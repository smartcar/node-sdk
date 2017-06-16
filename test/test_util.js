'use strict';

const expect = require('chai').use(require('dirty-chai')).expect;

const config = require('../lib/config');
const util = require('../lib/util');

const VALID_VID = 'valid-vid';
const API_URL = config.api + '/v' + config.version;

suite('Util', function() {

  test('setExpiration', function() {
    const access = {expires_in: 7200}; // eslint-disable-line camelcase
    const expected = Date.now() + (7200 * 1000);

    util.setExpiration(access);

    expect(access.expiration).to.be.a('string');
    const actual = Date.parse(access.expiration);
    expect(actual).to.be.within(expected - 100, expected + 100);
  });

  test('getUrl with id and endpoint', function() {
    const url = util.getUrl(VALID_VID, 'odometer');
    expect(url).to
    .equal(API_URL + '/vehicles/' + VALID_VID + '/odometer');
  });

  test('getUrl with no id or endpoint', function() {
    const url = util.getUrl();
    expect(url).to.equal(API_URL + '/vehicles');
  });

});
