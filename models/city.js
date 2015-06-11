
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


// instance api
City.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

City.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};
