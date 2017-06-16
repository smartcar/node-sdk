'use strict';

const expect = require('chai').use(require('dirty-chai')).expect;
const nock = require('nock');

const config = require('../lib/config');
const errors = require('../lib/errors');
const util = require('../lib/util');

const VALID_TOKEN = 'valid-token';
const VALID_AUTH = 'Bearer ' + VALID_TOKEN;
const INVALID_TOKEN = 'invalid-token';
const INVALID_AUTH = 'Bearer ' + INVALID_TOKEN;
const VALID_ENDPOINT = 'valid-endpoint';
const INVALID_ENDPOINT = 'invalid-endpoint';
const NOT_CAPABLE_ENDPOINT = 'not-capable-endpoint';
const INVALID_REQUEST_BODY = {invalidkey: 'invalidvalue'};
const API_URL = config.api + '/v' + config.version;
const REALLY_BAD_ENDPOINT = 'really-bad-endpoint';
const INSUFFICIENT_PERMISSION_ENDPOINT = 'godmode-endpoint';
const INVALID_STATE_ENDPOINT = 'invalid-state';
const MONTHLY_LIMIT_ENDPOINT = 'monthly-endpoint';
const RATE_LIMIT_ENDPOINT = 'rate-endpoint';

suite('Errors', function() {
  suiteSetup(function() {
    const apiNock = nock(`${config.api}/v${config.version}`).persist();
    apiNock
      .get(VALID_ENDPOINT)
      .matchHeader('Authorization', VALID_AUTH)
      .reply(200);
    apiNock
      .post(VALID_ENDPOINT, INVALID_REQUEST_BODY)
      .matchHeader('Authorization', VALID_AUTH)
      .reply(400);
    apiNock
      .get(VALID_ENDPOINT)
      .matchHeader('Authorization', INVALID_AUTH)
      .reply(401);
    apiNock
      .get(INSUFFICIENT_PERMISSION_ENDPOINT)
      .reply(403);
    apiNock
      .get(INVALID_ENDPOINT)
      .reply(404);
    apiNock.get(INVALID_STATE_ENDPOINT)
      .reply(409);
    apiNock
      .get(RATE_LIMIT_ENDPOINT)
      .reply(429);
    apiNock
      .get(MONTHLY_LIMIT_ENDPOINT)
      .reply(430);
    apiNock
      .get(REALLY_BAD_ENDPOINT)
      .reply(500);
    apiNock
      .get(NOT_CAPABLE_ENDPOINT)
      .matchHeader('Authorization', VALID_AUTH)
      .reply(501);

  });
  suiteTeardown(function() {
    nock.cleanAll();
  });

  test('SmartcarError', function() {
    Object.keys(errors).forEach(function(key) {
      expect(new errors[key]()).to.be.instanceof(errors.SmartcarError);
    });
    expect(new errors.SmartcarError()).to.be.instanceof(Error);
  });

  test('ValidationError', function() {
    return util.request({
      url: API_URL + VALID_ENDPOINT,
      method: 'POST',
      auth: {bearer: VALID_TOKEN},
      form: INVALID_REQUEST_BODY,
    })
    .then(function() {
      throw new Error('Invalid body data, request should have failed');
    })
    .catch(errors.ValidationError, function(err) {
      expect(err).to.have.property('statusCode', 400);
    });
  });

  test('AuthenticationError', function() {
    return util.request({
      url: API_URL + VALID_ENDPOINT,
      method: 'GET',
      auth: {bearer: INVALID_TOKEN},
    })
    .then(function() {
      throw new Error('Invalid authentication, request should have failed');
    })
    .catch(errors.AuthenticationError, function(err) {
      expect(err).to.have.property('statusCode', 401);
    });
  });

  test('PermissionError', function() {
    return util.request({
      url: API_URL + INSUFFICIENT_PERMISSION_ENDPOINT,
      method: 'GET',
    })
    .then(function() {
      throw new Error('Insufficient permission, request should have failed');
    })
    .catch(errors.PermissionError, function(err) {
      expect(err).to.have.property('statusCode', 403);
    });
  });

  test('ResourceNotFoundError', function() {
    return util.request({
      url: API_URL + INVALID_ENDPOINT,
      method: 'GET',
    })
    .then(function() {
      throw new Error('Invalid endpoint, request should have failed');
    })
    .catch(errors.ResourceNotFoundError, function(err) {
      expect(err).to.have.property('statusCode', 404);
    });
  });

  test('StateError', function() {
    return util.request({
      url: API_URL + INVALID_STATE_ENDPOINT,
      method: 'GET',
    })
    .then(function() {
      throw new Error('Invalid state, request should have failed');
    })
    .catch(errors.StateError, function(err) {
      expect(err).to.have.property('statusCode', 409);
    });
  });

  test('RateLimitingError', function() {
    return util.request({
      url: API_URL + RATE_LIMIT_ENDPOINT,
      method: 'GET',
    })
    .then(function() {
      throw new Error('Rate limit exceeded, request should have failed');
    })
    .catch(errors.RateLimitingError, function(err) {
      expect(err).to.have.property('statusCode', 429);
    });
  });

  test('MonthlyLimitExceeded', function() {
    return util.request({
      url: API_URL + MONTHLY_LIMIT_ENDPOINT,
      method: 'GET',
    })
    .then(function() {
      throw new Error('Monthly limit exceeded, request should have failed');
    })
    .catch(errors.MonthlyLimitExceeded, function(err) {
      expect(err).to.have.property('statusCode', 430);
    });
  });

  test('ServerError', function() {
    return util.request({
      url: API_URL + REALLY_BAD_ENDPOINT,
      method: 'GET',
    })
    .then(function() {
      throw new Error('The server got a bad url, request should have failed');
    })
    .catch(errors.ServerError, function(err) {
      expect(err).to.have.property('statusCode', 500);
    });
  });

  test('NotCapableError', function() {
    return util.request({
      url: API_URL + NOT_CAPABLE_ENDPOINT,
      method: 'GET',
      auth: {bearer: VALID_TOKEN},
    })
    .then(function() {
      throw new Error('Vehicle not capable, request should have failed');
    })
    .catch(errors.NotCapableError, function(err) {
      expect(err).to.have.property('statusCode', 501);
    });
  });


});
