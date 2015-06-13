
var Entity = require('./entityFactory');


// private constructor
var Company = module.exports = function Company (_node) {
  this._node = _node;
};


//build out

Company.prototype = Object.create(Entity.prototype);
Company._label = "Company" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
Company.create = function(data, callback){
  Entity.create(Company, data, callback);
};

Company.get = function(id, callback){
  Entity.get(Company, id, callback);
};

Company.getAll = function(callback){
  Entity.getAll(Company, callback);
};

Company.getAllWhere = function(where, callback){
  Entity.getAllWhere(Company, where, callback);
};

Company.getAllByProperty = function(key, value, callback){
  var where = "entity." + key + " = '" + value + "'"
  Entity.getAllWhere(Company, where, callback);
};

Company.getByPropertyOrCreate = function(key, value, data, callback){
  var wrapper = function(err, entities) {
    if (entities && entities[0])
      callback(null, entities[0]);
    else
      Company.create(data, function(err, entity) {
        callback(null, entity);
      });
  };
  Company.getAllByProperty(key, value, wrapper);
};

// instance api
Company.prototype.located_at = function (other, callback) {
  this.relate('LOCATED_AT', other, callback);
};

Company.prototype.unlocated_at = function (other, callback) {
  this.unrelate('LOCATED_AT', other, callback);
};

Company.prototype.employ = function (other, callback) {
  this.relate('EMPLOYS', other, callback);
};

Company.prototype.unemploy = function (other, callback) {
  this.unrelate('EMPLOYS', other, callback);
};

