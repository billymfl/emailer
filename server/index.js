/**
 *  @fileOverview Entrypoint for simple-microservice-template, following the 12 factor app
 *  design methodology.
 *
 *  @author       Billy Marin
 *
 *  @requires     NPM:dotenv
 *  @requires     NPM:@hapi/hapi
 *
 */

const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const routes = require('../modules/routes');
const EmailService = require('../modules/EmailService');

// load the config
const {NODE_ENV, APPNAME, VERSION, PORT, HOST, SERVICES,
  MAILGUN_API, MAILGUN_DOMAIN, MAILJET_API, _error} = require('../config');

// if there is a missing required or misconfigured env vars then we should exit
if (_error !== undefined) {
  console.error(_error);
  process.exit(1);
}

console.log(`${APPNAME} v${VERSION} is starting in ${NODE_ENV} mode...`);
const server = new Hapi.Server({port: PORT, host: HOST});

// build swagger doc, at GET /documentation
const swaggerOptions = {
  info: {
    title: 'API Documentation',
    version: VERSION,
    description: 'Emailer microservice API',
  },
  schemes: ['http', 'https'], // http for testing
  reuseDefinitions: false,
};

const init = async () => {
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  const config = {
    SERVICES,
    MAILGUN_API,
    MAILGUN_DOMAIN,
    MAILJET_API,
  };
  EmailService.init(config);

  // when requiring this file for testing the server shouldn't be started
  if (!module.parent) {
    try {
      await server.start();
    } catch (err) {
      console.error(`Server startup error: ${err.message}`);
    }
    console.log('Server listening on %s', server.info.uri);
  }

  server.route(routes);
  // other init...
};

if (NODE_ENV !== 'test') {
  process.on('unhandledRejection', async (err) => {
    console.error(`unhandledRejection: ${err}`);
    await server.stop();
    process.exit(1);
  });
}

init();

// for testing the server
module.exports = server;
