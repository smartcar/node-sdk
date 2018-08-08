'use strict';

const Chance = require('chance');

const chance = new Chance();

const helpers = {};

helpers.getAuthClientParams = function() {
  return {
    clientId: 'e922556a-7d4f-4168-88cd-059276044798',
    clientSecret: '79c07401-d3b2-48c0-8407-dc19c4ece7ff',
    redirectUri: 'http://localhost:4040/callback',
    development: true,
  };
};

const getCodeFromUrl = function(uri) {
  // this helper functions assumes the structure of the uri
  // is valid and contains the code required
  const firstIndexOfParams = uri.indexOf('?') + 1;
  const params = uri.substring(firstIndexOfParams);

  for (const param of params.split('&')) {
    const [code, value] = param.split('=');
    if (code === 'code') {
      return value;
    }
  }
};

helpers.runTest = function(client, browser, authUrl, test, done) {
  const email = chance.email({domain: 'smartcar.com'});
  /*
  * (todo Karthik) remove the pauses
  * we will use pause here to allow for the callback to execute
  * until we can neatly run an async nightwatch callback
  **/
  browser
    .url(authUrl)
    .waitForElementVisible('div[class=content]', 1000)
    .click('a[href^="https://mock.smartcar.com"]')
    // login dialog is rendered
    .waitForElementVisible('input[id=username]', 1500)
    // add username/password and submit
    .setValue('input[id=username]', email)
    .setValue('input[id=password]', 'password')
    .click('button[id=approval-button]')
    .url((currentUrl) => {
      if (currentUrl.value.startsWith('http://localhost:4040/callback')) {
        // if we have skipped the permissions, we can extract the code
        test(getCodeFromUrl(currentUrl.value));
        browser
          .pause(5000)
          .end();
      } else {
        // we still have to wait for and accept the permissions before
        // we can extract the code from the callback url
        browser
          .waitForElementVisible('div[class=permissions]', 5000)
          .click('button[id=approval-button]')
          .url((currentUrl) => {
            test(getCodeFromUrl(currentUrl.value));
          })
          .pause(5000)
          .end();
      }
    });

  client.start(done);
};

module.exports = helpers;
