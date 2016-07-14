'use strict';
var rp = require('request-promise');
var config = require('./config');

var util = {};
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
  return rp(options);
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
   * @param  {Boolean} [apiOptions.imperial] set true and the api will return
   * data in imperial units, defaults to metric units
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
        'smartcar-unit': apiOptions.imperial ? 'imperial' : 'metric'
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
   * @param  {Boolean} [apiOptions.imperial] set true to send data in imperial 
   * units rather than metric
   * @return {Promise} promise containing the response status
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
      form: data,
      headers: {
        'smartcar-unit': apiOptions.imperial ? 'imperial' : 'metric'
      }
    })
    .then(function(response) {
      return response;
    });
  };
};
module.exports = util;
