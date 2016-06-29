var util = require('./util');
var vehicle = require('./vehicle');
var querystring = require('querystring');

Smartcar = function (options){
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.scope = options.scope;
    this.handleAuthCode = this.handleAuthCodeWrap();
}
Smartcar.prototype.serializeToken = function(callback){
    this.serializer = callback;
}
Smartcar.prototype.loadToken = function(token){
    this.access_token = token;
}
Smartcar.prototype.getAuthUrl = function(oem){
    var base = `https://${oem}.smartcar.com/oauth/authorize?`
    var stateString = this.state ? `&state=${this.state}` : '';
    var query = querystring.stringify({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        scope: querystring.escape(this.scope.join(' '))
    });
    return base + query + stateString;
}
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
    })   
}
Smartcar.prototype.handleAuthCodeWrap = function() {
     var self = this;
     return function(req, res, next){
        if (req.query.error){
            /*  user denied the permissions */
        }
        if (!self.clientId && !self.clientSecret)
            throw new Error('clientId and clientSecret are undefined')
        return self.getToken(req.query.code)
        .then(function(body){
            self.serializer(body, req, next);
        }).catch(next);
    }
}
Smartcar.prototype.getVehicles = function(access, paging){
    if (!access) {
        throw new Error('access is not set')
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
            return vehicle(access.access_token, vid)
        })
    });
}

Smartcar.prototype.getVehicle = function(token, vehicleId){
    return vehicle(token, vehicleId)
}
module.exports = Smartcar;