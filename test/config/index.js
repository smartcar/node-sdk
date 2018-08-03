'use strict';

/* eslint strict: ['error', 'global'] */
/* global require, __dirname, module */

const convict = require('convict');
const path = require('path');

const config = convict({
  nightwatch: {
    // eslint-disable-next-line camelcase
    selenium_host: {
      doc: 'Selenium hostname.',
      format: String,
      default: 'localhost',
    },
    desiredCapabilities: {
      browserName: {
        doc: 'Browser name.',
        format: String,
        default: 'chrome',
      },
      javascriptEnabled: {
        doc: 'Flag to enable Javascript in nightwatch.',
        format: Boolean,
        default: true,
      },
      acceptSslCerts: {
        doc: 'Accept SSL Certificates.',
        format: Boolean,
        default: true,
      },
      chromeOptions: {
        args: {
          doc: 'Args sent to nightwatch.',
          format: Array,
          default: ['--no-sandbox'],
        },
      },
    },
    silent: {
      doc: 'Whether to run silently',
      format: Boolean,
      default: true,
    },
    globals: {
      waitForConditionTimeout: {
        doc: 'Wait for condition',
        format: Number,
        default: 200,
      },
      retryAssertionTimeout: {
        doc: 'Wait for condition',
        format: Number,
        default: 3000,
      },
    },
  },
});

config.loadFile(path.join(__dirname, 'config.json'));
config.validate({allowed: 'strict'});

module.exports = config;
