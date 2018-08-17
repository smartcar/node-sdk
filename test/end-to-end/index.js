'use strict';

const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const {getAuthClientParams, runAuthFlow} = require('./helpers');
const config = require('../config');

const context = {};

test.before(async() => {
  context.client = nightwatch.initClient(config.get('nightwatch'));
  context.browser = context.client.api();

  const client = new smartcar.AuthClient(getAuthClientParams());

  const authUrl = client.getAuthUrl();

  const code = await runAuthFlow(context.client, context.browser, authUrl);

  const access = await client.exchangeCode(code);
  context.accessToken = access.accessToken;
});

test('getVehicleIds', async(t) => {
  await t.notThrows(smartcar.getVehicleIds(context.accessToken));
});

test('getUserId', async(t) => {
  await t.notThrows(smartcar.getUserId(context.accessToken));
});
