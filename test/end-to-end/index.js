'use strict';

const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const {getAuthClientParams, runAuthFlow} = require('./helpers');
const config = require('../config');

const context = {};

test.before(() => {
  context.client = nightwatch.initClient(config.get('nightwatch'));
  context.browser = context.client.api();

  const client = new smartcar.AuthClient(getAuthClientParams());

  const authUrl = client.getAuthUrl();

  return runAuthFlow(context.client, context.browser, authUrl)
    .then(async (code) => {
      const access = await client.exchangeCode(code);

      context.accessToken = access.accessToken;
    });
});

test('getVehicleIds', async (t) => {
  t.notThrows(async () => await smartcar.getVehicleIds(context.accessToken));
});

test('getUserId', async (t) => {
  t.notThrows(async () => await smartcar.getUserId(context.accessToken));
});
