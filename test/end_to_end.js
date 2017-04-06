/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var assert = require('assert');
var test = require('tap').test;
var cp = require('child_process');
var TestServer = require('./test_server_runner');

var restify = require('restify');

var PORT = 9876;
var testServer = new TestServer(PORT);

test(
  'startup',
  function (t) {
    testServer.start(function (err) {
	t.type(testServer.server, 'object', 'test server was started');
      t.notOk(err, 'no errors were returned')
      t.end()
    });
  }
);

var client = restify.createJsonClient({
  url: 'http://127.0.0.1:' + PORT
});


test(
  'escapes JSON check',
  function (t) {
    client.get(
      '/',
      function (err, req, res, obj) {
        t.notOk(err, 'good request is successful')
        t.equal(res.statusCode, 200, 'good request returns a 200')
        t.equal(res.body, '{"foo":"\\u003cscript\\u003e\\u0026"}', 'returns escaped output');
        t.end();
      }
    );
  }
);

test(
  'teardown',
  function (t) {
    testServer.stop()
    t.equal(testServer.server.killed, true, 'test server has been killed')
    t.end()
  }
);
