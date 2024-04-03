'use strict';

const {emitWarning} = require('process');
const qs = require('querystring');
const SmartcarService = require('./smartcar-service');
const util = require('./util');
const config = require('./config.json');

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
 * @param {Boolean} [options.testMode=false] - Deprecated, please use `mode` instead.
 * Launch Smartcar Connect in [test mode](https://smartcar.com/docs/guides/testing/).
 * @param {String} [options.mode='live'] - Determine what mode Smartcar Connect should be
 * launched in. Should be one of test, live or simulated.
 */
function AuthClient(options = {}) {
  this.clientId =
    options.clientId || util.getOrThrowConfig('SMARTCAR_CLIENT_ID');
  this.clientSecret =
    options.clientSecret || util.getOrThrowConfig('SMARTCAR_CLIENT_SECRET');
  this.redirectUri =
    options.redirectUri || util.getOrThrowConfig('SMARTCAR_REDIRECT_URI');

  this.mode = 'live';
  if (options.hasOwnProperty('testMode')) {
    emitWarning(// eslint-disable-next-line max-len
      'The "testMode" parameter is deprecated, please use the "mode" parameter instead.',
    );
    this.mode = options.testMode === true ? 'test' : 'live';
  } else if (options.hasOwnProperty('mode')) {
    this.mode = options.mode;
  }
  if (!['test', 'live', 'simulated'].includes(this.mode)) {
    throw new Error(// eslint-disable-next-line max-len
      'The "mode" parameter MUST be one of the following: \'test\', \'live\', \'simulated\'',
    );
  }
  this.authUrl = util.getConfig('SMARTCAR_AUTH_ORIGIN') || config.auth;

  this.service = new SmartcarService({
    baseUrl: this.authUrl,
    auth: {
      user: this.clientId,
      pass: this.clientSecret,
    },
  });
}

/**
 * Generate the Smartcar Connect URL.
 *
 * By default users are not shown the permission dialog if they have already
 * approved the set of scopes for this application. The application can elect
 * to always display the permissions dialog to the user by setting
 * approval_prompt to `force`.
 * @param {String[]} [scope] - List of permissions your application
 * requires. The valid permission names are found in the [API Reference](https://smartcar.com/docs/guides/scope/)
 * @param {Object} [options]
 * @param {Boolean} [options.forcePrompt] - Setting `forcePrompt` to
 * `true` will show the permissions approval screen on every authentication
 * attempt, even if the user has previously consented to the exact scope of
 * permissions.
 * @param {Boolean|Object} [options.singleSelect] - An optional value that sets the
 * behavior of the grant dialog displayed to the user. Object can contain two keys :
 *  - enabled - Boolean value, if set to `true`, `single_select` limits the user to
 *    selecting only one vehicle.
 *  - vin - String vin, if set, Smartcar will only authorize the vehicle with the specified VIN.
 * See the [Single Select guide](https://smartcar.com/docs/guides/single-select/) for more information.
 * @param {String} [options.state] - OAuth state parameter passed to the
 * redirect uri. This parameter may be used for identifying the user who
 * initiated the request.
 * @param {Object} [options.makeBypass] - An optional parameter that allows
 * users to bypass the car brand selection screen.
 * For a complete list of supported makes, please see our
 * [API Reference](https://smartcar.com/docs/api#authorization) documentation.
 * @param {Object} [options.flags] - Object of flags where key is the name of the flag
 * value is string or boolean value.
 * @param {String} [options.user] - An optional unique identifier for a vehicle owner.
 * This identifier is used to aggregate analytics across Connect sessions for each vehicle owner.
 *
 * @return {String} Smartcar Connect URL to direct user to.
 * @example
 * https://connect.smartcar.com/oauth/authorize?
 * response_type=code
 * &client_id=8229df9f-91a0-4ff0-a1ae-a1f38ee24d07
 * &scope=read_odometer read_vehicle_info
 * &redirect_uri=https://example.com/home
 * &state=0facda3319
 * &make=TESLA
 * &single_select=true
 * &single_select_vin=5YJSA1E14FF101307
 * &flags=country:DE color:00819D
 * &user=61a3e3d2-5198-47ba-aabd-4623ce4a4042
 */
AuthClient.prototype.getAuthUrl = function(scope, options = {}) {
  /* eslint-disable camelcase */
  const parameters = {
    response_type: 'code',
    client_id: this.clientId,
    redirect_uri: this.redirectUri,
    approval_prompt: options.forcePrompt === true ? 'force' : 'auto',
  };
  /* eslint-enable camelcase */

  parameters.scope = scope.join(' ');

  if (options.state) {
    parameters.state = options.state;
  }

  if (options.singleSelect) {
    /* eslint-disable camelcase */
    if (options.singleSelect.vin) {
      parameters.single_select = true;
      parameters.single_select_vin = options.singleSelect.vin;
    } else if ([true, false].includes(options.singleSelect.enabled)) {
      parameters.single_select = options.singleSelect.enabled;
    }
    /* eslint-enable camelcase */
  }

  if (options.makeBypass) {
    parameters.make = options.makeBypass;
  }

  if (options.flags) {
    parameters.flags = util.getFlagsString(options.flags);
  }

  if (options.user) {
    parameters.user = options.user;
  }

  parameters.mode = this.mode;

  const query = qs.stringify(parameters);

  return `${
    util.getConfig('SMARTCAR_API_ORIGIN') || config.connect
  }/oauth/authorize?${query}`;
};

/**
 * Exchange an authorization code for an access object.
 *
 * @param {String} code - Authorization code to exchange for a Smartcar
 * access token and refresh token.
 * @param {Object} [options.flags] - Object of flags where key is the name of the flag
 * value is string or boolean value.
 * @return {Access} New set of Access and Refresh tokens.
 * @throws {SmartcarError} - an instance of SmartcarError.
 * See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 * for all possible errors.
 */
AuthClient.prototype.exchangeCode = async function(code, options = {}) {
  const qs = {};
  if (options.flags) {
    qs.flags = util.getFlagsString(options.flags);
  }

  /* eslint-disable camelcase */
  const form = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: this.redirectUri,
  };
  /* eslint-enable camelcase */

  const response = await this.service.request(
    'post',
    '/oauth/token',
    {form},
    {qs},
  );
  return util.formatAccess(response);
};

/**
 * Exchange a refresh token for a new access object.
 *
 * @param {String} token - Refresh token to exchange for a new set of Access and
 * Refresh tokens.
 * @param {Object} [options.flags] - Object of flags where key is the name of the flag
 * value is string or boolean value.
 * @return {Access} New set of Access and Refresh tokens.
 * @throws {SmartcarError} - an instance of SmartcarError.
 * See the [errors section](https://github.com/smartcar/node-sdk/tree/master/doc#errors)
 * for all possible errors.
 */
AuthClient.prototype.exchangeRefreshToken = async function(
  token,
  options = {},
) {
  const qs = {};
  if (options.flags) {
    qs.flags = util.getFlagsString(options.flags);
  }

  /* eslint-disable camelcase */
  const form = {
    grant_type: 'refresh_token',
    refresh_token: token,
  };
  /* eslint-enable camelcase */

  const response = await this.service.request(
    'post',
    '/oauth/token',
    {form},
    {qs},
  );
  return util.formatAccess(response);
};

module.exports = AuthClient;
