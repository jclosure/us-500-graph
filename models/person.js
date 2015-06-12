
var Entity = require('./entityFactory');


// private constructor
var Person = module.exports = function Person (_node) {
  this._node = _node;
};


//build out

Person.prototype = Object.create(Entity.prototype);
Person._label = "Person" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
Person.create = function(data, callback){
  Entity.create(Person, data, callback);
};


// instance api
Person.prototype.employed_by = function (other, callback) {
  debugger;
  this.relate('EMPLOYED_BY', other, callback);
};

Person.prototype.unemployed_by = function (other, callback) {
  this.unrelate('EMPLOYED_BY', other, callback);
};




