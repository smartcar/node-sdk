var rp = require('request-promise')
var _ = require('lodash')
var util = {}

util.getUrl = function(id, endpoint){
    var url = 'https://api.smartcar.com/v1.0/vehicles'
    if (id) {
        url += '/' + id;
    }

    if (endpoint) {
        url += '/' + endpoint;
    }
    
    return url;
};
util.request = function(options){
    return rp(_.defaults(options, {
        json: true
    }));
};
util.get = function(options){
    //token, endpoint, vid, key
    return function(){
        return util.request({
            uri: util.getUrl(options.vid, options.endpoint), 
            method: 'GET', 
            auth: {
                bearer: options.token
            }
        }).then(function(response){
            var key = options.key;
            return (key ? response[key] : response);
        });
    }
};
util.action = function(options){
    //token, endpoint, vid, action, key
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
    }
};

module.exports = util;