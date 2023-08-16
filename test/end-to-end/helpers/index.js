'use strict';

const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const isCI = require('is-ci');
const {v4: uuid} = require('uuid');
const {Builder, By, until} = require('selenium-webdriver');
const {URL} = require('url');

const helpers = {};

/* eslint-disable no-process-env */
const HEADLESS = isCI || process.env.HEADLESS;
const CLIENT_ID = process.env.E2E_SMARTCAR_CLIENT_ID;
const CLIENT_SECRET = process.env.E2E_SMARTCAR_CLIENT_SECRET;
/* eslint-enable */

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    // eslint-disable-next-line max-len
    '"E2E_SMARTCAR_CLIENT_ID" and "E2E_SMARTCAR_CLIENT_SECRET" environment variables must be set',
  );
}

helpers.DEFAULT_SCOPES = [
  'required:read_vehicle_info',
  'required:read_location',
  'required:read_odometer',
  'required:control_security',
  'required:read_vin',
  'required:read_fuel',
  'required:read_battery',
  'required:read_charge',
  'required:read_engine_oil',
  'required:read_tires',
];

helpers.getAuthClientParams = () => ({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'https://example.com/auth',
  mode: 'test',
});

const getCodeFromUri = function(uri) {
  const {searchParams} = new URL(uri);
  const code = searchParams.get('code');

  if (code) {
    return code;
  } else {
    throw new Error(
      `Did not get code in url! Query string: ${searchParams.get('error')}`,
    );
  }
};

helpers.runAuthFlow = async function(
  authUrl,
  brand = 'CHEVROLET',
  email = '',
) {
  const firefoxOptions = new firefox.Options();
  const chromeOptions = new chrome.Options()
    .addArguments('disable-infobars')
    // eslint-disable-next-line camelcase
    .setUserPreferences({credential_enable_service: false});

  if (HEADLESS) {
    firefoxOptions.headless();
    chromeOptions.addArguments('headless');
  }

  const driver = new Builder()
    .setChromeOptions(chromeOptions)
    .setFirefoxOptions(firefoxOptions)
    .forBrowser('firefox')
    .build();

  await driver.get(authUrl);

  // Preamble
  const continueButton = await driver.wait(
    until.elementLocated(
      By.css('button#continue-button'),
    ),
  );
  await continueButton.click();

  // Filter
  if (brand === 'KIA') {
    const brandInput = await driver.wait(
      until.elementLocated(
        By.css('input[id=brand-search]'),
      ),
    );
    await brandInput.sendKeys(brand);
  }

  // Brand Selector
  const brandButton = await driver.wait(
    until.elementLocated(
      By.css(`button#${brand.toUpperCase()}.brand-list-item`),
    ),
  );
  brandButton.click();

  // Login
  const signInButton = await driver.wait(
    until.elementLocated(
      By.id('sign-in-button'),
    ),
  );
  email = email || `${uuid()}@email.com`;
  await driver.findElement(By.css('input[id=username]')).sendKeys(email);
  await driver.findElement(By.css('input[id=password')).sendKeys('password');
  await signInButton.click();

  // Permissions
  await driver.sleep(5000);
  await driver.wait(until.elementLocated(By.css('.page-content')));
  await driver.findElement(By.css('button[id=approval-button]')).click();

  await driver.wait(until.urlContains('example.com'));

  const url = await driver.getCurrentUrl();
  await driver.quit();

  return getCodeFromUri(url);
};

module.exports = helpers;
