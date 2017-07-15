'use strict';

const qs = require('querystring');

const util = require('./util');
const config = require('./config');

/**
 * @type {Object}
 * @typedef Access
 * @property {String} tokenType - Always set to `Bearer`
 * @property {Number} expiresIn - Number of seconds the access token is valid
 * @property {String} expiration - ISO 8601 Datetime string which represents
 * when the token expires
 * @property {String} accessToken - A token to be used for requests to the
 * Smartcar API
 * @property {String} refreshToken - A token which is used to renew access when
 * the current access token expires, expires in 60 days
 *
 * @example
 * {
 *   "tokenType": "Bearer",
 *   "expiresIn": 3600,
 *   "expiration": "2017-05-26T01:21:27.070Z",
 *   "accessToken": "88704225-9f6c-4919-93e7-e0cec71317ce",
 *   "refreshToken": "60a9e801-6d26-4d88-926e-5c7f9fc13486",
 * }
 */

/**
 * Create a Smartcar OAuth client for your application.
 *
 * @constructor
 * @param {Object} options
 * @param {String} options.clientId - The application's client id
 * @param {String} options.clientSecret - The application's client secret
 * @param {String} options.redirectUri - one of the application's preregistered
 * redirect URIs
 * @param {String[]} [options.scope] - list of permissions to request from user
 */
function AuthClient(options) {
  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;
  this.redirectUri = options.redirectUri;
  this.scope = options.scope;

  this.request = util.request.defaults({
    baseUrl: config.auth,
    auth: {
      user: this.clientId,
      pass: this.clientSecret,
    },
    transform: function(body, res, full) {
      res.body = util.setExpiration(res.body);
      return full ? res : res.body;
    },
  });

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
 * @param {Boolean} [options.approvalPrompt=auto] - see 2nd paragraph above
 * @return {String} OAuth authorization URL to redirect user to
 */
AuthClient.prototype.getAuthUrl = function(make, options) {

  /* eslint-disable camelcase */
  const parameters = {
    response_type: 'code',
    client_id: this.clientId,
    redirect_uri: this.redirectUri,
  };
  /* eslint-enable camelcase */

  if (this.scope) {
    parameters.scope = this.scope.join(' ');
  }

  options = options || {};

  if (options.state) {
    parameters.state = options.state;
  }

  if (options.approvalPrompt) {
    // eslint-disable-next-line camelcase
    parameters.approval_prompt = options.approvalPrompt;
  }

  const query = qs.stringify(parameters);

  return `${config.oems[make]}/oauth/authorize?${query}`;

};

/**
 * Exchange an authorization code for an access object.
 *
 * @param {String} code - authorization code to exchange
 * @return {Promise<Access>}
 */
AuthClient.prototype.exchangeCode = function(code) {

  /* eslint-disable camelcase */
  const form = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: this.redirectUri,
  };
  /* eslint-enable camelcase */

  return util.wrap(this.request.post('/oauth/token', {form}));

};

/**
 * Exchange a refresh token for a new access object.
 *
 * @param {String} token - refresh token to exchange
 * @return {Promise<Access>}
 */
AuthClient.prototype.exchangeToken = function(token) {

  /* eslint-disable camelcase */
  const form = {
    grant_type: 'refresh_token',
    refresh_token: token,
  };
  /* eslint-enable camelcase */

  return util.wrap(this.request.post('/oauth/token', {form}));

};

module.exports = AuthClient;
