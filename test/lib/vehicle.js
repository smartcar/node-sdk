'use strict';

const nock = require('nock');
const test = require('ava');

const Vehicle = require('../../lib/vehicle');
const config = require('../../lib/config');

const VID = 'ada7207c-3c0a-4027-a47f-6215ce6f7b93';
const TOKEN = '9ad942c6-32b8-4af2-ada6-5e8ecdbad9c2';
const USER_AGENT = `smartcar-node-sdk:${config.version}`;

const vehicle = new Vehicle(VID, TOKEN);

const nocks = {
  base(vid = VID, token = TOKEN) {
    return nock(`https://api.smartcar.com/v1.0/vehicles/${vid}`)
      .matchHeader('User-Agent', USER_AGENT)
      .matchHeader('Authorization', `Bearer ${token}`);
  },
};

test.afterEach(function(t) {
  if (t.context.n) {
    t.true(t.context.n.isDone());
  }
});

test('constructor', async function(t) {

  t.context.n = nocks.base()
    .matchHeader('sc-unit-system', 'metric')
    .get('/default')
    .reply(200, 'default');

  const vehicle = new Vehicle(VID, TOKEN);
  t.is(vehicle.id, VID);
  t.is(vehicle.token, TOKEN);
  t.is(typeof vehicle.request, 'function');
  t.is(vehicle.unitSystem, 'metric');

  const res = await vehicle.request('/default');
  t.is(res, 'default');

});

test('constructor - imperial', async function(t) {

  t.context.n = nocks.base()
    .matchHeader('sc-unit-system', 'imperial')
    .get('/constructor/imperial')
    .reply(200, 'imperial build');

  const vehicle = new Vehicle(VID, TOKEN, 'imperial');
  t.is(vehicle.id, VID);
  t.is(vehicle.token, TOKEN);
  t.is(typeof vehicle.request, 'function');
  t.is(vehicle.unitSystem, 'imperial');

  const res = await vehicle.request('/constructor/imperial');
  t.is(res, 'imperial build');

});

test('constructor - errors without new', function(t) {
  const err = t.throws(() => Vehicle(VID, TOKEN), TypeError);
  t.regex(err.message, /cannot be invoked without 'new'/);
});

test('constructor - errors for invalid unit', function(t) {
  t.throws(() => Vehicle(VID, TOKEN), TypeError);
});

test('setUnitSystem - imperial', async function(t) {

  t.context.n = nocks.base()
    .matchHeader('sc-unit-system', 'imperial')
    .get('/unit/imperial')
    .reply(200, 'imperial');

  const vehicle = new Vehicle(VID, TOKEN);
  vehicle.setUnitSystem('imperial');
  t.is(vehicle.unitSystem, 'imperial');

  const res = await vehicle.request('/unit/imperial');
  t.is(res, 'imperial');

});

test('setUnitSystem - metric', async function(t) {

  t.context.n = nocks.base()
    .matchHeader('sc-unit-system', 'metric')
    .get('/unit/metric')
    .reply(200, 'metric');

  const vehicle = new Vehicle(VID, TOKEN, 'imperial');
  vehicle.setUnitSystem('metric');
  t.is(vehicle.unitSystem, 'metric');

  const res = await vehicle.request('/unit/metric');
  t.is(res, 'metric');

});

test('setUnitSystem - error', function(t) {
  const err = t.throws(() => vehicle.setUnitSystem('big'), TypeError);
  t.regex(err.message, /unit/);
});

test('disconnect', async function(t) {

  t.context.n = nocks.base()
    .delete('/application')
    .reply(200, 'disconnect');

  const response = await vehicle.disconnect();
  t.is(response, 'disconnect');

});

test('permissions', async function(t) {

  t.context.n = nocks.base()
    .get('/permissions')
    .reply(200, {
      permissions: ['permission1', 'permission2', 'permission3'],
    });

  const response = await vehicle.permissions();
  t.is(response.permissions.length, 3);

});

test('action with no argument', async function(t) {

  t.context.nock = nocks.base()
    .post('/security', {action: 'LOCK'})
    .reply(200, {status: 'success'});

  const response = await vehicle.lock();
  t.is(response.status, 'success');

});
