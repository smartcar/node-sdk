'use strict';

const _ = require('lodash');
const test = require('ava');

const smartcar = require('../../');
const {getAuthClientParams, runAuthFlow, DEFAULT_SCOPES} = require('./helpers');

test('exchangeCode', async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl(DEFAULT_SCOPES));
  const access = await client.exchangeCode(code);

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
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl(DEFAULT_SCOPES));

  const exchagedTokens = await client.exchangeCode(code);

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
