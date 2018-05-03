'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

const util = require('./lib/util');
// Tolerance for expiration measured in milliseconds
const TOLERANCE = 10 * 1000;

/* eslint-disable global-require */
/** @exports smartcar */
const smartcar = {
  /** @see modules */
  errors: require('./lib/errors'),
  /** @see Vehicle */
  Vehicle: require('./lib/vehicle'),
  /** @see AuthClient*/
  AuthClient: require('./lib/auth-client'),
};
/* eslint-enable global-require */

/**
 * Check if a token has expired.
 *
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
 * Return list of the user's vehicles.
 *
 * @param {String} token - access token
 * @param {Object} [paging]
 * @param {Number} [paging.limit] - number of vehicles to return
 * @param {Number} [paging.offset] - index to start vehicle list
 * @return {Promise}
 */
smartcar.getVehicles = Promise.method(function(token, paging) {

  if (!_.isString(token)) {
    throw new TypeError('"token" argument must be a string');
  }

  return util.request.get(util.getUrl(), {
    auth: {
      bearer: token,
    },
    form: paging,
  });

});

module.exports = smartcar;
