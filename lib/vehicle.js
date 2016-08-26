'use strict';

var methods = require('./vehicle_methods');
var util = require('./util');

/**
 * Initializes Vehicle object
 * @constructor
 * @param {String} token a valid access token
 * @param {string} vid the vehicle's unique identifier
 */
function Vehicle(token, vid) {
  this.token = token;
  this.vid = vid;
  Object.keys(methods).forEach(createMethod.bind(this));
}

var createMethod = function(method) {
  var config = methods[method];
  config.token = this.token;
  config.vid = this.vid;
  Vehicle.prototype[method] = util[config.type](config);
}

Vehicle.prototype.disconnect = function(){
  return util.request({
    uri: util.getUrl(this.vid, "application"),
    method: "DELETE",
    auth: {
      bearer: this.token
    }
  });
}

Vehicle.prototype.permissions = function(paging) {
  var options = {
    uri: util.getUrl(this.vid, "permissions"),
    method: 'GET',
    auth: {
      bearer: this.token,
    },
  };
  if (paging != undefined) {
    options.form = paging;
  }
  return util.request(options);
}

module.exports = Vehicle;
