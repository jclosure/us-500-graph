
var Entity = require('./entityFactory');


// private constructor
var Address = module.exports = function Address (_node) {
  this._node = _node;
};


//build out

Address.prototype = Object.create(Entity.prototype);
Address._label = "Address" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
Address.create = function(data, callback){
  Entity.create(Address, data, callback);
};

Address.get = function(id, callback){
  Entity.get(Address, id, callback);
};

Address.getAll = function(callback){
  Entity.getAll(Address, callback);
};

Address.getAllWhere = function(where, callback){
  Entity.getAllWhere(Address, where, callback);
};

Address.getAllByProperty = function(key, value, callback){
  var where = "entity." + key + " = '" + value + "'"
  Entity.getAllWhere(Address, where, callback);
};

Address.getAllByPropertyOrCreate = function(key, value, data, callback){
  var wrapper = function(err, entities) {
    if (entities && entities[0])
      callback(null, entities);
    else
      Address.create(data, function(err, entity) {
        callback(null, [entity]);
      });
  };
  Address.getAllByProperty(key, value, wrapper);
};

// instance api
Address.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

Address.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};
