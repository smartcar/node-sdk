'use strict';

const nock = require('nock');
const test = require('ava');
const sinon = require('sinon');

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

test('constructor - with optional flags', async function(t) {
  const vehicle = new Vehicle(VID, TOKEN, {
    flags: {country: 'DE', flag: 'suboption'},
  });
  t.context.n = nocks
    .base(vehicle.version)
    .matchHeader('sc-unit-system', 'metric')
    .get('/default?flags=country%3ADE%20flag%3Asuboption')
    .reply(200, '{"pizza": "pasta"}');

  t.deepEqual(vehicle.query, {flags: 'country:DE flag:suboption'});
  const res = await vehicle.service.request('get', 'default');
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
  // We are intentionally testing multiple routes here to make sure dynamic mapping
  // of function name is working for all cases. Please do not remove the paths being
  // asserted here.
  const paths = [
    '/', '/odometer', '/engine/oil', 'tires/pressure', 'tesla/speedometer',
  ];
  const requestBody = {
    requests: [
      {
        path: '/',
      },
      {
        path: '/odometer',
      },
      {
        path: '/engine/oil',
      },
      {
        path: 'tires/pressure',
      },
      {
        path: 'tesla/speedometer',
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
        path: '/',
        code: 200,
        body: {
          id: '36ab27d0-fd9d-4455-823a-ce30af709ffc',
          make: 'TESLA',
          model: 'Model S',
          year: 2014,
        },
      },
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
        headers: {'sc-unit-system': 'imperial'},
        path: '/engine/oil',
        code: 501,
        body: {
          error: 'vehicle_not_capable_error',
          message: 'Vehicle is not capable of performing request.',
        },
      },
      {
        headers: {
          'sc-unit-system': 'imperial',
          'sc-data-age': '2018-05-04T07:20:50.844Z',
        },
        path: '/tires/pressure',
        code: 200,
        body: {
          backLeft: 219.3,
          backRight: 219.3,
          frontLeft: 219.3,
          frontRight: 219.3,
        },
      },
      {
        headers: {
          'sc-unit-system': 'imperial',
          'sc-data-age': '2018-05-04T07:20:50.844Z',
        },
        path: '/tesla/speedometer',
        code: 200,
        body: {
          speed: 84.32,
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

  const attributes = response.attributes();
  t.is(attributes.make, 'TESLA');
  t.is(attributes.model, 'Model S');
  t.is(attributes.year, 2014);
  t.is(attributes.meta.requestId, 'requestId');
  t.is(attributes.meta.unitSystem, 'imperial');
  t.is(attributes.meta.dataAge.valueOf(), 1525418450844);

  const expectedMessage = 'vehicle_not_capable_error:undefined - '
    + 'Vehicle is not capable of performing request.';
  const error = t.throws(() => response.engineOil());
  t.is(error.message, expectedMessage);
  t.is(error.type, 'vehicle_not_capable_error');

  const tirePressure = response.tirePressure();
  t.is(tirePressure.backLeft, 219.3);
  t.is(tirePressure.backRight, 219.3);
  t.is(tirePressure.frontLeft, 219.3);
  t.is(tirePressure.frontRight, 219.3);
  t.is(attributes.meta.requestId, 'requestId');
  t.is(attributes.meta.unitSystem, 'imperial');
  t.is(attributes.meta.dataAge.valueOf(), 1525418450844);

  const speedometer = response.teslaSpeedometer();
  t.is(speedometer.speed, 84.32);
  t.is(attributes.meta.requestId, 'requestId');
  t.is(attributes.meta.unitSystem, 'imperial');
  t.is(attributes.meta.dataAge.valueOf(), 1525418450844);
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

test('request - override non-sc headers', async function(t) {
  t.context.n = nock(
    `https://api.smartcar.com/v${vehicle.version}/vehicles/${VID}`,
  )
    .matchHeader('User-Agent', 'monkeys_on_mars')
    .matchHeader('Authorization', `Bearer ${TOKEN}`)
    .matchHeader('Origin', 'monkeys_on_pluto')
    .get('/odometer')
    .reply(200, {distance: 10}, {'sc-request-id': 'requestId'});

  const response = await vehicle.request('get', 'odometer', undefined, {
    'User-Agent': 'monkeys_on_mars',
    Origin: 'monkeys_on_pluto',
  });

  t.is(response.body.distance, 10);
  t.is(response.meta.requestId, 'requestId');
});

test('request - rate limit', async function(t) {
  const retryAfter = new Date().valueOf();
  t.context.n = nock(
    `https://api.smartcar.com/v${vehicle.version}/vehicles/${VID}`,
  )
    .matchHeader('Authorization', `Bearer ${TOKEN}`)
    .get('/odometer')
    .reply(429, {error: 'RATE_LIMIT'}, {'retry-after': retryAfter});

  const error = await t.throwsAsync(vehicle.odometer());
  t.is(error.retryAfter, String(retryAfter));
});

test('request - get charge limit', async function(t) {
  sinon.restore(); // clear all spys

  t.context.n = nocks
    .base()
    .get('/charge/limit')
    .reply(200, {limit: 0.7}, {'sc-request-id': 'requestId'});

  const serviceRequestSpy = sinon.spy(vehicle.service, 'request');

  const response = await vehicle.getChargeLimit();

  t.true(serviceRequestSpy.calledOnceWith('get', 'charge/limit'));
  t.is(response.meta.requestId, 'requestId');
  t.is(response.limit, 0.7);
  t.true(t.context.n.isDone());
});

test('request - set charge limit', async function(t) {
  sinon.restore(); // clear all spys

  t.context.n = nocks
    .base()
    .post('/charge/limit')
    .reply(200, {}, {'sc-request-id': 'requestId'});

  const chargeLimit = 0.6;
  const serviceRequestSpy = sinon.spy(vehicle.service, 'request');
  const response = await vehicle.setChargeLimit(chargeLimit);

  t.is(response.meta.requestId, 'requestId');
  t.true(serviceRequestSpy.calledOnce);
  t.true(
    serviceRequestSpy.calledWith(
      'post', 'charge/limit', sinon.match({limit: String(chargeLimit)}),
    ),
  );
  t.true(t.context.n.isDone());
});
