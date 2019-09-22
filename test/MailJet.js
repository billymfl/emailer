const chai = require('chai');
const assert = chai.assert;
const {MAILJET_API} = require('../config');

describe('new MailJet() service', function() {
  // eslint-disable-next-line no-unused-vars
  let MailJet;

  before(function() {
    // runs before all tests in this block
    const config = {key: MAILJET_API};
    MailJet = require('../modules/services/MailJet')(config);
  });

  it('should be a singleton', function() {
    const MailJet2 = require('../modules/services/MailJet')({key: 'x:y'});
    if (!Object.is(MailJet, MailJet2)) {
      assert.fail('Not same object');
    }
  });

  it('should return the service name', function() {
    const name = MailJet.getName();
    assert.equal(name, 'MailJet');
  });

  it('should build the send request for mailjet', function() {
    const msg = {
      from: 'from@yahoo.com',
      fromName: 'user-from',
      to: 'to@yahoo.com',
      toName: 'user-to',
      subject: 'Hello',
      body: 'Testing Mailgun',
    };

    const request = MailJet.buildRequest(msg);

    const arr = MAILJET_API.split(':');
    const [user, pass] = arr;

    const expected = {
      method: 'POST',
      url: MailJet.host,
      auth: {username: user, password: pass},
      headers: {'content-type': 'application/json'},
      data: {
        Messages: [{From: {Email: 'from@yahoo.com', Name: 'user-from'},
          To: [{Email: 'to@yahoo.com', Name: 'user-to'}],
          Subject: 'Hello',
          TextPart: 'Testing Mailgun',
          HTMLPart: 'Testing Mailgun',
          CustomID: 'AppGettingStartedTest'}],
      },
    };

    assert.deepEqual(request, expected);
  });

  it('should have correct success response', function() {
    const res = {Messages: [{Status: 'success'}]};
    const bool = MailJet.isSuccess(res);
    assert.equal(bool, true);
  });
});

