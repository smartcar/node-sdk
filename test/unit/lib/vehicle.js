'use strict';

const nock = require('nock');
const test = require('ava');

const Vehicle = require('../../../lib/vehicle');
const {USER_AGENT} = require('../../../lib/util');

const VID = 'ada7207c-3c0a-4027-a47f-6215ce6f7b93';
const TOKEN = '9ad942c6-32b8-4af2-ada6-5e8ecdbad9c2';

const vehicle = new Vehicle(VID, TOKEN);

const nocks = {
  base(version = vehicle.version, vid = VID, token = TOKEN) {
    return nock(`https://api.smartcar.com/v${version}/vehicles/${vid}`)
      .matchHeader('User-Agent', USER_AGENT)
      .matchHeader('Authorization', `Bearer ${token}`);
  },
};

test.afterEach(function(t) {
  if (t.context.n) {
    t.true(t.context.n.isDone());
  }
});

test('constructor - default parameters check', async function(t) {
  const vehicle = new Vehicle(VID, TOKEN);
  t.context.n = nocks
    .base(vehicle.version)
    .matchHeader('sc-unit-system', 'metric')
    .get('/default')
    .reply(200, '{"pizza": "pasta"}');

  t.is(vehicle.id, VID);
  t.is(vehicle.token, TOKEN);
  t.is(vehicle.unitSystem, 'metric');
  t.is(vehicle.version, '2.0');

  const res = await vehicle.service.request('get', 'default');
  t.is(res.pizza, 'pasta');
});

test('constructor - non default unit and version', async function(t) {
  const vehicle = new Vehicle(VID, TOKEN, {
    unitSystem: 'imperial',
    version: '4.4',
  });
  t.context.n = nocks
    .base('4.4')
    .matchHeader('sc-unit-system', 'imperial')
    .get('/constructor/imperial')
    .reply(200, '{"pizza": "pasta"}');

  t.is(vehicle.id, VID);
  t.is(vehicle.token, TOKEN);
  t.is(vehicle.unitSystem, 'imperial');

  const res = await vehicle.service.request('get', '/constructor/imperial');
  t.is(res.pizza, 'pasta');
});

test('vehicle webhook subscribe', async(t) => {
  const responseBody = {webhookId: 'webhookID', vehicleId: 'vehicleId'};
  t.context.n = nocks
    .base()
    .post('/webhooks/webhookID')
    .reply(200, responseBody, {'sc-request-id': 'requestId'});

  const response = await vehicle.subscribe('webhookID');

  t.is(response.webhookId, 'webhookID');
  t.is(response.vehicleId, 'vehicleId');
  t.is(response.meta.requestId, 'requestId');
});

test('vehicle webhook unsubscribe', async(t) => {
  t.context.n = nocks
    .base(vehicle.version, VID, 'amt')
    .delete('/webhooks/webhookID')
    .reply(200, '', {'sc-request-id': 'requestId'});

  const response = await vehicle.unsubscribe('amt', 'webhookID');

  t.is(response.meta.requestId, 'requestId');
});

test('vehicle permissions', async(t) => {
  t.context.n = nocks
    .base()
    .get('/permissions')
    .query({limit: '1'})
    .reply(200, {permissions: []}, {'sc-request-id': 'requestId'});

  const response = await vehicle.permissions({limit: 1});

  t.is(response.meta.requestId, 'requestId');
  t.is(response.permissions.length, 0);
  t.true(t.context.n.isDone());
});

test('batch - success', async function(t) {
  const paths = ['/odometer', '/engine/oil', '/location'];
  const requestBody = {
    requests: [
      {
        path: '/odometer',
      },
      {
        path: '/engine/oil',
      },
      {
        path: '/location',
      },
    ],
  };
  const mockResponse = {
    responses: [
      {
        headers: {
          'sc-unit-system': 'imperial',
          'sc-data-age': '2018-05-04T07:20:50.844Z',
        },
        path: '/odometer',
        code: 200,
        body: {
          distance: 32768,
        },
      },
      {
        headers: {'sc-data-age': '2018-05-04T07:20:50.844Z'},
        path: '/engine/oil',
        code: 200,
        body: {
          lifeRemaining: 0.1123,
        },
      },
      {
        headers: {'sc-unit-system': 'imperial'},
        path: '/location',
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
    .reply(200, mockResponse, {'sc-request-id': 'requestId'});

  const response = await vehicle.batch(paths);

  const odometer = response.odometer();
  t.is(odometer.distance, 32768);
  t.is(odometer.meta.requestId, 'requestId');
  t.is(odometer.meta.unitSystem, 'imperial');
  t.is(odometer.meta.dataAge.valueOf(), 1525418450844);

  const engineOil = response.engineOil();
  t.is(engineOil.lifeRemaining, 0.1123);
  t.is(engineOil.meta.dataAge.valueOf(), 1525418450844);

  const expectedMessage = 'vehicle_not_capable_error:undefined - '
    + 'Vehicle is not capable of performing request.';
  const error = t.throws(() => response.location());
  t.is(error.message, expectedMessage);
  t.is(error.type, 'vehicle_not_capable_error');
});

test('batch - error', async function(t) {
  const paths = ['/odometer', '/engine/oil', '/location'];
  const requestBody = {
    requests: [
      {
        path: '/odometer',
      },
      {
        path: '/engine/oil',
      },
      {
        path: '/location',
      },
    ],
  };

  t.context.n = nocks
    .base()
    .post('/batch', requestBody)
    .reply(500, {
      error: 'monkeys_on_mars',
      message: 'yes, really',
    }, {
      'sc-request-id': 'requestId',
    });

  const error = await t.throwsAsync(vehicle.batch(paths));
  t.is(error.message, 'monkeys_on_mars:undefined - yes, really');
  t.is(error.type, 'monkeys_on_mars');
});
