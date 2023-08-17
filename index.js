/* eslint-disable max-len */
/* eslint-disable camelcase */
'use strict';

const _ = require('lodash');
const crypto = require('crypto');

const {emitWarning} = require('process');
const SmartcarService = require('./lib/smartcar-service');
const util = require('./lib/util');
const config = require('./lib/config.json');

/* eslint-disable global-require */
/** @exports smartcar */
const smartcar = {
  /** @see {@link module:errors} */
  SmartcarError: require('./lib/smartcar-error'),
  /** @see {@link Vehicle} */
  Vehicle: require('./lib/vehicle'),
  /** @see {@link AuthClient}*/
  AuthClient: require('./lib/auth-client'),
};
/* eslint-enable global-require */

const buildQueryParams = function(vin, scope, country, options) {
  const parameters = {
    vin,
    scope: scope.join(' '),
    country,
  };
  if (options.flags) {
    parameters.flags = util.getFlagsString(options.flags);
  }
  if (options.hasOwnProperty('testMode')) {
    emitWarning(
      // eslint-disable-next-line max-len
      'The "testMode" parameter is deprecated, please use the "mode" parameter instead.',
    );
    parameters.mode = options.testMode === true ? 'test' : 'live';
  } else if (options.hasOwnProperty('mode')) {
    parameters.mode = options.mode;
    if (!['test', 'live', 'simulated'].includes(parameters.mode)) {
      throw new Error( // eslint-disable-next-line max-len
        "The \"mode\" parameter MUST be one of the following: 'test', 'live', 'simulated'",
      );
    }
  }
  if (options.testModeCompatibilityLevel) {
    // eslint-disable-next-line camelcase
    parameters.test_mode_compatibility_level =
      options.testModeCompatibilityLevel;
    parameters.mode = 'test';
  }

  return parameters;
};

/**
 * Sets the version of Smartcar API you are using
 * @method
 * @param {String} version
 */
smartcar.setApiVersion = function(version) {
  config.version = version;
};

/**
 * Gets the version of Smartcar API that is set
 * @method
 * @return {String} version
 */
smartcar.getApiVersion = () => config.version;

/**
 * @type {Object}
 * @typedef User
 * @property {String} id - User Id
 * @property {module:smartcar.Vehicle.Meta} meta
 *
 * @example
 * {
 *   id: "e0514ef4-5226-11e8-8c13-8f6e8f02e27e",
 *   meta: {
 *     requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
 *   }
 * }
 */

/**
 * Return the user's id.
 *
 * @method
 * @param {String} accessToken - access token
 * @return {module:smartcar~User}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
smartcar.getUser = async function(accessToken) {
  const response = await new SmartcarService({
    baseUrl: util.getConfig('SMARTCAR_API_ORIGIN') || config.api,
    auth: {bearer: accessToken},
  }).request('get', `/v${config.version}/user`);
  return response;
};

/**
 * @type {Object}
 * @typedef VehicleIds
 * @property {String[]} vehicles - A list of the user's authorized vehicle ids.
 * @property {Object} paging
 * @property {Number} paging.count- The total number of vehicles.
 * @property {Number} paging.offset - The current start index of returned
 * vehicle ids.
 * @property {module:smartcar.Vehicle.Meta} meta
 *
 * @example
 * {
 *   vehicles: [
 *     '36ab27d0-fd9d-4455-823a-ce30af709ffc',
 *     '770bdda4-2429-4b20-87fd-6af475c4365e',
 *   ],
 *   paging: {
 *     count: 2,
 *     offset: 0,
 *   },
 *   meta: {
 *     requestId: 'b9593682-8515-4f36-8190-bb56cde4c38a',
 *   }
 * }
 */

/**
 * Return list of the user's vehicles ids.
 *
 * @method
 * @param {String} accessToken - access token
 * @param {Object} [paging]
 * @param {Number} [paging.limit] - number of vehicles to return
 * @param {Number} [paging.offset] - index to start vehicle list
 * @return {module:smartcar~VehicleIds}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
smartcar.getVehicles = async function(accessToken, paging = {}) {
  const response = await new SmartcarService({
    baseUrl: util.getUrl(),
    auth: {bearer: accessToken},
    qs: paging,
  }).request('get', '');
  return response;
};

/**
 * @type {Object}
 * @typedef Compatibility
 * @property {Boolean} compatible
 * @property {(VEHICLE_NOT_COMPATIBLE|MAKE_NOT_COMPATIBLE|null)} reason
 * @property {Array.<String>} capabilities
 * @property {String} capabilities[].permission
 * @property {String} capabilities[].endpoint
 * @property {Boolean} capabilities[].capable
 * @property {(VEHICLE_NOT_COMPATIBLE|MAKE_NOT_COMPATIBLE|null)} capabilities[].reason
 * @property {module:smartcar.Vehicle.Meta} meta
 *
 * @example
 * {
 *  compatible: true,
 *  reason: null,
 *  capabilities: [
 *    {
 *      capable: false,
 *      endpoint: '/engine/oil',
 *      permission: 'read_engine_oil',
 *      reason: 'SMARTCAR_NOT_CAPABLE',
 *    },
 *    {
 *      capable: true,
 *      endpoint: '/vin',
 *      permission: 'read_vin',
 *      reason: null,
 *    },
 *  ],
 *  meta: {
 *    'requestId':'6d4226e7-a7dd-44e0-b29c-9eed26be249d'
 *  }
 * }
 */

/**
 * Determine whether a vehicle is compatible with Smartcar.
 *
 * A compatible vehicle is a vehicle that:
 * 1. has the hardware required for internet connectivity,
 * 2. belongs to the makes and models Smartcar supports, and
 * 3. supports the permissions.
 *
 * _To use this function, please contact us!_
 *
 * @param {String} vin - the VIN of the vehicle
 * @param {String[]} scope - list of permissions to check compatibility for
 * @param {String} [country='US'] - an optional country code according to [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
 * @param {Object} [options]
 * @param {Boolean} [options.testMode] - Deprecated, please use `mode` instead.
 * Launch Smartcar Connect in [test mode](https://smartcar.com/docs/guides/testing/).
 * @param {String} [options.mode] - Determine what mode Smartcar Connect should be
 * launched in. Should be one of test, live or simulated.
 * @param {String} [options.testModeCompatibilityLevel] - This string determines which permissions
 * the simulated vehicle is capable of. Possible Values can be found at this link:
 * (https://smartcar.com/docs/integration-guide/test-your-integration/test-requests/#test-successful-api-requests-with-specific-vins)
 * @return {module:smartcar~Compatibility}
 * @throws {SmartcarError} - an instance of SmartcarError.
 *   See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 *   for all possible errors.
 */
smartcar.getCompatibility = async function(vin, scope, country, options = {}) {
  country = country || 'US';
  const clientId =
    options.clientId || util.getOrThrowConfig('SMARTCAR_CLIENT_ID');
  const clientSecret =
    options.clientSecret || util.getOrThrowConfig('SMARTCAR_CLIENT_SECRET');

  const response = await new SmartcarService({
    baseUrl: util.getConfig('SMARTCAR_API_ORIGIN') || config.api,
    auth: {
      user: clientId,
      pass: clientSecret,
    },
    qs: buildQueryParams(vin, scope, country, options),
  }).request('get', `v${options.version || config.version}/compatibility`);
  return response;
};

/**
 * Generate hash challenege for webhooks. It does HMAC_SHA256(amt, challenge)
 *
 * @method
 * @param {String} amt - Application Management Token
 * @param {String} challenge - Challenge string
 * @return {String}  String representing the hex digest
 */
smartcar.hashChallenge = function(amt, challenge) {
  const hmac = crypto.createHmac('sha256', amt);
  return hmac.update(challenge).digest('hex');
};

/**
 * Verify webhook payload with AMT and signature.
 *
 * @method
 * @param {String} amt - Application Management Token
 * @param {String} signature - sc-signature header value
 * @param {object} body - webhook response body
 * @return {Boolean} true if signature matches the hex digest of amt and body
 */
smartcar.verifyPayload = (amt, signature, body) =>
  smartcar.hashChallenge(amt, JSON.stringify(body)) === signature;

/**
 * Returns a paged list of all the vehicles that are connected to the application associated
 * with the management API token used sorted in descending order by connection date.
 *
 * @type {Object}
 * @typedef Connection
 * @property {String} vehicleId
 * @property {String} userId
 * @property {String} connectedAt
 *
 * @type {Object}
 * @typedef GetConnections
 * @property {Connection[]} connections
 * @property {Object} [paging]
 * @property {string} [paging.cursor]
 *
 * @param {String} amt - Application Management Token
 * @param {object} filter
 * @param {String} filter.userId
 * @param {String} filter.vehicleId
 * @param {object} paging
 * @param {number} paging.limit
 * @param {String} paging.cursor
 * @returns {GetConnections}
 */
smartcar.getConnections = async function(amt, filter = {}, paging = {}) {
  const {userId, vehicleId} = _.pick(filter, ['userId', 'vehicleId']);
  const {limit, cursor} = _.pick(paging, ['limit', 'cursor']);

  const qs = {};
  if (userId) {
    qs.user_id = userId;
  }
  if (vehicleId) {
    qs.vehicle_id = vehicleId;
  }
  if (limit) {
    qs.limit = limit;
  }
  // istanbul ignore next
  if (cursor) {
    qs.cursor = cursor;
  }

  const response = await new SmartcarService({
    // eslint-disable-next-line max-len
    baseUrl:
      `${util.getConfig('SMARTCAR_MANAGEMENT_API_ORIGIN') || config.management}/v${config.version}`,
    auth: {
      user: 'default',
      pass: amt,
    },
    qs,
  }).request('get', '/management/connections');

  return response;
};

/**
 * Deletes all the connections by vehicle or user ID and returns a
 * list of all connections that were deleted.
 *
 * @type {Object}
 * @typedef Connection
 * @property {String} vehicleId
 * @property {String} userId
 *
 * @type {Object}
 * @typedef DeleteConnections
 * @property {Connection[]} connections
 *
 * @param {String} amt - Application Management Token
 * @param {object} filter
 * @param {String} filter.userId
 * @param {String} filter.vehicleId
 * @returns {DeleteConnections}
 */
smartcar.deleteConnections = async function(amt, filter) {
  const {userId, vehicleId} = _.pick(filter, ['userId', 'vehicleId']);
  if (userId && vehicleId) {
    // eslint-disable-next-line max-len
    throw new Error(
      'Filter can contain EITHER user_id OR vehicle_id, not both',
    );
  }

  const qs = {};
  if (userId) {
    qs.user_id = userId;
  }
  if (vehicleId) {
    qs.vehicle_id = vehicleId;
  }

  const response = await new SmartcarService({
    baseUrl:
      `${util.getConfig('SMARTCAR_MANAGEMENT_API_ORIGIN') || config.management}/v${config.version}`,
    auth: {
      user: 'default',
      pass: amt,
    },
    qs,
  }).request('delete', '/management/connections');

  return response;
};

module.exports = smartcar;
