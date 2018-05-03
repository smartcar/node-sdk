'use strict';

const _ = require('lodash');
const test = require('ava');
const nock = require('nock');
const Promise = require('bluebird');
const StatusCodeError = require('request-promise/errors').StatusCodeError;

const util = require('../../lib/util');
const config = require('../../lib/config');
const errors = require('../../lib/errors');

const API_URL = config.api + '/v' + config.version;

test('setExpiration', function(t) {

  // eslint-disable-next-line camelcase
  const access = {expires_in: 7200};
  const expected = Date.now() + (7200 * 1000);
  const rExpected = Date.now() + (60 * 24 * 60 * 60 * 1000);

  util.setExpiration(access);

  t.true(_.isDate(access.expiration));
  t.true(_.isDate(access.refreshExpiration));

  const actual = access.expiration.getTime();
  const rActual = access.refreshExpiration.getTime();
  t.true(expected - 100 <= actual && actual <= expected + 100);
  t.true(rExpected - 100 <= rActual && rActual <= rExpected + 100);

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


test('request - default opts', async function(t) {

  const n = nock('https://mock.com')
    .get('/test')
    .matchHeader('accept', 'application/json')
    .matchHeader('user-agent', /smartcar-node-sdk:.*/)
    .reply(200, {test: 'data'});

  const response = await util.request('https://mock.com/test');

  t.is(typeof response, 'object');
  t.is(response.test, 'data');
  t.true(n.isDone());

});

test('wrap', async function(t) {

  const not = util.wrap(Promise.reject(new Error('blah')));
  await t.throws(not, /blah/);

  const should = util.wrap(Promise.reject(new StatusCodeError('h')));
  await t.throws(should);

});

test('catch - ValidationError', async function(t) {

  const n = nock('https://mock.com')
    .get('/validation')
    .reply(400, {
      error: 'validation_error',
      message: 'password must be a string',
    });

  const err = await t.throws(util.request('https://mock.com/validation'));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.ValidationError);
  t.is(boxed.message, 'password must be a string');
  t.true(n.isDone());

});

test('catch - AuthenticationError', async function(t) {

  const n = nock('https://mock.com')
    .get('/auth')
    .reply(401, {
      error: 'authentication_error',
      message: 'invalid bearer header',
    });

  const err = await t.throws(util.request('https://mock.com/auth', {
    auth: {
      bearer: 'pizza',
    },
  }));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.AuthenticationError);
  t.regex(boxed.message, /pizza/);
  t.true(n.isDone());

});

test('catch - PermissionError', async function(t) {

  const n = nock('https://mock.com')
    .get('/perm')
    .reply(403, {
      error: 'permission_error',
      message: 'you shall not pass',
    });

  const err = await t.throws(util.request('https://mock.com/perm'));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.PermissionError);
  t.regex(boxed.message, /https:\/\/mock.com\/perm/);
  t.true(n.isDone());

});

test('catch - ResourceNotFoundError', async function(t) {

  const n = nock('https://mock.com')
    .get('/404')
    .reply(404, {
      error: 'resource_not_found_error',
      message: 'wat',
    });

  const err = await t.throws(util.request('https://mock.com/404'));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.ResourceNotFoundError);
  t.regex(boxed.message, /https:\/\/mock.com\/404/);
  t.true(n.isDone());

});

test('catch - VehicleStateError', async function(t) {

  const n = nock('https://mock.com')
    .get('/state')
    .reply(409, {
      error: 'vehicle_state_error',
      message: 'wat',
    });

  const err = await t.throws(util.request('https://mock.com/state', {
    json: {ACTION: 'LOCK'},
  }));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.VehicleStateError);
  t.regex(boxed.message, /https:\/\/mock.com\/state/);
  t.true(n.isDone());

});

test('catch - RateLimitingError', async function(t) {

  const n = nock('https://mock.com')
    .get('/ratelimit')
    .reply(429, {
      error: 'rate_limit_error',
      message: 'wat',
    });

  const err = await t.throws(util.request('https://mock.com/ratelimit'));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.RateLimitingError);
  t.notRegex(boxed.message, /https:\/\/mock.com\/ratelimit/);
  t.true(n.isDone());

});

test('catch - MonthlyLimitExceeded', async function(t) {

  const n = nock('https://mock.com')
    .get('/monthly')
    .reply(430, {
      error: 'montly_limit_error',
      message: 'wat',
    });

  const err = await t.throws(util.request('https://mock.com/monthly'));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.MonthlyLimitExceeded);
  t.notRegex(boxed.message, /https:\/\/mock.com\/monthly/);
  t.true(n.isDone());

});

test('catch - ServerError', async function(t) {

  const n = nock('https://mock.com')
    .get('/server')
    .reply(500, {
      error: 'server_error',
      message: 'wat',
    });

  const err = await t.throws(util.request('https://mock.com/server'));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.ServerError);
  t.is(boxed.message, 'Unexpected server error');
  t.true(n.isDone());

});

test('catch - NotCapableError', async function(t) {

  const n = nock('https://mock.com')
    .get('/notcap')
    .reply(501, {
      error: 'vehicle_not_capable_error',
      message: 'wat',
    });

  const err = await t.throws(util.request('https://mock.com/notcap'));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.NotCapableError);
  t.regex(boxed.message, /https:\/\/mock.com\/notcap/);
  t.true(n.isDone());

}
);
test('catch - SmartcarError', async function(t) {

  const n = nock('https://mock.com')
    .get('/generic')
    .reply(600, {
      error: 'monkeys_on_mars',
      message: 'yes, really',
    });

  const err = await t.throws(util.request('https://mock.com/generic'));
  const boxed = t.throws(() => util.catch(err));

  t.true(boxed instanceof errors.SmartcarError);
  t.regex(boxed.message, /monkeys_on_mars/);
  t.true(boxed.original instanceof StatusCodeError);
  t.true(n.isDone());

});
