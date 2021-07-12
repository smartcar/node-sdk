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

  const oldAccess = await client.exchangeCode(code);
  const newAccess = await client.exchangeRefreshToken(oldAccess.refreshToken);

  t.deepEqual(
    _.xor(_.keys(newAccess), [
      'accessToken',
      'expiration',
      'refreshExpiration',
      'refreshToken',
    ]),
    [],
  );

  const error = await t.throwsAsync(
    client.exchangeRefreshToken(oldAccess.refreshToken)
  );
  const expectedMessage = 'invalid_grant:undefined - Invalid or expired refresh token.';
  t.is(error.message, expectedMessage);

  t.is(error.type, 'invalid_grant');
});
