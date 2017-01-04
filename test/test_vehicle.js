'use strict';
var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var Vehicle = require('../lib/vehicle');
var config = require('../lib/config');


var VALID_TOKEN = 'valid-token';
var VALID_AUTHORIZATION = `Bearer ${VALID_TOKEN}`;
var VALID_VID = 'valid-vid';
var IMPERIAL_ODOMETER_READING = 3.14;
var METRIC_ODOMETER_READING = 2.71;
var SUCCESS = {status: 'success'};
var VALID_USER_AGENT = `smartcar-node-sdk:${config.version}`;

suite('Vehicle', function() {

  var vehicle = new Vehicle(VALID_VID, VALID_TOKEN);

  suiteSetup(function() {

    var apiNock = nock('https://api.smartcar.com/v1.0');

    apiNock
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .matchHeader('User-Agent', VALID_USER_AGENT)
    .delete(`/vehicles/${VALID_VID}/application`)
    .reply(200, {
      status: 'success',
    });

    apiNock
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .matchHeader('User-Agent', VALID_USER_AGENT)
    .get(`/vehicles/${VALID_VID}/permissions`)
    .reply(200, {
      permissions: ['permission1', 'permission2', 'permission3'],
    });

    apiNock
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .matchHeader('User-Agent', VALID_USER_AGENT)
    .get(`/vehicles/${VALID_VID}/permissions`)
    .query({
      limit: 1,
    })
    .reply(200, {
      permissions: ['permission1'],
    });

    apiNock
      .get(`/vehicles/${VALID_VID}/odometer`)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .matchHeader('sc-unit-system', 'metric')
      .reply(200, {distance: METRIC_ODOMETER_READING});

    apiNock
      .get(`/vehicles/${VALID_VID}/odometer`).times(2)
      .matchHeader('sc-unit-system', 'imperial')
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, {distance: IMPERIAL_ODOMETER_READING});

    apiNock
      .post(`/vehicles/${VALID_VID}/panic`, {action: 'START'}).times(2)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/sunroof`, {
        action: 'OPEN',
        percentOpen: 0.5,
      })
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    // test that we can send multiple args, sunroof does not actually take both
    apiNock
      .post(`/vehicles/${VALID_VID}/sunroof`, {
        action: 'OPEN',
        percentOpen: 0.5,
        percentClosed: 0.5,
      })
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/lights/headlights`)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .reply(200, SUCCESS);

  });

  suiteTeardown(function() {
    nock.cleanAll();
  });

  test('switch unit system to imperial', function() {
    vehicle.setUnitSystem('imperial');
    expect(vehicle.unitSystem).to.equal('imperial');
  });

  test('switch unit system to metric', function() {
    vehicle.setUnitSystem('metric');
    expect(vehicle.unitSystem).to.equal('metric');
  });

  test('vehicle constructor defaults to metric unit', function() {
    var metricVehicle = new Vehicle(VALID_VID, VALID_TOKEN);
    expect(metricVehicle.unitSystem).to.equal('metric');
  });

  test('vehicle constructor throws error on bad unit param', function() {
    var badUnitConstructor = function() {
      // eslint-disable-next-line no-new
      new Vehicle(VALID_VID, VALID_TOKEN, 'not a unit');
    };
    expect(badUnitConstructor).to.throw(TypeError, /unit/);
  });

  test('setUnitSystem throws error on bad unit param', function() {
    var badUnitSet = function() {
      var badUnitVehicle = new Vehicle(VALID_VID, VALID_TOKEN);
      badUnitVehicle.setUnitSystem('big');
    };
    expect(badUnitSet).to.throw(TypeError, /unit/);
  });

  test('vehicle initialized to metric fetches metric', function() {
    var metricVehicle = new Vehicle(VALID_VID, VALID_TOKEN, 'metric');

    return metricVehicle.odometer()
      .then(function(result) {
        expect(result.distance).to.equal(METRIC_ODOMETER_READING);
      });
  });

  test('vehicle initialized to imperial fetches imperial', function() {
    var imperialVehicle = new Vehicle(VALID_VID, VALID_TOKEN, 'imperial');

    return imperialVehicle.odometer()
      .then(function(result) {
        expect(result.distance).to.equal(IMPERIAL_ODOMETER_READING);
      });
  });

  test('metric vehicle switched to imperial fetches imperial', function() {
    var metricVehicle = new Vehicle(VALID_VID, VALID_TOKEN, 'metric');
    metricVehicle.setUnitSystem('imperial');
    return metricVehicle.odometer()
      .then(function(result) {
        expect(result.distance).to.equal(IMPERIAL_ODOMETER_READING);
      });
  });

  test('action with no argument', function() {
    return vehicle.startPanic()
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('action with a key and argument', function() {
    return vehicle.openSunroof({percentOpen: 0.5})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('action with a key and multiple argument', function() {
    return vehicle.openSunroof({percentOpen: 0.5, percentClosed: 0.5})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  test('action with imperial car', function() {
    var imperialVehicle = new Vehicle(VALID_VID, VALID_TOKEN, 'imperial');

    return imperialVehicle.startPanic()
      .then(function(response) {
        expect(response).to.have.all.keys('status');
        expect(response.status).to.equal('success');
      });
  });

  test('vehicle constructor called without new', function() {
    var badConstruct = function() {
      Vehicle(VALID_VID, VALID_TOKEN);
    };
    expect(badConstruct).to.throw(Error, /new Vehicle/);
  });

  test('disconnect', function() {
    return vehicle.disconnect()
    .then(function(response) {
      expect(response.status).to.equal('success');
    });
  });

  test('permissions without paging', function() {
    return vehicle.permissions()
    .then(function(response) {
      expect(response).to.have.all.keys('permissions');
      expect(response.permissions).to.have.lengthOf(3);
    });
  });

  test('permissions with paging', function() {
    return vehicle.permissions({
      limit: 1,
    })
    .then(function(response) {
      expect(response).to.have.all.keys('permissions');
      expect(response.permissions).to.have.lengthOf(1);
    });
  });
});
