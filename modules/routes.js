/**
 * Defines routes for the app
 * @module routes
 *
 *  @requires     NPM:@hapi/Joi
*/

const Joi = require('@hapi/joi');
const handlers = require('./handlers');

const routes = [
  {// default root route
    method: 'GET',
    path: '/',
    options: {
      handler: handlers.default,
      description: 'Default route. Returns appname and version',
      tags: ['api'],
    },
  },

  {// healthcheck route
    method: 'GET',
    path: '/healthcheck',
    options: {
      handler: handlers.healthCheck,
      description: 'Ordinary health check route',
      tags: ['api'],
    },
  },

  {// a private route for testing the circuit breaker
    method: 'POST',
    path: '/mock-test-circuitbreaker-failover',
    options: {
      handler: handlers.testCircuitBreaker,
      description: 'Route used for testing the circuitbreaker by test suite',
    },
  },

  {// POST /email with validation of input payload
    method: 'POST',
    path: '/email',
    options: {
      handler: handlers.email,
      description: 'Handle requests for sending an email',
      tags: ['api'],
      validate: {
        payload: Joi.object({
          to: Joi.string().email().required(),
          to_name: Joi.string().required(),
          from: Joi.string().email().required(),
          from_name: Joi.string().required(),
          subject: Joi.string().required(),
          body: Joi.string().required(),
        }).label('Email'),
      },
      response: {
        schema: Joi.object({
          status: Joi.number(),
          message: Joi.string(),
        }).label('Response'),
      },
    },
  },
];

module.exports = routes;

