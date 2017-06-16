'use strict';

const nock = require('nock');
const Promise = require('bluebird');
const expect = require('chai').use(require('dirty-chai')).expect;

const config = require('../lib/config');
const Vehicle = require('../lib/vehicle');
const methodsRequiringParams = require('./vehicle_methods_requiring_params');

const VALID_TOKEN = 'valid-token';
const VALID_AUTHORIZATION = `Bearer ${VALID_TOKEN}`;
const VALID_VID = 'valid-vid';
const SUCCESS = {status: 'success'};
const VALID_USER_AGENT = `smartcar-node-sdk:${config.version}`;

suite('Vehicle prototype', function() {

  const vehicle = new Vehicle(VALID_VID, VALID_TOKEN);

  const methodsNotRequiringParams = [];

  suiteSetup(function() {

    const apiNock = nock('https://api.smartcar.com/v1.0').persist();

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

    for (const method in Vehicle.prototype) {
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
