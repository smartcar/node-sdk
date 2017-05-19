'use strict';
var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var Promise = require('bluebird');
var Vehicle = require('../lib/vehicle');
var methodsRequiringParams = require('./vehicle_methods_requiring_params');
var config = require('../lib/config');

var VALID_TOKEN = 'valid-token';
var VALID_AUTHORIZATION = `Bearer ${VALID_TOKEN}`;
var VALID_VID = 'valid-vid';
var SUCCESS = {status: 'success'};
var VALID_USER_AGENT = `smartcar-node-sdk:${config.version}`;

/* body objects of methods taking params */
var FLASH_HEADLIGHTS_DATA = {
  action: 'FLASH',
  type: 'HIGH_BEAM',
};
var ACTIVATE_CHILD_SAFETY_LOCKS_DATA = {
  action: 'LOCK',
  childSafetyLocks: [{location: 'BACK_LEFT'}],
};
var DISABLE_CHILD_SAFETY_LOCKS_DATA = {
  action: 'UNLOCK',
  childSafetyLocks: [{location: 'BACK_LEFT'}],
};
var TILT_SIDEVIEW_MIRRORS_DATA = {
  action: 'TILT',
  mirrors: [{location: 'LEFT'}],
};
var OPEN_WINDOWS_DATA = {
  action: 'OPEN',
  windows: [{location: 'BACK_LEFT'}],
};
var CLOSE_WINDOWS_DATA = {
  action: 'CLOSE',
  windows: [{location: 'BACK_LEFT'}],
};
var UNLOCK_WINDOWS_DATA = {
  action: 'UNLOCK',
  windows: [{location: 'BACK_LEFT'}],
};
var LOCK_WINDOWS_DATA = {
  action: 'LOCK',
  windows: [{location: 'BACK_LEFT'}],
};
var ENABLE_CHARGE_LIMIT_DATA = {
  limit: 0.5,
};
var ENABLE_CHARGE_SCHEDULE_DATA = {
  action: 'ENABLE',
  startTime: '11:11',
};
var START_CLIMATE_DATA = {
  action: 'START',
  temperature: 32.5,
};

suite('Vehicle prototype', function() {

  var vehicle = new Vehicle(VALID_VID, VALID_TOKEN);

  suiteSetup(function() {

    var apiNock = nock('https://api.smartcar.com/v1.0').persist();

    /* eslint-disable max-len */
    apiNock
      .post(`/vehicles/${VALID_VID}/lights/headlights`, FLASH_HEADLIGHTS_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/doors/child_safety_locks`, ACTIVATE_CHILD_SAFETY_LOCKS_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/doors/child_safety_locks`, DISABLE_CHILD_SAFETY_LOCKS_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/mirrors/side_view`, TILT_SIDEVIEW_MIRRORS_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/windows`, OPEN_WINDOWS_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/windows`, CLOSE_WINDOWS_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/windows`, UNLOCK_WINDOWS_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/windows`, LOCK_WINDOWS_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/charge/limit`, ENABLE_CHARGE_LIMIT_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/charge/schedule`, ENABLE_CHARGE_SCHEDULE_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(`/vehicles/${VALID_VID}/climate`, START_CLIMATE_DATA)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);
    /* eslint-enable max-len */

  });

  suiteTeardown(function() {
    nock.cleanAll();
  });

  test('all methods requiring parameters throw error when missing', function() {
    return Promise.each(methodsRequiringParams, function(method) {
      return Promise.try(function() {
        return vehicle[method]();
      })
      .then(function() {
        throw new Error(`expected ${method} to throw error on no params`);
      })
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(TypeError);
      });
    });
  });

  test('all methods requiring parameters throw error on bad input', function() {
    return Promise.each(methodsRequiringParams, function(method) {
      return Promise.try(function() {
        return vehicle[method]({});
      })
      .then(function() {
        throw new Error(`expected ${method} to throw error on bad params`);
      })
      .catch(function(err) {
        expect(err).to.be.an.instanceOf(TypeError);
      });
    });
  });

  /* TESTS OF VEHICLE METHODS REQUIRING PARAMETERS */

  test('flashHeadlights', function() {
    return vehicle.flashHeadlights(FLASH_HEADLIGHTS_DATA.type)
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('activateChildSafetyLocks', function() {
    // eslint-disable-next-line max-len
    return vehicle.activateChildSafetyLocks(ACTIVATE_CHILD_SAFETY_LOCKS_DATA.childSafetyLocks)
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('disableChildSafetyLocks', function() {
    // eslint-disable-next-line max-len
    return vehicle.disableChildSafetyLocks(DISABLE_CHILD_SAFETY_LOCKS_DATA.childSafetyLocks)
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('tiltSideviewMirrors', function() {
    return vehicle.tiltSideviewMirrors(TILT_SIDEVIEW_MIRRORS_DATA.mirrors)
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('openWindows', function() {
    return vehicle.openWindows(OPEN_WINDOWS_DATA.windows)
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('closeWindows', function() {
    return vehicle.closeWindows(CLOSE_WINDOWS_DATA.windows)
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('unlockWindows', function() {
    return vehicle.unlockWindows(UNLOCK_WINDOWS_DATA.windows)
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('lockWindows', function() {
    return vehicle.unlockWindows(LOCK_WINDOWS_DATA.windows)
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });

  /* TEST OF VEHICLE METHODS WITH OPTIONAL PARAMETERS */
  test('enableChargeLimit with arg', function() {
    return vehicle.enableChargeLimit(ENABLE_CHARGE_LIMIT_DATA.limit);
  });
  test('enableChargeSchedule with arg', function() {
    return vehicle.enableChargeSchedule(ENABLE_CHARGE_SCHEDULE_DATA.startTime);
  });
  test('startClimate with arg', function() {
    return vehicle.startClimate(START_CLIMATE_DATA.temperature);
  });
});
