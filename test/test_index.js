'use strict';
var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var smartcar = require('../index');
var Vehicle = require('../lib/vehicle');
var config = require('../lib/config');

var VALID_TOKEN = 'valid-token';
var VALID_AUTHORIZATION = 'Bearer ' + VALID_TOKEN;
var VALID_USER_AGENT_HEADER = `smartcar-node-sdk:${config.version}`;

suite('Index', function() {

  var client;

  suiteSetup(function() {
    client = new smartcar.Client({
      clientId: 'fakeid',
      clientSecret: 'fakesecret',
      redirectUri: 'fakeuri',
      scope: ['control_smell_sensor', 'control_seat_freezer'],
    });

    var authNock = nock('https://auth.smartcar.com').persist();

    authNock.post('/oauth/token')
    .matchHeader('User-Agent', VALID_USER_AGENT_HEADER)
    .reply(200, {
      /* eslint-disable camelcase */
      access_token: VALID_TOKEN,
      token_type: 'Bearer',
      expires_in: '1234',
      refresh_token: VALID_TOKEN,
      /* eslint-enable camelcase */
    });

    var apiNock = nock('https://api.smartcar.com/v1.0');

    apiNock.get('/vehicles')
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .matchHeader('User-Agent', VALID_USER_AGENT_HEADER)
    .reply(200, {
      vehicles: ['vehicle1', 'vehicle2', 'vehicle3'],
    });

    apiNock.get('/vehicles')
    .query({
      limit: 1,
    })
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .matchHeader('User-Agent', VALID_USER_AGENT_HEADER)
    .reply(200, {
      vehicles: ['vehicle1'],
    });

  });

  suiteTeardown(function() {
    nock.cleanAll();
  });

  test('getAuthUrl', function() {
    var url = client.getAuthUrl('ford');
    var expected = 'https://ford.smartcar.com/oauth/authorize?' +
    'response_type=code&client_id=fakeid&redirect_uri=fakeuri' +
    '&scope=control_smell_sensor%20control_seat_freezer';
    expect(url).to.equal(expected);
  });

  test('getAuthUrl with options', function() {
    var url = client.getAuthUrl('ford', {
      state: 'fakestate',
      approval_prompt: 'force', // eslint-disable-line camelcase
    });
    var expected = 'https://ford.smartcar.com/oauth/authorize?' +
    'response_type=code&client_id=fakeid&redirect_uri=fakeuri' +
    '&scope=control_smell_sensor%20control_seat_freezer' +
    '&state=fakestate&approval_prompt=force';
    expect(url).to.equal(expected);
  });

  test('getAuthUrl with no scope', function() {
    var noScopeClient = new smartcar.Client({
      clientId: 'fakeid',
      clientSecret: 'fakesecret',
      redirectUri: 'fakeuri',
    });

    var url = noScopeClient.getAuthUrl('ford', {
      state: 'fakestate',
      approval_prompt: 'force', // eslint-disable-line camelcase
    });
    var expected = 'https://ford.smartcar.com/oauth/authorize?' +
    'response_type=code&client_id=fakeid&redirect_uri=fakeuri' +
    '&state=fakestate&approval_prompt=force';
    expect(url).to.equal(expected);
  });

  test('exchangeCode', function() {
    return client.exchangeCode('fakecode')
    .then(function(response) {
      expect(response).to.have.all.keys(
        'access_token',
        'token_type',
        'expires_in',
        'refresh_token',
        'expiration'
      );
    });
  });

  test('exchangeToken', function() {
    return client.exchangeToken(VALID_TOKEN)
    .then(function(response) {
      expect(response).to.have.all.keys(
        'access_token',
        'token_type',
        'expires_in',
        'refresh_token',
        'expiration'
      );
    });
  });

  test('expiration - bad arg', function() {
    const access = {expiration: 'pizza'};
    expect(function() {
      client.expired(access);
    }).to.throw(TypeError);
  });

  test('expired - true', function() {
    const access = {
      expiration: new Date(Date.now() - (60 * 1000)).toISOString(),
    };
    expect(client.expired(access)).to.be.true();
  });

  test('expired - false', function() {
    const access = {
      expiration: new Date(Date.now() + (60 * 1000)).toISOString(),
    };
    expect(client.expired(access)).to.be.false();
  });

  test('getVehicles', function() {

    return client.getVehicles(VALID_TOKEN)
      .then(function(response) {
        expect(response.vehicles).to.have.lengthOf(3);
      });

  });

  test('getVehicles with undefined token', function() {

    return client.getVehicles(null)
      .thenThrow(new Error('TypeError should have been thrown'))
      .catch(TypeError, function(e) {
        expect(e.message).to.equal('"token" argument must be a string');
      });

  });

  test('getVehicles with paging', function() {

    return client.getVehicles(VALID_TOKEN, {
      limit: 1,
    })
      .then(function(response) {
        expect(response.vehicles).to.have.lengthOf(1);
      });

  });

  test('Vehicle instantiation', function() {

    var vehicle = new smartcar.Vehicle('fakevehicleid', VALID_TOKEN);
    expect(vehicle).to.be.instanceof(Vehicle);

  });

});
