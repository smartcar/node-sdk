'use strict';

var methods = require('./vehicle_methods');
var util = require('./util');

var createMethod = function(method) {
  var config = methods[method];
  config.token = this.token;
  config.vid = this.vid;
  config.unitSystem = this.unitSystem;
  Vehicle.prototype[method] = util[config.type](config);
};

/**
 * Initializes Vehicle object
 * @constructor
 * @param {String} token a valid access token
 * @param {string} vid the vehicle's unique identifier
 */
function Vehicle(vid, token, unitSystem = 'metric') {
  this.vid = vid;
  this.token = token;
  this.unitSystem = unitSystem;
  Object.keys(methods).forEach(createMethod.bind(this));
}

Vehicle.prototype.setUnitsToImperial = function() {
  this.unitSystem = 'imperial';

  // reconstruct methods with updated unit header
  Object.keys(methods).forEach(createMethod.bind(this));
};

Vehicle.prototype.setUnitsToMetric = function() {
  this.unitSystem = 'metric';

  // reconstruct methods with updated unit header
  Object.keys(methods).forEach(createMethod.bind(this));
};

Vehicle.prototype.disconnect = function() {
  return util.request({
    uri: util.getUrl(this.vid, 'application'),
    method: 'DELETE',
    auth: {
      bearer: this.token,
    },
  });
};

Vehicle.prototype.permissions = function(paging) {
  var options = {
    uri: util.getUrl(this.vid, 'permissions'),
    method: 'GET',
    auth: {
      bearer: this.token,
    },
  };
  if (paging) {
    options.form = paging;
  }
  return util.request(options);
};

module.exports = Vehicle;
