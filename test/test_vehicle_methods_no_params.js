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

suite('Vehicle prototype', function() {

  var vehicle = new Vehicle(VALID_VID, VALID_TOKEN);

  var methodsNotRequiringParams = [];

  suiteSetup(function() {

    var apiNock = nock('https://api.smartcar.com/v1.0').persist();

    apiNock
      .get(/.*/)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .post(/.*/)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
      .reply(200, SUCCESS);

    apiNock
      .delete(/.*/)
      .matchHeader('Authorization', VALID_AUTHORIZATION)
      .matchHeader('User-Agent', VALID_USER_AGENT)
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
});
