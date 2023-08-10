'use strict';

const _ = require('lodash');
const test = require('ava');

const smartcar = require('../../');
const util = require('../../lib/util');
const {getAuthClientParams, runAuthFlow, DEFAULT_SCOPES} = require('./helpers');

test.before(async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl(DEFAULT_SCOPES));
  const {accessToken} = await client.exchangeCode(code);
  const {vehicles} = await smartcar.getVehicles(accessToken);
  t.context.accessToken = accessToken;
  t.context.connectedVehicles = vehicles;
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

test('getConnections', async(t) => {
  const amt = util.getOrThrowConfig('E2E_SMARTCAR_AMT');
  const testVehicleId = t.context.connectedVehicles[0];
  const res = await smartcar.getConnections(amt, {vehicleId: testVehicleId});
  t.is(res.connections.length, 1);
  t.is(res.connections[0].vehicleId, testVehicleId);
});

test('deleteConnections', async(t) => {
  const amt = util.getOrThrowConfig('E2E_SMARTCAR_AMT');
  const testVehicleId = t.context.connectedVehicles[0];
  const res = await smartcar.deleteConnections(amt, {vehicleId: testVehicleId});
  t.is(res.connections.length, 1);
  t.is(res.connections[0].vehicleId, testVehicleId);
});
