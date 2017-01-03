'use strict';

var expect = require('chai').use(require('dirty-chai')).expect;
var util = require('../lib/util');
var config = require('../lib/config');

var VALID_VID = 'valid-vid';
var API_URL = config.api + '/v' + config.version;

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
    var url = util.getUrl(VALID_VID, 'odometer');
    expect(url).to
    .equal(API_URL + '/vehicles/' + VALID_VID + '/odometer');
  });

  test('getUrl with no id or endpoint', function() {
    var url = util.getUrl();
    expect(url).to.equal(API_URL + '/vehicles');
  });

});
