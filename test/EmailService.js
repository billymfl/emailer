const chai = require('chai');
// const chaiHttp = require('chai-http');

const assert = chai.assert;
// const expect = chai.expect;
// chai.use(chaiHttp);

const {SERVICES, MAILGUN_API, MAILGUN_DOMAIN, MAILJET_API} = require('../config');

describe('new EmailService()', function() {
  let EmailService;

  const data = {
    to: 'TtoHIS.com',
    to_name: 'user-to',
    from: 'Ffrom@THIS.com',
    from_name: 'user-from',
    subject: 'A test message',
    body: '<h1>Your Bill</h1><p>$10</p>',
  };

  before(function() {
    // runs before all tests in this block
    // const config = {NODE_ENV, APPNAME, VERSION, PROVIDERS, KEYS, PORT: 85};
    EmailService = require('../modules/EmailService');
  });

  it('should be a singleton', function() {
    const EmailService2 = require('../modules/EmailService');
    if (!Object.is(EmailService, EmailService2)) {
      assert.fail('Not same object');
    }
  });

  it('should init the EmailService with config', function() {
    const config = {SERVICES, MAILGUN_API, MAILGUN_DOMAIN, MAILJET_API};
    EmailService.init(config);
    assert.isNotEmpty(EmailService.services);
  });

  it('should format the body by stripping out html', function() {
    const result = EmailService.format({body: data.body});
    assert.equal(result.body, '\nYour Bill\n\n$10\n');
  });
});
