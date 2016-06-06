'use strict';

require('angular');

var helloWorldComponent = require('./helloWorld.component');

module.exports = angular.module('helloWorld', [])
    .component('helloWorld', helloWorldComponent);