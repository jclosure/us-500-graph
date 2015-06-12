
var Entity = require('./entityFactory');


// private constructor
var Company = module.exports = function Company (_node) {
  this._node = _node;
};


//build out

Company.prototype = Object.create(Entity.prototype);
Company._label = "Company" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
Company.create = function(data, callback){
  Entity.create(Company, data, callback);
};


// instance api
Company.prototype.located_at = function (other, callback) {
  this.relate('LOCATED_AT', other, callback);
};

Company.prototype.unlocated_at = function (other, callback) {
  this.unrelate('LOCATED_AT', other, callback);
};

Company.prototype.employ = function (other, callback) {
  this.relate('EMPLOYS', other, callback);
};

Company.prototype.unemploy = function (other, callback) {
  this.unrelate('EMPLOYS', other, callback);
};

