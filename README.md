
# Emailer
> Additional information or tagline

EmailService is a microservice that handles sending email via an email provider. A list of SERVICES and their API keys should be passed in. If more than one provider is passed in they will act as failovers in the order they were passed in. 

The failover is handled by a circuit breaker.

This service is meant to be run internally and consumed by other internal services so no API key is required.

* dotenv is used to load environment variables from .env file into process.env. The .env file should not be committed to a repo.
 *  The testing library are mocha and chai.
 *  Linting with eslint configured with the google style.
 *  Services used for testing are: [MailGun](https://www.mailgun.com) and [MailJet](https://www.mailjet.com). For the tests to pass set appripriate to/from email addresses. For MailGun the additional step of registering and validating a 'to' email address has to be done in their dashboard.
## Installing / Getting started

Installing locally
```bash
npm install
```

Before starting the app, view the env.example file for the required env vars that need to be setup, and create an .env file.

```bash
cp env.example .env
```

Edit the .env file and set the SERVICES and the required options for the service listed. Then start up the app.

```bash
npm start
```

Once started the service should be listening on the specified PORT and the SERVICES should be registered.

### Initial Configuration

The .env file should be configured with a list of the email api SERVICES to use for sending an email. If more than one SERVICES is listed then they will be tried in order if one of them fails.

## Developing

To add a service

```shell
git clone https://github.com/billymfl/emailer.git
cd emailer/
npm i
```

Add new services to the modules/services folder by implementing the Emailer interface. An api service must implement the following methods:
- getName() string - return the name of the service.
- buildRequest(object) object - build the request object which includes the method, url, and data used to call the service.
- isSuccess(object) bool - validate the success response we expect from the service.

Configure the service in the constructor with any api keys and other options required for the service. These should be passed in the .env file and config.js should be edited to validate the vars. See the Mailgun and Mailjet services in the services folder for examples of how to add a new service.

Make sure to add a test to the test folder for the service you added.

### Testing

```bash
npm test
```

will run the [mocha-test.sh](./mocha-test.sh) file. Edit this file to add any env vars to be used for the tests. 

To run a specific test:
```bash
npm test MailGun
```

will run just the MailGun test

### Deploying / Publishing

When running the app the required env vars must be passed via the runtime's environment (Docker, AWS, etc)

To build the docker image (set the appropriate names for app:version)

```bash
docker build -t app:version .
```

Will build the docker image app:version, with NODE_ENV var set to production.

Run an instance of the app, with ```<SERVICES>``` replaced with actual values to the services to use and provide any other config options needed for the services:
```bash
docker run --rm --name emailservice -p 80:80 -e SERVICES=<SERVICES> app:version
```

## Features

* Uses Hapi as the server, along with Hapi-Swagger to build Swagger API documentation. Run the app and go to GET /documentation to view.
* You can also do another thing
* If you get really randy, you can even do this

## Configuration

The required and optional variables the app uses. These should be placed in a .env file. When the app is loaded the file is read to validate and populate process.env with the variables. Note: As these are environment variables these can also be passed via the shell's/runtime's environment. Passing via .env file is preferred.

#### HOST
Type: `String`  
Default: `'0.0.0.0'`

The hostname. Defaults to 0.0.0.0 so it can bind to a docker container.

Example:
```bash
HOST="test.com"
```

#### PORT
Type: `Number`  
Default: 80

The port to listen on.

Example:
```bash
PORT=88
```

#### SERVICES
Type: `string`  
Default: none  
Required

Comma delimited list of email api services to use.

Example:
```bash
SERVICES=mailgun,mailjet
```

#### MAILGUN_API
Type: `string`  
Default: none  
Required if 'mailgun' is listed in SERVICES

The api key for mailgun

Example:
```bash
MAILGUN_API=abc
```

#### MAILGUN_DOMAIN
Type: `string`  
Default: none  
Required if 'mailgun' is listed in SERVICES

Your api domain for mailgun

Example:
```bash
MAILGUN_DOMAIN=blah
```

#### MAILJET_API
Type: `string`  
Default: none  
Required if 'mailjet' is listed in SERVICES

The api key for mailjet

Example:
```bash
MAILJET_API=abc
```

#### TIMEOUT
Type: `number`  
Default: 2

How long before timing out a service call, in seconds

Example:
```bash
TIMEOUT=2
```

## Links

- Repository: https://github.com/billymfl/emailer
- Issue tracker: https://github.com/billymfl/emailer/issues

## Licensing

The code in this project is licensed under MIT [license](LICENSE).
