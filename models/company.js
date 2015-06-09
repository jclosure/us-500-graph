// company.js
// Company model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(
    process.env['NEO4J_URL'] ||
    process.env['GRAPHENEDB_URL'] ||
    'http://localhost:7474'

);

// private constructor:

var Company = module.exports = function Company(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Company.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Company.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

// public instance methods:

Company.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

Company.prototype.del = function (callback) {
    // use a Cypher query to delete both this company and his/her following
    // relationships in one transaction and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (company:Company)',
        'WHERE ID(company) = {companyId}',
        'DELETE company',
        'WITH company',
        'MATCH (company) -[rel:follows]- (other)',
        'DELETE rel',
    ].join('\n')

    var params = {
        companyId: this.id
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

Company.prototype.follow = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'follows', {}, function (err, rel) {
        callback(err);
    });
};

Company.prototype.unfollow = function (other, callback) {
    var query = [
        'MATCH (company:Company) -[rel:follows]-> (other:Company)',
        'WHERE ID(company) = {companyId} AND ID(other) = {otherId}',
        'DELETE rel',
    ].join('\n')

    var params = {
        companyId: this.id,
        otherId: other.id,
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// companies this company follows, and others is all other companies minus him/herself.
Company.prototype.getFollowingAndOthers = function (callback) {
    // query all companies and whether we follow each one or not:
    var query = [
        'MATCH (company:Company), (other:Company)',
        'OPTIONAL MATCH (company) -[rel:follows]-> (other)',
        'WHERE ID(company) = {companyId}',
        'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
    ].join('\n')

    var params = {
        companyId: this.id,
    };

    var company = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new Company(results[i]['other']);
            var follows = results[i]['COUNT(rel)'];

            if (company.id === other.id) {
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

// static methods:

Company.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new Company(node));
    });
};

Company.getAll = function (callback) {
    var query = [
        'MATCH (company:Company)',
        'RETURN company',
    ].join('\n');

    db.query(query, null, function (err, results) {
        if (err) return callback(err);
        var companies = results.map(function (result) {
            return new Company(result['company']);
        });
        callback(null, companies);
    });
};

// creates the company and persists (saves) it to the db, incl. indexing it:
Company.create = function (data, callback) {
    // construct a new instance of our class with the data, so it can
    // validate and extend it, etc., if we choose to do that in the future:
    var node = db.createNode(data);
    var company = new Company(node);

    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'CREATE (company:Company {data})',
        'RETURN company',
    ].join('\n');

    var params = {
        data: data
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var company = new Company(results[0]['company']);
        callback(null, company);
    });
};
