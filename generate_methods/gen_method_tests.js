'use strict';
var methods = require('../lib/vehicle_methods');
var fs = require('fs');

var stream = fs.createWriteStream('temp_methods_test_file.js');
stream.once('open', function() {
  Object.keys(methods).forEach(function(method) {
    var config = methods[method];

    var testNoArgs = `test('${method} no args', function() {
        return vehicle.${method}()
        .then(function(response) {
          expect(response).to.have.all.keys('status');
          expect(response.status).to.equal('success');
        });
      });`;

    var testArgs = '';
    if (config.type === 'action') {
      testArgs = `test('${method} args', function() {
        return vehicle.${method}({arg: 'test'})
        .then(function(response) {
          expect(response).to.have.all.keys('status');
          expect(response.status).to.equal('success');
        });
      });`;
    }

    stream.write(testNoArgs);
    stream.write('\n');
    stream.write('\n');
    stream.write(testArgs);
    stream.write('\n');
    stream.write('\n');
  });
});
