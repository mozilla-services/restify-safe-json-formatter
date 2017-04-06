A restify formatter that unicode escapes <, >, & as \u003c, \u003e,
\u0026 respectively to keep some browsers from misinterpreting it as
HTML.


Usage:

```js
var restify = require('restify');
var safeJsonFormatter = require('restify-safe-json-formatter');

var server = restify.createServer({
  formatters: {
    'application/json; q=0.9': safeJsonFormatter
  }
});
```


See also: [the example server](example/server.js)
