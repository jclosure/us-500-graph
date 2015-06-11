
var Entity = require('./entityFactory');


// private constructor
var County = module.exports = function County (_node) {
  this._node = _node;
};


//build out

County.prototype = Object.create(Entity.prototype);
County._label = "County" //note: that I am defaulting the labeling of this class for Entity.create here...


// static api
County.create = function(data, callback){
  Entity.create(County, data, callback);
};


// instance api
County.prototype.belong_to = function (other, callback) {
  this.relate('BELONGS_TO', other, callback);
};

County.prototype.unbelong_to = function (other, callback) {
  this.unrelate('BELONGS_TO', other, callback);
};



