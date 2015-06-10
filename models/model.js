// model.js
// Base model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(
    process.env['NEO4J_URL'] ||
    process.env['GRAPHENEDB_URL'] ||
    'http://localhost:7474'

);

// private constructor:

var Model = module.exports = function Model(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Model.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Model.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

// public instance methods:

Model.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

Model.prototype.del = function (callback, relations) {
    // use a Cypher query to delete both this model and his/her following
    // relationships in one transaction and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (model:Model)',
        'WHERE ID(model) = {modelId}',
        'DELETE model',
        'WITH model',
        'MATCH (model)-[rel]-(other)',
        'DELETE rel',
    ].join('\n')

    var params = {
        modelId: this.id
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};


// static methods:

Model.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new Model(node));
    });
};

Model.getAll = function (callback) {
    var query = [
        'MATCH (model:Model)',
        'RETURN model',
    ].join('\n');

    db.query(query, null, function (err, results) {
        if (err) return callback(err);
        var models = results.map(function (result) {
            return new Model(result['model']);
        });
        callback(null, models);
    });
};

// creates the model and persists (saves) it to the db, incl. indexing it:
Model.create = function (data, callback) {
    // construct a new instance of our class with the data, so it can
    // validate and extend it, etc., if we choose to do that in the future:
    var node = db.createNode(data);
    var model = new Model(node);

    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'CREATE (model:Model {data})',
        'RETURN model',
    ].join('\n');

    var params = {
        data: data
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var model = new Model(results[0]['model']);
        callback(null, model);
    });
};

// relationsPerson.prototype.follow = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'follows', {}, function (err, rel) {
        callback(err);
    });
};

Person.prototype.unfollow = function (other, callback) {
    var query = [
        'MATCH (person:Person) -[rel:follows]-> (other:Person)',
        'WHERE ID(person) = {personId} AND ID(other) = {otherId}',
        'DELETE rel',
    ].join('\n')

    var params = {
        personId: this.id,
        otherId: other.id,
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// people this person follows, and others is all other people minus him/herself.
Person.prototype.getFollowingAndOthers = function (callback) {
    // query all people and whether we follow each one or not:
    var query = [
        'MATCH (person:Person), (other:Person)',
        'OPTIONAL MATCH (person) -[rel:follows]-> (other)',
        'WHERE ID(person) = {personId}',
        'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
    ].join('\n')

    var params = {
        personId: this.id,
    };

    var person = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new Person(results[i]['other']);
            var follows = results[i]['COUNT(rel)'];

            if (person.id === other.id) {
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
