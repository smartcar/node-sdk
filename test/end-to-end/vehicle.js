'use strict';

const test = require('ava');

const smartcar = require('../../');
const {getAuthClientParams, runAuthFlow} = require('./helpers');

/**
 * Returns access token to a vehicle that has compatibility + permission to scope
 */
const getVehicle = async function(brand, scope) {
  const client = new smartcar.AuthClient(getAuthClientParams(scope));
  const code = await runAuthFlow(client.getAuthUrl(), brand);
  const {accessToken} = await client.exchangeCode(code);
  const vehicleIds = await smartcar.getVehicleIds(accessToken);

  return new smartcar.Vehicle(vehicleIds.vehicles[0], accessToken);
};

test.before(async(t) => {
  const [volt, egolf] = await Promise.all([
    getVehicle('CHEVROLET', [
      'required:read_vehicle_info',
      'required:read_location',
      'required:read_odometer',
      'required:control_security',
      'required:read_vin',
      'required:read_fuel',
      'required:read_battery',
      'required:read_charge',
      'required:read_engine_oil',
      'required:read_tires',
    ]),
    getVehicle('VOLKSWAGEN', ['required:control_charge']),
  ]);

  t.context = {volt, egolf};
});

test('vehicle info', async(t) => {
  await t.notThrowsAsync(t.context.volt.info());
});

test('vehicle location', async(t) => {
  await t.notThrowsAsync(t.context.volt.location());
});

test('vehicle odometer', async(t) => {
  await t.notThrowsAsync(t.context.volt.odometer());
});

test('vehicle fuel', async(t) => {
  await t.notThrowsAsync(t.context.volt.fuel());
});

test('vehicle oil', async(t) => {
  await t.notThrowsAsync(t.context.volt.oil());
});

test('vehicle tire pressure', async(t) => {
  await t.notThrowsAsync(t.context.volt.tirePressure());
});

test('vehicle battery', async(t) => {
  await t.notThrowsAsync(t.context.volt.battery());
});

test('vehicle charge', async(t) => {
  await t.notThrowsAsync(t.context.volt.charge());
});

test('vehicle vin', async(t) => {
  await t.notThrowsAsync(t.context.volt.vin());
});

test('vehicle lock', async(t) => {
  await t.notThrowsAsync(t.context.volt.lock());
});

test('vehicle unlock', async(t) => {
  await t.notThrowsAsync(t.context.volt.unlock());
});

test('vehicle startCharge', async(t) => {
  await t.notThrowsAsync(t.context.egolf.startCharge());
});

test('vehicle stopCharge', async(t) => {
  await t.notThrowsAsync(t.context.egolf.stopCharge());
});

test('vehicle batch', async(t) => {
  await t.notThrowsAsync(t.context.volt.batch(['/odometer', '/location']));
});

test('vehicle permissions', async(t) => {
  await t.notThrowsAsync(t.context.volt.permissions());
});

test('vehicle has permission', async(t) => {
  await t.notThrowsAsync(t.context.volt.hasPermissions('read_odometer'));
});

test('vehicle has permissions', async(t) => {
  await t.notThrowsAsync(
    t.context.volt.hasPermissions(['read_odometer', 'read_vehicle_info']),
  );
});

test.after.always('vehicle disconnect', async(t) => {
  await t.notThrowsAsync(t.context.volt.disconnect());
});
