'use strict';

const _ = require('lodash');
const nock = require('nock');
const test = require('ava');

const Vehicle = require('../../../lib/vehicle');
const {USER_AGENT} = require('../../../lib/util');

const VID = 'ada7207c-3c0a-4027-a47f-6215ce6f7b93';
const TOKEN = '9ad942c6-32b8-4af2-ada6-5e8ecdbad9c2';

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
  t.is(res.body, 'default');
  t.deepEqual(_.keys(res).sort(), ['body', 'headers'].sort());
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
  t.is(res.body, 'imperial build');
  t.deepEqual(_.keys(res).sort(), ['body', 'headers'].sort());
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
  t.is(res.body, 'imperial');
  t.deepEqual(_.keys(res).sort(), ['body', 'headers'].sort());
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
  t.is(res.body, 'metric');
  t.deepEqual(_.keys(res).sort(), ['body', 'headers'].sort());
});

test('setUnitSystem - error', function(t) {
  const err = t.throws(() => vehicle.setUnitSystem('big'), TypeError);
  t.regex(err.message, /unit/);
});

test('disconnect', async function(t) {
  const body = {status: 'success'};

  t.context.n = nocks.base()
    .delete('/application')
    .reply(200, body);

  const response = await vehicle.disconnect();

  t.is(response.status, body.status);
  // Headers should be hidden
  t.deepEqual(_.keys(response), _.keys(body));
  t.deepEqual(_.keys(response.headers), ['requestId']);

});

test('permissions', async function(t) {
  t.context.n = nocks.base()
    .get('/permissions')
    .reply(200, {
      permissions: ['permission1', 'permission2', 'permission3'],
    });

  const permissions = await vehicle.permissions();

  t.is(permissions.length, 3);

});

test('info', async function(t) {
  const body = {
    id: 'id',
    make: 'make',
    model: 'model',
    year: 1234,
  };
  t.context.n = nocks.base()
    .get('/')
    .reply(200, body);

  const response = await vehicle.info();

  // Headers should be hidden
  t.deepEqual(response, body);
  t.deepEqual(_.keys(response.headers), ['requestId']);

});

test('location', async function(t) {
  const body = {
    latitude: 1234,
    longitude: 1234,
  };
  const headers = {
    'sc-data-age': '2018-05-03T03:45:51+00:00',
  };
  t.context.n = nocks.base()
    .get('/location')
    .reply(200, body, headers);

  const response = await vehicle.location();

  // Headers should be hidden
  t.deepEqual(response.data, body);
  t.deepEqual(_.keys(response.headers), ['requestId']);
  t.true(_.isDate(response.age));
  const expectedISOString = new Date(headers['sc-data-age']).toISOString();
  t.is(response.age.toISOString(), expectedISOString);

});

test('location - no age', async function(t) {
  const body = {
    latitude: 1234,
    longitude: 1234,
  };
  const headers = {};
  t.context.n = nocks.base()
    .get('/location')
    .reply(200, body, headers);

  const response = await vehicle.location();

  // Headers should be hidden
  t.deepEqual(response.data, body);
  t.deepEqual(_.keys(response.headers), ['requestId']);
  t.is(response.age, null);

});

test('odometer', async function(t) {
  const body = {
    distance: 1234,
  };
  const headers = {
    'sc-data-age': '2018-05-03T03:45:51+00:00',
    'sc-unit-system': 'metric',
  };
  t.context.n = nocks.base()
    .get('/odometer')
    .reply(200, body, headers);

  const response = await vehicle.odometer();

  // Headers should be hidden
  t.deepEqual(response.data, body);
  t.deepEqual(_.keys(response.headers), ['requestId']);
  t.true(_.isDate(response.age));
  const expectedISOString = new Date(headers['sc-data-age']).toISOString();
  t.is(response.age.toISOString(), expectedISOString);
  t.is(response.unitSystem, headers['sc-unit-system']);
});

test('odometer - no age', async function(t) {
  const body = {
    distance: 1234,
  };
  const headers = {
    'sc-unit-system': 'metric',
  };
  t.context.n = nocks.base()
    .get('/odometer')
    .reply(200, body, headers);

  const response = await vehicle.odometer();

  // Headers should be hidden
  t.deepEqual(response.data, body);
  t.deepEqual(_.keys(response.headers), ['requestId']);
  t.is(response.age, null);
  t.is(response.unitSystem, headers['sc-unit-system']);

});

test('vin', async function(t) {

  const body = {
    vin: '4JGBB8GB2AA537355',
  };
  t.context.n = nocks.base()
    .get('/vin')
    .reply(200, body);

  const vin = await vehicle.vin();
  t.is(vin, body.vin);

});

test('lock', async function(t) {
  t.context.nock = nocks.base()
    .post('/security', {action: 'LOCK'})
    .reply(200, {status: 'success'});

  const response = await vehicle.lock();

  t.is(response.status, 'success');
  // Headers should be hidden
  t.deepEqual(_.keys(response), ['status']);
  t.deepEqual(_.keys(response.headers), ['requestId']);
});

test('unlock', async function(t) {
  t.context.nock = nocks.base()
    .post('/security', {action: 'UNLOCK'})
    .reply(200, {status: 'success'});

  const response = await vehicle.unlock();

  t.is(response.status, 'success');
  // Headers should be hidden
  t.deepEqual(_.keys(response), ['status']);
  t.deepEqual(_.keys(response.headers), ['requestId']);
});
