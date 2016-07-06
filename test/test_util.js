'use strict';
var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var util = require('../lib/util');

var VALID_TOKEN = 'valid-token';
var VALID_AUTHORIZATION = 'Bearer ' + VALID_TOKEN;

suite('util', function() {
  suiteSetup(function() {
    var apiNock = nock('https://api.smartcar.com/v1.0').persist();

    apiNock.get('/vehicles')
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .reply(200, { vehicles: ['fakecar'] });

    apiNock.get('/vehicles/fakeid/barometer')
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .reply(200, {pressure: 1000});

    apiNock.post('/vehicles/fakeid/sunroof')
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .reply(200, {status: 'success'});

    apiNock.post('/vehicles/fakeid/panic')
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .reply(200, {status: 'success'});
  });
  suiteTeardown(function() {
    nock.cleanAll();
  });
  test('getUrl with id and endpoint', function() {
    var url = util.getUrl('fakeid', 'odometer');
    expect(url).to
    .equal('https://api.smartcar.com/v1.0/vehicles/fakeid/odometer');
  });
  test('getUrl with no id or endpoint', function() {
    var url = util.getUrl();
    expect(url).to.equal('https://api.smartcar.com/v1.0/vehicles');
  });
  test('get vehicles', function() {
    return util.get({
      token: VALID_TOKEN,
      endpoint: null,
      vid: null,
      key: null,
    })().then(function(response) {
      expect(response).to.have.all.keys('vehicles');
      expect(response.vehicles).to.have.length(1);
    });
  });
  test('get with a key and vid', function() {
    return util.get({
      token: VALID_TOKEN,
      endpoint: 'barometer',
      vid: 'fakeid',
      key: 'pressure',
    })().then(function(response) {
      expect(response).to.be.a('number');
    });
  });
  test('action with a key and argument', function() {
    return util.action({
      token: VALID_TOKEN,
      endpoint: 'sunroof',
      vid: 'fakeid',
      action: 'OPEN',
      key: 'percentOpen',
    })(0.5).then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
  test('action with no key or argument', function() {
    return util.action({
      token: VALID_TOKEN,
      endpoint: 'panic',
      vid: 'fakeid',
      action: 'START',
    })().then(function(response) {
      expect(response).to.have.all.keys('status');
      expect(response.status).to.equal('success');
    });
  });
});