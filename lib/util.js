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
  process.version,
);

/**
 * Format Access object and set expiration properties.
 * Appends requestId to headers hidden object.
 *
 * @param {Access} access access object
 * @return {Access}
 */
util.formatAccess = function(res) {
  const expiresIn = res.body.expires_in * 1000; // normalize to ms
  const expiration = new Date(Date.now() + expiresIn);
  const dayMs = 24 * 60 * 60 * 1000;
  const refreshExpiration = new Date(Date.now() + (60 * dayMs));
  const response = {
    accessToken: res.body.access_token,
    refreshToken: res.body.refresh_token,
    expiration,
    refreshExpiration,
  };

  util.appendHeaders(response, res, 'requestId', 'headers.sc-request-id');
  return response;
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

/**
 * Helper function to add headers and body to response
 *
 * @param {Body} body body of response
 * @param {Response} response response
 */
const _includeHeaders = function(body, response) {
  return {
    headers: response.headers,
    body,
  };
};

/**
 * Append a hidden headers object with a key to the destination object
 * Note: Modifies destination object.
 *
 * @param {Object} destination Object to write headers hidden object
 * @param {Object} source Object that contains value to extract
 * @param {String} key Name of key to add to headers object
 * @param {String} path Path to get the value from the source.
 */
util.appendHeaders = function(destination, source, key, path) {
  Object.defineProperty(destination, 'headers', {
    enumerable: false,
    writable: false,
    value: {[key]: _.get(source, path)},
  });
};

util.request = request.defaults({
  json: true,
  headers: {
    'User-Agent': util.USER_AGENT,
  },
  transform: _includeHeaders,
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
      throw new errors.AuthenticationError(
        body.error_description || body.message
      );
    case 403:
      throw new errors.PermissionError(options.uri);
    case 404:
      throw new errors.ResourceNotFoundError(options.uri);
    case 409:
      throw new errors.VehicleStateError(body.message, body.code);
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
