/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

var restify = require('restify');


/*
 * Unicode escape <, >, & as \u003c, \u003e, \u0026 respectively to
 * keep some browsers misinterpreting it as HTML.
 */
module.exports = function formatSafeJson(req, res, body, cb) {
  restify.formatters['application/json; q=0.4'](req, res, body, function (err, data) {

    data = data.replace(/</g, '\\u003c')
               .replace(/>/g, '\\u003e')
               .replace(/&/g, '\\u0026');

    res.setHeader('Content-Length', Buffer.byteLength(data));
    return cb(null, data);
  });
};
