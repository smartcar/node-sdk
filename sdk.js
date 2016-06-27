var util = require('./util.js');
var car = require('./car.js');
var querystring = require('querystring');

var Smartcar = function(){};

Smartcar.prototype.init = function(options){
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.scope = options.scope;
}
Smartcar.prototype.serializeToken = function(callback){

}
Smartcar.prototype.loadToken = function(token){

}
Smartcar.prototype.getAuthUrl = function(oem){
    var stateString = this.state ? `&state=${this.state}` : '';
    var query = querystring.stringify({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: querystring.escape(this.redirectUri),
        scope: querystring.escape(this.scope.join(' '))
    }) + stateString;
    return `https://${oem}.smartcar.com/oauth/authorize?${query}`;
}
Smartcar.prototype.handleAuthCode = function(request, response){
    if (request.query.error){
        /*  user denied the permissions
            what should be done here? call some kind of callback
            that the dev gives us? */
    }
    util.request('https://auth.smartcar.com/oauth/token', 'POST')
    .auth(this.clientId, this.clientSecret)
    .form({
        'grant_type': 'authorization_code',
        'code': request.query.code,
        'redirect_uri': this.redirectUri
    }).then(function(body){
        
        /*  request for token was successful.
            now what do we do with the access_token and refresh token?
        body = {
            "access_token": "...",
            "token_type": "Bearer",
            "expires_in": 1234,
            "refresh_token": "...",
        }*/
    }).catch(function(err){
        /* err = {
            "error": "...",
            "error_description": "..."
        }*/
    });
   
}
Smartcar.prototype.getVehicles = function(limit, offset){ 
    util.request(util.getURL(), 'GET')
    .auth(null, null, true, 'token')
    .form({
        limit: limit || 10,
        offset: offset || 0
    }).then(function(response){
        return response.vehicles.map(car);
    }).catch(console.log);
}

module.exports = Smartcar;