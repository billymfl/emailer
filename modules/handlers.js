/**
 * Defines handlers for the routes
 * @module handlers
 *
*/

const {APPNAME, VERSION} = require('../config');
const EmailService = require('./EmailService');

module.exports = {
  default: (request, h) => {
    return {APPNAME, VERSION};
  },

  healthCheck: (request, h) => {
    return {status: 'ok'};
  },

  testCircuitBreaker: async (request, h) => {
    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    await sleep(2000);
    return {status: 'ok'};
  },

  email: async (request, h) =>{
    // return `Hello ${request.params.name}!`;

    const data = {
      to: request.payload.to,
      toName: request.payload.to_name,
      from: request.payload.from,
      fromName: request.payload.from_name,
      subject: request.payload.subject,
      body: request.payload.body,
    };
    return await EmailService.send(data);
  },

};
