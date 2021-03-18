'use strict';

const test = require('ava');

const errors = require('../../../lib/errors');

test('inheritance check', function(t) {

  Object.keys(errors).forEach(function(error) {
    switch (error) {
      case 'VehicleStateError':
        t.true(
          new errors[error]('Message', {code: 'VS_000'})
          instanceof errors.SmartcarError
        );
        break;
      case 'SmartcarErrorV2':
        break;
      default:
        t.true(new errors[error]() instanceof errors.SmartcarError);
    }
  });

  t.true(new errors.SmartcarError() instanceof Error);

});

test('message check', function(t) {

  Object.keys(errors).forEach(function(error) {
    switch (error) {
      case 'VehicleStateError':
        t.regex(new errors[error]('R2D2', {code: 'VS_000'}).message, /R2D2/);
        break;
      case 'SmartcarErrorV2':
        break;
      default:
        t.regex(new errors[error]('R2D2').message, /R2D2/);
    }
  });

});
