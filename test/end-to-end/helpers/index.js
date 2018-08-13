'use strict';

const Promise = require('bluebird');
const querystring = require('querystring');
const uuid = require('uuid');

const helpers = {};

helpers.getAuthClientParams = function() {
  return {
    // eslint-disable-next-line no-process-env
    clientId: process.env.INTEGRATION_CLIENT_ID,
    // eslint-disable-next-line no-process-env
    clientSecret: process.env.INTEGRATION_CLIENT_SECRET,
    redirectUri: 'https://example.com/auth',
    development: true,
  };
};

const getCodeFromUri = function(uri) {
  // this helper functions assumes the structure of the uri
  // is valid and contains the required code
  const firstIndexOfParams = uri.indexOf('?') + 1;
  const params = uri.substring(firstIndexOfParams);

  return querystring.parse(params).code;
};

helpers.runAuthFlow = function(client, browser, authUrl) {
  const email = `${uuid()}@email.com`;

  let code = '';
  return new Promise((resolve) => {
    browser
      .url(authUrl)
      .waitForElementVisible('div[class=content]', 3000)
      .click('a[href^="https://mock.smartcar.com"]')
      // login dialog is rendered
      .waitForElementVisible('input[id=username]', 3500)
      // add username/password and submit
      .setValue('input[id=username]', email)
      .setValue('input[id=password]', 'password')
      .click('button[id=approval-button]')
      // wait for permissions and approve
      .waitForElementVisible('div[class=permissions]', 5000)
      .click('button[id=approval-button]')
      .url((currentUrl) => {
        // extract code from callback url
        code = getCodeFromUri(currentUrl.value);
      })
      .end();

    client.start(() => {
      resolve(code);
    });
  });
};

module.exports = helpers;
