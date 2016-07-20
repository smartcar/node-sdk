'use strict';
var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var Smartcar = require('../index');
var Vehicle = require('../lib/vehicle.js');

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

    var apiNock = nock('https://api.smartcar.com/v1.0').persist();

    apiNock.get('/vehicles')
    .query({limit: 1})
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .reply(200, {
      vehicles: ['vehicle1'],
    });

    apiNock.get('/vehicles')
    .matchHeader('Authorization', VALID_AUTHORIZATION)
    .reply(200, {
      vehicles: ['vehicle1', 'vehicle2', 'vehicle3'],
    });


  });

  suiteTeardown(function() {
    nock.cleanAll();
  });

  test('getAuthUrl', function() {
    var url = client.getAuthUrl('https://fakeoem.smartcar.com');
    var expected = 'https://fakeoem.smartcar.com/oauth/authorize?' +
    'response_type=code&client_id=fakeid&redirect_uri=fakeuri' +
    '&scope=control_smell_sensor%20control_seat_freezer';
    expect(url).to.equal(expected);
  });
  test('getAuthUrl with options', function() {
    var url = client.getAuthUrl('https://fakeoem.smartcar.com', {
      state: 'fakestate',
      approval_prompt: 'force',
    });
    var expected = 'https://fakeoem.smartcar.com/oauth/authorize?' +
    'response_type=code&client_id=fakeid&redirect_uri=fakeuri' +
    '&scope=control_smell_sensor%20control_seat_freezer&state=fakestate' +
    '&approval_prompt=force';
    expect(url).to.equal(expected);
  });
  test('setCreation', function() {
    var access = {};
    var newAccess = client.setCreation(access);
    expect(newAccess).to.have.all.keys('created_at');
  });

  test('exchangeCode', function() {
    client.exchangeCode('fakecode').then(function(response) {
      expect(response).to.have.all.keys(
        'access_token','token_type','expires_in','refresh_token','created_at'
      );
    });
  });

  test('exchangeToken', function() {
    client.exchangeToken(VALID_TOKEN).then(function(response) {
      expect(response).to.have.all.keys(
        'access_token','token_type','expires_in','refresh_token','created_at'
      );
    });
  });

  test('refreshAccess with valid access', function(done) {
    var access = {
      created_at: Date.now(),
      expires_in: 7200,
    };
    client.refreshAccess(access).then(function(newAccess){
      expect(newAccess).to.equal(access);
      done();
    });
  });
  test('refreshAccess with expired access', function(done) {
    var past = Date.now() - 3 * 3600 * 1000;
    var access = {
      created_at: past,
      expires_in: 7200,
    };
    client.refreshAccess(access).then(function(newAccess) {
      expect(newAccess).to.have.all.keys(
        'access_token','token_type','expires_in','refresh_token','created_at'
      );
      expect(newAccess.created_at).to.be.within(past, Date.now());
      done();
    });
  });

  test('getVehicles', function(done) {
    client.getVehicles(VALID_TOKEN).then(function(vehicles) {
      for (var i in vehicles) {
        expect(vehicles[i]).to.be.instanceof(Vehicle);
      }
      done();
    });
  });
  test('getVehicles with paging', function(done) {
    client.getVehicles(VALID_TOKEN, { limit: 1 }).then(function(vehicles) {
      expect(vehicles).to.have.lengthOf(1);
      done();
    });
  });

  test('getVehicle', function() {
    var vehicle = client.getVehicle(VALID_TOKEN, 'fakevehicleid');
    expect(vehicle).to.be.instanceof(Vehicle);
  });

  test('getVehicle with undefined token', function(){
    try {
      var vehicle = client.getVehicle(null, 'fakevehicleid');
    } catch (e) {
      expect(e.message).to.equal("token is undefined");
    }
  });

  test('getVehicle with undefined vid', function(){
    try {
      var vehicle = client.getVehicle(VALID_TOKEN, null);
    } catch (e) {
      expect(e.message).to.equal("vid is undefined");
    }
  });

  test('getVehicles with undefined token', function(done){
    try {
      client.getVehicles(null)
    } catch (e) {
      expect(e.message).to.equal('token is undefined');
      done();
    }
  });
});
