'use strict';
var request = require('request-promise');
var methods = require('./vehicle_methods');
var util = require('./util');
var config = require('./config');

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
function Vehicle(vid, token, unitSystem) {
  unitSystem = typeof unitSystem !== 'undefined' ? unitSystem : 'metric';
  if (['imperial', 'metric'].indexOf(unitSystem) < 0) {
    throw new TypeError('unit system must be one of: \'imperial\', \'metric\'');
  }

  this.vid = vid;
  this.token = token;
  this.unitSystem = unitSystem;
  console.log('in constructor');
  console.log(this.unitSystem);
  this.request = request.defaults({
    baseUrl: (`${config.api}/v${config.version}/vehicles/${vid}/`),
    auth: {
      bearer: token,
    },
    json: true,
  });
  // Object.keys(methods).forEach(createMethod.bind(this));
}

Object.keys(methods).forEach(function(method) {
  var config = methods[method];
  Vehicle.prototype[method] = function(data) {
    console.log('in function');
    console.log(this.unitSystem);
    return this.request({
      uri: config.endpoint,
      body: data,
      headers: {
        'sc-unit-system': this.unitSystem,
      },
    });
  };
});

Vehicle.prototype.setUnitsToImperial = function() {
  this.unitSystem = 'imperial';

  // reconstruct methods with updated unit header
  // Object.keys(methods).forEach(createMethod.bind(this));
};

Vehicle.prototype.setUnitsToMetric = function() {
  this.unitSystem = 'metric';

  // reconstruct methods with updated unit header
  // Object.keys(methods).forEach(createMethod.bind(this));
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
