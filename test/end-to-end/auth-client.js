'use strict';

const _ = require('lodash');
const test = require('ava');

const smartcar = require('../../');
const {getAuthClientParams, runAuthFlow, DEFAULT_SCOPES} = require('./helpers');

// Share auth tokens across tests to reduce auth flow calls
test.before(async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl(DEFAULT_SCOPES));
  const tokens = await client.exchangeCode(code);
  
  t.context.client = client;
  t.context.tokens = tokens;
});

test('exchangeCode', (t) => {
  const access = t.context.tokens;

  t.deepEqual(
    _.xor(_.keys(access), [
      'accessToken',
      'expiration',
      'refreshExpiration',
      'refreshToken',
    ]),
    [],
  );
});

test('exchangeRefreshToken', async(t) => {
  const client = t.context.client;
  const initialTokens = t.context.tokens;

  const exchagedTokens = await client.exchangeRefreshToken(
    initialTokens.refreshToken,
  );

  t.deepEqual(
    _.xor(_.keys(exchagedTokens), [
      'accessToken',
      'expiration',
      'refreshExpiration',
      'refreshToken',
    ]),
    [],
  );
});
