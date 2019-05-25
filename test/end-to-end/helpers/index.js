'use strict';

const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const isCI = require('is-ci');
const uuid = require('uuid');
const {Builder, By, until} = require('selenium-webdriver');
const {URL} = require('url');

const helpers = {};

/* eslint-disable no-process-env */
const HEADLESS = isCI || process.env.HEADLESS;
const CLIENT_ID = process.env.INTEGRATION_CLIENT_ID;
const CLIENT_SECRET = process.env.INTEGRATION_CLIENT_SECRET;
/* eslint-enable */

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error(
    // eslint-disable-next-line max-len
    '"INTEGRATION_CLIENT_ID" and "INTEGRATION_CLIENT_SECRET" environment variables must be set'
  );
}

helpers.getAuthClientParams = () => ({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: 'https://example.com/auth',
  testMode: true,
});

const getCodeFromUri = function(uri) {
  const uriObj = new URL(uri);
  return uriObj.searchParams.get('code');
};

helpers.runAuthFlow = async function(authUrl) {
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

  // OEM Selector
  await driver.get(authUrl);
  await driver.findElement(By.css('a[data-make="TESLA"]')).click();

  // Login
  const email = `${uuid()}@email.com`;
  await driver.findElement(By.css('input[id=username]')).sendKeys(email);
  await driver.findElement(By.css('input[id=password')).sendKeys('password');
  await driver.findElement(By.css('button[id=sign-in-button]')).click();

  // Permissions
  await driver
    .wait(until.elementLocated(By.css('button[id=approval-button]')))
    .click();

  await driver.wait(until.urlContains('code='));

  const url = await driver.getCurrentUrl();
  await driver.quit();

  return getCodeFromUri(url);
};

module.exports = helpers;
