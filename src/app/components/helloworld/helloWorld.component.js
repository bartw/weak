'use strict';

var controller = require('./helloWorld.controller');

module.exports = {
    template: require('./helloWorld.html'),
    bindings: { name: '<' },
    controller: controller
};