
var Entity = require('./entityFactory');


// private constructor
var City = module.exports = function County (_node) {
  this._node = _node;
};


//build out

City.prototype = Object.create(Entity.prototype);
City._label = "City" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
City.create = function(data, callback){
  Entity.create(City, data, callback);
};

City.get = function(id, callback){
  Entity.get(City, id, callback);
};

City.getAll = function(callback){
  Entity.getAll(City, callback);
};

City.getAllWhere = function(where, callback){
  Entity.getAllWhere(City, where, callback);
};

City.getAllByProperty = function(key, value, callback){
  var where = "entity." + key + " = '" + value + "'"
  Entity.getAllWhere(City, where, callback);
};

City.getAllByPropertyOrCreate = function(key, value, data, callback){
  var wrapper = function(err, entities) {
    debugger;
    if (entities && entities[0])
      callback(null, entities);
    else
      City.create(data, function(err, entity) {
        debugger;
        callback(null, [entity]);
      });
  };
  City.getAllByProperty(key, value, wrapper);
};

// instance api
City.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

City.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};
