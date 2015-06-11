
var Entity = require('./entityFactory');


// private constructor
var State = module.exports = function County (_node) {
  this._node = _node;
};


//build out

State.prototype = Object.create(Entity.prototype);
State._label = "State" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
State.create = function(data, callback){
  Entity.create(State, data, callback);
};


// instance api
State.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

State.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};



