var expect = require('chai').use(require('dirty-chai')).expect;
var nock = require('nock');
var Smartcar = require('../index');
var Vehicle = require('../lib/vehicle.js')

var VALID_TOKEN = 'valid-token';
var INVALID_TOKEN = 'invalid-token';
var VALID_AUTHORIZATION = 'Bearer ' + VALID_TOKEN;
var INVALID_AUTHORIZATION = 'Bearer ' + INVALID_TOKEN;

suite('index', function(){
    var client;
    suiteSetup(function(){
        client = new Smartcar({
            clientId: 'fakeid',
            clientSecret: 'fakesecret',
            redirectUri: 'fakeuri',
            scope: ['fakescope']
        });

        var authNock = nock('https://auth.smartcar.com').persist();
        authNock.post('/oauth/token')
        .reply(200, {
            access_token: VALID_TOKEN,
            token_type: 'Bearer',
            expires_in: '1234',
            refresh_token: VALID_TOKEN
        });

        var apiNock = nock('https://api.smartcar.com/v1.0').persist();

        apiNock.get('/vehicles')
        .query({limit: 1})
        .matchHeader('Authorization', VALID_AUTHORIZATION)
        .reply(200, {
            vehicles: ['vehicle1']
        });

        apiNock.get('/vehicles')
        .matchHeader('Authorization', VALID_AUTHORIZATION)
        .reply(200, {
            vehicles: ['vehicle1', 'vehicle2', 'vehicle3']
        });


    });

    suiteTeardown(function(){
        nock.cleanAll();
    });

    test('getAuthUrl', function(){
        var url = client.getAuthUrl('fakeoem');
        var expected = 'https://fakeoem.smartcar.com/oauth/authorize?response_type=code&client_id=fakeid&redirect_uri=fakeuri&scope=fakescope'
        expect(url).to.equal(expected)
    });
    test('getAuthUrl with state', function(){
        var url = client.getAuthUrl('fakeoem', {state: 'fakestate'});
        var expected = 'https://fakeoem.smartcar.com/oauth/authorize?response_type=code&client_id=fakeid&redirect_uri=fakeuri&scope=fakescope&state=fakestate'
        expect(url).to.equal(expected);
    });
    test('getAuthUrl with forcePrompt', function(){
        var url = client.getAuthUrl('fakeoem', {forcePrompt: true});
        var expected = 'https://fakeoem.smartcar.com/oauth/authorize?response_type=code&client_id=fakeid&redirect_uri=fakeuri&scope=fakescope&approval_prompt=force'
        expect(url).to.equal(expected);
    })

    test('setCreation', function(){
        var access = {};
        var newAccess = client.setCreation(access);
        expect(newAccess).to.have.all.keys('created_at');
    });
  
    test('exchangeCode', function(){
        client.exchangeCode('fakecode').then(function(response){
            expect(response).to.have.all.keys(
                'access_token', 'token_type', 'expires_in', 'refresh_token', 'created_at'
            );
        })
    });

    test('exchangeToken', function(){
        client.exchangeToken(VALID_TOKEN).then(function(response){
            expect(response).to.have.all.keys(
                'access_token', 'token_type', 'expires_in', 'refresh_token', 'created_at'
            );
        });
    });

    test('refreshAccess with valid access', function(){
        var access = {
            created_at: Date.now(),
            expires_in: 7200
        }
        var newAccess = client.refreshAccess(access);
        expect(newAccess).to.equal(access);
    });
    test('refreshAccess with expired access', function(done){
        var past = Date.now() - 3*3600*1000
        var access = {
            created_at: past,
            expires_in: 7200
        }
        client.refreshAccess(access).then(function(newAccess){
            expect(newAccess).to.have.all.keys(
                'access_token', 'token_type', 'expires_in', 'refresh_token', 'created_at'
            );
            expect(newAccess.created_at).to.be.within(past, Date.now())
            done();
        });
    });

    test('getVehicles', function(done){
        client.getVehicles(VALID_TOKEN).then(function(vehicles){
            for (var vehicle of vehicles){
                expect(vehicle).to.be.instanceof(Vehicle);
            }
            done();
        });
    });
    test('getVehicles with paging', function(done){
        client.getVehicles(VALID_TOKEN, { limit: 1 }).then(function(vehicles){
            expect(vehicles).to.have.lengthOf(1);
            done();
        });
    });

    test('getVehicle', function(){
        var vehicle = client.getVehicle(VALID_TOKEN, 'fakevehicleid')
        expect(vehicle).to.be.instanceof(Vehicle);
    });
});