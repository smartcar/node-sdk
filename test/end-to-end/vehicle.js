'use strict';

const test = require('ava');

const smartcar = require('../../');
const {getAuthClientParams, runAuthFlow} = require('./helpers');

test.before(async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl());
  const {accessToken} = await client.exchangeCode(code);
  const vehicleIds = await smartcar.getVehicleIds(accessToken);

  t.context.vehicle = new smartcar.Vehicle(vehicleIds.vehicles[0], accessToken);
});

test('vehicle info', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.info());
});

test('vehicle location', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.location());
});

test('vehicle odometer', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.odometer());
});

test('vehicle fuel', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.fuel());
});

test('vehicle battery', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.battery());
});

test('vehicle charge', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.charge());
});

test('vehicle vin', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.vin());
});

test('vehicle lock', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.lock());
});

test('vehicle unlock', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.unlock());
});

test('vehicle permissions', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.permissions());
});

test('vehicle has permission', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.hasPermissions('read_odometer'));
});

test('vehicle has permissions', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.hasPermissions(
    ['read_odometer', 'read_vehicle_info']));
});

test('vehicle disconnect', async(t) => {
  await t.notThrowsAsync(t.context.vehicle.disconnect());
});
