'use strict';

if(!process.addAsyncListener)
    require('async-listener');

var stack = require('./lib/stack');


Error.stackTraceLimit = Infinity;

var stackSeparator = 'From previous event:';
var currentStack = null;


/**
 * AsyncListener object
 */
var AsyncListener = {};


AsyncListener.create = function create() {
    // This always gets called in between before/after
    var trace = {};
    Error.captureStackTrace(trace, create);
    trace.name = stackSeparator;
    return stack(trace.stack, currentStack);
};


AsyncListener.before = function before(context, stack) {
    currentStack = stack;
};


AsyncListener.after = function after() {
    currentStack = null;
};


AsyncListener.error = function error(stack, err) {
    if (stack) {
        err.stack += '\n' + stack.getStacks().join('\n');
    }
};


var key = process.addAsyncListener(AsyncListener);


module.exports = key;
module.exports.stackSeparator = stackSeparator;