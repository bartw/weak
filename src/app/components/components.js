'use strict';

require('angular');

var HelloWorld = require('./helloworld/helloWorld');

angular.module('app.components', [
    HelloWorld.name
]);

module.exports = angular.module('app.components');