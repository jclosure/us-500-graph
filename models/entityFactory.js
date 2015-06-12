// entity.js
// Base entity logic.



var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(
  process.env['NEO4J_URL'] ||
    process.env['GRAPHENEDB_URL'] ||
    'http://localhost:7474'

);



// private constructor:

Entity = module.exports = function Entity (_node) {
  this._node = _node;
};



// Entity Buildout

// public instance properties:

Object.defineProperty(Entity.prototype, 'id', {
  get: function () { return this._node.id; }
});

Object.defineProperty(Entity.prototype, 'name', {
  get: function () {
    return this._node.data['name'];
  },
  set: function (name) {
    this._node.data['name'] = name;
  }
});


// public instance methods:

Entity.prototype.save = function (callback) {
  this._node.save(function (err) {
    callback(err);
  });
};


Entity.prototype.del = function (callback) {
  // use a Cypher query to delete both this entity and his/her following
  // relationships in one transaction and one network request:
  // (note that this'll still fail if there are any relationships attached
  // of any other types, which is good because we don't expect any.)
  // todo: use label for perf
  var query = [
    'MATCH (entity)',
    'WHERE ID(entity) = {entityId}',
    'DELETE entity',
    'WITH entity',
    'MATCH (entity)-[rel]-(other)',
    'DELETE rel',
  ].join('\n')

  var params = {
    entityId: this.id
  };

  db.query(query, params, function (err) {
    callback(err);
  });
};

Entity.prototype.relate = function (relationType, other, callback) {
  //var caller = arguments.callee.caller.toString();
  debugger;
  this._node.createRelationshipTo(other._node, relationType, {}, function (err, rel) {
    //if ( typeof callback === 'undefined' ) { callback = function() {}; }
    debugger;
    callback(err);
  });
};

Entity.prototype.unrelate = function (relationType, other, callback) {
  //todo: optimize by using labels for entities
  var query = [
    'MATCH (entity) -[rel:' + relationType + ']-> (other)',
    'WHERE ID(entity) = {entityId} AND ID(other) = {otherId}',
    'DELETE rel',
  ].join('\n')

  var params = {
    entityId: this.id,
    otherId: other.id,
  };

  db.query(query, params, function (err) {
    callback(err);
  });
};



// static methods:

Entity.addProperties = function (props) {
  props.forEach(function(prop){
    Object.defineProperty(Entity.prototype, prop, {
      get: function () {
        return this._node.data[prop];
      },
      set: function (name) {
        this._node.data[prop] = name;
      }
    });
  });
}

Entity.get = function (id, callback) {
  db.getNodeById(id, function (err, node) {
    if (err) return callback(err);
    callback(null, new Entity(node));
  });
};

Entity.getAll = function (label, callback) {
  var query = [
    'MATCH (entity:' + label + ')',
    'RETURN entity',
  ].join('\n');

  db.query(query, null, function (err, results) {
    if (err) return callback(err);
    var entitys = results.map(function (result) {
      return new Entity(result['entity']);
    });
    callback(null, entitys);
  });
};

// creates the entity and persists (saves) it to the db, incl. indexing it:
Entity.create = function (_class, data, callback) {
  // construct a new instance of our class with the data, so it can
  // validate and extend it, etc., if we choose to do that in the future:
  
  Object.getOwnPropertyNames(data).forEach(function(key) {  
    //var val = data[key]);
    if (!Entity.prototype.hasOwnProperty(key)) {
      Object.defineProperty(Entity.prototype, key, {
        get: function () {
          return this._node.data[key];
        },
        set: function (v) {
          this._node.data[key] = v;
        }
      })
    }
  });

  var node = db.createNode(data);
  var entity = new _class(node);
  
  // but we do the actual persisting with a Cypher query, so we can also
  // apply a label at the same time. (the save() method doesn't support
  // that, since it uses Neo4j's REST API, which doesn't support that.)

  var query = [
    'CREATE (entity:' + _class._label + ' {data})',
    'RETURN entity',
  ].join('\n');

  var params = {
    data: data
  };

  // note: this is where entity classes actually get created!!!
  db.query(query, params, function (err, results) {
    if (err) return callback(err);
    var entity = new _class(results[0]['entity']);
    //copy the properties from parent class invokation
    entity._class = _class;
    callback(null, entity);
  });

};


// follow relations


Entity.prototype.follow = function (other, callback) {
  this._node.createRelationshipTo(other._node, 'follows', {}, function (err, rel) {
    callback(err);
  });
};

Entity.prototype.unfollow = function (other, callback) {
  //todo: use labels for perf
  var query = [
    'MATCH (entity) -[rel:follows]-> (other)',
    'WHERE ID(entity) = {entityId} AND ID(other) = {otherId}',
    'DELETE rel',
  ].join('\n')

  var params = {
    entityId: this.id,
    otherId: other.id,
  };

  db.query(query, params, function (err) {
    callback(err);
  });
};

// calls callback w/ (err, following, others) where following is an array of
// entities this entity follows, and others is all other entities minus him/herself.
Entity.prototype.getFollowingAndOthers = function (callback) {
  // query all entities and whether we follow each one or not:
  // todo: use labels for perf
  var query = [
    'MATCH (entity), (other)',
    'OPTIONAL MATCH (entity) -[rel:follows]-> (other)',
    'WHERE ID(entity) = {entityId}',
    'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
  ].join('\n')

  var params = {
    entityId: this.id,
  };

  var entity = this;
  db.query(query, params, function (err, results) {
    if (err) return callback(err);

    var following = [];
    var others = [];

    for (var i = 0; i < results.length; i++) {
      var other = new Entity(results[i]['other']);
      var follows = results[i]['COUNT(rel)'];

      if (entity.id === other.id) {
        continue;
      } else if (follows) {
        following.push(other);
      } else {
        others.push(other);
      }
    }

    callback(null, following, others);
  });
};

