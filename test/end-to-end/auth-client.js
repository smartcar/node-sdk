'use strict';

const _ = require('lodash');
const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const {getAuthClientParams, runTest} = require('./helpers');
const config = require('../config');

const context = {};

test.before(() => {
  context.client = nightwatch.initClient(config.get('nightwatch'));
  context.browser = context.client.api();
});

test.cb('exchangeCode', (t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());

  const authUrl = client.getAuthUrl();

  const testFn = (t, client) => {
    return async (code) => {
      try {
        const access = await client.exchangeCode(code);
        const keys = Object.keys(access).sort();
        const hasKeys = _.isEmpty(
          _.xor(keys, [
            'accessToken',
            'expiration',
            'refreshExpiration',
            'refreshToken',
          ])
        );
        t.true(hasKeys);

        t.pass();
      } catch (err) {
        t.fail();
      }
    };
  };

  runTest(context.client, context.browser, authUrl, testFn(t, client), t.end);
});

test.cb('exchangeRefreshToken', (t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());

  const authUrl = client.getAuthUrl();

  const testFn = (t, client) => {
    return async (code) => {
      try {
        const oldAccess = await client.exchangeCode(code);

        const newAccess = await client.exchangeRefreshToken(
          oldAccess.refreshToken
        );

        const keys = Object.keys(newAccess).sort();
        const hasKeys = _.isEmpty(
          _.xor(keys, [
            'accessToken',
            'expiration',
            'refreshExpiration',
            'refreshToken',
          ])
        );
        t.true(hasKeys);

        t.pass();
      } catch (err) {
        t.fail();
      }
    };
  };

  runTest(context.client, context.browser, authUrl, testFn(t, client), t.end);
});
