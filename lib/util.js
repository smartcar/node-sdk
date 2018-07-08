'use strict';

const _ = require('lodash');
const request = require('request-promise');
const {format} = require('util');
const {StatusCodeError} = require('request-promise/errors');

const config = require('./config');
const errors = require('./errors');
const {version} = require('../package.json');

const util = {};

util.USER_AGENT = format(
  'Smartcar/%s (%s; %s) Node.js %s',
  version,
  process.platform,
  process.arch,
  process.version
);

/**
 * Format Access object and set expiration properties.
 *
 * @param {Access} access access object
 * @return {Access}
 */
util.formatAccess = function(access) {
  const expiresIn = access.expires_in * 1000; // normalize to ms
  const expiration = new Date(Date.now() + expiresIn);
  const dayMs = 24 * 60 * 60 * 1000;
  const refreshExpiration = new Date(Date.now() + (60 * dayMs));
  return {
    accessToken: access.access_token,
    refreshToken: access.refresh_token,
    expiration,
    refreshExpiration,
  };
};

/**
 * Form an API request URI
 *
 * @param {String} id vehicle identifier
 * @param {String} endpoint API endpoint
 * @return {String} API request URI
 */
util.getUrl = function(id, endpoint) {
  let url = `${config.api}/v${config.version}/vehicles`;

  if (id) {
    url += `/${id}`;
  }

  if (endpoint) {
    url += `/${endpoint}`;
  }

  return url;
};

util.request = request.defaults({
  json: true,
  headers: {
    'User-Agent': util.USER_AGENT,
  },
});

util.wrap = function(promise) {
  return promise.catch(StatusCodeError, util.catch);
};

util.catch = function(caught) {

  const options = caught.options;
  const body = _.get(caught, 'response.body', {});

  switch (caught.statusCode) {
    case 400:
      throw new errors.ValidationError(body.error_description || body.message);
    case 401:
      throw new errors.AuthenticationError(options.auth.bearer);
    case 403:
      throw new errors.PermissionError(options.uri);
    case 404:
      throw new errors.ResourceNotFoundError(options.uri);
    case 409:
      throw new errors.VehicleStateError(options.uri);
    case 429:
      throw new errors.RateLimitingError();
    case 430:
      throw new errors.MonthlyLimitExceeded();
    case 500:
      throw new errors.ServerError();
    case 501:
      throw new errors.NotCapableError(options.uri);
    default:
      const e = new errors.SmartcarError(caught.message);
      e.original = caught;
      throw e;
  }
};

module.exports = util;
