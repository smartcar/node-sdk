'use strict';

var querystring = require('querystring');
var Vehicle = require('./lib/vehicle');
var util = require('./lib/util');
var config = require('./lib/config');
var errors = require('./lib/errors');
var _ = require('lodash');
var Promise = require('bluebird');

/**
 * @type {Object}
 * @typedef Access
 * @property {String} tokenType - Always set to `Bearer`
 * @property {Number} expiresIn - Number of seconds the access token is valid for, always set to 7200 (2 hours)
 * @property {String} expiration - ISO 8601 Datetime string which represents when the token expires
 * @property {String} accessToken - A token to be used for requests to the Smartcar API
 * @property {String} refreshToken - A token which is used to renew access when the current access token expires, expires in 60 days
 *
 * @example
 * {
 *   "tokenType": "example",
 *   "expiresIn": 3600,
 *   "expiration": "2017-05-26T01:21:27.070Z",
 *   "accessToken": "88704225-9f6c-4919-93e7-e0cec71317ce",
 *   "refreshToken": "60a9e801-6d26-4d88-926e-5c7f9fc13486",
 * }
 */

/**
 * Create a Smartcar API client for your application.
 *
 * @constructor
 * @param {Object} options
 * @param {String} options.clientId - The application's client id
 * @param {String} options.clientSecret - The application's client secret
 * @param {String} options.redirectUri - One of the application's preregistered redirect URIs
 * @param {String[]} options.scope - list of permissions to request from user
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
 * Generate the OAuth authorization URL for a given vehicle make.
 *
 * By default users are not shown the permission dialog if they have already
 * approved the set of scopes for this application. The application can elect
 * to always display the permissions dialog to the user by setting
 * approval_prompt to `force`.
 *
 * @param {String} make - the vehicle make to generate the URL for
 * @param {Object} [options]
 * @param {String} [options.state] - extra application state to pass along
 * @param {Boolean} [options.approval_prompt=auto] - see 2nd paragraph above
 * @return {String} OAuth authorization URL to redirect user to
 */
Client.prototype.getAuthUrl = function(make, options) {

  /* eslint-disable camelcase */
  var parameters = {
    response_type: 'code',
    client_id: this.clientId,
    redirect_uri: this.redirectUri,
  };
  /* eslint-enable camelcase */

  if (this.scope) {
    parameters.scope = this.scope.join(' ');
  }

  _.defaults(parameters, options);
  var query = querystring.stringify(parameters);
  return config.oems[make] + '/oauth/authorize?' + query;
};


/**
 * Exchange an authorization code for an access object.
 *
 * @param {String} code - authorization code to exchange
 * @return {Promise<Access>}
 */
Client.prototype.exchangeCode = function(code) {
  return util.request({
    uri: config.auth,
    method: 'POST',
    auth: this.auth,
    headers: {
      'User-Agent': `smartcar-node-sdk:${config.version}`,
    },
    form: {
      /* eslint-disable camelcase */
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      /* eslint-enable camelcase */
    },
  })
  .then(util.setExpiration);
};

/**
 * Exchange a refresh token for a new access object
 *
 * @param {String} token - refresh token to exchange
 * @return {Promise<Access>}
 */
Client.prototype.exchangeToken = function(token) {
  return util.request({
    uri: config.auth,
    method: 'POST',
    auth: this.auth,
    headers: {
      'User-Agent': `smartcar-node-sdk:${config.version}`,
    },
    form: {
      /* eslint-disable camelcase */
      grant_type: 'refresh_token',
      refresh_token: token,
      /* eslint-enable camelcase */
    },
  })
  .then(util.setExpiration);
};

/**
 * Check if an access object's access token is expired
 *
 * @param {Access} access - access object to be checked
 * @return {Boolean} true if expired, false if not expired
 */
Client.prototype.expired = function(access) {
  const expiration = Date.parse(access.expiration);

  if (isNaN(expiration)) { // eslint-disable-next-line max-len
    throw new TypeError('"access.expiration" argument must be a valid ISO date string');
  }

  return Date.now() > expiration;
};

/**
 * Return list of the user's vehicles
 *
 * @param {String} token - access token
 * @param {Object} [paging]
 * @param {Number} [paging.limit] - number of vehicles to return
 * @param {Number} [paging.offset] - index to start vehicle list
 * @return {Promise}
 */
Client.prototype.getVehicles = Promise.method(function(token, paging) {
  if (typeof token !== 'string') {
    throw new TypeError('"token" argument must be a string');
  }
  var options = {
    uri: util.getUrl(),
    method: 'GET',
    auth: {
      bearer: token,
    },
    headers: {
      'User-Agent': `smartcar-node-sdk:${config.version}`,
    },
  };
  if (paging) {
    options.form = paging;
  }
  return util.request(options);
});

var smartcar = {};

smartcar.errors = errors;
smartcar.Vehicle = Vehicle;
smartcar.Client = Client;

module.exports = smartcar;
