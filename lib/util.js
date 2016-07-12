'use strict';
var rp = require('request-promise');
var config = require('./config');
var errors = require('./error');

var RequestError = require('request-promise/errors').RequestError;
var StatusCodeError = require('request-promise/errors').StatusCodeError;

var codes = {
  400: errors.ValidationError,
  401: errors.AuthenticationError,
  403: errors.PermissionError,
  404: errors.ResourceNotFoundError,
  409: errors.StateError,
  429: errors.RateLimitingError,
  430: errors.MonthlyLimitExceeded,
  500: errors.ServerError,
  501: errors.NotCapableError
};

var util = {};
util.config = config;
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
    throw new codes[e.statusCode];
  });
};
/**
 * creates a GET method for the Smartcar object
 * @param  {String} options method options object
 * @param  {String} options.vid vehicle identifier
 * @param  {String} options.endpoint API endpoint
 * @param  {String} options.token access token
 * @param  {String} [options.key] key of value to extract from API response
 * @return {Function} makes API request for data
 */
util.get = function(options) {
  /**
   * function that GET requests the Smartcar API
   * @param  {Boolean} [imperial] set true for imperial units, defaults to metric
   * @return {Promise} promise containing the API response
   */
  return function(imperial) {
    return util.request({
      uri: util.getUrl(options.vid, options.endpoint),
      method: 'GET',
      auth: {
        bearer: options.token,
      },
      headers: {
        'Accept-Unit': imperial ? 'imperial' : 'metric'
      }
    })
    .then(function(response) {
      var key = options.key;
      return (key ? response[key] : response);
    });
  };
};
/**
 * creates a POST method for the Smartcar object
 * @param  {String} options method options object
 * @param  {String} options.action value to action key in request body
 * @param  {String} options.vid vehicle identifier
 * @param  {String} options.endpoint API endpoint
 * @param  {String} options.token access token
 * @param  {String} [options.key] key of value to set in response body
 * @return {Function} makes API action request 
 */
util.action = function(options) {
  /**
   * function that POST requests the Smartcar API
   * @param  {String|String[]|Number} arg value that will be associated 
   * with options.key
   * @return {Promise} promise containing the response status
   */
  return function(arg) {
    var data = { action: options.action };
    if (options.key && arg) {
      data[options.key] = arg;
    }

    return util.request({
      uri: util.getUrl(options.vid, options.endpoint),
      method: 'POST',
      auth: {
        bearer: options.token,
      },
      form: data,
    })
    .then(function(response) {
      return response;
    });
  };
};
module.exports = util;