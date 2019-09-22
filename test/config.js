
// const path = require('path');
// const dotEnvPath = path.resolve('./test/.env');
// const env = require('dotenv').config({path: dotEnvPath});

const chai = require('chai');
const pkg = require('../package');
const {NODE_ENV, HOST, PORT, APPNAME, VERSION, SERVICES,
  MAILGUN_API, MAILJET_API, MAILGUN_DOMAIN, _error} = require('../config');

const assert = chai.assert;

describe('config', function() {
  // it('should not throw error', function() {
  //   assert.equal(env.error, undefined);
  // });

  it('_error should be undefined', function() {
    assert.equal(_error, undefined);
  });

  it('APPNAME value should be set from package.json', function() {
    assert.equal(APPNAME, pkg.name);
  });

  it('VERSION value should be set from package.json', function() {
    assert.equal(VERSION, pkg.version);
  });

  it('NODE_ENV value should be set to test', function() {
    assert.equal(NODE_ENV, 'test');
  });

  it('HOST value should be set', function() {
    assert.equal(HOST, '0.0.0.0');
  });

  it('PORT value should be set', function() {
    assert.equal(PORT, 88);
  });

  it('SERVICES should be an array', function() {
    assert.isArray(SERVICES);
  });

  it('SERVICES should have min of 2 SERVICES', function() {
    assert.lengthOf(SERVICES, 2);
  });

  it('MAILGUN_API should be set', function() {
    assert.isNotEmpty(MAILGUN_API);
  });

  it('MAILJET_API should be set', function() {
    assert.isNotEmpty(MAILJET_API);
  });
});
