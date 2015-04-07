# Super stack trace

[![Build Status](https://img.shields.io/travis/nitely/superstacktrace/master.svg?style=flat-square)](https://travis-ci.org/nitely/superstacktrace)
[![npm](https://img.shields.io/npm/v/superstacktrace.svg?style=flat-square)](https://www.npmjs.com/package/superstacktrace)

It provides support for “long stack traces,” wherein the `stack` property of `Error` rejection reasons
is rewritten to be traced along asynchronous jumps instead of stopping at the most recent one.

The heavy lifting is made by [async-listener](https://github.com/othiym23/async-listener),
which is a polyfill for an experimental API that had a short-life in node.js (v0.11.x only) and was removed.


# Installation

```
$ npm install superstacktrace
```

Tested on latest [iojs](https://iojs.org)

# Example

```javascript
require('superstacktrace');

// That's it.
```

Stack trace example:

```
Error: Unhandled error!
    at /home/user/project/test/test.js:166:23
    at /home/user/project/node_modules/async-listener/glue.js:188:31
    at process._tickDomainCallback [as _tickCallback] (node.js:366:13)
From previous event:
    at asyncWrap (/home/user/project/node_modules/async-listener/glue.js:150:28)
    at wrapCallback (/home/user/project/node_modules/async-listener/glue.js:401:35)
    at process.nextTick (/home/user/project/node_modules/async-listener/index.js:16:26)
    at myNestedFunction [as _onTimeout] (/home/user/project/test/test.js:165:25)
    at Timer.listOnTimeout (timers.js:89:15)
```

> There are some lines including the async-listener library, I thought about filtering them,
but then I realise, if that's the real cause of the error it would be hidden.

# Running tests

```
$ mocha
```

## License

MIT