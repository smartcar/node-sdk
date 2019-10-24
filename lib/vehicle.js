'use strict';

const util = require('./util');
const _ = require('lodash');

/** @exports Vehicle */

/**
 * @param {Object} response
 *
 * @return {Date|null} A parsed age or null if no age exists
 */
const parseAge = function(response) {
  const age = _.get(response, 'headers.sc-data-age', null);
  return age ? new Date(age) : null;
};

/**
 * Initializes a new Vehicle to use for making requests to the Smartcar API.
 *
 * @constructor
 * @param {String} id - The vehicle's unique identifier. Retrieve a user's
 * vehicle id using {@link module:smartcar.getVehicleIds}.
 * @param {String} token - A valid access token
 * @param {String} [unitSystem=metric] - The unit system to use for vehicle data
 * , must be either `metric` or `imperial`.
 */
function Vehicle(id, token, unitSystem) {
  if (!(this instanceof Vehicle)) {
    // eslint-disable-next-line max-len
    throw new TypeError(
      "Class constructor Vehicle cannot be invoked without 'new'"
    );
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
 * @param {String} unitSystem - The unit system to use, must be either `metric`
 * or `imperial`.
 */
Vehicle.prototype.setUnitSystem = function(unitSystem) {
  if (['imperial', 'metric'].indexOf(unitSystem) < 0) {
    throw new TypeError("unit system must be one of: 'imperial', 'metric'");
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
 * Note: Calling this method will invalidate your token's access to the vehicle.
 * You will have to reauthorize the user to your application again if you wish
 * to make requests to it again.
 *
 * @return {Promise} A promise resolved on successful disconnect.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.disconnect = function() {
  return util.wrap(this.request.delete('application'));
};

/**
 * Fetch the list of permissions that this application has been granted for
 * this vehicle.
 *
 * @return {Promise.<String[]>} An array of permissions names.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 * @example
 * ['read_vehicle_info', 'read_odometer', 'control_security']
 */
Vehicle.prototype.permissions = function() {
  return util.wrap(this.request.get('permissions')).then(function(response) {
    return response.permissions;
  });
};

/**
 * Checks if permissions granted to a vehicle contain the specified permission(s).
 *
 * @param {String[]|String} permissions Permission(s) to check
 *
 * @return {Promise.<Boolean>} Whether the vehicle has the specified permission(s)
 */
Vehicle.prototype.hasPermissions = function(permissions) {
  return this.permissions().then(function(vehiclePermissions) {
    if (_.isArray(permissions)) {
      const strippedPermissions = _.map(permissions, (permission) =>
        permission.replace(/^required:/, '')
      );

      return _.difference(strippedPermissions, vehiclePermissions).length === 0;
    } else {
      permissions = permissions.replace(/^required:/, '');
      return vehiclePermissions.includes(permissions);
    }
  });
};

/* VEHICLE API METHODS */

/**
 * @type {Object}
 * @typedef Info
 * @property {String} id - The vehicle's unique Smartcar identifier.
 * @property {String} make - The brand of the vehicle.
 * @property {String} model - The specific model of the vehicle.
 * @property {Number} year - The model year of the vehicle.
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
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.info = function() {
  return util.wrap(this.request.get('/'));
};

/**
 * @type {Object}
 * @typedef Location
 * @property {Object} data - The returned vehicle data.
 * @property {Number} data.latitude - The vehicle latitude (in degrees).
 * @property {Number} data.longitude - The vehicle longitude (in degrees).
 * @property {Date} age - The timestamp of when the data was recorded.
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
 * @return {Promise.<Location>} A promise for info on the vehicle's location.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.location = function() {
  const req = this.request.get('location', {resolveWithFullResponse: true});
  return util.wrap(req).then(function(response) {
    return {
      data: response.body,
      age: parseAge(response),
    };
  });
};

/**
 * @type {Object}
 * @typedef Odometer
 * @property {Object} data - The returned vehicle data.
 * @property {Number} data.distance - The reading of the vehicle's odometer (in
 *   kms or miles). To set unit, see {@link Vehicle#setUnitSystem}.
 * @property {Date} age - The timestamp of when the data was recorded.
 * @property {String} unitSystem - The unit system of the returned odometer
 * reading. `metric` signifies kilometers, `imperial` signifies miles.
 * To set, see {@link Vehicle#setUnitSystem}.
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
 * @return {Promise.<Odometer>} A promise for info on the vehicle's odometer.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.odometer = function() {
  const req = this.request.get('odometer', {resolveWithFullResponse: true});
  return util.wrap(req).then(function(response) {
    return {
      data: response.body,
      age: parseAge(response),
      unitSystem: response.headers['sc-unit-system'],
    };
  });
};

/**
 * @type {Object}
 * @typedef EngineOil
 * @property {Object} data - The returned vehicle data.
 * @property {Number} data.lifeRemaining - The engine oil's remaining life span
 * (as a percentage). Oil life is based on the current quality of the oil.
 * @property {Date} age - The timestamp of when the data was recorded.
 *
 * @example
 * {
 *   data: {
 *     lifeRemaining: 0.86,
 *   }
 *   age: new Date('2018-05-04T07:20:50.844Z')
 * }
 */

/**
 * GET Vehicle.oil
 *
 * @return {Promise.<EngineOil>} A promise for info on the vehicle's engine oil.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.oil = function() {
  const req = this.request.get('engine/oil', {resolveWithFullResponse: true});
  return util.wrap(req).then(function(response) {
    return {
      data: response.body,
      age: parseAge(response),
    };
  });
};

/**
 * @type {Object}
 * @typedef TirePressure
 * @property {Object} data - The returned vehicle data.
 * @property {Number} data.frontLeft - The current air pressure of the front left tire
 * @property {Number} data.frontRight - The current air pressure of the back right tire
 * @property {Number} data.backLeft - The current air pressure of the back left tire
 * @property {Number} data.backRight - The current air pressure of the back right tire
 * @property {Date} age - The timestamp of when the data was recorded.
 * @property {String} unitSystem - The unit system of the returned odometer
 * reading. `metric` signifies kilopascals (kpa), `imperial` signifies pounds per square inch (psi).
 * To set, see {@link Vehicle#setUnitSystem}.
 * @example
 * {
 *   data: {
 *     frontleft: 33,
 *     frontRight: 34,
 *     backLeft: 34,
 *     backRight: 33
 *   }
 *   age: new Date('2018-05-04T07:20:50.844Z'),
 *   unitSystem: 'imperial'
 * }
 */

/**
 * GET Vehicle.tirePressure
 *
 * @return {Promise.<TirePressure>} A promise for info on the vehicle's tire pressure.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.tirePressure = function() {
  const req = this.request.get('tires/pressure', {
    resolveWithFullResponse: true,
  });
  return util.wrap(req).then(function(response) {
    return {
      data: {
        tires: response.body,
      },
      age: parseAge(response),
      unitSystem: response.headers['sc-unit-system'],
    };
  });
};

/**
 * @type {Object}
 * @typedef Fuel
 * @property {Object} data - The returned vehicle data.
 * @property {Number} data.range - The estimated remaining distance the car can
 *  travel (in kms or miles). To set unit, see {@link Vehicle#setUnitSystem}.
 * @property {Number} data.percentRemaining - The remaining level of fuel in
 *   the tank (in percent).
 * @property {Number} data.amountRemaining - The amount of fuel in the tank (in
 *  liters or gallons (US)). To set unit, see {@link Vehicle#setUnitSystem}.
 * @property {Date} age - The timestamp of when the data was recorded.
 * @property {String} unitSystem - The unit system of the returned data.
 *   To set, see {@link Vehicle#setUnitSystem}.
 *
 * @example
 * {
 *   data: {
 *     range: 40.5,
 *     percentRemaining: 0.3,
 *     amountRemaining: 40.5,
 *   }
 *   age: new Date('2018-05-04T07:20:50.844Z'),
 *   unitSystem: 'imperial',
 * }
 */

/**
 * GET Vehicle.fuel
 *
 * @return {Promise.<Fuel>} A promise for info on the vehicle's fuel status.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.fuel = function() {
  const req = this.request.get('fuel', {resolveWithFullResponse: true});
  return util.wrap(req).then(function(response) {
    return {
      data: response.body,
      age: parseAge(response),
      unitSystem: response.headers['sc-unit-system'],
    };
  });
};

/**
 * @type {Object}
 * @typedef Battery
 * @property {Object} data - The returned vehicle data.
 * @property {Number} data.range - The estimated remaining distance the car can
 *  travel (in kms or miles). To set unit, see {@link Vehicle#setUnitSystem}.
 * @property {Number} data.percentRemaining - The remaining level of charge in
 *   the battery (in percent).
 * @property {Date} age - The timestamp of when the data was recorded.
 * @property {String} unitSystem - The unit system of the returned data.
 *   To set, see {@link Vehicle#setUnitSystem}.
 *
 * @example
 * {
 *   data: {
 *     range: 40.5,
 *     percentRemaining: 0.3,
 *   }
 *   age: new Date('2018-05-04T07:20:50.844Z'),
 *   unitSystem: 'imperial',
 * }
 */

/**
 * GET Vehicle.battery
 *
 * @return {Promise.<Battery>} A promise for info on the vehicle's battery status.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.battery = function() {
  const req = this.request.get('battery', {resolveWithFullResponse: true});
  return util.wrap(req).then(function(response) {
    return {
      data: response.body,
      age: parseAge(response),
      unitSystem: response.headers['sc-unit-system'],
    };
  });
};

/**
 * @type {Object}
 * @typedef Charge
 * @property {Object} data - The returned vehicle data.
 * @property {Number} data.isPluggedIn - Indicates whether charging cable is
 *   plugged in.
 * @property {Number} data.state - Indicates the current state of the charge
 *   system. Can be `FULLY_CHARGED`, `CHARGING`, or `NOT_CHARGING`.
 * @property {Date} age - The timestamp of when the data was recorded.
 *
 * @example
 * {
 *   data: {
 *     isPluggedIn: false,
 *     state: "FULLY_CHARGED",
 *   }
 *   age: new Date('2018-05-04T07:20:50.844Z'),
 * }
 */

/**
 * GET Vehicle.charge
 *
 * @return {Promise.<Charge>} A promise for info on the vehicle's charge status.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.charge = function() {
  const req = this.request.get('charge', {resolveWithFullResponse: true});
  return util.wrap(req).then(function(response) {
    return {
      data: response.body,
      age: parseAge(response),
    };
  });
};

/**
 * GET Vehicle.vin
 *
 * @return {Promise.<String>} A promise for info on the vehicle's vin.
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.vin = function() {
  return util.wrap(this.request.get('vin')).then(function(response) {
    return response.vin;
  });
};

/**
 * @type {Object}
 * @typedef Security
 * @property {String} status - set to `success` on successful request
 *
 * @example
 * {
 *   status: 'success',
 * }
 */

/**
 * POST Vehicle.lock
 *
 * @return {Promise.<Security>} response on successful request
 * @throws {SmartcarError} - on unsuccessful request. An instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.lock = function() {
  const req = this.request.post('security', {body: {action: 'LOCK'}});
  return util.wrap(req).then(({status}) => ({status}));
};

/**
 * POST Vehicle.unlock
 *
 * @return {Promise.<Security>} response on successful request
 * @throws {SmartcarError} - on unsuccessful request. An instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.unlock = function() {
  const req = this.request.post('security', {body: {action: 'UNLOCK'}});
  return util.wrap(req).then(({status}) => ({status}));
};

/**
 * @type {Object}
 * @typedef Batch
 * @property {Object} responses - The object of mul HTTP responses.
 * @property {Object} data.ENDPOINT - The HTTP response for a given endpoint. ENDPOINT is a Smartcar endpoint (i.e. /odometer, /fuel).
 * @property {Number} data.ENDPOINT.code - The HTTP response code for this response.
 * @property {Object} data.ENDPOINT.headers - The HTTP headers for this response.
 * @property {Object} data.ENDPOINT.body - The body for this response.
 *
 * @example
 * {
 *    "/odometer" : {
 *      "body": {
 *        "distance": 37829
 *      },
 *      "code": 200,
 *      "headers": {
 *        "sc-data-age": "2019-10-24T00:43:46.000Z",
 *        "sc-unit-system": "metric"
 *       }
 *    },
 *    "/location" : {
 *      "body": {
 *        "latitude": 37.4292,
 *        "longitude": 122.1381
 *      },
 *      "code": 200,
 *      "headers": {
 *        "sc-data-age": "2019-10-24T00:43:46.000Z"
 *      }
 *    }
 * }
 */

/**
 * POST Vehicle.batch
 *
 * @param {String[]} paths - A list of paths of endpoints to send requests to.
 * @return {Promise<Batch>} response on successful request
 *
 * @throws {SmartcarError} - on unsuccessful request. An instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
Vehicle.prototype.batch = async function(paths) {
  const requests = paths.map((path) => ({path}));
  const req = this.request.post('batch', {body: {requests}});

  const response = await util.wrap(req).then(({responses}) => ({responses}));
  return _.transform(
    response.responses,
    (result, item) => {
      result[item.path] = _.pick(item, ['body', 'code', 'headers']);
    },
    {}
  );
};

module.exports = Vehicle;
