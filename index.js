var querystring = require('querystring');
var Vehicle = require('./lib/vehicle');
var Promise = require('bluebird');
var util = require('./lib/util');

/**
 * @description Initializes Smartcar object
 * @constructor
 * @param options - sdk configuration object
 * @param {String} options.clientId - application client identifier
 * @param {String} options.clientSecret - application secret
 * @param {String} options.redirectUri - redirect here after OEM authorization
 * @param {String[]} options.scope - list of application's permissions
 * @param {String} [options.state] - oauth application state
 * @param {boolean} [options.forcePrompt=false] - force permission dialog if true
 */
function Smartcar (options){
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.redirectUri = options.redirectUri;
    this.scope = options.scope;
    this.state = options.state;
    this.forcePrompt = options.forcePrompt;
    this.handleAuthCode = this.handleAuthCodeWrap();
    this.serializer = function(req, res, next){
        next();
    };
};

/**
 * @description register a callback function into the client to handle tokens
 * @param {Function} callback - function to register
 * and refresh tokens
 */
Smartcar.prototype.serializeToken = function(callback){
    this.serializer = callback;
};

/**
 * @description return oauth authorization URL for user to login to smartcar
 * @param  {String} oem - name of oem 
 * @return {String} - oauth authorize URI for the specified oem
 */
Smartcar.prototype.getAuthUrl = function(oem){
    var baseString = `https://${oem}.smartcar.com/oauth/authorize?`;
    var parameters = {
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        scope: querystring.escape(this.scope.join(' '))        
    }
    if (this.state){
        parameters.state = this.state;
    }
    if (this.forcePrompt){
        parameters.approval_prompt = 'force';
    }
    var queryString = querystring.stringify(parameters);
    return baseString + queryString;
};

/**
 * @description exchange a code for a token
 * @param  {String} code - code to exchange
 * @return {Promise} - promise containing token data
 */
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

/**
 * @return {Function} - take auth code, use getToken on the code, then call your
 * token handler registered with serializeToken
 */
Smartcar.prototype.handleAuthCodeWrap = function() {
    var self = this;
    return function(req, res, next){
        Promise.try(function() {
            if (req.query.error){
                var message = "permissions denied"
                throw new Error(message);
            }
            if (!self.clientId && !self.clientSecret){
                var message = "clientId and clientSecret are undefined"
                throw new Error(message);
            }
            return self.getToken(req.query.code);
        })
        .then(function(body){
            self.serializer(body, req, next);
        })
        .catch(next);
    };
};

/**
 * @description return list of the user's vehicles
 * @param  {String} token - access token
 * @param  {Paging} [paging] - Paging object
 * @param  {number} [paging.limit] - number of vehicles to return
 * @param  {number} [paging.offset] - index to start vehicle list
 * @return {Vehicle[]} - list of Vehicles
 */
Smartcar.prototype.getVehicles = function(token, paging){
    if (!token) {
        throw new Error('token is not set');
    }

    var options = {
        uri: util.getUrl(), 
        method: 'GET',
        auth: {
            bearer: token
        }
    }
    if (paging){
        options.form = paging;
    }
    return util.request(options)
    .then(function(response){
        return response.vehicles.map(function(vid){
            return new Vehicle(token, vid);
        });
    });
};

/**
 * @description get a user's specific vehicle
 * @param  {String} token - access token
 * @param  {String} vid - vehicle identifier 
 * @return {Vehicle} - user's vehicle
 */
Smartcar.prototype.getVehicle = function(token, vid){
    return new Vehicle(token, vid);
};

module.exports = Smartcar;
