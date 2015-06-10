
var Entity = require('./entity');

var State  = module.exports = function State(_node) {
  this._node = _node;
  this._class = this.constructor;
}

State.prototype = Entity;
