/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var restify = require('restify');
var safeJsonFormatter = require('../');

function shutdown(code) {
  process.nextTick(process.exit.bind(null, code));
}

process.on('SIGINT', shutdown);

var server = restify.createServer({
  formatters: {
    'application/json; q=0.9': safeJsonFormatter
  }
});

server.get('/', function(req, res, next) {
  res.send({"foo": "<script>&"});
  next();
});

server.listen(9876, '127.0.0.1', function (err) {
  console.log('test server listening', err);
});
