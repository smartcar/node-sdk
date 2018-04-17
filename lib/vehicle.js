'use strict';

const util = require('./util');

/** @exports Vehicle */

/**
 * Initializes a new Vehicle to use for making requests to the Smartcar API.
 *
 * @constructor
 * @param {String} id - the vehicle's unique identifier
 * @param {String} token - a valid access token
 * @param {String} [unitSystem=metric] - the unit system to use for vehicle data
 * (metric/imperial)
 */
function Vehicle(id, token, unitSystem) {
  if (!(this instanceof Vehicle)) {
    // eslint-disable-next-line max-len
    throw new TypeError("Class constructor Vehicle cannot be invoked without 'new'");
  }

  this.id = id;
  this.token = token;
  this.request = util.request.defaults();
  this.setUnitSystem(unitSystem || 'metric');

  this.updateRequest({
    baseUrl: util.getUrl(this.id),
    auth: {
      bearer: this.token,
    },
  });
}

Vehicle.prototype.updateRequest = function(options) {
  this.request = this.request.defaults(options);
};

/**
 * Update the unit system to use in requests to the Smartcar API.
 *
 * @param {String} unitSystem - the unit system to use (metric/imperial)
 */
Vehicle.prototype.setUnitSystem = function(unitSystem) {

  if (['imperial', 'metric'].indexOf(unitSystem) < 0) {
    throw new TypeError('unit system must be one of: \'imperial\', \'metric\'');
  }

  this.unitSystem = unitSystem;
  this.updateRequest({
    headers: {
      'sc-unit-system': this.unitSystem,
    },
  });

};

/**
 * Disconnect this vehicle from the connected application.
 *
 * Note: Calling this method will invalidate your access token and you will
 * have to have the user reauthorize the vehicle to your application if
 * you wish to make requests to it
 *
 * @return {Promise} // TODO document return type more throughly
 */
Vehicle.prototype.disconnect = function() {
  return util.wrap(this.request.delete('application'));
};

/**
 * Fetch the list of permissions that this application has been granted for
 * this vehicle.
 *
 * @return {Promise} // TODO document return type more throughly
 */
Vehicle.prototype.permissions = function() {
  return util.wrap(this.request.get('permissions'));
};

/* VEHICLE API METHODS */

/**
 * GET Vehicle.info
 *
 * @return {Promise} A promise for info on the vehicle's info
 */
Vehicle.prototype.info = function() {
  return util.wrap(this.request.get('/'));
};

/**
 * GET Vehicle.location
 *
 * @return {Promise} A promise for info on the vehicle's location
 */
Vehicle.prototype.location = function() {
  return util.wrap(this.request.get('location'));
};

/**
 * GET Vehicle.odometer
 *
 * @return {Promise} A promise for info on the vehicle's odometer
 */
Vehicle.prototype.odometer = function() {
  return util.wrap(this.request.get('odometer'));
};

/**
 * GET Vehicle.vin
 *
 * @return {Promise} A promise for info on the vehicle's vin
 */
Vehicle.prototype.vin = function() {
  return util.wrap(this.request.get('vin'));
};

/**
 * POST Vehicle.lock
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.lock = function() {
  return util.wrap(this.request.post('security', {
    body: {action: 'LOCK'},
  }));
};

/**
 * POST Vehicle.unlock
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.unlock = function() {
  return util.wrap(this.request.post('security', {
    body: {action: 'UNLOCK'},
  }));
};

module.exports = Vehicle;
