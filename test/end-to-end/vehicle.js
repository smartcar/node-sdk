'use strict';

const express = require('express');
const nightwatch = require('nightwatch');
const test = require('ava');

const smartcar = require('../../');

const {getAuthClientParams, startBrowser} = require('./helpers');
const config = require('../config');

const context = {};

test.before.cb((t) => {
  context.client = nightwatch.initClient(config.get('nightwatch'));
  context.browser = context.client.api();

  const client = new smartcar.AuthClient(getAuthClientParams());

  const app = express();
  const server = app.listen(4040);

  app.get('/callback', async function(req, res) {
    try {
      const access = await client.exchangeCode(req.query.code);

      const accessToken = access.accessToken;
      const vehicleIds = await smartcar.getVehicleIds(accessToken);
      context.vehicle = new smartcar.Vehicle(vehicleIds.vehicles[0], accessToken);
    } finally {
      server.close();
    }

    res.status(200).send();
  });

  const authUrl = client.getAuthUrl();

  startBrowser(context.client, context.browser, authUrl, t.end);
});

test('vehicle info', async (t) => {
  t.notThrows(async () => await context.vehicle.info());
});

test('vehicle location', async (t) => {
  t.notThrows(async () => await context.vehicle.location());
});

test('vehicle odometer', async (t) => {
  t.notThrows(async () => await context.vehicle.odometer());
});

test('vehicle vin', async (t) => {
  t.notThrows(async () => await context.vehicle.vin());
});

test('vehicle lock', async (t) => {
  t.notThrows(async () => await context.vehicle.lock());
});

test('vehicle unlock', async (t) => {
  t.notThrows(async () => await context.vehicle.unlock());
});

test('vehicle permissions', async (t) => {
  t.notThrows(async () => await context.vehicle.permissions());
});

test('vehicle disconnect', async (t) => {
  t.notThrows(async () => await context.vehicle.disconnect());
});
