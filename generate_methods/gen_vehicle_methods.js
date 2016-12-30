'use strict';
var methods = require('../lib/vehicle_methods');
var fs = require('fs');

var stream = fs.createWriteStream('temp_methods_file.js');
stream.once('open', function() {
  Object.keys(methods).forEach(function(method) {
    var config = methods[method];
    var httpMethod = determineHTTPMethod(config);
    var paramDocs = '*';
    var returnDocs = '';
    if (config.key) {
      paramDocs = `*
      * @param {Object} data See the API Docs for what keys can be in this object
      *`;
    }

    if (httpMethod === 'GET') {
      returnDocs = `* @return {Promise} A promise for info on the vehicle's ${method}`;
    } else {
      returnDocs = '* @return {Promise} A success or failure response';
    }
    /* write the documentation string to file when documentation format known */
    var documentation = `
     /*
      * ${httpMethod} Vehicle.${method}
      ${paramDocs}
      ${returnDocs}
      */`;

    var str = `Vehicle.prototype.${method} = function(data) {
      data = data || {};
      ${config.type === 'action' ? `data.action = '${config.action}'` : ''}
      return this.request({
        uri: ${config.endpoint ? `'${config.endpoint}'` : null},
        body: data,
        headers: {
          'sc-unit-system': this.unitSystem,
        },
        method: '${httpMethod}',
      });
    };`;
    stream.write(documentation);
    stream.write('\n');
    stream.write(str);
    stream.write('\n');
  });
});

function determineHTTPMethod(config) {
  return config.type === 'action' ? 'POST' : 'GET';
}
