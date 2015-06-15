
var Entity = require('./entityFactory');


// private constructor
var Person = module.exports = function Person (_node) {
  this._node = _node;
};


//build out

Person.prototype = Object.create(Entity.prototype);
Person._label = "Person" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
Person.create = function(data, callback){
  Entity.create(Person, data, callback);
};

Person.get = function(id, callback){
  Entity.get(Person, id, callback);
};

Person.getAll = function(callback){
  Entity.getAll(Person, callback);
};

Person.getAllWhere = function(where, callback){
  Entity.getAllWhere(Person, where, callback);
};

Person.getAllByProperty = function(key, value, callback){
  var where = "entity." + key + " = '" + value + "'"
  Entity.getAllWhere(Person, where, callback);
};

Person.getByPropertyOrCreate = function(key, value, data, callback){
  var wrapper = function(err, entities) {
    if (entities && entities[0])
      callback(null, entities[0]);
    else
      Person.create(data, function(err, entity) {
        callback(null, entity);
      });
  };
  Person.getAllByProperty(key, value, wrapper);
};

// instance api
Person.prototype.employed_by = function (other, callback) {
  this.relate('EMPLOYED_BY', other, callback);
};

Person.prototype.unemployed_by = function (other, callback) {
  this.unrelate('EMPLOYED_BY', other, callback);
};


// example of bringing db access out to derived entity if nec

Entity.prototype.unfollow = function (other, callback) {
  //todo: use labels for perf
  var query = [
    'MATCH (entity:Person) -[rel:follows]-> (other:Person)',
    'WHERE ID(entity) = {entityId} AND ID(other) = {otherId}',
    'DELETE rel',
  ].join('\n')

  var params = {
    entityId: this.id,
    otherId: other.id,
  };

  Entity.db.query(query, params, function (err) {
    callback(err);
  });
};

// calls callback w/ (err, following, others) where following is an array of
// entities this entity follows, and others is all other entities minus him/herself.
Entity.prototype.getFollowingAndOthers = function (callback) {
  // query all entities and whether we follow each one or not:
  // todo: use labels for perf
  var query = [
    'MATCH (entity:Person), (other:Person)',
    'OPTIONAL MATCH (entity) -[rel:follows]-> (other)',
    'WHERE ID(entity) = {entityId}',
    'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
  ].join('\n')

  var params = {
    entityId: this.id,
  };

  var entity = this;
  Entity.db.query(query, params, function (err, results) {
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
