'use strict';
var querystring = require('querystring');
var Vehicle = require('./lib/vehicle');
var Promise = require('bluebird');
var util = require('./lib/util');
var config = require('./lib/config');

/**
 * Initializes Smartcar object
 * @constructor
 * @param options sdk configuration object
 * @param {String} options.clientId application client identifier
 * @param {String} options.clientSecret application secret
 * @param {String} options.redirectUri redirect here after OEM authorization
 * @param {String[]} options.scope list of application's permissions 
 */
function Smartcar(options) {
  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;
  this.auth = {
    user: this.clientId,
    pass: this.clientSecret,
  };
  this.redirectUri = options.redirectUri;
  this.scope = options.scope;
}
/**
 * return oem authorization URI
 * @param  {String} oem name of oem
 * @param  {String} [options.state] oauth application state
 * @param  {boolean} [options.forcePrompt=false] force permission dialog
 * @return {String} oauth authorize URI for the specified oem 
 */
Smartcar.prototype.getAuthUrl = function(oem, options) {
  var baseString = "https://" + oem + ".smartcar.com/oauth/authorize?";
  var parameters = {
    response_type: 'code',
    client_id: this.clientId,
    redirect_uri: this.redirectUri,
    scope: querystring.escape(this.scope.join(' ')),
  };
  if (options && options.state) {
    parameters.state = options.state;
  }
  if (options && options.forcePrompt) {
    parameters.approval_prompt = 'force';
  }
  var queryString = querystring.stringify(parameters);
  return baseString + queryString;
};
/**
 * set the created_at property of an access object
 * @param  {Access} access access object
 * @return {Access}
 */
Smartcar.prototype.setCreation = function(access) {
  access.created_at = Date.now();
  return access;
};
/**
 * exchange a code for an access object
 * @param  {String} code code to exchange
 * @return {Promise} promise containing access object 
 */
Smartcar.prototype.exchangeCode = function(code) {
  return util.request({
    uri: config.auth,
    method: 'POST',
    auth: this.auth,
    form: {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
    },
  }).then(this.setCreation);
};
/**
 * exchange a refresh token for a new access object
 * @param  {String} refresh_token refresh token to exchange
 * @param  auth authentication object
 * @param  {String} auth.user client id
 * @param  {String} auth.pass client secret
 * @return {Promise} promise containing a new access object 
 */
Smartcar.prototype.exchangeToken = function(refresh_token) {
  return util.request({
    uri: config.auth,
    method: 'POST',
    auth: this.auth,
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
  }).then(this.setCreation);
};
/**
 * get new access if access is expired
 * @param  {Access} access to be checked
 * @return {Promise} promise containing a fresh access object, or the old one 
 */
Smartcar.prototype.refreshAccess = Promise.method(function(access) {
  if (Date.now() > access.created_at + access.expires_in * 1000) {
    return this.exchangeToken(access.refresh_token);
  } else {
    return access;
  }
});
/**
 * return list of the user's vehicles
 * @param  {String} token access token
 * @param  {Paging} [paging] Paging object
 * @param  {number} [paging.limit] number of vehicles to return
 * @param  {number} [paging.offset] index to start vehicle list
 * @return {Vehicle[]} list of Vehicles
 */
Smartcar.prototype.getVehicles = function(token, paging) {
  var options = {
    uri: util.getUrl(),
    method: 'GET',
    auth: {
      bearer: token,
    },
  };
  if (paging) {
    options.form = paging;
  }
  return util.request(options)
  .then(function(response) {
    return response.vehicles.map(function(vid) {
      return new Vehicle(token, vid);
    });
  });
};
/**
 * get a specific vehicle
 * @param  {String} vid vehicle identifier
 * @return {Vehicle} user's vehicle
 */
Smartcar.prototype.getVehicle = function(token, vid) {
  return new Vehicle(token, vid);
};
module.exports = Smartcar;
