
var Entity = require('./entityFactory');


// private constructor
var Address = module.exports = function County (_node) {
  this._node = _node;
};


//build out

Address.prototype = Object.create(Entity.prototype);
Address._label = "Address" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
Address.create = function(data, callback){
  Entity.create(Address, data, callback);
};


// instance api
Address.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

Address.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};
