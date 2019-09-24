/**
 * Module for EmailService microservice.
 * EmailService starts up the express app and listens on specified PORT.
 * Config items are passed in to initialize the app.
 * Handles sending email via one of the SERVICES passed in and fails over
 * to another.* round-robined to accept requests.
 * @module EmailService
*/

const striptags = require('striptags');
const CircuitBreaker = require('./CircuitBreaker');

/** Class representing the EmailService. */
class EmailService {
  /**
     *
     * @constructor
     */
  constructor() {
    // list of services
    this.services = [];
  }

  /**
   * @param  {object} config
   */
  init(config) {
    // setup CircuitBreaker with the provided timeout threshold
    this.circuitBreaker = new CircuitBreaker({timeout: config.TIMEOUT});

    config.SERVICES.forEach((service) => {
      // TODO we can build an endpoint to query this object to see if any service is down
      const obj = {};

      switch (service) {
        case 'mailgun':
          obj.service = require('./services/MailGun')(
              {
                key: config.MAILGUN_API,
                domain: config.MAILGUN_DOMAIN,
              }
          );
          break;

        case 'mailjet':
          obj.service = require('./services/MailJet')({key: config.MAILJET_API});
          break;

        default:
          console.error(`Unknown service: ${service}`);
      }

      if (Object.keys(obj).length) {
        console.log(`Registered ${obj.service.getName()} service`);
        obj.status = 'active';
        this.services.push(obj);
      }
    });
  }

  /** Whatever formatting we need on the data
   *
   * @param  {object} data
   * @return {object} data formatted
   *
   */
  format(data) {
    data = this.cleanTags(data);
    // add any more formatting required...

    return data;
  }

  /** Strip out html from the body
   * @param  {object} data
   * @return {object} data
   */
  cleanTags(data) {
    data.body = striptags(data.body, ['<p>'], '\n');
    return data;
  }

  /** send email using an email service
   * @param  {object} data
   * @return {boolean} true or false
   */
  async send(data) {
    // run the data thru any formatting needed
    data = this.format(data);

    let i = 0;
    const len = this.services.length;

    // loop thru list of services, if one sends then we stop
    while (i < len) {
      const serviceRequest = this.services[i].service.buildRequest(data);

      // use circuitbreaker for sending api request and deal with failover
      const res = await this.circuitBreaker.callService(serviceRequest);
      // debug('TCL: EmailService -> send -> res', res);

      // TODO handle rate limits by the service
      // TODO log email request and response
      // TODO make sure no email fails

      // if successfully called this service then exit loop
      if (res) {
        console.log('code', res.statusCode);
        if (res.statusCode === 200) {
          if (this.services[i].service.isSuccess(res.data)) {
            const msg = `Sent using ${this.services[i].service.getName()}`;
            return {status: true, message: msg};
          }
        }
      }

      // otherwise the service failed, try the next one
      this.services[i].status = 'inactive';
      i++;
    }
    // all services failed :(
    return {status: false, message: 'No email service is active'};
  }
}

// export EmailService as a singleton
module.exports = new EmailService();
