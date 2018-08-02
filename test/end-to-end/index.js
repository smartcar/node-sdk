'use strict';

const express = require('express');
const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const {getAuthClientParams, startBrowser} = require('./helpers');
const config = require('./config');

const context = {};

test.before.cb((t) => {
  context.client = nightwatch.initClient(config.nightwatch);
  context.browser = context.client.api();

  const client = new smartcar.AuthClient(getAuthClientParams());

  const app = express();
  const server = app.listen(4040);

  app.get('/callback', async (req, res) => {
    try {
      const access = await client.exchangeCode(req.query.code);
      context.accessToken = access.accessToken;
    } finally {
      server.close();
    }

    res.status(200).send();
  });

  const authUrl = client.getAuthUrl();

  startBrowser(context.client, context.browser, authUrl, t.end);
});

test('getVehicleIds', async (t) => {
  t.notThrows(async () => await smartcar.getVehicleIds(context.accessToken));
});

test('getUserId', async (t) => {
  t.notThrows(async () => await smartcar.getUserId(context.accessToken));
});
