'use strict';

var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var util = require('../lib/util');
var config = require('../lib/config');
var errors = require('../lib/errors');

var VALID_TOKEN = 'valid-token';
var VALID_AUTH = 'Bearer ' + VALID_TOKEN;
var INVALID_TOKEN = 'invalid-token';
var INVALID_AUTH = 'Bearer ' + INVALID_TOKEN;
var VALID_ENDPOINT = 'valid-endpoint';
var INVALID_ENDPOINT = 'invalid-endpoint';
var NOT_CAPABLE_ENDPOINT = 'not-capable-endpoint';
var INVALID_REQUEST_BODY = { invalidkey: 'invalidvalue' };
var API_URL = config.api + '/v' + config.version;

suite('Errors', function(){
  suiteSetup(function(){
    var apiNock = nock(config.api + '/v' + config.version).persist();
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
      .get(INVALID_ENDPOINT)
      .reply(404);
    apiNock
      .get(NOT_CAPABLE_ENDPOINT)
      .matchHeader('Authorization', VALID_AUTH)
      .reply(501);

  });
  suiteTeardown(function(){
    nock.cleanAll();
  });

  test('ValidationError', function(){
    util.request({
      url: API_URL + VALID_ENDPOINT,
      method: 'POST',
      auth: { bearer: VALID_TOKEN },
      form: INVALID_REQUEST_BODY,
    })
    .then(function(){
      throw new Error('Invalid body data, request should have failed');
    })
    .catch(errors.ValidationError, function(err){
      expect(err).to.have.property('statusCode', 400);
    });
  });

  test('AuthenticationError', function(){
    util.request({
      url: API_URL + VALID_ENDPOINT,
      method: 'GET',
      auth: { bearer: INVALID_TOKEN },
    })
    .then(function(){
      throw new Error('Invalid authentication, request should have failed');
    })
    .catch(errors.AuthenticationError, function(err){
      expect(err).to.have.property('statusCode', 401);
    });
  });

  test('PermissionError', function(){

  });
  test('ResourceNotFoundError', function(){
    util.request({
      url: API_URL + INVALID_ENDPOINT,
      method: 'GET',
    })
    .then(function(){
      throw new Error('Invalid endpoint, request should have failed');
    })
    .catch(errors.ResourceNotFoundError, function(err){
      expect(err).to.have.property('statusCode', 404);
    });
  });
  test('NotCapableError', function(){
    util.request({
      url: API_URL + NOT_CAPABLE_ENDPOINT,
      method: 'GET',
      auth: { bearer: VALID_TOKEN },
    })
    .then(function(){
      throw new Error('Vehicle not capable, request should have failed');
    })
    .catch(errors.NotCapableError, function(err){
      expect(err).to.have.property('statusCode', 501);
    });
  });

});