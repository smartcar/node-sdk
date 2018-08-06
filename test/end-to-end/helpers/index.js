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

helpers.startBrowser = function(client, browser, authUrl, done) {
  const email = chance.email({domain: 'smartcar.com'});
  /* istanbul ignore next */
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
    // grant dialog is rendered and submitted
    .waitForElementVisible('div[class=permissions]', 10000)
    .click('button[id=approval-button]')
    .end();

  client.start(done);
};

module.exports = helpers;
