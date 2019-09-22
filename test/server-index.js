const chai = require('chai');
const server = require('../server/index');
const {APPNAME, VERSION} = require('../config');
const sinon = require('sinon');
const axios = require('axios');

const assert = chai.assert;

describe('server', function() {
  describe('GET /', function() {
    it(`should return ${APPNAME} v${VERSION}`, async function() {
      const res = await server.inject({method: 'GET', url: '/'});

      assert.equal(res.statusCode, 200);
      assert.equal(res.payload, `{"APPNAME":"${APPNAME}","VERSION":"${VERSION}"}`);
    });
  });

  // describe('POST /email', function() {
  //   it(`should `, async function() {
  //     const res = await server.inject(
  //         {
  //           method: 'POST',
  //           url: '/email',
  //           payload: {
  //             to: 'to@email.com',
  //             to_name: 'user-to',
  //             from: 'from@email.com',
  //             from_name: 'user-from',
  //             subject: 'Test subject',
  //             body: '<b>test email</b>',
  //           },
  //         }
  //     );
  //     console.log('Res', res);
  //     // assert.equal(res.statusCode, 200);
  //     // assert.equal(res.payload, `{"APPNAME":"${APPNAME}","VERSION":"${VERSION}"}`);
  //   });
  // });
});
