'use strict';

const test = require('ava');
const nock = require('nock');

const smartcar = require('../');

test('isExpired - error', function(t) {

  t.throws(() => smartcar.isExpired(1000), TypeError);
  t.throws(() => smartcar.isExpired({}), TypeError);
  t.throws(() => smartcar.isExpired('not a date'), TypeError);

});

test('isExpired - date', function(t) {

  let expiration;

  expiration = new Date(Date.now() - (60 * 1000));
  t.true(smartcar.isExpired(expiration));

  expiration = new Date(Date.now() + (60 * 1000));
  t.false(smartcar.isExpired(expiration));

});

test('isExpired - string', function(t) {

  let expiration;

  expiration = new Date(Date.now() - (60 * 1000)).toISOString();
  t.true(smartcar.isExpired(expiration));

  expiration = new Date(Date.now()).toISOString();
  t.true(smartcar.isExpired(expiration));

  expiration = new Date(Date.now() + (60 * 1000)).toISOString();
  t.false(smartcar.isExpired(expiration));

});

test('getVehicleIds - missing token', async function(t) {

  const err = await t.throws(smartcar.getVehicleIds(), TypeError);
  t.is(err.message, '"token" argument must be a string');

});

test('getVehicleIds - simple', async function(t) {

  const n = nock('https://api.smartcar.com/v1.0/')
    .get('/vehicles')
    .matchHeader('Authorization', 'Bearer simple')
    .reply(200, {
      vehicles: ['vehicle1', 'vehicle2', 'vehicle3'],
    });

  const res = await smartcar.getVehicleIds('simple');
  t.is(res.vehicles.length, 3);
  t.true(n.isDone());

});

test('getVehicleIds - paging', async function(t) {

  const n = nock('https://api.smartcar.com/v1.0/')
    .get('/vehicles', {
      limit: '1',
    })
    .matchHeader('Authorization', 'Bearer paging')
    .reply(200, {
      vehicles: ['vehicle1'],
    });

  const res = await smartcar.getVehicleIds('paging', {limit: 1});
  t.is(res.vehicles.length, 1);
  t.true(n.isDone());

});

test('getUserId', async function(t) {

  const n = nock('https://api.smartcar.com/v1.0/')
    .get('/user')
    .matchHeader('Authorization', 'Bearer token')
    .reply(200, {
      id: 'userid',
    });

  const id = await smartcar.getUserId('token');
  t.is(id, 'userid');
  t.true(n.isDone());

});

test('exports', function(t) {
  t.true('errors' in smartcar);
  t.true('Vehicle' in smartcar);
  t.true('AuthClient' in smartcar);
});
