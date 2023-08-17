'use strict';

const _ = require('lodash');
const {format} = require('util');
const {StatusCodeError} = require('request-promise/errors');

const config = require('./config.json');
const SmartcarError = require('./smartcar-error');
const {version} = require('../package.json');
const {env} = require('process');

const util = {};

util.USER_AGENT = format(
  'Smartcar/%s (%s; %s) Node.js %s',
  version,
  process.platform,
  process.arch,
  process.version,
);

/**
 * Format Access object and set expiration properties.
 *
 * @param {Access} access access object
 * @return {Access}
 */
util.formatAccess = function(access) {
  const expiresIn = access.expires_in * 1000; // normalize to ms
  const expiration = new Date(Date.now() + expiresIn);
  const dayMs = 24 * 60 * 60 * 1000;
  const refreshExpiration = new Date(Date.now() + (60 * dayMs));
  return {
    accessToken: access.access_token,
    refreshToken: access.refresh_token,
    expiration,
    refreshExpiration,
  };
};

/**
 * Form an API request URI.
 *
 * @param {String} id vehicle identifier
 * @param {String} endpoint API endpoint
 * @return {String} API request URI
 */
util.getUrl = function(id, endpoint, version = config.version) {
  const origin = util.getConfig('SMARTCAR_API_ORIGIN') || config.api;
  let url = `${origin}/v${version}/vehicles`;

  if (id) {
    url += `/${id}`;
  }

  if (endpoint) {
    url += `/${endpoint}`;
  }

  return url;
};

util.wrap = function(promise) {
  return promise.catch(StatusCodeError, util.handleError);
};

util.getOrThrowConfig = function(configName) {
  if (env[configName]) {
    return env[configName];
  }

  throw new Error(
    `${configName} not set or passed as arguments`,
  );
};

util.getConfig = function(configName) {
  return env[configName];
};

util.getFlagsString = function(flags) {
  return Object.entries(flags)
    .map(([key, value]) => `${key}:${value}`).join(' ');
};

util.handleError = function(caught) {
  const body = _.get(caught, 'response.body', '');
  const headers = _.get(caught, 'response.headers', {});

  const contentType = String(headers['content-type']);
  if (!contentType.toLowerCase().includes('application/json')) {
    // body would be a string in this case
    throw new SmartcarError(caught.statusCode, body, headers);
  }

  if (typeof body === 'string') {
    throw new SmartcarError(
      caught.statusCode,
      {message: body, type: 'SDK_ERROR'},
      headers,
    );
  }

  if (body.error || body.type) {
    throw new SmartcarError(caught.statusCode, body, headers);
  } else {
    throw new SmartcarError(
      caught.statusCode,
      {body, type: 'SDK_ERROR'},
      headers,
    );
  }
};

/**
 *
 * Generate the token for vehicle management APIs using the amt.
 *
 * @method
 * @param {String} amt - Application Management Token
 * @param {String} username
 * @return {String} managementToken
 */
util.getManagementToken = function(amt, username = 'default') {
  const credentials = `${username}:${amt}`;
  return Buffer.from(credentials).toString('base64');
};

module.exports = util;
