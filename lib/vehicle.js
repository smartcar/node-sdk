'use strict';
var methods = require('./vehicle_methods');
var util = require('./util');

/**
 * Initializes Vehicle object
 * @constructor
 * @param {string} vid - the vehicle's unique identifier
 */
function Vehicle(token, vid) {
  this.token = token;
  this.vid = vid;
  var self = this;
  Object.keys(methods).forEach(function(key) {
    var config = methods[key];
    config.token = self.token;
    config.vid = self.vid;
    Vehicle.prototype[key] = util[config.type](config);
  });
}
module.exports = Vehicle;