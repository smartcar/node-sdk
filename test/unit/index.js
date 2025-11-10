'use strict';

const test = require('ava');
const nock = require('nock');

const smartcar = require('../../');
const SmartcarService = require('../../lib/smartcar-service');
const SmartcarError = require('../../lib/smartcar-error');

const v3VehiclesResponse = {
  id: 'vehicleId123',
  type: 'vehicle',
  attributes: {
    make: '<string>',
    model: '<string>',
    year: 123,
  },
  links: {
    self: '<string>',
  },
};

test('setApiVersion and getApiVersion', function(t) {
  let vehicle = new smartcar.Vehicle();
  t.is(vehicle.version, '2.0');

  smartcar.setApiVersion('4.0');
  t.is(smartcar.getApiVersion(), '4.0');
  // checking the old vehicle object has same version as before
  t.is(vehicle.version, '2.0');

  vehicle = new smartcar.Vehicle();
  t.is(vehicle.version, '4.0');

  smartcar.setApiVersion('2.0');
  t.is(vehicle.version, '4.0');

  vehicle = new smartcar.Vehicle();
  t.is(vehicle.version, '2.0');
});

test('hashChallenge', function(t) {
  const res = smartcar.hashChallenge('amt', 'challenge');
  t.is(res, '9baf5a7464bd86740ad5a06e439dcf535a075022ed2c92d74efacf646d79328e');
});

test('verifyPayload', function(t) {
  // eslint-disable-next-line max-len
  const signature = '4c05a8da471f05156ad717baa4017acd13a3a809850b9ca7d3301dcaaa854f70';
  const res = smartcar.verifyPayload('amt', signature, {pizza: 'pasta'});
  t.true(res);
});

test('getVehicles - simple', async function(t) {

  const n = nock('https://api.smartcar.com/v2.0/')
    .get('/vehicles/')
    .matchHeader('Authorization', 'Bearer simple')
    .reply(200, {
      vehicles: ['vehicle1', 'vehicle2', 'vehicle3'],
      paging: {count: 3, offset: 0},
    });

  const res = await smartcar.getVehicles('simple');
  t.is(res.vehicles.length, 3);
  t.true(n.isDone());
});

test('getVehicles - paging', async function(t) {

  const n = nock('https://api.smartcar.com/v2.0/')
    .get('/vehicles/')
    .query({limit: '1'})
    .matchHeader('Authorization', 'Bearer token')
    .reply(200, {
      vehicles: ['vehicle1'],
      paging: {count: 1, offset: 0},
    });

  const res = await smartcar.getVehicles('token', {limit: 1});
  t.is(res.vehicles.length, 1);
  t.true(n.isDone());
});

test.only('getVehicle - v3', async function(t) {

  const vehicle = new smartcar.Vehicle();
  vehicle.id = v3VehiclesResponse.id;

  const n = nock('https://vehicle.api.smartcar.com/v3/')
    .get(`/vehicles/${vehicle.id}/`)
    .matchHeader('Authorization', 'Bearer simple')
    .reply(200, v3VehiclesResponse);

  const res = await smartcar.getVehicle('simple', vehicle.id);
  t.is(res.id, v3VehiclesResponse.id);
  t.true(n.isDone());
});

test('getUser', async function(t) {
  const n = nock('https://api.smartcar.com/v2.0/')
    .get('/user/')
    .matchHeader('Authorization', 'Bearer token')
    .reply(200, {
      id: 'userid',
    });

  const response = await smartcar.getUser('token');
  t.is(response.id, 'userid');
  t.true(n.isDone());
});

test('exports', function(t) {
  t.true('SmartcarError' in smartcar);
  t.true('Vehicle' in smartcar);
  t.true('AuthClient' in smartcar);
});

test('getCompatibility - client id and secret errors', async function(t) {
  const vin = 'fake_vin';
  const scope = ['read_location', 'read_odometer'];


  let error = await t.throwsAsync(smartcar.getCompatibility(vin, scope));
  t.is(error.message, 'SMARTCAR_CLIENT_ID not set or passed as arguments');

  error = await t.throwsAsync(
    smartcar.getCompatibility(vin, scope, 'US', {clientId: 'clientId'}),
  );
  t.is(error.message, 'SMARTCAR_CLIENT_SECRET not set or passed as arguments');
});

test('getCompatibility - with flags, testModeCompatibilityLevel and override version', async function(t) {
  const vin = 'fake_vin';
  const scope = ['read_location', 'read_odometer'];
  const path = '/compatibility?vin=fake_vin&'
    + 'scope=read_location%20read_odometer&country=US&'
    + 'flags=test%3Atest&test_mode_compatibility_level=pizza&mode=test';
  const n = nock('https://api.smartcar.com/v6.6/')
    .get(path)
    .matchHeader('Authorization', 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0')
    .reply(200, {
      pizza: 'pasta',
    });

  const response = await smartcar.getCompatibility(vin, scope, 'US', {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    version: '6.6',
    flags: {test: 'test'},
    testModeCompatibilityLevel: 'pizza',
  });

  t.is(response.pizza, 'pasta');
  t.true(n.isDone());
});

test('getCompatibility - No country provided', async function(t) {
  const vin = 'fake_vin';
  const scope = ['read_location', 'read_odometer'];
  const path = '/compatibility?vin=fake_vin&'
    + 'scope=read_location%20read_odometer&country=US&'
    + 'flags=test%3Atest&test_mode_compatibility_level=pizza&mode=test';
  const n = nock('https://api.smartcar.com/v6.6/')
    .get(path)
    .matchHeader('Authorization', 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0')
    .reply(200, {
      pizza: 'pasta',
    });

  const response = await smartcar.getCompatibility(vin, scope, {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    version: '6.6',
    flags: {test: 'test'},
    testModeCompatibilityLevel: 'pizza',
  });

  t.is(response.pizza, 'pasta');
  t.true(n.isDone());
});

test('getCompatibility - mode invalid input errors', async function(t) {
  const vin = 'fake_vin';
  const scope = ['read_location', 'read_odometer'];


  const err = await t.throwsAsync(smartcar.getCompatibility(vin, scope, 'US', {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    version: '6.6',
    mode: 'pizzapasta',
  }));
  t.is(
    err.message,
    // eslint-disable-next-line max-len
    'The "mode" parameter MUST be one of the following: \'test\', \'live\', \'simulated\'',
  );
});

test('getCompatibility - with mode simulated', async function(t) {
  const vin = 'fake_vin';
  const scope = ['read_location', 'read_odometer'];
  const path = '/compatibility?vin=fake_vin&'
    + 'scope=read_location%20read_odometer&country=US&'
    + 'mode=simulated';
  const n = nock('https://api.smartcar.com/v6.6/')
    .get(path)
    .matchHeader('Authorization', 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0')
    .reply(200, {
      pizza: 'pasta',
    });

  const response = await smartcar.getCompatibility(vin, scope, 'US', {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    version: '6.6',
    mode: 'simulated',
  });

  t.is(response.pizza, 'pasta');
  t.true(n.isDone());
});

test('getCompatibility - with test_mode true [deprecated]', async function(t) {
  const vin = 'fake_vin';
  const scope = ['read_location', 'read_odometer'];
  const path = '/compatibility?vin=fake_vin&'
    + 'scope=read_location%20read_odometer&country=US&'
    + 'mode=test';
  const n = nock('https://api.smartcar.com/v6.6/')
    .get(path)
    .matchHeader('Authorization', 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0')
    .reply(200, {
      pizza: 'pasta',
    });

  const response = await smartcar.getCompatibility(vin, scope, 'US', {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    version: '6.6',
    testMode: true,
  });

  t.is(response.pizza, 'pasta');
  t.true(n.isDone());
});

test('getCompatibility - with test_mode false [deprecated]', async function(t) {
  const vin = 'fake_vin';
  const scope = ['read_location', 'read_odometer'];
  const path = '/compatibility?vin=fake_vin&'
    + 'scope=read_location%20read_odometer&country=US&'
    + 'mode=live';
  const n = nock('https://api.smartcar.com/v6.6/')
    .get(path)
    .matchHeader('Authorization', 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0')
    .reply(200, {
      pizza: 'pasta',
    });

  const response = await smartcar.getCompatibility(vin, scope, 'US', {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    version: '6.6',
    testMode: false,
  });

  t.is(response.pizza, 'pasta');
  t.true(n.isDone());
});

test('getCompatibilityMatrix ', async function(t) {
  const path = '/compatibility/matrix?mode=live&region=US';
  const n = nock('https://api.smartcar.com/v6.6/')
    .get(path)
    .matchHeader('Authorization', 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0')
    .reply(200, {
      pizza: 'pasta',
    });

  const response = await smartcar.getCompatibilityMatrix('US', {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    version: '6.6',
    testMode: false,
  });

  t.is(response.pizza, 'pasta');
  t.true(n.isDone());
});

test('getCompatibilityMatrix - with options', async function(t) {
  const type = 'BEV';
  const make = 'TESLA';
  const path = `/compatibility/matrix?mode=live&region=US&type=${type}&make=${make}`;
  const n = nock('https://api.smartcar.com/v6.6/')
    .get(path)
    .matchHeader('Authorization', 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0')
    .reply(200, {
      pizza: 'pasta',
    });

  const response = await smartcar.getCompatibilityMatrix('US', {
    clientId: 'clientId',
    clientSecret: 'clientSecret',
    version: '6.6',
    testMode: false,
    make,
    type,
  });

  t.is(response.pizza, 'pasta');
  t.true(n.isDone());
});

test('getConnections - no filters', async function(t) {
  const n = nock('https://management.smartcar.com/v2.0/')
    .get('/management/connections')
    .matchHeader('Authorization', 'Basic ZGVmYXVsdDpmYWtlLWFtdA==')
    .reply(200, {
      connections: [
        {vehicleId: 'vehicle1', userId: 'user1', connectedAt: '2023-01-01'},
        {vehicleId: 'vehicle2', userId: 'user2', connectedAt: '2023-01-02'},
      ],
    });

  const response = await smartcar.getConnections('fake-amt');
  t.is(response.connections.length, 2);
  t.is(response.connections[0].vehicleId, 'vehicle1');
  t.true(n.isDone());
});

test('getConnections - with userId filter', async function(t) {
  const n = nock('https://management.smartcar.com/v2.0/')
    .get('/management/connections')
    // eslint-disable-next-line camelcase
    .query({user_id: 'test-user-123'})
    .matchHeader('Authorization', 'Basic ZGVmYXVsdDpmYWtlLWFtdA==')
    .reply(200, {
      connections: [
        {
          vehicleId: 'vehicle1',
          userId: 'test-user-123',
          connectedAt: '2023-01-01',
        },
      ],
    });

  const response = await smartcar.getConnections('fake-amt', {
    userId: 'test-user-123',
  });
  t.is(response.connections.length, 1);
  t.is(response.connections[0].userId, 'test-user-123');
  t.true(n.isDone());
});

test('getConnections - with vehicleId filter', async function(t) {
  const n = nock('https://management.smartcar.com/v2.0/')
    .get('/management/connections')
    // eslint-disable-next-line camelcase
    .query({vehicle_id: 'test-vehicle-456'})
    .matchHeader('Authorization', 'Basic ZGVmYXVsdDpmYWtlLWFtdA==')
    .reply(200, {
      connections: [
        {
          vehicleId: 'test-vehicle-456',
          userId: 'user1',
          connectedAt: '2023-01-01',
        },
      ],
    });

  const response = await smartcar.getConnections('fake-amt', {
    vehicleId: 'test-vehicle-456',
  });
  t.is(response.connections.length, 1);
  t.is(response.connections[0].vehicleId, 'test-vehicle-456');
  t.true(n.isDone());
});

test('getConnections - with limit parameter', async function(t) {
  const n = nock('https://management.smartcar.com/v2.0/')
    .get('/management/connections')
    .query({limit: 10})
    .matchHeader('Authorization', 'Basic ZGVmYXVsdDpmYWtlLWFtdA==')
    .reply(200, {
      connections: [
        {vehicleId: 'vehicle1', userId: 'user1', connectedAt: '2023-01-01'},
      ],
      paging: {cursor: 'next-page-cursor'},
    });

  const response = await smartcar.getConnections('fake-amt', {}, {limit: 10});
  t.is(response.connections.length, 1);
  t.is(response.paging.cursor, 'next-page-cursor');
  t.true(n.isDone());
});

test('getConnections - with cursor parameter', async function(t) {
  const n = nock('https://management.smartcar.com/v2.0/')
    .get('/management/connections')
    .query({cursor: 'page-cursor-123'})
    .matchHeader('Authorization', 'Basic ZGVmYXVsdDpmYWtlLWFtdA==')
    .reply(200, {
      connections: [
        {vehicleId: 'vehicle2', userId: 'user2', connectedAt: '2023-01-02'},
      ],
    });

  const response = await smartcar.getConnections('fake-amt', {}, {
    cursor: 'page-cursor-123',
  });
  t.is(response.connections.length, 1);
  t.is(response.connections[0].vehicleId, 'vehicle2');
  t.true(n.isDone());
});

test('getConnections - with all parameters', async function(t) {
  const n = nock('https://management.smartcar.com/v2.0/')
    .get('/management/connections')
    .query({
      // eslint-disable-next-line camelcase
      user_id: 'test-user-789',
      limit: 5,
      cursor: 'test-cursor',
    })
    .matchHeader('Authorization', 'Basic ZGVmYXVsdDpmYWtlLWFtdA==')
    .reply(200, {
      connections: [
        {
          vehicleId: 'vehicle1',
          userId: 'test-user-789',
          connectedAt: '2023-01-01',
        },
      ],
    });

  const response = await smartcar.getConnections(
    'fake-amt',
    {userId: 'test-user-789'},
    {limit: 5, cursor: 'test-cursor'},
  );
  t.is(response.connections.length, 1);
  t.is(response.connections[0].userId, 'test-user-789');
  t.true(n.isDone());
});

test('deleteConnections - both vehicleId and userId passed', async function(t) {
  const error = await t.throwsAsync(
    smartcar.deleteConnections('fake-amt', {
      vehicleId: 'vehicle id',
      userId: 'user id',
    }),
  );
  t.is(
    error.message,
    'Filter can contain EITHER user_id OR vehicle_id, not both',
  );
});

test('deleteConnections - with userId filter', async function(t) {
  const n = nock('https://management.smartcar.com/v2.0/')
    .delete('/management/connections')
    // eslint-disable-next-line camelcase
    .query({user_id: 'test-user-123'})
    .matchHeader('Authorization', 'Basic ZGVmYXVsdDpmYWtlLWFtdA==')
    .reply(200, {
      connections: [
        {vehicleId: 'vehicle1', userId: 'test-user-123'},
        {vehicleId: 'vehicle2', userId: 'test-user-123'},
      ],
    });

  const response = await smartcar.deleteConnections('fake-amt', {
    userId: 'test-user-123',
  });
  t.is(response.connections.length, 2);
  t.is(response.connections[0].userId, 'test-user-123');
  t.true(n.isDone());
});

test('deleteConnections - with vehicleId filter', async function(t) {
  const n = nock('https://management.smartcar.com/v2.0/')
    .delete('/management/connections')
    // eslint-disable-next-line camelcase
    .query({vehicle_id: 'test-vehicle-456'})
    .matchHeader('Authorization', 'Basic ZGVmYXVsdDpmYWtlLWFtdA==')
    .reply(200, {
      connections: [
        {vehicleId: 'test-vehicle-456', userId: 'user1'},
      ],
    });

  const response = await smartcar.deleteConnections('fake-amt', {
    vehicleId: 'test-vehicle-456',
  });
  t.is(response.connections.length, 1);
  t.is(response.connections[0].vehicleId, 'test-vehicle-456');
  t.true(n.isDone());
});

test('timeout', async function(t) {

  nock('https://api.smartcar.com/v6.6/')
    .get('/custom/endpoint')
    .delay(1000) // delay the response to simulate timeout
    .reply(200, {success: true});

  const newService = new SmartcarService({baseUrl: 'https://api.smartcar.com/v6.6', timeout: 1});
  const error = await t.throwsAsync(
    newService.request('get', 'custom/endpoint'),
    {instanceOf: SmartcarError},
  );

  t.is(error.message, 'Request timed out');
  t.is(error.statusCode, 408);
});


test('timeout - batch', async function(t) {
  nock('https://api.smartcar.com/v6.6/')
    .post('/batch', {
      requests: [
        {path: '/custom/endpoint'},
      ],
    })
    .delay(1000) // delay the response to simulate timeout
    .reply(200, {success: true});

  const newService = new SmartcarService({baseUrl: 'https://api.smartcar.com/v6.6', timeout: 1});
  const error = await t.throwsAsync(
    newService.batchRequest(['/custom/endpoint']),
    {instanceOf: SmartcarError},
  );

  t.is(error.message, 'Request timed out');
  t.is(error.statusCode, 408);
});

