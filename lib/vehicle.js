'use strict';

const util = require('./util');
const _ = require('lodash');

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
  this.request = util.request.defaults({
    baseUrl: util.getUrl(this.id),
    auth: {
      bearer: this.token,
    },
  });
  this.setUnitSystem(unitSystem || 'metric');
}

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
  this.request = this.request.defaults({
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
 * @return {Promise} A promise resolved on successful disconnect
 */
Vehicle.prototype.disconnect = function() {
  return util.wrap(this.request.delete('application'));
};

/**
 * Fetch the list of permissions that this application has been granted for
 * this vehicle.
 *
 * @return {Promise.<String[]>} an array of permissions names
 * @example
 * ['read_vehicle_info', 'read_odometer', 'control_security']
 */
Vehicle.prototype.permissions = function() {
  return util.wrap(this.request.get('permissions'))
    .then(function(response) {
      return response.permissions;
    });
};

/* VEHICLE API METHODS */

/**
 * @type {Object}
 * @typedef Info
 * @property {String} id - The vehicle's unique Smartcar identifier
 * @property {String} make - The brand of the vehicle
 * @property {String} model - The specific model of the vehicle
 * @property {Number} year - The model year of the vehicle
 *
 * @example
 * {
 *   id: '19c0cc8c-80e0-4182-9372-6ef903c7599c',
 *   make: 'TESLA',
 *   model: 'S',
 *   year: 2017,
 * }
 */

/**
 * GET Vehicle.info
 *
 * @return {Promise.<Info>} A promise for info on the vehicle's info
 */
Vehicle.prototype.info = function() {
  return util.wrap(this.request.get('/'));
};

/**
 * @type {Object}
 * @typedef Location
 * @property {Object} data - The returned vehicle data
 * @property {Number} data.latitude - The vehicle latitude (in degrees)
 * @property {Number} data.longitude - The vehicle longitude (in degrees)
 * @property {Date} age - The timestamp of when the data was recorded
 *
 * @example
 * {
 *   data: {
 *     latitude: 37.400880,
 *     longitude: -122.057804,
 *   }
 *   age: new Date('2018-05-04T07:20:50.844Z'),
 * }
 */

/**
 * GET Vehicle.location
 *
 * @return {Promise.<Location>} A promise for info on the vehicle's location
 */
Vehicle.prototype.location = function() {
  const req = this.request.get('location', {resolveWithFullResponse: true});
  return util.wrap(req)
    .then(function(response) {
      return {
        data: response.body,
        age: new Date(response.headers['sc-data-age']),
      };
    });
};

/**
 * @type {Object}
 * @typedef Odometer
 * @property {Object} data - The returned vehicle data
 * @property {Number} data.distance - The reading of the vehicle's odometer
 * @property {Date} age - The timestamp of when the data was recorded
 * @property {String} unitSystem - The unit system of the returned odometer
 * reading. `metric` signifies kilometers, `imperial` signifies miles.
 *
 * @example
 * {
 *   data: {
 *     distance: 1234.12,
 *   }
 *   age: new Date('2018-05-04T07:20:50.844Z'),
 *   unitSystem: 'imperial',
 * }
 */

/**
 * GET Vehicle.odometer
 *
 * @return {Promise.<Odometer>} A promise for info on the vehicle's odometer
 */
Vehicle.prototype.odometer = function() {
  const req = this.request.get('odometer', {resolveWithFullResponse: true});
  return util.wrap(req)
    .then(function(response) {
      return {
        data: response.body,
        age: new Date(response.headers['sc-data-age']),
        unitSystem: response.headers['sc-unit-system'],
      };
    });
};

/**
 * GET Vehicle.vin
 *
 * @return {Promise.<String>} A promise for info on the vehicle's vin
 */
Vehicle.prototype.vin = function() {
  return util.wrap(this.request.get('vin'))
    .then(function(response) {
      return response.vin;
    });
};

/**
 * POST Vehicle.lock
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.lock = function() {
  const req = this.request.post('security', {body: {action: 'LOCK'}});
  return util.wrap(req).then(_.noop);
};

/**
 * POST Vehicle.unlock
 *
 * @return {Promise} A success or failure response
 */
Vehicle.prototype.unlock = function() {
  const req = this.request.post('security', {body: {action: 'UNLOCK'}});
  return util.wrap(req).then(_.noop);
};

module.exports = Vehicle;
