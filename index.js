var util = require('./lib/util');
var Vehicle = require('./lib/vehicle');
var querystring = require('querystring');
var Promise = require('bluebird')

Smartcar = function (options){
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.scope = options.scope;
    this.state = options.state;
    this.handleAuthCode = this.handleAuthCodeWrap();
    this.serializer = function(req, res, next){
        next();
    };
};
Smartcar.prototype.serializeToken = function(callback){
    this.serializer = callback;
};
Smartcar.prototype.getAuthUrl = function(oem){
    var base = `https://${oem}.smartcar.com/oauth/authorize?`;
    var stateString = this.state ? `&state=${this.state}` : '';
    var query = querystring.stringify({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        scope: querystring.escape(this.scope.join(' '))
    });
    return base + query + stateString;
};
Smartcar.prototype.getToken = function(code){
    return util.request({
        uri: 'https://auth.smartcar.com/oauth/token', 
        method: 'POST',
        auth: {
            user: this.clientId,
            pass: this.clientSecret
        },
        form: {
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': this.redirectUri
        }
    });
};
Smartcar.prototype.handleAuthCodeWrap = function() {
     var self = this;
     return function(req, res, next){
        Promise.try(function() {

            if (req.query.error){
                throw new Error('permissions denied');
            }
            if (!self.clientId && !self.clientSecret){
                throw new Error('clientId and clientSecret are undefined');
            }

            return self.getToken(req.query.code);

        }).then(function(body){
            self.serializer(body, req, next);
        }).catch(function(err) {
            next(err);
        });      

    };
};
Smartcar.prototype.getVehicles = function(access, paging){
    if (!access) {
        throw new Error('access is not set');
    }

    return util.request({
        uri: util.getUrl(), 
        method: 'GET', 
        auth: {
            bearer: access.access_token
        },
        form: paging
    })
    .then(function(response){
        return response.vehicles.map(function(vid){
            return new Vehicle(access.access_token, vid);
        });
    });
};
Smartcar.prototype.getVehicle = function(token, vehicleId){
    return new Vehicle(token, vehicleId);
};
module.exports = Smartcar;