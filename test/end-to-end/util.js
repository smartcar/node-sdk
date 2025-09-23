'use strict';

const test = require('ava');

const smartcar = require('../../');
const SmartcarError = require('../../lib/smartcar-error');
const {getAuthClientParams, runAuthFlow} = require('./helpers');

const getVehicleObject = async function(email, version = '') {
  const client = new smartcar.AuthClient(getAuthClientParams());
  const code = await runAuthFlow(
    client.getAuthUrl(['read_odometer'], {forcePrompt: true}),
    'CHEVROLET',
    email,
  );
  const {accessToken} = await client.exchangeCode(code);
  const {vehicles} = await smartcar.getVehicles(accessToken);

  return new smartcar.Vehicle(vehicles[0], accessToken, {version});
};

// Note: we skip the following 2 tests because the account associated with them
// began throwing Smartcar Authentication errors. At this time, we have not diagnosed
// exactly why this is happening, so we skip for now to move projects forward.
test.skip('handleError-SmartcarError V2 resolution string', async function(t) {
  const description = 'The vehicle was unable to perform your request'
    + ' due to an unknown issue.';

  const vehicle = await getVehicleObject(
    'VEHICLE_STATE.UNKNOWN@smartcar.com',
  );
  const error = await t.throwsAsync(vehicle.odometer());

  t.true(error instanceof SmartcarError);
  t.is(error.statusCode, 409);
  t.is(error.resolution.type, 'RETRY_LATER');
  t.is(error.docURL, 'https://smartcar.com/docs/errors/api-errors/vehicle-state-errors#unknown');
  t.is(error.description, description);
  t.is(error.type, 'VEHICLE_STATE');
  t.is(error.code, 'UNKNOWN');
  t.is(error.requestId.length, 36);
  t.is(error.message, `VEHICLE_STATE:UNKNOWN - ${description}`);
});

test.skip('handleError - SmartcarError V2 resolution null', async function(t) {
  const description = 'This vehicle is no longer associated with the user\'s '
    + 'connected services account. Please prompt the user to re-add'
    + ' the vehicle to their account.';

  const vehicle = await getVehicleObject(
    'CONNECTED_SERVICES_ACCOUNT.VEHICLE_MISSING@smartcar.com',
  );
  const error = await t.throwsAsync(vehicle.odometer());

  t.true(error instanceof SmartcarError);
  t.is(error.statusCode, 400);
  t.is(error.resolution.type, null);
  t.is(error.docURL, 'https://smartcar.com/docs/errors/api-errors/connected-services-account-errors#vehicle-missing');
  t.is(error.description, description);
  t.is(error.type, 'CONNECTED_SERVICES_ACCOUNT');
  t.is(error.code, 'VEHICLE_MISSING');
  t.is(error.requestId.length, 36);
  t.is(error.message,
    `CONNECTED_SERVICES_ACCOUNT:VEHICLE_MISSING - ${description}`,
  );
});

test.skip('handleError - SmartcarError V1 error', async function(t) {
  const vehicle = await getVehicleObject(
    'smartcar@vs-000.vehicle-state-error.com',
    '1.0',
  );
  const error = await t.throwsAsync(vehicle.odometer());

  t.true(error instanceof SmartcarError);
  t.is(error.statusCode, 409);
  t.is(error.type, 'vehicle_state_error');
  t.is(error.code, 'VS_000');
  t.is(error.requestId.length, 36);
  const expectedMessage = 'vehicle_state_error:VS_000 - '
    + 'Vehicle state cannot be determined.';
  t.is(error.message, expectedMessage);
});

test.skip('handleError - SmartcarError V2 code null', async function(t) {
  const description = 'Your application has insufficient permissions to access '
    + 'the requested resource. Please prompt the user to re-authenticate'
    + ' using Smartcar Connect.';

  const vehicle = await getVehicleObject();
  const error = await t.throwsAsync(vehicle.location());

  t.true(error instanceof SmartcarError);
  t.is(error.statusCode, 403);
  t.is(error.resolution.type, 'REAUTHENTICATE');
  t.is(error.docURL, 'https://smartcar.com/docs/errors/api-errors/permission-errors#null');
  t.is(error.description, description);
  t.is(error.type, 'PERMISSION');
  t.is(error.code, undefined);
  t.is(error.requestId.length, 36);
  t.is(error.message, `PERMISSION:null - ${description}`);
});
