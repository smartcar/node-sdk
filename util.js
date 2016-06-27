var rp = require('request-promise')
var Util = function(){};

getUrl = function(id, endpoint){
    var url = 'https://api.smartcar.com/v1.0/vehicles'
    if (id) url += '/' + id;
    if (endpoint) url += '/' + endpoint;
    return url;
}
request = function(url, method){
    return rp({
        url: url,
        method: method,
        json: true
    })
}
get = function(endpoint, vid, key){
    return function(){
        request(getUrl(vid, endpoint), 'GET')
        .auth(null, null, true, 'token')
        .then(function(response){
            return (key ? response[key] : response);
        }).catch(console.log);
    }
}
action = function(endpoint, vid, action, key){
    return function(arg){
        data = { action: action };
        if(key && arg) data[key] = arg;
        request(getUrl(vid, endpoint), 'POST')
        .auth(null, null, true, 'token')
        .form(data)
        .then(function(response){
            return response;
        });
    }
}