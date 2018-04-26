'use strict';

const test = require('ava');
const nock = require('nock');

const AuthClient = require('../../lib/auth-client');

const ISO_REGEX = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;

test('constructor', function(t) {

  const client = new AuthClient({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  });

  t.is(client.clientId, 'CLIENT_ID');
  t.is(client.clientSecret, 'CLIENT_SECRET');
  t.is(client.redirectUri, 'https://insurance.co/callback');
  t.deepEqual(client.scope, ['read_odometer', 'read_vehicle_info']);
  t.true('request' in client);

});

test('request', async function(t) {

  const client = new AuthClient({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
  });

  const n = nock('https://auth.smartcar.com')
    .get('/client')
    .basicAuth({
      user: 'CLIENT_ID',
      pass: 'CLIENT_SECRET',
    })
    .twice()
    .reply(200, {
      expires_in: 1800, // eslint-disable-line camelcase
    });

  const body = await client.request('client');

  t.is(body.expires_in, 1800);
  t.regex(body.expiration, ISO_REGEX);

  const full = await client.request('client', {
    resolveWithFullResponse: true,
  });

  t.is(full.statusCode, 200);
  t.is(full.body.expires_in, 1800);
  t.regex(full.body.expiration, ISO_REGEX);
  t.true(n.isDone());

});

test('getAuthUrl - simple', function(t) {

  const client = new AuthClient({
    clientId: 'CLIENT_ID',
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  });

  const actual = client.getAuthUrl();
  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += 'response_type=code&client_id=CLIENT_ID';
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=auto';
  expected += '&scope=read_odometer%20read_vehicle_info';

  t.is(actual, expected);

});

test('getAuthUrl - no scope', function(t) {

  const client = new AuthClient({
    clientId: 'CLIENT_ID',
    redirectUri: 'https://insurance.co/callback',
  });

  const actual = client.getAuthUrl({
    scope: 'this should be ignored',
    state: 'fakestate',
    forcePrompt: true,
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += 'response_type=code&client_id=CLIENT_ID';
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&state=fakestate';

  t.is(actual, expected);

});

test('getAuthUrl - state & approval prompt', function(t) {

  const client = new AuthClient({
    clientId: 'CLIENT_ID',
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  });

  const actual = client.getAuthUrl({
    scope: 'this should be ignored',
    state: 'fakestate',
    forcePrompt: true,
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += 'response_type=code&client_id=CLIENT_ID';
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';

  t.is(actual, expected);

});

test('exchangeCode', async function(t) {

  const client = new AuthClient({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    redirectUri: 'https://insurance.co/callback',
  });

  /* eslint-disable camelcase */
  const n = nock('https://auth.smartcar.com')
    .post('/oauth/token', {
      code: 'AUTHCODE',
      grant_type: 'authorization_code',
      redirect_uri: 'https://insurance.co/callback',
    })
    .basicAuth({
      user: 'CLIENT_ID',
      pass: 'CLIENT_SECRET',
    })
    .reply(200, {
      access_token: 'access',
      token_type: 'Bearer',
      expires_in: 1800,
      refresh_token: 'refresh',
    });
  /* eslint-enable camelcase */

  const response = await client.exchangeCode('AUTHCODE');

  t.is(response.access_token, 'access');
  t.is(response.token_type, 'Bearer');
  t.is(response.expires_in, 1800);
  t.is(response.refresh_token, 'refresh');

  t.regex(response.expiration, ISO_REGEX);
  t.true(n.isDone());

});

test('exchangeToken', async function(t) {

  const client = new AuthClient({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    redirectUri: 'https://insurance.co/callback',
  });

  /* eslint-disable camelcase */
  const n = nock('https://auth.smartcar.com')
    .post('/oauth/token', {
      refresh_token: 'TOKEN',
      grant_type: 'refresh_token',
    })
    .basicAuth({
      user: 'CLIENT_ID',
      pass: 'CLIENT_SECRET',
    })
    .reply(200, {
      access_token: 'access',
      token_type: 'Bearer',
      expires_in: 1800,
      refresh_token: 'refresh',
    });
  /* eslint-enable camelcase */

  const response = await client.exchangeToken('TOKEN');

  t.is(response.access_token, 'access');
  t.is(response.token_type, 'Bearer');
  t.is(response.expires_in, 1800);
  t.is(response.refresh_token, 'refresh');

  t.regex(response.expiration, ISO_REGEX);
  t.true(n.isDone());

});
