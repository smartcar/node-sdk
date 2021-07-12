'use strict';

const _ = require('lodash');
const test = require('ava');

const smartcar = require('../../');
const {getAuthClientParams, runAuthFlow, DEFAULT_SCOPES} = require('./helpers');

test.before(async(t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(client.getAuthUrl(DEFAULT_SCOPES));
  const {accessToken} = await client.exchangeCode(code);
  t.context.accessToken = accessToken;
  // t.context.accessToken = 'f14a1599-b5d9-4fe7-bff0-c890f837b7b4';
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

  t.deepEqual(
    _.xor(_.keys(teslaComp), [
      'compatible',
      'meta',
    ]),
    [],
  );

  t.deepEqual(
    _.xor(_.keys(audiComp), [
      'compatible',
      'meta',
    ]),
    [],
  );

  t.truthy(teslaComp.compatible);
  t.deepEqual(teslaComp.meta.requestId.length, 36);
  t.falsy(audiComp.compatible);
  t.deepEqual(audiComp.meta.requestId.length, 36);
});
