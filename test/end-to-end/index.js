'use strict';

const _ = require('lodash');
const express = require('express');
const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const config = require('./config');

const nightwatchClient = nightwatch.initClient(config.nightwatch);
const browser = nightwatchClient.api();

test.serial.cb('exchangeCode', function(t) {
  const client = new smartcar.AuthClient({
    clientId: 'e922556a-7d4f-4168-88cd-059276044798',
    clientSecret: '79c07401-d3b2-48c0-8407-dc19c4ece7ff',
    redirectUri: 'http://localhost:4040/callback',
    development: true,
  });

  const app = express();
  const server = app.listen(4040);

  app.get('/callback', function(req, res) {
    return (async function() {
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
        server.close();
        t.end();
      } catch (err) {
        t.fail();
        server.close();
        t.end();
      }

      res.status(200).send();
    })();
  });

  const authUrl = client.getAuthUrl();

  browser
    .url(authUrl)
    .waitForElementVisible('div[class=content]', 1000)
    .click('a[href^="https://mock.smartcar.com"]')
    // login dialog is rendered
    .waitForElementVisible('input[id=username]', 1500)
    // add username/password and submit
    .setValue('input[id=username]', 'node@test.com')
    .setValue('input[id=password]', 'password')
    .click('button[id=approval-button]')
    // grant dialog is rendered and submitted
    .waitForElementVisible('div[class=permissions]', 1500)
    .click('button[id=approval-button]')
    .end();

  nightwatchClient.start();
});

test.serial.cb('exchangeRefreshToken', function(t) {
  const client = new smartcar.AuthClient({
    clientId: 'e922556a-7d4f-4168-88cd-059276044798',
    clientSecret: '79c07401-d3b2-48c0-8407-dc19c4ece7ff',
    redirectUri: 'http://localhost:4040/callback',
    development: true,
  });

  const app = express();
  const server = app.listen(4040);

  app.get('/callback', function(req, res) {
    return (async function() {
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
        t.end();
        server.close();
      } catch (err) {
        t.fail();
        t.end();
        server.close();
      }

      res.status(200).send();
    })();
  });

  const authUrl = client.getAuthUrl();

  browser
    .url(authUrl)
    .waitForElementVisible('div[class=content]', 1000)
    .click('a[href^="https://mock.smartcar.com"]')
    // login dialog is rendered
    .waitForElementVisible('input[id=username]', 1500)
    // add username/password and submit
    .setValue('input[id=username]', 'node@test.com')
    .setValue('input[id=password]', 'password')
    .click('button[id=approval-button]')
    // grant dialog is rendered and submitted
    .waitForElementVisible('div[class=permissions]', 1500)
    .click('button[id=approval-button]')
    .end();

  nightwatchClient.start();
});
