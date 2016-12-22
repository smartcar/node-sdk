'use strict';
var request = require('request-promise');
var methods = require('./vehicle_methods');
var util = require('./util');


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
  var baseUrl = util.getUrl(vid);
  this.request = request.defaults({
    baseUrl,
    auth: {
      bearer: token,
    },
    json: true,
  });
}


Vehicle.prototype.setUnitsToImperial = function() {
  this.unitSystem = 'imperial';
};

Vehicle.prototype.setUnitsToMetric = function() {
  this.unitSystem = 'metric';
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

// add methods from json to Vehicle prototype
Object.keys(methods).forEach(function(method) {
  var config = methods[method];
  Vehicle.prototype[method] = function(data) {
    var method = determineHTTPMethod(config);

    if (config.type === 'action') {
      data = addActionToBody(config, data);
    }

    return this.request({
      uri: config.endpoint,
      body: data,
      headers: {
        'sc-unit-system': this.unitSystem,
      },
      method,
    });
  };
});

function determineHTTPMethod(config) {
  return config.type === 'action' ? 'POST' : 'GET';
}

function addActionToBody(config, otherData) {
  var body = otherData;
  if (body) {
    body.action = config.action;
  } else {
    body = {action: config.action};
  }
  return body;
}

module.exports = Vehicle;
