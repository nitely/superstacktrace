var assert = require("assert");
var domain = require('domain');

require('..');
var stackSeparator = require('..').stackSeparator;


describe('Stack trace test suite', function(){

    it("works with normal throw", function() {
        var foo = function() {
            throw new TypeError("foo bar baz");
        };

        assert.throws(foo, "foo bar baz");
    });

    it("works with io operation", function(done) {
        var fs = require('fs');
        fs.readFile('not_there.txt', 'utf8', function(err, text) {
            assert.equal(err instanceof Error, true);
            assert.equal(err.stack, 'Error: ENOENT: no such file or directory, open \'not_there.txt\'\n    at Error (native)');
            done();
        });
    });

    it("tracks frames across async operations", function(done) {
        var d = domain.create();

        d.on('error', function(err) {
            //
            // IMPORTANT: if this does not passes, the trace shows the first error (Unhandled error!...)
            // we ca probably wrap this and show the last stack, or find what's up with this event
            //
            assert.equal(err.stack.split(stackSeparator).length, 2);
            done();
        });

        d.run(function() {
            process.nextTick(function() {
                throw new Error('Unhandled error!');
            });
        });
    });

    it("remove previous frames from unhandled errors", function(done) {
        var d = domain.create();

        d.on('error', function(err) {
            assert.equal(err.stack.split(stackSeparator).length, 2);
            done();
        });

        d.run(function() {
            process.nextTick(function() {
                throw new Error('Unhandled error!');
            });
        });
    });

    it("traces frames across async calls in nested functions", function(done) {
        var d = domain.create();

        d.on('error', function(err) {
            assert.equal(err.stack.split(stackSeparator).length, 2);
            done();
        });

        d.run(function() {
            process.nextTick(function() {
                function nested(){
                    throw new Error('Unhandled error!');
                }
                nested();
            });
        });
    });

    it("traces frames across async calls in nested functions", function(done) {
        var d = domain.create();

        d.on('error', function(err) {
            assert.equal(err.stack.split(stackSeparator).length, 3);
            done();
        });

        d.run(function() {
            process.nextTick(function() {
                process.nextTick(function() {
                    function nested(){
                        throw new Error('Unhandled error!');
                    }
                    nested();
                });
            });
        });
    });

    it("traces frames across async calls in nested functions", function(done) {
        var d = domain.create();

        d.on('error', function(err) {
            assert.equal(err.stack.split(stackSeparator).length, 3);
            done();
        });

        d.run(function() {
            process.nextTick(function() {
                process.nextTick(function() {
                    function nested(){
                        throw new Error('Unhandled error!');
                    }
                    nested();
                });
            });
        });
    });

    it("traces its own frames not others", function(done) {
        var d = domain.create();

        d.on('error', function(err) {
            assert.equal(err.stack.split(stackSeparator).length, 3);
            done();
        });

        d.run(function() {
            process.nextTick(function() {
                // ...
            });

            process.nextTick(function() {
                process.nextTick(function() {
                    // ...
                });

                process.nextTick(function() {
                    function nested(){
                        throw new Error('Unhandled error!');
                    }
                    nested();
                });

                process.nextTick(function() {
                    // ...
                });
            });

            process.nextTick(function() {
                // ...
            });
        });
    });

});