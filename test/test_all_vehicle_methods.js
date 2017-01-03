'use strict';
var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var Promise = require('bluebird');
var Vehicle = require('../lib/vehicle');
var methodsRequiringParams = require('./vehicle_methods_requiring_params');

var VALID_TOKEN = 'valid-token';
var VALID_AUTHORIZATION = `Bearer ${VALID_TOKEN}`;
var VALID_VID = 'valid-vid';
var SUCCESS = {status: 'success'};

suite('Vehicle prototype', function() {

  var vehicle = new Vehicle(VALID_VID, VALID_TOKEN);

  var methodsNotRequiringParams = [];

  suiteSetup(function() {

    var apiNock = nock('https://api.smartcar.com/v1.0').persist();

    apiNock
      .get(/.*/)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .reply(200, SUCCESS);

    apiNock
      .post(/.*/)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .reply(200, SUCCESS);

    apiNock
      .delete(/.*/)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .reply(200, SUCCESS);

    for (var method in Vehicle.prototype) {
      if (Vehicle.prototype.hasOwnProperty(method)
       && methodsRequiringParams.indexOf(method) < 0) {
        methodsNotRequiringParams.push(method);
      }
    }
  });

  suiteTeardown(function() {
    nock.cleanAll();
  });

  test('all prototype methods, excluding those w/ required params', function() {
    return Promise.each(methodsNotRequiringParams, function(method) {
      return vehicle[method]()
      .then(function(response) {
        expect(response).to.have.all.keys('status');
        expect(response.status).to.equal('success');
      });
    });
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

  // manual tests of vehicle methods taking parameters
  test('flashHeadlights', function() {
    return vehicle.flashHeadlights({type: 'HIGH_BEAM'})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('activateChildSafetyLocks', function() {
    return vehicle.activateChildSafetyLocks({childSafetyLocks: ['BACK_LEFT']})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('disableChildSafetyLocks', function() {
    return vehicle.disableChildSafetyLocks({childSafetyLocks: ['BACK_LEFT']})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('tiltSideviewMirrors', function() {
    return vehicle.tiltSideviewMirrors({mirrors: ['LEFT']})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('openWindows', function() {
    return vehicle.openWindows({windows: ['BACK_LEFT']})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('closeWindows', function() {
    return vehicle.closeWindows({windows: ['BACK_LEFT']})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('unlockWindows', function() {
    return vehicle.unlockWindows({windows: ['BACK_LEFT']})
    .then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('setUnitSystem', function() {
    return vehicle.setUnitSystem('metric');
  });
});
