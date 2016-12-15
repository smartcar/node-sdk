'use strict';

var querystring = require('querystring');
var Vehicle = require('./lib/vehicle');
var util = require('./lib/util');
var config = require('./lib/config');
var errors = require('./lib/errors');
var _ = require('lodash');

/**
 * Initializes Client object
 * @constructor
 * @param options sdk configuration object
 * @param {String} options.clientId application client identifier
 * @param {String} options.clientSecret application secret
 * @param {String} options.redirectUri redirect here after OEM authorization
 * @param {String[]} options.scope list of application's permissions
 */
function Client(options) {
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
 * @param  {String} oem oem url
 * @param  {String} [options.state] oauth application state
 * @param  {String} [options.approval_prompt=auto] force permission
 * dialog by setting options.approval_prompt=force
 * @return {String} oauth authorize URI
 */
Client.prototype.getAuthUrl = function(oem, options) {

  /* eslint-disable camelcase */
  var parameters = {
    response_type: 'code',
    client_id: this.clientId,
    redirect_uri: this.redirectUri,
    scope: this.scope.join(' '),
  };
  /* eslint-enable camelcase */

  _.defaults(parameters, options);
  var query = querystring.stringify(parameters);
  return config.oems[oem] + '/oauth/authorize?' + query;
};


/**
 * exchange a code for an access object
 * @param  {String} code code to exchange
 * @return {Promise} promise containing access object
 */
Client.prototype.exchangeCode = function(code) {
  return util.request({
    uri: config.auth,
    method: 'POST',
    auth: this.auth,
    form: {
      /* eslint-disable camelcase */
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      /* eslint-enable camelcase */
    },
  })
  .then(util.setCreation);
};

/**
 * exchange a refresh token for a new access object
 * @param  {String} refresh_token refresh token to exchange
 * @return {Promise} promise containing a new access object
 */
Client.prototype.exchangeToken = function(token) {
  return util.request({
    uri: config.auth,
    method: 'POST',
    auth: this.auth,
    form: {
      /* eslint-disable camelcase */
      grant_type: 'refresh_token',
      refresh_token: token,
      /* eslint-enable camelcase */
    },
  })
  .then(util.setCreation);
};

/**
 * check if an access object's access token is expired
 * @param  {Access} access access object to be checked
 * @return {Boolean} true if expired, false if not expired
 */
Client.prototype.expired = function(access){
  return Date.now() > access.created_at + (access.expires_in * 1000);
};

/**
 * return list of the user's vehicles
 * @param  {String} token access token
 * @param  {Paging} [paging] Paging object
 * @param  {number} [paging.limit] number of vehicles to return
 * @param  {number} [paging.offset] index to start vehicle list
 * @return {Promise}
 */
Smartcar.prototype.getVehicles = function(token, paging) {
  if (!token) {
    throw new errors.SmartcarError('token is undefined');
  }
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
  return util.request(options);
};

var smartcar = {};

smartcar.errors = errors;
smartcar.methods = require('./lib/vehicle_methods');
smartcar.Vehicle = Vehicle;
smartcar.Client = Client;

module.exports = smartcar;
