'use strict';

const nock = require('nock');
const test = require('ava');

const BatchRequest = require('../../../lib/batch-request');
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

test.only('batch request', async function(t) {
  const defaultHeaders = {'sc-unit-system': 'imperial'};
  const batchRequest = new BatchRequest(defaultHeaders);
  batchRequest.addRequest('/odometer');
  batchRequest.addRequest('/transmission/fluid', {'sc-unit-system': 'metric'});
  batchRequest.addRequest('/fuel');
  batchRequest.addRequest('/sunroof');
  const requestBody = {
    headers: {
      'sc-unit-system': 'imperial',
    },
    requests: [
      {
        path: '/odometer',
      },
      {
        headers: {
          'sc-unit-system': 'metric',
        },
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
        headers: {'sc-unit-system': 'metric'},
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
        headers: {'sc-unit-system': 'metric'},
        path: '/fuel',
        code: 200,
        body: {
          range: 550.8499755859375,
          percentRemaining: 0.9449999928474426,
        },
      },
      {
        headers: {'sc-unit-system': 'metric'},
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

  const response = await vehicle.batch(batchRequest);
  t.deepEqual(response.responses, responseBody.responses);
});
