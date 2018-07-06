'use strict';

const test = require('ava');

const validators = require('../../lib/validators');
const errors = require('../../lib/errors');

const CLIENT_ID = '4cf82729-4275-46d9-9255-8437ba777151';
const CLIENT_SECRET = '4cf82729-4275-46d9-9255-8437ba777151';
const INVALID_CLIENT_ID = '4cf82729-4275-46d9-9255-87ba151';

test('valid request parameters', function(t) {
  const requestData = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  };

  t.notThrows(() =>
    validators.validateRequestData(requestData), errors.ValidationError);
});

test('invalid uuid parameter', function(t) {
  const requestData = {
    clientId: INVALID_CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  };

  t.throws(() =>
    validators.validateRequestData(requestData), errors.ValidationError);
});

test('missing required parameter', function(t) {
  const requestData = {
    clientId: CLIENT_ID,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  };

  t.throws(() =>
    validators.validateRequestData(requestData), errors.ValidationError);
});

test('invalid scope parameter', function(t) {
  const requestData = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: 'read_odometer',
  };

  t.throws(() =>
    validators.validateRequestData(requestData), errors.ValidationError);
});

test('invalid development parameter', function(t) {
  const requestData = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'https://insurance.co/callback',
    scope: ['read_odometer', 'read_vehicle_info'],
    development: 'truthsies',
  };

  t.throws(() =>
    validators.validateRequestData(requestData), errors.ValidationError);
});

test('iOS and Android redirect uri', function(t) {
  const requestData = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: 'sc4a1b01e5-0497-417c-a30e-6df6ba33ba46://callback',
    scope: ['read_odometer', 'read_vehicle_info'],
  };

  t.notThrows(() =>
    validators.validateRequestData(requestData), errors.ValidationError);
});
