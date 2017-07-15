'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

const util = require('./lib/util');

/* eslint-disable global-require */
const smartcar = {
  errors: require('./lib/errors'),
  Vehicle: require('./lib/vehicle'),
  AuthClient: require('./lib/auth-client'),
};
/* eslint-enable global-require */

/**
 * Check if an access object's access token is expired.
 *
 * @param {Access|String} access - access object or expiration to be checked
 * @return {Boolean} true if expired, false if not expired
 */
smartcar.expired = function(access) {
  let expiration = _.isString(access) ? access : access.expiration;
  expiration = Date.parse(expiration);

  if (!Number.isFinite(expiration)) { // eslint-disable-next-line max-len
    throw new TypeError('"access.expiration" argument must be a valid ISO date string');
  }

  return Date.now() > expiration;
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
