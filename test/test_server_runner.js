/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-disable no-console */
var cp = require('child_process')
var request = require('request')

function TestServer(port) {
  this.port = port;
  this.url = 'http://127.0.0.1:' + port;
  this.server = null;
}

function waitLoop(testServer, url, cb) {
  request(
    url + '/',
    function (err, res/*, body*/) {
      if (err) {
        if (err.errno !== 'ECONNREFUSED') {
          console.log('ERROR: unexpected result from ' + url)
          console.log(err)
          return cb(err)
        }
        return setTimeout(waitLoop.bind(null, testServer, url, cb), 100)
      }
      if (res.statusCode !== 200) {
        console.log('ERROR: bad status code: ' + res.statusCode)
        return cb(res.statusCode)
      }
      return cb()
    }
  )
}

TestServer.prototype.start = function (cb) {
  if (!this.server) {
    var spawnOptions = ['./test_server.js'];
    console.log('running', spawnOptions);
    this.server = cp.spawn(
      'node',
      spawnOptions,
      {
        cwd: __dirname,
        stdio: 'inherit'
      }
    );
  }

  waitLoop(this, this.url, function (err) {
    if (err) {
      cb(err)
    } else {
      cb(null)
    }
  });
}

TestServer.prototype.stop = function () {
  if (this.server) {
    this.server.kill('SIGINT');
  }
};

module.exports = TestServer
