'use strict';

var rp = require('request-promise');
var config = require('./config');
var errors = require('./errors');
var RequestError = require('request-promise/errors').RequestError;
var StatusCodeError = require('request-promise/errors').StatusCodeError;

var util = {};

/**
 * set the created_at property of an access object
 * @param  {Access} access access object
 * @return {Access}
 */
util.setExpiration = function(access) {
  const expiresIn = access.expires_in * 1000; // normalize to ms
  access.expiration = new Date(Date.now() + expiresIn).toISOString();
  return access;
};

/**
 * form an API request URI
 * @param  {String} id vehicle identifier
 * @param  {String} endpoint API endpoint
 * @return {String} API request URI
 */
util.getUrl = function(id, endpoint) {
  var url = `${config.api}/v${config.version}/vehicles`;
  if (id) {
    url += `/${id}`;
  }
  if (endpoint) {
    url += `/${endpoint}`;
  }
  return url;
};

/**
 * wrapper for request-promise call
 * @param  {String} options options to request call
 * @return {Promise}
 */
util.request = function(options) {
  options.json = true;
  return rp(options)
  .catch(RequestError, StatusCodeError, function(e) {
    switch (e.statusCode) {
      case 400:
        throw new errors.ValidationError(e.error.error_description);
      case 401:
        throw new errors.AuthenticationError(options.auth.bearer);
      case 403:
        throw new errors.PermissionError(options.uri);
      case 404:
        throw new errors.ResourceNotFoundError(options.uri);
      case 409:
        throw new errors.StateError(`${options.uri} ${options.form}`);
      case 429:
        throw new errors.RateLimitingError();
      case 430:
        throw new errors.MonthlyLimitExceeded();
      case 500:
        throw new errors.ServerError();
      case 501:
        throw new errors.NotCapableError(options.uri);
      /* istanbul ignore next */
      default:
        throw new errors.SmartcarError(e);
    }
  });
};

module.exports = util;
