'use strict';

const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const {getAuthClientParams, runTest} = require('./helpers');
const config = require('../config');

const context = {};

test.before.cb((t) => {
  context.client = nightwatch.initClient(config.get('nightwatch'));
  context.browser = context.client.api();

  const client = new smartcar.AuthClient(getAuthClientParams());

  const setup = (context) => {
    return async (code) => {
      const access = await client.exchangeCode(code);
      context.accessToken = access.accessToken;
    };
  };

  const authUrl = client.getAuthUrl();

  runTest(context.client, context.browser, authUrl, setup(context), t.end);
});

test('getVehicleIds', async (t) => {
  t.notThrows(async () => await smartcar.getVehicleIds(context.accessToken));
});

test('getUserId', async (t) => {
  t.notThrows(async () => await smartcar.getUserId(context.accessToken));
});
