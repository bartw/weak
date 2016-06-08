'use strict';

require('./helloWorld.less');
require('angular');

var helloWorldComponent = require('./helloWorld.component');

module.exports = angular.module('helloWorld', [])
    .component('helloWorld', helloWorldComponent);