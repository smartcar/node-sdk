var rp = require('request-promise');
var util = {};

/**
 * @description form an API request URI
 * @param  {String} id - vehicle identifier
 * @param  {String} endpoint - API endpoint 
 * @return {String} url - API request URI
 */
util.getUrl = function(id, endpoint){
    var url = 'https://api.smartcar.com/v1.0/vehicles';
    if (id) {
        url += '/' + id;
    }
    if (endpoint) {
        url += '/' + endpoint;
    }
    return url;
};

/**
 * @description wrapper for request-promise call
 * @param  {String} options - options to request call 
 * @return {Promise}
 */
util.request = function(options){
    options.json = true;
    return rp(options);
};

/**
 * @description creates a GET method for the Smartcar object
 * @param  {String} options - method options object
 * @param  {String} options.vid - vehicle identifier
 * @param  {String} options.endpoint - API endpoint
 * @param  {String} options.token - access token
 * @param  {String} [options.key] - key of value to extract from 
 * API response
 * @return {Function} - makes API request for data
 */
util.get = function(options){
    return function(){
        return util.request({
            uri: util.getUrl(options.vid, options.endpoint), 
            method: 'GET', 
            auth: {
                bearer: options.token
            }
        })
        .then(function(response){
            var key = options.key;
            return (key ? response[key] : response);
        });
    };
};
/**
 * @description creates a POST method for the Smartcar object
 * @param  {String} options - method options object
 * @param  {String} options.action - value to action key in 
 * request body
 * @param  {String} options.vid - vehicle identifier
 * @param  {String} options.endpoint - API endpoint
 * @param  {String} options.token - access token
 * @param  {String} [options.key] - key of value to set in 
 * response body
 * @return {Function} - makes API action request
 */
util.action = function(options){
    return function(arg){
        var data = { action: options.action };
        if(options.key && arg) data[options.key] = arg;

        return util.request({
            uri: util.getUrl(options.vid, options.endpoint), 
            method: 'POST',
            auth: {
                bearer: options.token
            },
            form: data
        })
        .then(function(response){
            return response;
        });
    };
};

module.exports = util;