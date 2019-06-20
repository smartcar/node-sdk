'use strict';

const _ = require('lodash');
const test = require('ava');

const smartcar = require('../../');
const {getAuthClientParams, runAuthFlow} = require('./helpers');

test.serial('exchangeCode', async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl());
  const access = await client.exchangeCode(code);

  t.deepEqual(
    _.xor(_.keys(access), [
      'accessToken',
      'expiration',
      'refreshExpiration',
      'refreshToken',
    ]),
    []
  );
});

test.serial('exchangeRefreshToken', async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl());

  const oldAccess = await client.exchangeCode(code);
  const newAccess = await client.exchangeRefreshToken(oldAccess.refreshToken);

  t.deepEqual(
    _.xor(_.keys(newAccess), [
      'accessToken',
      'expiration',
      'refreshExpiration',
      'refreshToken',
    ]),
    []
  );
});

test.serial('isCompatible', async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());

  const teslaVin = '5YJXCDE22HF068739';
  const audiVin = 'WAUAFAFL1GN014882';

  const scopes = ['read_odometer', 'read_location'];

  const teslaComp = await client.isCompatible(teslaVin, scopes);
  const audiComp = await client.isCompatible(audiVin, scopes);

  t.truthy(teslaComp);
  t.falsy(audiComp);
});
