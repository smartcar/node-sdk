'use strict';

const _ = require('lodash');
const test = require('ava');
const {env} = require('process');

const smartcar = require('../../');
const util = require('../../lib/util');
const {getAuthClientParams, runAuthFlow, DEFAULT_SCOPES} = require('./helpers');

test.before(async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl(DEFAULT_SCOPES));
  const {accessToken} = await client.exchangeCode(code);
  const {vehicles} = await smartcar.getVehicles(accessToken);
  const {id: userId} = await smartcar.getUser(accessToken);
  t.context.userId = userId;
  t.context.accessToken = accessToken;
  t.context.connectedVehicles = vehicles;

  const v3TestVehicleId = 'tst2e255-d3c8-4f90-9fec-e6e68b98e9cb';
  const v3TestToken = 'test-data-token';
  const v3TestVehicle = new smartcar.Vehicle(v3TestVehicleId, v3TestToken);
  const v3TestOrigin = 'https://vehicle.api.smartcar.com';

  t.context.v3TestVehicle = v3TestVehicle;
  t.context.v3TestOrigin = v3TestOrigin;
});

test('getVehicles', async(t) => {
  const response = await smartcar.getVehicles(t.context.accessToken);
  t.deepEqual(
    _.xor(_.keys(response), [
      'vehicles',
      'paging',
      'meta',
    ]),
    [],
  );
  t.deepEqual(response.paging.offset, 0);
  response.vehicles.forEach((vehicleId) => {
    t.deepEqual(vehicleId.length, 36);
  });
  t.deepEqual(response.meta.requestId.length, 36);
});

test('getVehicle - v3', async(t) => {

  env.SMARTCAR_API_V3_ORIGIN = t.context.v3TestOrigin;
  const {v3TestVehicle} = t.context;
  const token = v3TestVehicle.token;
  const vehicleId = v3TestVehicle.id;
  const response = await smartcar.getVehicle(token, vehicleId);

  t.is(response.body.id, vehicleId);
  delete env.SMARTCAR_API_V3_ORIGIN;

});

test('getUser', async(t) => {
  const response = await smartcar.getUser(t.context.accessToken);
  t.deepEqual(
    _.xor(_.keys(response), [
      'id',
      'meta',
    ]),
    [],
  );

  t.deepEqual(response.id.length, 36);
  t.deepEqual(response.meta.requestId.length, 36);
});

test('getCompatibility', async(t) => {
  const {clientId, clientSecret} = getAuthClientParams();
  const teslaVin = '5YJXCDE22HF068739';
  const audiVin = 'WAUAFAFL1GN014882';

  const scope = ['read_odometer', 'read_location'];

  const teslaComp = await smartcar.getCompatibility(
    teslaVin,
    scope,
    null,
    {clientId, clientSecret},
  );
  const audiComp = await smartcar.getCompatibility(
    audiVin,
    scope,
    null,
    {clientId, clientSecret},
  );
  [teslaComp, audiComp].forEach((response) => {
    t.deepEqual(
      _.xor(_.keys(response), [
        'compatible',
        'reason',
        'capabilities',
        'meta',
      ]),
      [],
    );
    t.truthy(response.compatible);
    t.deepEqual(response.meta.requestId.length, 36);
    t.deepEqual(response.capabilities.length, 2);
  });
  t.truthy(_.every(audiComp.capabilities, ['capable', false]));
  t.truthy(_.every(teslaComp.capabilities, ['capable', true]));
});

test.serial('getCompatibilityMatrix', async(t) => {
  const {clientId, clientSecret} = getAuthClientParams();
  const response = await smartcar.getCompatibilityMatrix('US', {
    scope: ['read_battery', 'read_charge'],
    make: 'NISSAN',
    type: 'BEV',
    clientId,
    clientSecret,
  });
  t.truthy(response.NISSAN);
  response.NISSAN.forEach((vehicle) => {
    t.deepEqual(
      _.xor(_.keys(vehicle), [
        'model',
        'type',
        'startYear',
        'endYear',
        'endpoints',
        'permissions',
      ]),
      [],
    );
    t.is(vehicle.type, 'BEV');
    t.truthy(vehicle.permissions.includes('read_battery'));
    t.truthy(vehicle.permissions.includes('read_charge'));
  });
});

test.serial('getConnections', async(t) => {
  const amt = util.getOrThrowConfig('E2E_SMARTCAR_AMT');
  const res = await smartcar.getConnections(amt);
  t.truthy(res.connections[0].userId);
  t.truthy(res.connections[0].vehicleId);
  t.truthy(res.connections[0].connectedAt);
});

test.serial('getConnections - by vehicleId', async(t) => {
  const amt = util.getOrThrowConfig('E2E_SMARTCAR_AMT');
  const testVehicleId = t.context.connectedVehicles[0];
  const res = await smartcar.getConnections(amt, {vehicleId: testVehicleId});
  t.is(res.connections.length, 1);
  t.is(res.connections[0].vehicleId, testVehicleId);
});

test.serial('getConnections - by userId', async(t) => {
  const amt = util.getOrThrowConfig('E2E_SMARTCAR_AMT');
  const res = await smartcar.getConnections(amt, {userId: t.context.userId});
  t.is(res.connections.length, t.context.connectedVehicles.length);
  for (const connection of res.connections) {
    t.is(connection.userId, t.context.userId);
  }
});

test.serial('getConnections - by userId - limit 1', async(t) => {
  const amt = util.getOrThrowConfig('E2E_SMARTCAR_AMT');
  const res = await smartcar.getConnections(amt,
    {userId: t.context.userId},
    {limit: 1},
  );
  t.is(res.connections.length, t.context.connectedVehicles.length);
});

test.serial('deleteConnections - by vehicleId', async(t) => {
  const amt = util.getOrThrowConfig('E2E_SMARTCAR_AMT');
  const testVehicleId = t.context.connectedVehicles[0];
  const res = await smartcar.deleteConnections(amt, {vehicleId: testVehicleId});
  t.is(res.connections.length, 1);
  t.is(res.connections[0].vehicleId, testVehicleId);
});

test.serial('deleteConnections - by userId', async(t) => {
  const amt = util.getOrThrowConfig('E2E_SMARTCAR_AMT');
  const res = await smartcar.deleteConnections(amt, {userId: t.context.userId});
  // to account for serial test above
  t.is(res.connections.length, t.context.connectedVehicles.length - 1);
  for (const connection of res.connections) {
    t.is(connection.userId, t.context.userId);
  }
});
