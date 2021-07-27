'use strict';
const _ = require('lodash');
const test = require('ava');

const smartcar = require('../../');
const {getOrThrowConfig} = require('../../lib/util');

const {getAuthClientParams, runAuthFlow, DEFAULT_SCOPES} = require('./helpers');

/**
 * Returns access token to a vehicle that has compatibility + permission to scope
 */
const getVehicle = async function(brand, scope) {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl(scope), brand);
  const {accessToken} = await client.exchangeCode(code);
  const {vehicles} = await smartcar.getVehicles(accessToken);

  return new smartcar.Vehicle(vehicles[0], accessToken);
};

test.before(async(t) => {
  const [volt, tesla] = await Promise.all([
    getVehicle('CHEVROLET', DEFAULT_SCOPES),
    getVehicle('TESLA', [
      'required:control_charge',
      'required:control_security',
    ]),
  ]);

  smartcar.setApiVersion('1.0');
  t.context = {volt, tesla};
});

test('vehicle vin', async(t) => {
  const response = await t.context.volt.vin();
  t.deepEqual(
    _.xor(_.keys(response), [
      'vin',
      'meta',
    ]),
    [],
  );
  t.is(response.vin.length, 17);
  t.is(response.meta.requestId.length, 36);
});

test('vehicle charge', async(t) => {
  const response = await t.context.volt.charge();
  t.deepEqual(
    _.xor(_.keys(response), [
      'isPluggedIn',
      'state',
      'meta',
    ]),
    [],
  );

  t.truthy(
    ['CHARGING', 'FULLY_CHARGED', 'NOT_CHARGING'].includes(response.state),
  );
  t.truthy(typeof response.isPluggedIn === 'boolean');
  t.truthy(response.meta.dataAge instanceof Date);
  t.is(response.meta.requestId.length, 36);
});

test('vehicle battery', async(t) => {
  const response = await t.context.volt.battery();
  t.deepEqual(
    _.xor(_.keys(response), [
      'range',
      'percentRemaining',
      'meta',
    ]),
    [],
  );

  t.truthy(typeof response.range === 'number');
  t.truthy(response.percentRemaining >= 0 && response.percentRemaining <= 1);
  t.truthy(response.meta.dataAge instanceof Date);
  t.is(response.meta.requestId.length, 36);
  t.is(response.meta.unitSystem, 'metric');
});

test('vehicle batteryCapacity', async(t) => {
  const response = await t.context.volt.batteryCapacity();
  t.deepEqual(
    _.xor(_.keys(response), [
      'capacity',
      'meta',
    ]),
    [],
  );

  t.truthy(typeof response.capacity === 'number');
  t.truthy(response.meta.dataAge instanceof Date);
  t.is(response.meta.requestId.length, 36);
});

test('vehicle fuel', async(t) => {
  const response = await t.context.volt.fuel();
  t.deepEqual(
    _.xor(_.keys(response), [
      'range',
      'percentRemaining',
      'amountRemaining',
      'meta',
    ]),
    [],
  );

  t.truthy(typeof response.range === 'number');
  t.truthy(typeof response.amountRemaining === 'number');
  t.truthy(response.percentRemaining >= 0 && response.percentRemaining <= 1);
  t.truthy(response.meta.dataAge instanceof Date);
  t.is(response.meta.requestId.length, 36);
  t.is(response.meta.unitSystem, 'metric');
});

test('vehicle tire pressure', async(t) => {
  const keys = ['frontLeft', 'frontRight', 'backLeft', 'backRight'];
  const response = await t.context.volt.tirePressure();
  t.deepEqual(
    _.xor(_.keys(response), keys.concat(['meta'])),
    [],
  );

  keys.forEach((key) => t.truthy(typeof response[key] === 'number'));
  t.truthy(response.meta.dataAge instanceof Date);
  t.is(response.meta.requestId.length, 36);
  t.is(response.meta.unitSystem, 'metric');
});

test('vehicle engine oil', async(t) => {
  const response = await t.context.volt.engineOil();
  t.deepEqual(
    _.xor(_.keys(response), [
      'lifeRemaining',
      'meta',
    ]),
    [],
  );

  t.truthy(response.lifeRemaining >= 0 && response.lifeRemaining <= 1);
  t.truthy(response.meta.dataAge instanceof Date);
  t.is(response.meta.requestId.length, 36);
});

test('vehicle odometer', async(t) => {
  const response = await t.context.volt.odometer();
  t.deepEqual(
    _.xor(_.keys(response), [
      'distance',
      'meta',
    ]),
    [],
  );

  t.truthy(typeof response.distance === 'number');
  t.truthy(response.meta.dataAge instanceof Date);
  t.is(response.meta.requestId.length, 36);
  t.is(response.meta.unitSystem, 'metric');
});

test('vehicle location', async(t) => {
  const response = await t.context.volt.location();
  t.deepEqual(
    _.xor(_.keys(response), [
      'longitude',
      'latitude',
      'meta',
    ]),
    [],
  );

  t.truthy(typeof response.longitude === 'number');
  t.truthy(typeof response.latitude === 'number');
  t.truthy(response.meta.dataAge instanceof Date);
  t.is(response.meta.requestId.length, 36);
});


test('vehicle attributes', async(t) => {
  const response = await t.context.volt.attributes();
  t.deepEqual(
    _.xor(_.keys(response), [
      'make',
      'model',
      'year',
      'id',
      'meta',
    ]),
    [],
  );

  t.is(response.id.length, 36);
  t.is(response.make, 'CHEVROLET');
  t.is(response.model, 'Volt');
  t.truthy(typeof response.year === 'number');
  t.is(response.meta.requestId.length, 36);
});

test('vehicle permissions', async(t) => {
  const response = await t.context.volt.permissions();
  t.deepEqual(
    _.xor(_.keys(response), [
      'permissions',
      'meta',
      'paging',
    ]),
    [],
  );

  t.deepEqual(
    _.xor(
      response.permissions.map((item) => `required:${item}`),
      DEFAULT_SCOPES,
    ),
    [],
  );
  t.is(response.meta.requestId.length, 36);
  t.is(response.paging.offset, 0);
  t.is(response.paging.count, 10);
});

test('vehicle subscribe and unsubscribe - success', async(t) => {
  const webhookId = getOrThrowConfig('E2E_SMARTCAR_WEBHOOK_ID');
  const amt = getOrThrowConfig('E2E_SMARTCAR_AMT');
  let response = await t.context.volt.subscribe(webhookId);
  t.deepEqual(
    _.xor(_.keys(response), [
      'webhookId',
      'vehicleId',
      'meta',
    ]),
    [],
  );
  t.is(response.vehicleId, t.context.volt.id);
  t.is(response.webhookId, webhookId);
  t.is(response.meta.requestId.length, 36);

  response = await t.context.volt.unsubscribe(amt, webhookId);
  t.deepEqual(
    _.xor(_.keys(response), [
      'status',
      'meta',
    ]),
    [],
  );

  t.is(response.status, 'success');
  t.is(response.meta.requestId.length, 36);
});

test('vehicle subscribe - error', async(t) => {
  const errorMessage = 'VALIDATION:null - Request invalid or malformed.'
    + ' Please check for missing parameters,'
    + ' spelling and casing mistakes, and other syntax issues.';
  const error = await t.throwsAsync(t.context.volt.subscribe('webhookID'));
  t.is(error.requestId.length, 36);
  t.is(error.statusCode, 400);
  t.is(error.message, errorMessage);
  t.is(error.type, 'VALIDATION');
});

test('vehicle unsubscribe - error', async(t) => {
  const errorMessage = 'AUTHENTICATION:null - The authorization header'
   + ' is missing or malformed, or it contains invalid or'
   + ' expired authentication credentials. Please check for missing parameters,'
   + ' spelling and casing mistakes, and other syntax issues.';
  const error = await t.throwsAsync(
    t.context.volt.unsubscribe('amt', 'webhookID'),
  );
  t.is(error.requestId.length, 36);
  t.is(error.statusCode, 401);
  t.is(error.message, errorMessage);
  t.is(error.type, 'AUTHENTICATION');
});

test('vehicle lock', async(t) => {
  const response = await t.context.tesla.lock();
  t.deepEqual(
    _.xor(_.keys(response), [
      'status',
      'message',
      'meta',
    ]),
    [],
  );

  t.is(response.status, 'success');
  t.is(response.message, 'Successfully sent request to vehicle');
  t.is(response.meta.requestId.length, 36);
});

test('vehicle unlock', async(t) => {
  const response = await t.context.tesla.unlock();
  t.deepEqual(
    _.xor(_.keys(response), [
      'status',
      'message',
      'meta',
    ]),
    [],
  );

  t.is(response.status, 'success');
  t.is(response.message, 'Successfully sent request to vehicle');
  t.is(response.meta.requestId.length, 36);
});

test('vehicle startCharge', async(t) => {
  const response = await t.context.tesla.startCharge();
  t.deepEqual(
    _.xor(_.keys(response), [
      'status',
      'message',
      'meta',
    ]),
    [],
  );

  t.is(response.status, 'success');
  t.is(response.message, 'Successfully sent request to vehicle');
  t.is(response.meta.requestId.length, 36);
});

test('vehicle stopCharge', async(t) => {
  const response = await t.context.tesla.stopCharge();
  t.deepEqual(
    _.xor(_.keys(response), [
      'status',
      'message',
      'meta',
    ]),
    [],
  );
  t.is(response.status, 'success');
  t.is(response.message, 'Successfully sent request to vehicle');
  t.is(response.meta.requestId.length, 36);
});

test('vehicle batch', async(t) => {
  const response = await t.context.volt.batch(['/odometer', '/location']);

  const odometer = response.odometer();
  t.deepEqual(
    _.xor(_.keys(odometer), [
      'distance',
      'meta',
    ]),
    [],
  );

  t.truthy(typeof odometer.distance === 'number');
  t.truthy(odometer.meta.dataAge instanceof Date);
  t.is(odometer.meta.requestId.length, 36);
  t.is(odometer.meta.unitSystem, 'metric');
  t.truthy(Boolean(response));

  const location = response.location();
  t.deepEqual(
    _.xor(_.keys(location), [
      'longitude',
      'latitude',
      'meta',
    ]),
    [],
  );

  t.truthy(typeof location.longitude === 'number');
  t.truthy(typeof location.latitude === 'number');
  t.truthy(location.meta.dataAge instanceof Date);
  t.is(location.meta.requestId.length, 36);
});

test.after.always('vehicle disconnect', async(t) => {
  const response = await t.context.volt.disconnect();
  t.deepEqual(
    _.xor(_.keys(response), [
      'status',
      'meta',
    ]),
    [],
  );

  t.is(response.status, 'success');
  t.is(response.meta.requestId.length, 36);
});
