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

      const accessToken = access.accessToken;
      const vehicleIds = await smartcar.getVehicleIds(accessToken);
      context.vehicle = new smartcar.Vehicle(vehicleIds.vehicles[0], accessToken);
    };
  };

  const authUrl = client.getAuthUrl();

  runTest(context.client, context.browser, authUrl, setup(context), t.end);
});

test('vehicle info', async (t) => {
  t.notThrows(async () => await context.vehicle.info());
});

test('vehicle location', async (t) => {
  t.notThrows(async () => await context.vehicle.location());
});

test('vehicle odometer', async (t) => {
  t.notThrows(async () => await context.vehicle.odometer());
});

test('vehicle vin', async (t) => {
  t.notThrows(async () => await context.vehicle.vin());
});

test('vehicle lock', async (t) => {
  t.notThrows(async () => await context.vehicle.lock());
});

test('vehicle unlock', async (t) => {
  t.notThrows(async () => await context.vehicle.unlock());
});

test('vehicle permissions', async (t) => {
  t.notThrows(async () => await context.vehicle.permissions());
});

test('vehicle disconnect', async (t) => {
  t.notThrows(async () => await context.vehicle.disconnect());
});
