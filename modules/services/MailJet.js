/*
* @module MailJet
*/

const Emailer = require('./Emailer');

// reference to us
let instance;

// the response from the api signifying success
const success = {
  Messages: [
    {Status: 'success'},
  ],
};

/** Class representing the MailJet API using the Emailer interface. */
class MailJet extends Emailer {
  /**
   * constructor for MailJet
   * @param {object} config
     */
  constructor(config) {
    super();

    if (config.key === '') {
      throw Error('MAILJET key cannot be empty');
    }

    // key comes in as user:pass
    const key = config.key.split(':');
    if (key.length !== 2) {
      throw Error('MAILJET API is missing user or password');
    } else if (key[0] === '' || key[1] === '') {
      throw Error('MAILJET API is has empty user or password');
    }

    this.host = 'https://api.mailjet.com/v3.1/send';
    this.user = key[0];
    this.pass = key[1];
  }

  /**
   * @return {string} name of service
   */
  getName() {
    return 'MailJet';
  }

  /** buildRequest builds the settings for sending a request to MailJet API
   * @param  {object} data Config options
   * @return {Object} the request settings
   *
   * Request:
   *
   * curl -s \
-X POST \
--user "f6a1d0013020ed6c97595784d219f455:f63753b5812e7c64714b21ec5a5a2f9a" \
https://api.mailjet.com/v3.1/send \
-H 'Content-Type: application/json' \
-d '{
  "Messages":[
    {
      "From": {
        "Email": "from@yahoo.com",
        "Name": "from name"
      },
      "To": [
        {
          "Email": "to@yahoo.com",
          "Name": "to name"
        }
      ],
      "Subject": "My first Mailjet email",
      "TextPart": "Greetings from Mailjet.",
      "HTMLPart": "<h3>Hi, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
}'
* Response:
{
  "Messages": [
    {
      "Status": "success",
      "To": [
        {
        "Email": "passenger1@mailjet.com",
        "MessageUUID": "123",
        "MessageID": 456,
        "MessageHref": "https://api.mailjet.com/v3/message/456"
        }
      ]
     }
  ]
}
   */
  buildRequest(data) {
    const obj = [
      {
        'From': {
          'Email': data.from,
          'Name': data.fromName,
        },
        'To': [
          {
            'Email': data.to,
            'Name': data.toName,
          },
        ],
        'Subject': data.subject,
        'TextPart': data.body,
        'HTMLPart': data.body,
        'CustomID': 'AppGettingStartedTest',
      },
    ];

    return {
      method: 'POST',
      url: this.host,
      auth: {
        username: this.user,
        password: this.pass,
      },
      headers: {'content-type': 'application/json'},
      data: {'Messages': obj},
    };
  }

  /** isSuccess checks for successful response from the api
   * @param  {object} response
   * @return {boolean}
   */
  isSuccess(response) {
    return response.Messages[0].Status === success.Messages[0].Status;
  }
}

// export as Singleton
module.exports = (config) => {
  if (!instance) {
    instance = new MailJet(config);
  }
  return instance;
};

