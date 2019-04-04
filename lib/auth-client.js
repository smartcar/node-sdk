'use strict';

const Joi = require('joi');
const qs = require('querystring');

const util = require('./util');
const config = require('./config');

/** @exports AuthClient*/

/**
 * @type {Object}
 * @typedef Access
 * @property {Date} expiration - Date object which represents when the access
 * token expires.
 * @property {String} accessToken - A token to be used for requests to the
 * Smartcar API
 * @property {String} refreshToken - A token which is used to renew access when
 * the current access token expires, expires in 60 days
 * @property {Date} refreshExpiration - Date object which represents when the
 * refresh token expires.
 * @example
 * {
 *   expiration: new Date('2017-05-26T01:21:27.070Z'),
 *   accessToken: '88704225-9f6c-4919-93e7-e0cec71317ce',
 *   refreshToken: '60a9e801-6d26-4d88-926e-5c7f9fc13486',
 *   refreshExpiration: new Date('2017-05-26T01:21:27.070Z'),
 * }
 */

/**
 * Create a Smartcar OAuth client for your application.
 *
 * @constructor
 * @param {Object} options
 * @param {String} options.clientId - Application client id obtained from
 * [Smartcar Developer Portal](https://developer.smartcar.com). If you do not
 * have access to the dashboard, please
 * [request access](https://smartcar.com/subscribe).
 * @param {String} options.clientSecret - The application's client secret.
 * @param {String} options.redirectUri - Redirect URI registered in the
 * [application settings](https://developer.smartcar.com/apps). The given URL
 * must exactly match one of the registered URLs.
 * @param {String[]} [options.scope=all] - List of permissions your application
 * requires. This will default to requiring all scopes. The valid permission
 * names are found in the
 * [API Reference](https://smartcar.com/docs#get-all-vehicles).
 * @param {Boolean} [options.testMode=false] - Launch the Smartcar auth flow in
 * test mode.
 * [API Reference](https://smartcar.com/docs#request-authorization).
 * @param {Boolean} [options.development=false] - DEPRECATED: Launch Smartcar auth in
 * development mode to enable mock vehicle brands.
 */
function AuthClient(options) {
  const schema = Joi.object().keys({
    clientId: Joi.string()
      .guid({
        version: ['uuidv4'],
      })
      .required(),
    clientSecret: Joi.string()
      .guid({
        version: ['uuidv4'],
      })
      .required(),
    redirectUri: Joi.string()
      .uri()
      .required(),
    scope: Joi.array().items(Joi.string()),
    development: Joi.boolean(),
    testMode: Joi.boolean(),
  });

  Joi.assert(options, schema);

  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;
  this.redirectUri = options.redirectUri;
  this.scope = options.scope;

  if (options.development !== undefined) {
    /* eslint-disable-next-line no-console */
    console.warn(`DeprecationWarning: development flag is deprecated.
      This is discouraged and will be removed in the next major release.
      Use testMode instead`);
    this.development = options.development;
  }

  this.testMode = options.testMode || false;

  this.request = util.request.defaults({
    baseUrl: config.auth,
    auth: {
      user: this.clientId,
      pass: this.clientSecret,
    },
  });
}

/**
 * Generate the OAuth authorization URL.
 *
 * By default users are not shown the permission dialog if they have already
 * approved the set of scopes for this application. The application can elect
 * to always display the permissions dialog to the user by setting
 * approval_prompt to `force`.
 *
 * @param {Object} [options]
 * @param {String} [options.state] - OAuth state parameter passed to the
 * redirect uri. This parameter may be used for identifying the user who
 * initiated the request.
 * @param {Boolean} [options.forcePrompt=false] - Setting `forcePrompt` to
 * `true` will show the permissions approval screen on every authentication
 * attempt, even if the user has previously consented to the exact scope of
 * permissions.
 * @param {Object} [options.vehicleInfo.make] - `vehicleInfo` is an
 * object with an optional property `make`. An optional parameter that allows
 * users to bypass the car brand selection screen.
 * For a complete list of supported makes, please see our
 * [API Reference](https://smartcar.com/docs/api#authorization) documentation.
 * @return {String} OAuth authorization URL to direct user to.
 * @example
 * https://connect.smartcar.com/oauth/authorize?
 * response_type=code
 * &client_id=8229df9f-91a0-4ff0-a1ae-a1f38ee24d07
 * &scope=read_odometer read_vehicle_info
 * &redirect_uri=https://example.com/home
 * &state=0facda3319
 * &make=TESLA
 */
AuthClient.prototype.getAuthUrl = function(options) {
  options = options || {};
  const forcePrompt = options.forcePrompt || false;

  /* eslint-disable camelcase */
  const parameters = {
    response_type: 'code',
    client_id: this.clientId,
    redirect_uri: this.redirectUri,
    approval_prompt: forcePrompt ? 'force' : 'auto',
  };
  /* eslint-enable camelcase */

  if (this.scope) {
    parameters.scope = this.scope.join(' ');
  }

  if (options.state) {
    parameters.state = options.state;
  }

  if (options.vehicleInfo) {
    const availableParams = ['make'];
    for (const param of availableParams) {
      if (param in options.vehicleInfo) {
        parameters[param] = options.vehicleInfo[param];
      }
    }
  }

  let mode;
  if (this.development !== undefined) {
    mode = this.development;
  } else {
    mode = this.testMode;
  }
  parameters.mode = mode ? 'test' : 'live';

  const query = qs.stringify(parameters);

  return `${config.connect}/oauth/authorize?${query}`;
};

/**
 * Exchange an authorization code for an access object.
 *
 * @param {String} code - Authorization code to exchange for a Smartcar
 * access token and refresh token.
 * @return {Promise.<Access>} Access and Refresh tokens.
 */
AuthClient.prototype.exchangeCode = function(code) {
  /* eslint-disable camelcase */
  const form = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: this.redirectUri,
  };
  /* eslint-enable camelcase */

  return util
    .wrap(this.request.post('/oauth/token', {form}))
    .then(util.formatAccess);
};

/**
 * Exchange a refresh token for a new access object.
 *
 * @param {String} token - Refresh token to exchange for a new set of Access and
 * Refresh tokens.
 * @return {Promise.<Access>} New set of Access and Refresh tokens.
 */
AuthClient.prototype.exchangeRefreshToken = function(token) {
  /* eslint-disable camelcase */
  const form = {
    grant_type: 'refresh_token',
    refresh_token: token,
  };
  /* eslint-enable camelcase */

  return util
    .wrap(this.request.post('/oauth/token', {form}))
    .then(util.formatAccess);
};

/**
 * Determine whether a vehicle is compatible with Smartcar.
 *
 * A compatible vehicle is a vehicle that:
 * 1. has the hardware required for internet connectivity,
 * 2. belongs to the makes and models Smartcar supports, and
 * 3. supports the permissions.
 *
 * _To use this function, please contact us!_
 *
 * @param {String} vin - the VIN of the vehicle
 * @param {String[]} scope - list of permissions to check compatibility for
 * @return {Promise.<Boolean>} false if the vehicle is not compatible. true if the
 *   vehicle is likely compatible.
 */
AuthClient.prototype.isCompatible = function(vin, scope) {
  const qs = {
    vin,
    scope: scope.join(' '),
  };

  return util.wrap(this.request.get({
    baseUrl: config.api,
    url: `v${config.version}/compatibility`,
    qs,
  }))
    .then(function(response) {
      return response.compatible;
    });
};

module.exports = AuthClient;
