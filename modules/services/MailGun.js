/*
* @module MailGun
*/
const Emailer = require('./Emailer');
const qs = require('qs');

// reference to us
let instance;

// the response from the api signifying success
const success = {
  message: 'Queued. Thank you.',
};

/** Class representing the MailGun API using Emailer interface. */
class MailGun extends Emailer {
  /**
   * constructor for MailGun
   * @param {object} config must pass in 'domain' and api 'key'
     */
  constructor(config) {
    super();

    if (config.key === '') {
      throw Error('MAILGUN key cannot be empty');
    }

    if (config.domain === '') {
      throw Error('MAILGUN domain cannot be empty');
    }

    this.host = `https://api.mailgun.net/v3/${config.domain}/messages`;
    this.key = config.key;
  }

  /**
   * @return {string} name of service
   */
  getName() {
    return 'MailGun';
  }

  /** buildRequest builds the settings for sending a request to MailGun API
   * @param  {object} data Config options
   * @return {Object} the request config
   *
   * curl -s --user 'api:YOUR_API_KEY' \
    https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages \
    -F from='Excited User <mailgun@YOUR_DOMAIN_NAME>' \
    -F to=YOU@YOUR_DOMAIN_NAME \
    -F to=bar@example.com \
    -F subject='Hello' \
    -F text='Testing some Mailgun awesomeness!'

    Response:
    {
    "message": "Queued. Thank you.",
    "id": "<20111114174239.25659.5817@samples.mailgun.org>"
    }
   */
  buildRequest(data) {
    // msg format used by this service
    const msg = {
      from: `${data.fromName} <${data.from}>`,
      to: data.to,
      subject: data.subject,
      text: data.body,
    };

    return {
      method: 'POST',
      url: this.host,
      auth: {
        username: 'api',
        password: this.key,
      },
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: qs.stringify(msg),
    };
  }

  /** isSuccess checks for successful response from the api
   * @param  {object} response
   * @return {boolean}
   */
  isSuccess(response) {
    return response.message === success.message;
  }
}

// export as Singleton
module.exports = (config) => {
  if (!instance) {
    instance = new MailGun(config);
  }
  return instance;
};

