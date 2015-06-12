
var Entity = require('./entityFactory');


// private constructor
var County = module.exports = function County (_node) {
  this._node = _node;
};


//build out

County.prototype = Object.create(Entity.prototype);
County._label = "County" //note: that I am defaulting the labeling of this class for Entity.create here...


// generic static api
County.create = function(data, callback){
  Entity.create(County, data, callback);
};

County.get = function(id, callback){
  Entity.get(County, id, callback);
};

County.getAll = function(callback){
  Entity.getAll(County, callback);
};

County.getAllWhere = function(where, callback){
  Entity.getAllWhere(County, where, callback);
};

County.getAllByProperty = function(key, value, callback){
  var where = "entity." + key + " = '" + value + "'"
  Entity.getAllWhere(County, where, callback);
};

County.getAllByPropertyOrCreate = function(key, value, data, callback){
  var wrapper = function(err, entities) {
    if (entities && entities[0])
      callback(null, entities);
    else
      County.create(data, function(err, entity) {
        callback(null, [entity]);
      });
  };
  County.getAllByProperty(key, value, wrapper);
};

// instance api
County.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

County.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};



