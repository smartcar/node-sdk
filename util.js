var rp = require('request-promise')
var Util = function(){};

API = 'https://api.smartcar.com/v1.0/vehicles'

Util.prototype.sendGetRequest = function(id, endpoint){
    var url = API
    if (id) url += '/' + id
    if (endpoint) url += '/' + endpoint
    return rp({
        url: API,
        method: 'GET',
        auth: {
            bearer: token
        },
        json: true
    })
}

Util.prototype.getJSON = function(endpoint){
    return function(vehicleID){
        sendGetRequest(vehicleID, endpoint)
        .then(function(response){
            return response
        }).catch(console.log)
    }
}