'use strict';

const nightwatch = require('nightwatch');
const test = require('ava');

const config = require('./config');

test.beforeEach.always('Authenticate', function(t) {
  t.context.client = nightwatch.initClient(config.nightwatch);
  t.context.browser = t.context.client.client.api();
});

test('Noop', function(t) {
  t.true(true);
});
