'use strict';

const test = require('ava');

const errors = require('../../../lib/errors');

test('inheritance check', function(t) {

  Object.keys(errors).forEach(function(error) {
    t.true(new errors[error]() instanceof errors.SmartcarError);
  });

  t.true(new errors.SmartcarError() instanceof Error);

});

test('message check', function(t) {

  Object.keys(errors).forEach(function(error) {
    t.regex(new errors[error]('R2D2').message, /R2D2/);
  });

});
