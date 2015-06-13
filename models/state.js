
var Entity = require('./entityFactory');


// private constructor
var State = module.exports = function State (_node) {
  this._node = _node;
};


//build out

State.prototype = Object.create(Entity.prototype);
State._label = "State" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
State.create = function(data, callback){
  Entity.create(State, data, callback);
};

State.get = function(id, callback){
  Entity.get(State, id, callback);
};

State.getAll = function(callback){
  Entity.getAll(State, callback);
};

State.getAllWhere = function(where, callback){
  Entity.getAllWhere(State, where, callback);
};

State.getAllByProperty = function(key, value, callback){
  var where = "entity." + key + " = '" + value + "'"
  Entity.getAllWhere(State, where, callback);
};

State.getByPropertyOrCreate = function(key, value, data, callback){
  var wrapper = function(err, entities) {
    if (entities && entities[0])
      callback(null, entities[0]);
    else
      State.create(data, function(err, entity) {
        callback(null, entity);
      });
  };
  State.getAllByProperty(key, value, wrapper);
};

// instance api
State.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

State.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};



