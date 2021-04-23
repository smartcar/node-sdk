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
      default:
        t.true(new errors[error]('Message') instanceof errors.SmartcarError);
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
        t.regex(new errors[error]('R2D2').description, /R2D2/);
        const sampleError = {
          type: '<type>',
          code: '<code>',
          description: '<description>',
        };
        t.is(new errors[error](sampleError).message, '<type>:<code> - <description>');
        break;
      default:
        t.regex(new errors[error]('R2D2').message, /R2D2/);
    }
  });

});
