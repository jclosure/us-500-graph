
var Entity = require('./entity');

var City  = module.exports.city = function City(_node) {
  this._node = _node;
  this._class = this.constructor;
  this.prototype = Entity;
}


var County  = module.exports.county = function County(_node) {
  this._node = _node;
  this._class = this.constructor;
  this.prototype = Entity;
}

