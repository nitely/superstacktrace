'use strict';


var proto = {};


proto.init = function init(stack, parent) {
    this.stack = stack;
    this.parent = parent;
    return this;
};


proto.getStacks = function getStacks() {
    var stacks = [this.stack];
    var parent = this.parent;

    while (true) {
        if (!parent) {
            break;
        }

        stacks.push(parent.stack);
        parent = parent.parent;
    }

    return stacks;
};


function stackFactory(stack, parent) {
    return Object.create(proto).init(stack, parent);
}


module.exports = stackFactory;
module.exports.stack = proto;