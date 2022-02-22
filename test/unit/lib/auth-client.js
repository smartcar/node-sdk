'use strict';

const _ = require('lodash');
const test = require('ava');
const nock = require('nock');

const AuthClient = require('../../../lib/auth-client');

const CLIENT_ID = '4cf82729-4275-46d9-9255-8437ba777151';
const CLIENT_SECRET = '4cf82729-4275-46d9-9255-8437ba777151';

test('constructor', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  t.is(client.clientId, CLIENT_ID);
  t.is(client.clientSecret, CLIENT_SECRET);
  t.is(client.redirectUri, 'https://insurance.co/callback');
  t.is(client.testMode, false);
  t.true('service' in client);
});

test('constructor - client id, secret and redirect url errors', function(t) {
  let error = t.throws(
    () =>
      new AuthClient({
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      }),
  );
  let message = 'SMARTCAR_REDIRECT_URI not set or passed as arguments';
  t.is(error.message, message);

  error = t.throws(
    () =>
      new AuthClient({
        clientId: 'clientId',
      }),
  );
  message = 'SMARTCAR_CLIENT_SECRET not set or passed as arguments';
  t.is(error.message, message);

  error = t.throws(
    () =>
      new AuthClient(),
  );
  message = 'SMARTCAR_CLIENT_ID not set or passed as arguments';
  t.is(error.message, message);
});

test('getAuthUrl - simple', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  const actual = client.getAuthUrl(['read_odometer', 'read_vehicle_info']);
  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=auto';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&mode=live';

  t.is(actual, expected);
});

test('getAuthUrl - with optional arguments', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    testMode: true,
  });

  const actual = client.getAuthUrl(
    ['read_odometer', 'read_vehicle_info'],
    {
      makeBypass: 'TESLA',
      state: 'fakestate',
      forcePrompt: true,
      flags: {country: 'DE', flag: 'suboption'},
    },
  );
  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&make=TESLA';
  expected += '&flags=country%3ADE%20flag%3Asuboption';
  expected += '&mode=test';

  t.is(actual, expected);
});

test('getAuthUrl - single select enabled true', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  const actual = client.getAuthUrl(['read_odometer', 'read_vehicle_info'], {
    state: 'fakestate',
    forcePrompt: true,
    singleSelect: {enabled: true},
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&single_select=true';
  expected += '&mode=live';

  t.is(actual, expected);
});

test('getAuthUrl - single select enabled false', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  const actual = client.getAuthUrl(['read_odometer', 'read_vehicle_info'], {
    state: 'fakestate',
    forcePrompt: true,
    singleSelect: {enabled: false},
  });

  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&single_select=false';
  expected += '&mode=live';

  t.is(actual, expected);
});

test('getAuthUrl - single select vin', function(t) {
  const client = new AuthClient({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
  });

  const singleSelect = {
    vin: '01234567890123',
  };

  const actual = client.getAuthUrl(['read_odometer', 'read_vehicle_info'], {
    state: 'fakestate',
    forcePrompt: true,
    singleSelect,
  });


  let expected = 'https://connect.smartcar.com/oauth/authorize?';
  expected += `response_type=code&client_id=${CLIENT_ID}`;
  expected += '&redirect_uri=https%3A%2F%2Finsurance.co%2Fcallback';
  expected += '&approval_prompt=force';
  expected += '&scope=read_odometer%20read_vehicle_info';
  expected += '&state=fakestate';
  expected += '&single_select=true';
  expected += '&single_select_vin=01234567890123';
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
    .post('/oauth/token?flags=pizza%3Apasta', {
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

  const response = await client.exchangeCode(
    'AUTHCODE',
    {flags: {pizza: 'pasta'}},
  );

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
    .post('/oauth/token?flags=pizza%3Apasta', {
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

  const response = await client.exchangeRefreshToken(
    'TOKEN',
    {flags: {pizza: 'pasta'}},
  );
  t.is(response.accessToken, 'access');
  t.is(response.refreshToken, 'refresh');

  t.true(_.isDate(response.expiration));
  t.true(_.isDate(response.refreshExpiration));
  t.true(n.isDone());
});
