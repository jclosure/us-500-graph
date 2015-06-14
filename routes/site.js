

var Populate = require('../data/populate');
var domain = require('../models/domain');


/*
 * Get home page.
 */

exports.index = function(req, res){
  res.render('index');
};
