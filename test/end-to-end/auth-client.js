'use strict';

const _ = require('lodash');
const express = require('express');
const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const {getAuthClientParams, startBrowser} = require('./helpers');
const config = require('./config');

const context = {};

test.before(() => {
  context.client = nightwatch.initClient(config.nightwatch);
  context.browser = context.client.api();
});

test.serial.cb('exchangeCode', (t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());

  const app = express();
  const server = app.listen(4040);

  app.get('/callback', async (req, res) => {
    try {
      const access = await client.exchangeCode(req.query.code);

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
    } finally {
      server.close();
    }

    res.status(200).send();
  });

  const authUrl = client.getAuthUrl();

  startBrowser(context.client, context.browser, authUrl, t.end);
});

test.serial.cb('exchangeRefreshToken', (t) => {
  const client = new smartcar.AuthClient(getAuthClientParams());

  const app = express();
  const server = app.listen(4040);

  app.get('/callback', async (req, res) => {
    try {
      const oldAccess = await client.exchangeCode(req.query.code);

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
    } finally {
      server.close();
    }

    res.status(200).send();
  });

  const authUrl = client.getAuthUrl();

  startBrowser(context.client, context.browser, authUrl, t.end);
});
