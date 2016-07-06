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
        })
        var authNock = nock('https://auth.smartcar.com').persist();
        authNock.post('/oauth/token')
        //.matchHeader('Authorization', 'Basic ')
        .reply(200, {
            access_token: VALID_TOKEN,
            token_type: 'Bearer',
            expires_in: '1234',
            refresh_token: VALID_TOKEN
        })

        var apiNock = nock('https://api.smartcar.com/v1.0').persist();
        apiNock.get('/vehicles')
        .matchHeader('Authorization', VALID_AUTHORIZATION)
        .reply(200, {
            vehicles: ['fakevehicleid']
        })
    });

    suiteTeardown(function(){
        nock.cleanAll();
    });

    test('getAuthUrl without state', function(){
        var url = client.getAuthUrl('fakeoem');
        var expected = 'https://fakeoem.smartcar.com/oauth/authorize?response_type=code&client_id=fakeid&redirect_uri=fakeuri&scope=fakescope'
        expect(url).to.equal(expected)
    });

    test('getAuthUrl with state', function(){
        client.state = 'state'
        var url = client.getAuthUrl('fakeoem');
        var expected = 'https://fakeoem.smartcar.com/oauth/authorize?response_type=code&client_id=fakeid&redirect_uri=fakeuri&scope=fakescope&state=state'
        expect(url).to.equal(expected);
    });

    test('getToken', function(){
        client.getToken('fakecode').then(function(response){
            expect(response).to.have.all.keys(
                'access_token', 'token_type', 'expires_in', 'refresh_token'
            );
        })
    });

    test('getVehicles no access', function(){
        expect(client.getVehicles).to.throw('token is not set');
    });

    test('getVehicles with access', function(){
        var token = VALID_TOKEN
        client.getVehicles(token).then(function(vehicles){
            expect(vehicles[0]).to.be.instanceof(Vehicle);
        })
    });

    test('getVehicle', function(){
        var vehicle = client.getVehicle(VALID_TOKEN, 'fakevehicleid')
        expect(vehicle).to.be.instanceof(Vehicle);
    });

    test('handleAuthCode', function(done){
        var serializeClient = new Smartcar({
            clientId: 'fakeid',
            clientSecret: 'fakesecret',
            redirectUri: 'fakeuri',
            scope: ['fakescope']
        })
        serializeClient.accessSerializer(function(body, req, next){
            expect(body).to.have.all.keys(
                'access_token', 'token_type', 'expires_in', 'refresh_token'
            );
            next();
        });
        var req = { query: {} }
        var res = {}
        serializeClient.handleAuthCode(req, res, done)
    });
    test('handleAuthCode with default serializer', function(done){
        var serializeClient = new Smartcar({
            clientId: 'fakeid',
            clientSecret: 'fakesecret',
            redirectUri: 'fakeuri',
            scope: ['fakescope']
        })
        var req = { query: {} }
        var res = {}
        serializeClient.handleAuthCode(req, res, done)
    });

    test('handleAuthCode with permissions denied', function(done){
        var req = { query: { error: "access_denied"} };
        var res = {};
        var next = function(err){
            expect(err).to.be.instanceof(Error);
            done();
        }
        client.handleAuthCode(req, res, next)
    });

    test('handleAuthCode with undefined clientSecret and clientId', function(done){
        var badclient = new Smartcar({
            clientId: undefined,
            clientSecret: undefined,
            redirectUri: 'fakeuri',
            scope: ['fakescope']
        });
        var req = {
            query: {}
        }
        var res = {}
        var next = function(err){
            expect(err).to.be.instanceof(Error);
            done();
        }
        badclient.handleAuthCode(req, res, next);
    });
})
