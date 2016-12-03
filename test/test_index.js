'use strict';
var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var Smartcar = require('../index');
var Vehicle = require('../lib/vehicle');

var VALID_TOKEN = 'valid-token';
var VALID_AUTHORIZATION = 'Bearer ' + VALID_TOKEN;

suite('Index', function() {

  var client;

  suiteSetup(function() {
    client = new Smartcar({
      clientId: 'fakeid',
      clientSecret: 'fakesecret',
      redirectUri: 'fakeuri',
      scope: ['control_smell_sensor', 'control_seat_freezer'],
    });

    var authNock = nock('https://auth.smartcar.com').persist();

    authNock.post('/oauth/token')
    .reply(200, {
      access_token: VALID_TOKEN,
      token_type: 'Bearer',
      expires_in: '1234',
      refresh_token: VALID_TOKEN,
    });

    var apiNock = nock('https://api.smartcar.com/v1.0')

    apiNock.get('/vehicles')
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .reply(200, {
      vehicles: ['vehicle1', 'vehicle2', 'vehicle3'],
    });

    apiNock.get('/vehicles')
    .query({
      limit: 1
    })
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .reply(200, {
      vehicles: ['vehicle1']
    })

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
      approval_prompt: 'force',
    });
    var expected = 'https://ford.smartcar.com/oauth/authorize?' +
    'response_type=code&client_id=fakeid&redirect_uri=fakeuri' +
    '&scope=control_smell_sensor%20control_seat_freezer' + 
    '&state=fakestate&approval_prompt=force';
    expect(url).to.equal(expected);
  });

  test('exchangeCode', function() {
    client.exchangeCode('fakecode')
    .then(function(response) {
      expect(response).to.have.all.keys(
        'access_token',
        'token_type',
        'expires_in',
        'refresh_token',
        'created_at'
      );
    });
  });

  test('exchangeToken', function() {
    client.exchangeToken(VALID_TOKEN)
    .then(function(response) {
      expect(response).to.have.all.keys(
        'access_token',
        'token_type',
        'expires_in',
        'refresh_token',
        'created_at'
      );
    });
  });

  test('expired', function() {
    var access = {
      created_at: Date.now() - 7300*1000,
      expired_in: 7200,
    }
    expect(client.expired(access)).to.be.true;
  });

  test('getVehicles', function(done) {
    client.getVehicles(VALID_TOKEN)
    .then(function(response) {
      expect(response.vehicles).to.have.lengthOf(3);
      done();
    })
    .catch(done);
  });

  test('getVehicles with undefined token', function(done){
    try {
      client.getVehicles(null)
    } catch (e) {
      expect(e.message).to.equal('token is undefined');
      done();
    }
  });

  test('getVehicles with paging', function(done) {
    client.getVehicles(VALID_TOKEN, {
      limit: 1
    })
    .then(function(response) {
      expect(response.vehicles).to.have.lengthOf(1);
      done();
    })
    .catch(done);
  })

  test('Vehicle instantiation', function() {
    var vehicle = client.Vehicle('fakevehicleid', VALID_TOKEN);
    expect(vehicle).to.be.instanceof(Vehicle);
  });

  test('Vehicle with undefined token', function(){
    try {
      var vehicle = client.Vehicle('fakevehicleid', null);
    } catch (e) {
      expect(e.message).to.equal("token is undefined");
    }
  });

  test('Vehicle with undefined vid', function(){
    try {
      var vehicle = client.Vehicle(null, VALID_TOKEN);
    } catch (e) {
      expect(e.message).to.equal("vid is undefined");
    }
  });
});
