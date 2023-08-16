'use strict';

const _ = require('lodash');
const test = require('ava');
const Promise = require('bluebird');
const {StatusCodeError} = require('request-promise/errors');
const {env} = require('process');

const util = require('../../../lib/util');
const smartcar = require('../../../');
const config = require('../../../lib/config.json');
const SmartcarError = require('../../../lib/smartcar-error');

const API_URL = config.api + '/v' + config.version;

test.afterEach((t) => {
  smartcar.setApiVersion('1.0');
  t.true(config.version === '1.0');
});

test('formatAccess', function(t) {

  /* eslint-disable camelcase */
  const response = {
    token_type: 'Bearer',
    expires_in: 7200,
    access_token: 'df12ca11-36a7-4196-9c33-b9fa1f18dd14',
    refresh_token: 'c569b7ed-6536-4d19-9790-61ba7a4389c6',
  };
  /* eslint-enable camelcase */
  const access = util.formatAccess(response);
  const expectedKeys = [
    'accessToken',
    'refreshToken',
    'expiration',
    'refreshExpiration',
  ];

  t.is(_.xor(Object.keys(access), expectedKeys).length, 0);

  t.is(access.accessToken, response.access_token);
  t.is(access.refreshToken, response.refresh_token);

  const expected = Date.now() + (7200 * 1000);
  const rExpected = Date.now() + (60 * 24 * 60 * 60 * 1000);

  t.true(_.isDate(access.expiration));
  t.true(_.isDate(access.refreshExpiration));

  const actual = access.expiration.getTime();
  const rActual = access.refreshExpiration.getTime();
  t.true(expected - 1000 <= actual && actual <= expected + 1000);
  t.true(rExpected - 1000 <= rActual && rActual <= rExpected + 1000);
});

test('getOrThrowConfig - success', function(t) {
  env.PIZZA = 'PASTA';
  t.is(util.getOrThrowConfig('PIZZA'), 'PASTA');
});

test('getOrThrowConfig - error', function(t) {
  const error = t.throws(() => (util.getOrThrowConfig('PASTA')));
  t.is(error.message, 'PASTA not set or passed as arguments');
});

test('getUrl - no args', function(t) {
  const url = util.getUrl();
  t.is(url, API_URL + '/vehicles');
});

test('getUrl - id', function(t) {
  const url = util.getUrl('VID');
  t.is(url, API_URL + '/vehicles/VID');
});

test('getUrl - id & endpoint', function(t) {
  const url = util.getUrl('VID', 'odometer');
  t.is(url, API_URL + '/vehicles/VID/odometer');
});

test('getUrl - version 2.0', function(t) {
  const url = util.getUrl('VID', 'odometer', '2.0');
  t.is(url, 'https://api.smartcar.com/v2.0/vehicles/VID/odometer');
});

test('wrap - ignores non-StatusCodeErrors', async function(t) {
  const error = new Error('blah');

  const not = util.wrap(Promise.reject(error));

  await t.throwsAsync(not, {
    is: error,
  });
});


test('wrap - wraps StatusCodeErrors', async function(t) {
  const error = new StatusCodeError('h');

  const should = util.wrap(Promise.reject(error));

  await t.throwsAsync(should, {
    instanceOf: SmartcarError,
  });
});

test('handleError - non-json', function(t) {
  const boxed = t.throws(() => util.handleError({
    statusCode: 504,
    response: {
      body: 'what',
    },
  }));

  t.true(boxed instanceof SmartcarError);
  t.is(boxed.statusCode, 504);
  t.is(boxed.message, 'what');
});

test('handleError - String/non-json body', function(t) {
  const boxed = t.throws(() => util.handleError({
    statusCode: 500,
    response: {
      body: 'what',
      headers: {
        'content-type': 'application/json',
      },
    },
  }));

  t.true(boxed instanceof SmartcarError);
  t.is(boxed.statusCode, 500);
  t.is(boxed.message, 'SDK_ERROR:undefined - what');
  t.is(boxed.type, 'SDK_ERROR');
});

test('handleError - SmartcarError V1', function(t) {
  const boxed = t.throws(() => util.handleError({
    statusCode: 600,
    response: {
      body: {
        error: 'monkeys_on_mars',
        message: 'yes, really',
      },
      headers: {
        'content-type': 'application/json',
      },
    },
  }));

  t.true(boxed instanceof SmartcarError);
  t.is(boxed.statusCode, 600);
  t.is(boxed.message, 'monkeys_on_mars:undefined - yes, really');
  t.is(boxed.type, 'monkeys_on_mars');
});

test('handleError - when bit-flips because of moon position', function(t) {
  const boxed = t.throws(() => util.handleError({
    statusCode: 999,
    response: {
      body: {
        random: 'testing',
      },
      headers: {
        'content-type': 'application/json',
      },
    },
  }));

  t.true(boxed instanceof SmartcarError);
  t.is(boxed.statusCode, 999);
  t.is(boxed.message, 'SDK_ERROR:undefined - Unknown error');
  t.is(boxed.type, 'SDK_ERROR');
});


test('handleError - SmartcarError V2 no resolution', function(t) {
  const boxed = t.throws(() => util.handleError({
    statusCode: 500,
    response: {
      body: {
        type: 'type',
        code: 'code',
        description: 'description',
        resolution: null,
        detail: null,
        requestId: '123',
        docURL: null,
        statusCode: 500,
      },
      headers: {
        'content-type': 'application/json',
      },
    },
  }));

  t.true(boxed instanceof SmartcarError);
  t.is(boxed.statusCode, 500);
  t.false('resolution' in boxed);
  t.false('detail' in boxed);
  t.false('docURL' in boxed);
  t.is(boxed.description, 'description');
  t.is(boxed.type, 'type');
  t.is(boxed.code, 'code');
  t.is(boxed.requestId, '123');
  t.is(boxed.message, 'type:code - description');
});

test('handleError - SmartcarError V2 resolution string', function(t) {
  const boxed = t.throws(() => util.handleError({
    statusCode: 500,
    response: {
      body: {
        type: 'type',
        code: 'code',
        description: 'description',
        resolution: 'resolution',
        requestId: '123',
        statusCode: 500,
      },
      headers: {
        'content-type': 'application/json',
      },
    },
  }));

  t.true(boxed instanceof SmartcarError);
  t.is(boxed.statusCode, 500);
  t.is(boxed.resolution.type, 'resolution');
  t.false('url' in boxed.resolution);
  t.false('detail' in boxed);
  t.false('docURL' in boxed);
  t.is(boxed.description, 'description');
  t.is(boxed.type, 'type');
  t.is(boxed.code, 'code');
  t.is(boxed.requestId, '123');
  t.is(boxed.message, 'type:code - description');
});

test('handleError - SmartcarError V2 with all attrbutes', function(t) {
  const boxed = t.throws(() => util.handleError({
    statusCode: 500,
    response: {
      body: {
        type: 'type',
        code: 'code',
        description: 'description',
        docURL: 'docURL',
        resolution: {pizza: 'resolution'},
        requestId: '123',
        statusCode: 500,
        detail: ['pizza'],
      },
      headers: {
        'content-type': 'application/json',
      },
    },
  }));

  t.true(boxed instanceof SmartcarError);
  t.is(boxed.statusCode, 500);
  t.is(boxed.resolution.pizza, 'resolution');
  t.is(boxed.docURL, 'docURL');
  t.is(boxed.description, 'description');
  t.is(boxed.type, 'type');
  t.is(boxed.code, 'code');
  t.is(boxed.requestId, '123');
  t.is(boxed.message, 'type:code - description');
  t.is(boxed.detail[0], 'pizza');
});

test('getManagementToken', function(t) {
  const res = util.getManagementToken('amt');
  t.is(res, 'ZGVmYXVsdDphbXQ=');
  const res2 = util.getManagementToken('amt', 'default');
  t.is(res2, 'ZGVmYXVsdDphbXQ=');
});
