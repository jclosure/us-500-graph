
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

Person.getAllByPropertyOrCreate = function(key, value, data, callback){
  var wrapper = function(err, entities) {
    if (entities && entities[0])
      callback(null, entities);
    else
      Person.create(data, function(err, entity) {
        callback(null, [entity]);
      });
  };
  Person.getAllByProperty(key, value, wrapper);
};

// instance api
Person.prototype.employed_by = function (other, callback) {
  debugger;
  this.relate('EMPLOYED_BY', other, callback);
};

Person.prototype.unemployed_by = function (other, callback) {
  this.unrelate('EMPLOYED_BY', other, callback);
};


