
var Entity = require('./entityFactory');


// private constructor
var Zipcode = module.exports = function County (_node) {
  this._node = _node;
};


//build out

Zipcode.prototype = Object.create(Entity.prototype);
Zipcode._label = "Zipcode" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
Zipcode.create = function(data, callback){
  Entity.create(Zipcode, data, callback);
};


// instance api
Zipcode.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

Zipcode.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};
