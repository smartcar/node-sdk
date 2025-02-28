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

// Test for diagnosticSystemStatus method
test('request - diagnostic system status', async function(t) {
  const responseBody = {
    systems: [
      {
        systemId: 'POWERTRAIN',
        status: 'OK',
      },
      {
        systemId: 'BATTERY',
        status: 'WARNING',
      },
    ]
  };

  t.context.n = nocks
    .base()
    .get('/diagnostics/system_status')
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-data-age': '2018-05-04T07:20:50.844Z',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.diagnosticSystemStatus();

  t.deepEqual(response.systems, responseBody.systems);
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.dataAge.valueOf(), 1525418450844);
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
});

// Test for diagnosticTroubleCodes method
test('request - diagnostic trouble codes', async function(t) {
  const responseBody = {
    activeCodes: [
      {
        code: 'P0100',
        description: 'Mass or Volume Air Flow Circuit Malfunction',
        timestamp: '2022-01-01T00:00:00.000Z',
      },
    ]
  };

  t.context.n = nocks
    .base()
    .get('/diagnostics/dtcs')
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-data-age': '2018-05-04T07:20:50.844Z',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.diagnosticTroubleCodes();

  t.deepEqual(response.activeCodes, responseBody.activeCodes);
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.dataAge.valueOf(), 1525418450844);
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
});

// Test for serviceHistory method
test('request - service history', async function(t) {
  const startDate = '2022-01-01';
  const endDate = '2022-12-31';
  const responseBody = {
    serviceHistory: [
      {
        serviceId: 'service-123',
        serviceTasks: [
          {
            taskId: 'task-456',
            taskDescription: 'Oil change',
          },
        ],
        serviceDate: '2022-06-15',
        odometerDistance: 12500.5,
        serviceDetails: [
          {
            type: 'OIL_CHANGE',
            value: null,
          },
        ],
        serviceCost: {
          totalCost: 49.99,
          currency: 'USD',
        },
      },
    ]
  };

  t.context.n = nocks
    .base()
    .get('/service/history')
    .query({
      start_date: startDate,
      end_date: endDate,
    })
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-data-age': '2018-05-04T07:20:50.844Z',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.serviceHistory(startDate, endDate);

  t.deepEqual(response.serviceHistory, responseBody.serviceHistory);
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.dataAge.valueOf(), 1525418450844);
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
});

// Test for sendDestination method
test('request - send destination', async function(t) {
  const latitude = 37.7749;
  const longitude = -122.4194;
  const responseBody = {
    status: 'success',
    message: 'Successfully sent request to vehicle',
  };

  t.context.n = nocks
    .base()
    .post('/navigation/destination', {
      latitude: latitude,
      longitude: longitude,
    })
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-data-age': '2018-05-04T07:20:50.844Z',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.sendDestination(latitude, longitude);

  t.is(response.status, responseBody.status);
  t.is(response.message, responseBody.message);
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.dataAge.valueOf(), 1525418450844);
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
});

// Test for sendDestination method with invalid latitude
test('request - send destination with invalid latitude', async function(t) {
  const error = await t.throwsAsync(
    async () => {
      await vehicle.sendDestination(100, -122.4194);
    },
    {instanceOf: Error}
  );

  t.is(error.message, 'Invalid latitude value. It must be between -90 and 90.');
});

// Test for sendDestination method with invalid longitude
test('request - send destination with invalid longitude', async function(t) {
  const error = await t.throwsAsync(
    async () => {
      await vehicle.sendDestination(37.7749, 200);
    },
    {instanceOf: Error}
  );

  t.is(error.message, 'Invalid longitude value. It must be between -180 and 180.');
});

// Test the request with a body
test('request - with body', async function(t) {
  const requestBody = {
    someKey: 'someValue',
  };

  const responseBody = {
    status: 'success',
  };

  t.context.n = nocks
    .base()
    .post('/custom/endpoint', {body: requestBody})
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.request('post', 'custom/endpoint', {
    body: requestBody,
  });

  t.is(response.body.status, 'success');
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
});

// Test the request without a body
test('request - without body', async function(t) {
  const responseBody = {
    status: 'success',
  };

  t.context.n = nocks
    .base()
    .get('/custom/endpoint')
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.request('get', 'custom/endpoint', {});

  t.is(response.body.status, 'success');
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
});

// Test the request with null body
test('request - with null body', async function(t) {
  const responseBody = {
    status: 'success',
  };

  t.context.n = nocks
    .base()
    .get('/custom/endpoint')
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.request('get', 'custom/endpoint', {
    body: null,
  });

  t.is(response.body.status, 'success');
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
});

// Test the request with false body
test('request - with false body', async function(t) {
  const responseBody = {
    status: 'success',
  };

  t.context.n = nocks
    .base()
    .get('/custom/endpoint')
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.request('get', 'custom/endpoint', {
    body: false,
  });

  t.is(response.body.status, 'success');
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
});

// Test the request with string body
test('request - with string body', async function(t) {
  const responseBody = {
    status: 'success',
  };

  t.context.n = nocks
    .base()
    .post('/custom/endpoint', {body: "test-string"})
    .reply(200, responseBody, {
      'sc-request-id': 'requestId',
      'sc-fetched-at': '2018-05-04T07:20:51.844Z',
    });

  const response = await vehicle.request('post', 'custom/endpoint', {
    body: "test-string",
  });

  t.is(response.body.status, 'success');
  t.is(response.meta.requestId, 'requestId');
  t.is(response.meta.fetchedAt.valueOf(), 1525418451844);
}); 