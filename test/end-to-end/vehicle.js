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
  const accessToken = access.accessToken;
  const vehicleIds = await smartcar.getVehicleIds(accessToken);
  context.vehicle = new smartcar.Vehicle(vehicleIds.vehicles[0], accessToken);
});

test('vehicle info', async(t) => {
  await t.notThrowsAsync(context.vehicle.info());
});

test('vehicle location', async(t) => {
  await t.notThrowsAsync(context.vehicle.location());
});

test('vehicle odometer', async(t) => {
  await t.notThrowsAsync(context.vehicle.odometer());
});

test('vehicle vin', async(t) => {
  await t.notThrowsAsync(context.vehicle.vin());
});

test('vehicle lock', async(t) => {
  await t.notThrowsAsync(context.vehicle.lock());
});

test('vehicle unlock', async(t) => {
  await t.notThrowsAsync(context.vehicle.unlock());
});

test('vehicle permissions', async(t) => {
  await t.notThrowsAsync(context.vehicle.permissions());
});

test('vehicle disconnect', async(t) => {
  await t.notThrowsAsync(context.vehicle.disconnect());
});
