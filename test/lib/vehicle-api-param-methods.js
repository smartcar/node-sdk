'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const nock = require('nock');
const test = require('ava');

const Vehicle = require('../../lib/vehicle');
const config = require('../../lib/config');

const VID = 'c8d7e7bc-22ef-4ebe-87ab-f2193c94c9b9';
const TOKEN = 'fde1666c-5090-4494-8b0d-ec396db9e4d7';
const USER_AGENT = `smartcar-node-sdk:${config.version}`;

const vehicle = new Vehicle(VID, TOKEN);

const nocks = {
  base(endpoint, body) {
    return nock(`https://api.smartcar.com/v1.0/vehicles/${VID}`)
      .matchHeader('User-Agent', USER_AGENT)
      .matchHeader('Authorization', `Bearer ${TOKEN}`)
      .post(endpoint, body)
      .reply(200, {status: 'success'});
  },
};

test.before(() => nock.disableNetConnect());
test.after(() => nock.cleanAll());

const optionalArguments = [
  'startClimate',
  'updateRequest',
  'enableChargeLimit',
  'enableChargeSchedule',
];

// test all the methods that do not require any arguments
_.forEach(Vehicle.prototype, function(method, name) {

  if (!method.length || _.includes(optionalArguments, name)) {
    return;
  }

  test(`${name} - throws error on invalid params`, function(t) {
    return Promise.join(
      t.throws(() => vehicle[name](), TypeError),
      t.throws(() => vehicle[name]({}), TypeError)
    );
  });

});

test('flashHeadlights', async function(t) {

  const body = {
    action: 'FLASH',
    type: 'HIGH_BEAM',
  };

  t.context.n = nocks.base('/lights/headlights', body);
  const response = await vehicle.flashHeadlights(body.type);
  t.is(response.status, 'success');

});

test('activateChildSafetyLocks', async function(t) {

  const body = {
    action: 'LOCK',
    childSafetyLocks: [{location: 'BACK_LEFT'}],
  };

  t.context.n = nocks.base('/doors/child_safety_locks', body);
  const response = await vehicle.activateChildSafetyLocks(
    body.childSafetyLocks
  );
  t.is(response.status, 'success');

});

test('disableChildSafetyLocks', async function(t) {

  const body = {
    action: 'UNLOCK',
    childSafetyLocks: [{location: 'BACK_LEFT'}],
  };

  t.context.n = nocks.base('/doors/child_safety_locks', body);
  const response = await vehicle.disableChildSafetyLocks(body.childSafetyLocks);
  t.is(response.status, 'success');

});

test('tiltSideviewMirrors', async function(t) {

  const body = {
    action: 'TILT',
    mirrors: [{location: 'LEFT'}],
  };

  t.context.n = nocks.base('/mirrors/side_view', body);
  const response = await vehicle.tiltSideviewMirrors(body.mirrors);
  t.is(response.status, 'success');

});

test('openWindows', async function(t) {

  const body = {
    action: 'OPEN',
    windows: [{location: 'BACK_LEFT'}],
  };

  t.context.n = nocks.base('/windows', body);
  const response = await vehicle.openWindows(body.windows);
  t.is(response.status, 'success');

});

test('closeWindows', async function(t) {

  const body = {
    action: 'CLOSE',
    windows: [{location: 'BACK_LEFT'}],
  };

  t.context.n = nocks.base('/windows', body);
  const response = await vehicle.closeWindows(body.windows);
  t.is(response.status, 'success');

});

test('unlockWindows', async function(t) {

  const body = {
    action: 'UNLOCK',
    windows: [{location: 'BACK_LEFT'}],
  };

  t.context.n = nocks.base('/windows', body);
  const response = await vehicle.unlockWindows(body.windows);
  t.is(response.status, 'success');

});

test('lockWindows', async function(t) {

  const body = {
    action: 'LOCK',
    windows: [{location: 'BACK_LEFT'}],
  };

  t.context.n = nocks.base('/windows', body);
  const response = await vehicle.lockWindows(body.windows);
  t.is(response.status, 'success');

});

test('enableChargeLimit', async function(t) {

  const body = {
    action: 'ENABLE',
    limit: 0.5,
  };

  t.context.n = nocks.base('/charge/limit', body);
  const response = await vehicle.enableChargeLimit(body.limit);
  t.is(response.status, 'success');

});

test('enableChargeSchedule', async function(t) {

  const body = {
    action: 'ENABLE',
    startTime: '11:11',
  };
  t.context.n = nocks.base('/charge/schedule', body);
  const response = await vehicle.enableChargeSchedule(body.startTime);
  t.is(response.status, 'success');

});

test('startClimate', async function(t) {

  const body = {
    action: 'START',
    temperature: 32.5,
  };

  t.context.n = nocks.base('/climate', body);
  const response = await vehicle.startClimate(body.temperature);
  t.is(response.status, 'success');

});
