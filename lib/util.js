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
util.setCreation = function(access) {
  access.created_at = Date.now();
  return access;
};

/**
 * form an API request URI
 * @param  {String} id vehicle identifier
 * @param  {String} endpoint API endpoint
 * @return {String} API request URI 
 */
util.getUrl = function(id, endpoint) {
  var url = config.api + '/v' + config.version + '/vehicles';
  if (id) {
    url += '/' + id;
  }
  if (endpoint) {
    url += '/' + endpoint;
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
  .catch(RequestError, StatusCodeError, function(e){
    switch(e.statusCode){
      case 400:
        throw new errors.ValidationError(options.uri);
      case 401:
        throw new errors.AuthenticationError(options.auth.bearer);
      case 403:
        throw new errors.PermissionError(options.uri);
      case 404:
        throw new errors.ResourceNotFoundError(options.uri);
      case 409:
        throw new errors.StateError(options.uri + " " + options.form);
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

/**
 * creates a GET method for the Smartcar object
 * @param  {String} options.vid vehicle identifier
 * @param  {String} options.endpoint API endpoint
 * @param  {String} options.token access token
 * from API response
 * @return {Function} makes API request for data
 */
util.get = function(options) {
  /**
   * function that GET requests the Smartcar API
   * @param  {Boolean} [apiOptions.imperial] set true and 
   * the API will return data in imperial units, otherwise 
   * defaults to metric units
   * @return {Promise} promise containing the API response
   */
  return function(apiOptions) {
    apiOptions = apiOptions ? apiOptions : {};
    return util.request({
      uri: util.getUrl(options.vid, options.endpoint),
      method: 'GET',
      auth: {
        bearer: options.token,
      },
      headers: {
        'smartcar-unit': apiOptions.imperial ? 'imperial' : 'metric',
      }
    })
  };
};

/**
 * creates a POST method for the Smartcar object
 * @param  {String} options method options object
 * @param  {String} options.action value to action key 
 * in request body
 * @param  {String} options.vid vehicle identifier
 * @param  {String} options.endpoint API endpoint
 * @param  {String} options.token access token
 * @param  {String} [options.key] key of value to set 
 * in response body
 * @return {Function} makes API action request 
 */
util.action = function(options) {
  /**
   * function that POST requests the Smartcar API
   * @param  {Object} arg Object to POST to the API
   * @param  {Boolean} [apiOptions.imperial] set true to 
   * send imperial data
   * @return {Promise} promise containing the response object
   */
  return function(arg, apiOptions) {
    var data = { action: options.action };
    if (options.key && arg) {
      data[options.key] = arg;
    }

    apiOptions = apiOptions ? apiOptions : {}; 
    return util.request({
      uri: util.getUrl(options.vid, options.endpoint),
      method: 'POST',
      auth: {
        bearer: options.token,
      },
      body: data,
      headers: {
        'smartcar-unit': apiOptions.imperial ? 'imperial' : 'metric',
      },
    })
  };
};

module.exports = util;
