'use strict';
var methods = require('../lib/vehicle_methods');
var fs = require('fs');

var stream = fs.createWriteStream('temp_methods_file.js');
stream.once('open', function() {
  Object.keys(methods).forEach(function(method) {
    var config = methods[method];
    var httpMethod = determineHTTPMethod(config);

    /* write the documentation string to file when documentation format known */
    // var documentation = `/*
    //   * Vehicle.${method}()
    //   * api-endpoint: ${httpMethod} ${config.endpoint}
    //   * parameters: ${config.key ? `Object: {${config.key}: __}` : 'N/A'}
    //   */`

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
    stream.write(str);
    stream.write('\n');
    stream.write('\n');
    stream.write('\n');
  });
});

function determineHTTPMethod(config) {
  return config.type === 'action' ? 'POST' : 'GET';
}
