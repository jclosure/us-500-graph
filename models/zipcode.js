
var Entity = require('./entityFactory');


// private constructor
var Zipcode = module.exports = function Zipcode (_node) {
  this._node = _node;
};


//build out

Zipcode.prototype = Object.create(Entity.prototype);
Zipcode._label = "Zipcode" //note: that I am defaulting the labeling of this class for Entity.create here...



// static api
Zipcode.create = function(data, callback){
  Entity.create(Zipcode, data, callback);
};

Zipcode.get = function(id, callback){
  Entity.get(Zipcode, id, callback);
};

Zipcode.getAll = function(callback){
  Entity.getAll(Zipcode, callback);
};

Zipcode.getAllWhere = function(where, callback){
  Entity.getAllWhere(Zipcode, where, callback);
};

Zipcode.getAllByProperty = function(key, value, callback){
  var where = "entity." + key + " = '" + value + "'";
  Entity.getAllWhere(Zipcode, where, callback);
};

Zipcode.getAllByPropertyOrCreate = function(key, value, data, callback){
  var wrapper = function(err, entities) {
    if (entities && entities[0])
      callback(null, entities);
    else
      Zipcode.create(data, function(err, entity) {
        callback(null, [entity]);
      });
  };
  Zipcode.getAllByProperty(key, value, wrapper);
};

// instance api
Zipcode.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

Zipcode.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};
