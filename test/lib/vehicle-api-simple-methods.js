'use strict';

const _ = require('lodash');
const nock = require('nock');
const test = require('ava');

const Vehicle = require('../../lib/vehicle');
const config = require('../../lib/config');

const VID = '82bcb867-a115-4a45-865d-03f4f561c59d';
const TOKEN = 'beeaec88-37f9-4b40-b2f8-2852b77a74c4';
const USER_AGENT = `smartcar-node-sdk:${config.version}`;

const vehicle = new Vehicle(VID, TOKEN);

test.before(function() {

  const n = nock(`https://api.smartcar.com/v1.0/vehicles/${VID}`)
    .matchHeader('User-Agent', USER_AGENT)
    .matchHeader('Authorization', `Bearer ${TOKEN}`)
    .persist();

  n.get(/.*/).reply(200, 'pass');
  n.post(/.*/).reply(200, 'pass');
  n.delete(/.*/).reply(200, 'pass');

});

test.after(() => nock.cleanAll());

// test all the methods that do not require any arguments
_.forEach(Vehicle.prototype, function(method, name) {

  if (method.length) {
    return;
  }

  test(name, async function(t) {
    const response = await vehicle[name]();
    t.is(response, 'pass');
  });

});
