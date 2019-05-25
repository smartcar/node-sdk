'use strict';

const test = require('ava');

const smartcar = require('../../');
const {getAuthClientParams, runAuthFlow} = require('./helpers');

test.before(async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl());
  const {accessToken} = await client.exchangeCode(code);

  t.context.accessToken = accessToken;
});

test('getVehicleIds', async(t) => {
  await t.notThrowsAsync(smartcar.getVehicleIds(t.context.accessToken));
});

test('getUserId', async(t) => {
  await t.notThrowsAsync(smartcar.getUserId(t.context.accessToken));
});
