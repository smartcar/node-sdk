var methods = require('./vehicle_methods');
var _ = require('lodash');
var util = require('./util');
Vehicle = function(token, vehicleId){
    this.token = token;
    this.vehicleId = vehicleId;
};
_.each(methods, function(config, method){
    config = _.extend({
        vid: this.vehicleId, 
        token: this.token
    }, config);
    Vehicle.prototype[method] = util[config.type](config);
});

module.exports = Vehicle;