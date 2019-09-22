const chai = require('chai');
const assert = chai.assert;
const {MAILGUN_API, MAILGUN_DOMAIN} = require('../config');

describe('new MailGun() service', function() {
  // eslint-disable-next-line no-unused-vars
  let Mailgun;

  before(function() {
    // runs before all tests in this block
    const config = {key: MAILGUN_API, domain: MAILGUN_DOMAIN};
    MailGun = require('../modules/services/MailGun')(config);
  });

  it('should be a singleton', function() {
    const MailGun2 = require('../modules/services/MailGun')({key: 'x', domain: 'x'});
    if (!Object.is(MailGun, MailGun2)) {
      assert.fail('Not same object');
    }
  });

  it('should return the service name', function() {
    const name = MailGun.getName();
    assert.equal(name, 'MailGun');
  });

  it('should build the send request for mailgun', function() {
    const msg = {
      from: 'from@yahoo.com',
      fromName: 'user-from',
      to: 'to@yahoo.com',
      toName: 'user-to',
      subject: 'Hello',
      body: 'Testing Mailgun',
    };

    const request = MailGun.buildRequest(msg);

    const expected = {
      method: 'POST',
      url: `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      auth: {
        username: 'api',
        password: MAILGUN_API,
      },
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      // eslint-disable-next-line max-len
      data: 'from=user-from%20%3Cfrom%40yahoo.com%3E&to=to%40yahoo.com&subject=Hello&text=Testing%20Mailgun',
    };

    assert.deepEqual(request, expected);
  });

  it('should have correct success response', function() {
    const res = {message: 'Queued. Thank you.'};
    const bool = MailGun.isSuccess(res);
    assert.equal(bool, true);
  });
});

