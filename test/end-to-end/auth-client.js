'use strict';

const _ = require('lodash');
const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const {getAuthClientParams, runAuthFlow} = require('./helpers');
const config = require('../config');

const context = {};

test.before(() => {
  context.client = nightwatch.initClient(config.get('nightwatch'));
  context.browser = context.client.api();
});

test('exchangeCode', async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());

  const authUrl = client.getAuthUrl();

  const code = await runAuthFlow(context.client, context.browser, authUrl);

  const access = await client.exchangeCode(code);

  t.deepEqual(_.xor(_.keys(access), [
    'accessToken',
    'expiration',
    'refreshExpiration',
    'refreshToken',
  ]), []);
});

test('exchangeRefreshToken', async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());

  const authUrl = client.getAuthUrl();

  const code = await runAuthFlow(context.client, context.browser, authUrl);

  const oldAccess = await client.exchangeCode(code);
  const newAccess = await client.exchangeRefreshToken(
    oldAccess.refreshToken
  );

  t.deepEqual(_.xor(_.keys(newAccess), [
    'accessToken',
    'expiration',
    'refreshExpiration',
    'refreshToken',
  ]), []);
});

test('isCompatible', async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());

  const teslaVin = '5YJXCDE22HF068739';
  const royceVin = 'SCA665C59HUX86700';

  const teslaComp = await client.isCompatible(teslaVin);
  const royceComp = await client.isCompatible(royceVin);

  t.truthy(teslaComp);
  t.falsy(royceComp);
});
