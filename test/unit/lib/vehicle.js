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
  t.context.n = nocks
    .base()
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
  t.context.n = nocks
    .base()
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
  t.context.n = nocks
    .base()
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
  t.context.n = nocks
    .base()
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
  t.context.n = nocks
    .base()
    .delete('/application')
    .reply(200, 'disconnect');

  const response = await vehicle.disconnect();
  t.is(response, 'disconnect');
});

test('permissions', async function(t) {
  t.context.n = nocks
    .base()
    .get('/permissions')
    .reply(200, {
      permissions: ['permission1', 'permission2', 'permission3'],
    });

  const permissions = await vehicle.permissions();
  t.is(permissions.length, 3);
});

test('has permissions - single', async function(t) {
  t.context.n = nocks
    .base()
    .get('/permissions')
    .reply(200, {
      permissions: ['permission1', 'permission2', 'permission3'],
    });

  const hasPermission = await vehicle.hasPermissions('required:permission1');

  t.is(hasPermission, true);
});

test('has permissions - multi', async function(t) {
  t.context.n = nocks
    .base()
    .get('/permissions')
    .reply(200, {
      permissions: ['permission1', 'permission2', 'permission3'],
    });

  const hasPermissions = await vehicle.hasPermissions([
    'permission1',
    'required:permission2',
  ]);

  t.is(hasPermissions, true);
});

test('has permissions - false', async function(t) {
  t.context.n = nocks
    .base()
    .get('/permissions')
    .reply(200, {
      permissions: ['permission1', 'permission2', 'permission3'],
    });

  const hasPermission = await vehicle.hasPermissions('permission4');

  t.is(hasPermission, false);
});

test('has permissions - multi false', async function(t) {
  t.context.n = nocks
    .base()
    .get('/permissions')
    .reply(200, {
      permissions: ['permission1', 'permission2', 'permission3'],
    });

  const hasPermissions = await vehicle.hasPermissions([
    'permission1',
    'permission4',
  ]);

  t.is(hasPermissions, false);
});

test('info', async function(t) {
  const body = {
    id: 'id',
    make: 'make',
    model: 'model',
    year: 1234,
  };
  t.context.n = nocks
    .base()
    .get('/')
    .reply(200, body);

  const response = await vehicle.info();
  t.deepEqual(response, body);
});

test('location', async function(t) {
  const body = {
    latitude: 1234,
    longitude: 1234,
  };
  const headers = {
    'sc-data-age': '2018-05-03T03:45:51+00:00',
  };
  t.context.n = nocks
    .base()
    .get('/location')
    .reply(200, body, headers);

  const response = await vehicle.location();
  t.deepEqual(response.data, body);
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
  t.context.n = nocks
    .base()
    .get('/location')
    .reply(200, body, headers);

  const response = await vehicle.location();
  t.deepEqual(response.data, body);
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
  t.context.n = nocks
    .base()
    .get('/odometer')
    .reply(200, body, headers);

  const response = await vehicle.odometer();
  t.deepEqual(response.data, body);
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
  t.context.n = nocks
    .base()
    .get('/odometer')
    .reply(200, body, headers);

  const response = await vehicle.odometer();
  t.deepEqual(response.data, body);
  t.is(response.age, null);
  t.is(response.unitSystem, headers['sc-unit-system']);
});

test('fuel', async function(t) {
  const body = {
    range: 1234,
    percentRemaining: 0.43,
    amountRemaining: 7,
  };
  const headers = {
    'sc-data-age': '2018-05-03T03:45:51+00:00',
    'sc-unit-system': 'metric',
  };
  t.context.n = nocks
    .base()
    .get('/fuel')
    .reply(200, body, headers);

  const response = await vehicle.fuel();
  t.deepEqual(response.data, body);
  t.true(_.isDate(response.age));
  const expectedISOString = new Date(headers['sc-data-age']).toISOString();
  t.is(response.age.toISOString(), expectedISOString);
  t.is(response.unitSystem, headers['sc-unit-system']);
});

test('fuel - no age', async function(t) {
  const body = {
    range: 1234,
    percentRemaining: 0.43,
    amountRemaining: 7,
  };
  const headers = {
    'sc-unit-system': 'metric',
  };
  t.context.n = nocks
    .base()
    .get('/fuel')
    .reply(200, body, headers);

  const response = await vehicle.fuel();
  t.deepEqual(response.data, body);
  t.is(response.age, null);
  t.is(response.unitSystem, headers['sc-unit-system']);
});

test('oil', async function(t) {
  const body = {
    lifeRemaining: 0.86,
  };
  const headers = {
    'sc-data-age': '2018-05-03T03:45:51+00:00',
  };
  t.context.n = nocks
    .base()
    .get('/engine/oil')
    .reply(200, body, headers);

  const response = await vehicle.oil();
  t.deepEqual(response.data, body);
  t.true(_.isDate(response.age));
  const expectedISOString = new Date(headers['sc-data-age']).toISOString();
  t.is(response.age.toISOString(), expectedISOString);
});

test('oil - no age', async function(t) {
  const body = {
    lifeRemaining: 0.86,
  };
  const headers = {};
  t.context.n = nocks
    .base()
    .get('/engine/oil')
    .reply(200, body, headers);

  const response = await vehicle.oil();
  t.deepEqual(response.data, body);
  t.is(response.age, null);
});

test('tire pressure', async function(t) {
  const body = {
    frontLeft: 33.0,
    frontRight: 34.0,
    backLeft: 33.0,
    backRight: 33.0,
  };
  const headers = {
    'sc-data-age': '2018-05-03T03:45:51+00:00',
    'sc-unit-system': 'imperial',
  };
  t.context.n = nocks
    .base()
    .get('/tires/pressure')
    .reply(200, body, headers);

  const response = await vehicle.tirePressure();
  t.deepEqual(response.data.tires, body);
  t.true(_.isDate(response.age));
  const expectedISOString = new Date(headers['sc-data-age']).toISOString();
  t.is(response.age.toISOString(), expectedISOString);
  t.is(response.unitSystem, headers['sc-unit-system']);
});

test('tire pressure - no age', async function(t) {
  const body = {
    frontLeft: 33.0,
    frontRight: 34.0,
    backLeft: 33.0,
    backRight: 33.0,
  };
  const headers = {
    'sc-unit-system': 'imperial',
  };
  t.context.n = nocks
    .base()
    .get('/tires/pressure')
    .reply(200, body, headers);

  const response = await vehicle.tirePressure();
  t.deepEqual(response.data.tires, body);
  t.is(response.age, null);
  t.is(response.unitSystem, headers['sc-unit-system']);
});

test('battery', async function(t) {
  const body = {
    range: 1234,
    percentRemaining: 0.43,
  };
  const headers = {
    'sc-data-age': '2018-05-03T03:45:51+00:00',
    'sc-unit-system': 'metric',
  };
  t.context.n = nocks
    .base()
    .get('/battery')
    .reply(200, body, headers);

  const response = await vehicle.battery();
  t.deepEqual(response.data, body);
  t.true(_.isDate(response.age));
  const expectedISOString = new Date(headers['sc-data-age']).toISOString();
  t.is(response.age.toISOString(), expectedISOString);
  t.is(response.unitSystem, headers['sc-unit-system']);
});

test('battery - no age', async function(t) {
  const body = {
    range: 1234,
    percentRemaining: 0.43,
  };
  const headers = {
    'sc-unit-system': 'metric',
  };
  t.context.n = nocks
    .base()
    .get('/battery')
    .reply(200, body, headers);

  const response = await vehicle.battery();
  t.deepEqual(response.data, body);
  t.is(response.age, null);
  t.is(response.unitSystem, headers['sc-unit-system']);
});

test('charge', async function(t) {
  const body = {
    isPluggedIn: true,
    state: 'CHARGING',
  };
  const headers = {
    'sc-data-age': '2018-05-03T03:45:51+00:00',
  };
  t.context.n = nocks
    .base()
    .get('/charge')
    .reply(200, body, headers);

  const response = await vehicle.charge();
  t.deepEqual(response.data, body);
  t.true(_.isDate(response.age));
  const expectedISOString = new Date(headers['sc-data-age']).toISOString();
  t.is(response.age.toISOString(), expectedISOString);
});

test('charge - no age', async function(t) {
  const body = {
    isPluggedIn: true,
    state: 'CHARGING',
  };
  const headers = {};
  t.context.n = nocks
    .base()
    .get('/charge')
    .reply(200, body, headers);

  const response = await vehicle.charge();
  t.deepEqual(response.data, body);
  t.is(response.age, null);
});

test('vin', async function(t) {
  const body = {
    vin: '4JGBB8GB2AA537355',
  };
  t.context.n = nocks
    .base()
    .get('/vin')
    .reply(200, body);

  const vin = await vehicle.vin();
  t.is(vin, body.vin);
});

test('lock', async function(t) {
  t.context.nock = nocks
    .base()
    .post('/security', {action: 'LOCK'})
    .reply(200, {status: 'success'});

  const response = await vehicle.lock();

  t.deepEqual(_.xor(_.keys(response), ['status']), []);
  t.is(response.status, 'success');
});

test('unlock', async function(t) {
  t.context.nock = nocks
    .base()
    .post('/security', {action: 'UNLOCK'})
    .reply(200, {status: 'success'});

  const response = await vehicle.unlock();

  t.deepEqual(_.xor(_.keys(response), ['status']), []);
  t.is(response.status, 'success');
});

test('batch', async function(t) {
  vehicle.setUnitSystem('imperial');
  const paths = ['/odometer', '/transmission/fluid', '/fuel', '/sunroof'];
  const requestBody = {
    headers: {
      'sc-unit-system': 'imperial',
    },
    requests: [
      {
        path: '/odometer',
      },
      {
        path: '/transmission/fluid',
      },
      {
        path: '/fuel',
      },
      {
        path: '/sunroof',
      },
    ],
  };
  const responseBody = {
    responses: [
      {
        headers: {'sc-unit-system': 'imperial'},
        path: '/odometer',
        code: 200,
        body: {
          distance: 32768,
        },
      },
      {
        headers: {'sc-unit-system': 'imperial'},
        path: '/transmission/fluid',
        code: 200,
        body: {
          temperature: 98.2,
          wear: 0.5,
        },
      },
      {
        headers: {'sc-unit-system': 'imperial'},
        path: '/fuel',
        code: 200,
        body: {
          range: 550.8499755859375,
          percentRemaining: 0.9449999928474426,
        },
      },
      {
        headers: {'sc-unit-system': 'imperial'},
        path: '/sunroof',
        code: 501,
        body: {
          error: 'vehicle_not_capable_error',
          message: 'Vehicle is not capable of performing request.',
        },
      },
    ],
  };

  t.context.n = nocks
    .base()
    .post('/batch', requestBody)
    .reply(200, responseBody);

  const response = await vehicle.batch(paths);
  t.deepEqual(response.responses, responseBody.responses);
});
