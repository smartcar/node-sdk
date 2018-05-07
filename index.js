'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

const util = require('./lib/util');
const config = require('./lib/config');
// Tolerance for expiration measured in milliseconds
const TOLERANCE = 10 * 1000;

/* eslint-disable global-require */
/** @exports smartcar */
const smartcar = {
  /** @see {@link module:errors} */
  errors: require('./lib/errors'),
  /** @see {@link Vehicle} */
  Vehicle: require('./lib/vehicle'),
  /** @see {@link AuthClient}*/
  AuthClient: require('./lib/auth-client'),
};
/* eslint-enable global-require */

/**
 * Check if a token has expired.
 *
 * @method
 * @param {Date|String} expiration - token expiration timestamp
 * @return {Boolean} true if expired, false if not expired
 */
smartcar.isExpired = function(expiration) {
  const msg = '"expiration" argument must be a Date object or ISO date string';
  let epoch;
  if (_.isDate(expiration)) {
    epoch = expiration.getTime();
  } else if (_.isString(expiration)) {
    epoch = Date.parse(expiration);
  } else {
    throw new TypeError(msg);
  }

  if (!Number.isFinite(epoch)) { // eslint-disable-next-line max-len
    throw new TypeError(msg);
  }

  return Date.now() > epoch - TOLERANCE;
};

/**
 * @type {Object}
 * @typedef VehicleIds
 * @property {String[]} vehicles - A list of the user's authorized vehicle ids.
 * @property {Object} paging
 * @property {Number} paging.count- The total number of vehicles.
 * @property {Number} paging.offset - The current start index of returned
 * vehicle ids.
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
 *   }
 * }
 */

/**
 * Return list of the user's vehicles ids.
 *
 * @method
 * @param {String} token - access token
 * @param {Object} [paging]
 * @param {Number} [paging.limit] - number of vehicles to return
 * @param {Number} [paging.offset] - index to start vehicle list
 * @return {Promise.<module:smartcar~VehicleIds>} A promise with the vehicle ids.
 */
smartcar.getVehicleIds = Promise.method(function(token, paging) {

  if (!_.isString(token)) {
    throw new TypeError('"token" argument must be a string');
  }

  return util.request.get(util.getUrl(), {
    auth: {
      bearer: token,
    },
    qs: paging,
  });

});

/**
 * Return the user's id.
 *
 * @method
 * @param {String} token - access token
 * @return {Promise.<String>} the user id
 */
smartcar.getUserId = Promise.method(function(token) {

  if (!_.isString(token)) {
    throw new TypeError('"token" argument must be a string');
  }

  return util.request.get(`${config.api}/v${config.version}/user`, {
    auth: {
      bearer: token,
    },
  }).then(function(response) {
    return response.id;
  });

});

module.exports = smartcar;
