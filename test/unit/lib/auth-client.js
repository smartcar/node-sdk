'use strict';

const _ = require('lodash');
const test = require('ava');
const nock = require('nock');

const AuthClient = require('../../../lib/auth-client');

const CLIENT_ID = '4cf82729-4275-46d9-9255-8437ba777151';
const INVALID_CLIENT_ID = '4cf82729-4275-46d9-9255-87ba151';
const CLIENT_SECRET = '4cf82729-4275-46d9-9255-8437ba777151';

test('constructor', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  });

  t.is(client.clientId, CLIENT_ID);
  t.is(client.clientSecret, CLIENT_SECRET);
  t.is(client.redirectUri, 'https://insurance.co/callback');
  t.deepEqual(client.scope, ['read_odometer', 'read_vehicle_info']);
  t.is(client.testMode, false);
  t.true('request' in client);
});

test('constructor - missing required parameter', function(t) {
  t.throws(
    () =>
      new AuthClient({
        clientId: 'f3266b17-961d-4295-8544-054c7bd94fbb',
        redirectUri: 'https://insurance.co/callback',
        scope: ['read_odometer', 'read_vehicle_info'],
      }),
  );
});

test('constructor - invalid uuid parameter', function(t) {
  t.throws(
    () =>
      new AuthClient({
        clientId: INVALID_CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: 'https://insurance.co/callback',
        scope: ['read_odometer', 'read_vehicle_info'],
      }),
  );
});

test('constructor - invalid scope parameter', function(t) {
  t.throws(
    () =>
      new AuthClient({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: 'https://insurance.co/callback',
        scope: 'read_odometer',
      }),
  );
});

test('constructor - invalid development parameter', function(t) {
  t.throws(
    () =>
      new AuthClient({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: 'https://insurance.co/callback',
        scope: ['read_odometer', 'read_vehicle_info'],
        development: 'truthsies',
      }),
  );
});

test('iOS and Android redirect uri', function(t) {
  t.notThrows(
    () =>
      new AuthClient({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: 'sc4a1b01e5-0497-417c-a30e-6df6ba33ba46://callback',
        scope: ['read_odometer', 'read_vehicle_info'],
      }),
  );
});

test('getAuthUrl - simple', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  });

  const actual = client.getAuthUrl();
  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=auto';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&mode=live';

  t.is(actual, expected);
});

test('getAuthUrl - with vehicleInfo={...}', function(t) {

  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  });

  const vehicleInfo = {
    make: 'TESLA',
  };

  const actual = client.getAuthUrl({vehicleInfo});
  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=auto';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&make=TESLA';
  expected += '&mode=live';

  t.is(actual, expected);

});

test('getAuthUrl - with incorrect vehicleInfo={...}', function(t) {

  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  });

  const vehicleInfo = {
    pizza: 'isGood',
  };

  const actual = client.getAuthUrl({vehicleInfo});

  t.is(actual.includes('&pizza=isGood'), false);

});


test('getAuthUrl - no scope', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  const actual = client.getAuthUrl({
    scope: 'this should be ignored',
    state: 'fakestate',
    forcePrompt: true,
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&state=fakestate';
  expected += '&mode=live';

  t.is(actual, expected);
});

test('getAuthUrl - state & approval prompt', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  });

  const actual = client.getAuthUrl({
    scope: 'this should be ignored',
    state: 'fakestate',
    forcePrompt: true,
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&mode=live';

  t.is(actual, expected);
});

test('getAuthUrl - test mode true', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
    testMode: true,
  });

  const actual = client.getAuthUrl({
    scope: 'this should be ignored',
    state: 'fakestate',
    forcePrompt: true,
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&mode=test';

  t.is(actual, expected);
});

test('getAuthUrl - test mode false', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
    testMode: false,
  });

  const actual = client.getAuthUrl({
    scope: 'this should be ignored',
    state: 'fakestate',
    forcePrompt: true,
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&mode=live';

  t.is(actual, expected);
});

test('getAuthUrl - deprecated development mode', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
    development: true,
  });

  const actual = client.getAuthUrl({
    scope: 'this should be ignored',
    state: 'fakestate',
    forcePrompt: true,
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&mode=test';

  t.is(actual, expected);
});

test('getAuthUrl - deprecated development mode false', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
    development: false,
  });

  const actual = client.getAuthUrl({
    scope: 'this should be ignored',
    state: 'fakestate',
    forcePrompt: true,
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&mode=live';

  t.is(actual, expected);
});

test('exchangeCode', async function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
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
      user: CLIENT_ID,
      pass: CLIENT_SECRET,
    })
    .reply(200, {
      access_token: 'access',
      token_type: 'Bearer',
      expires_in: 1800,
      refresh_token: 'refresh',
    });
  /* eslint-enable camelcase */

  const response = await client.exchangeCode('AUTHCODE');

  t.is(response.accessToken, 'access');
  t.is(response.refreshToken, 'refresh');

  t.true(_.isDate(response.expiration));
  t.true(_.isDate(response.refreshExpiration));
  t.true(n.isDone());
});

test('exchangeRefreshToken', async function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  /* eslint-disable camelcase */
  const n = nock('https://auth.smartcar.com')
    .post('/oauth/token', {
      refresh_token: 'TOKEN',
      grant_type: 'refresh_token',
    })
    .basicAuth({
      user: CLIENT_ID,
      pass: CLIENT_SECRET,
    })
    .reply(200, {
      access_token: 'access',
      token_type: 'Bearer',
      expires_in: 1800,
      refresh_token: 'refresh',
    });
  /* eslint-enable camelcase */

  const response = await client.exchangeRefreshToken('TOKEN');

  t.is(response.accessToken, 'access');
  t.is(response.refreshToken, 'refresh');

  t.true(_.isDate(response.expiration));
  t.true(_.isDate(response.refreshExpiration));
  t.true(n.isDone());
});

test('isCompatible - without scope', async function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  const vin = 'fake_vin';

  const n = nock('https://api.smartcar.com')
    .get('/v1.0/compatibility')
    .query({vin})
    .basicAuth({
      user: CLIENT_ID,
      pass: CLIENT_SECRET,
    })
    .reply(200, {
      compatible: true,
    });

  const response = await client.isCompatible(vin);

  t.is(response, true);
  t.true(n.isDone());
});

test('isCompatible - with scope', async function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  const vin = 'fake_vin';
  const scope = ['read_location', 'read_odometer'];

  const n = nock('https://api.smartcar.com')
    .get('/v1.0/compatibility')
    .query({vin, scope: 'read_location read_odometer'})
    .basicAuth({
      user: CLIENT_ID,
      pass: CLIENT_SECRET,
    })
    .reply(200, {
      compatible: true,
    });

  const response = await client.isCompatible(vin, scope);

  t.is(response, true);
  t.true(n.isDone());
});
