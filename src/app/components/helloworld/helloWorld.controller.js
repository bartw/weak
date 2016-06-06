'use strict';

module.exports = function HelloWorldController() {
    var helloWorldController = this;

    helloWorldController.reverse = function() {
        return helloWorldController.name ? helloWorldController.name.split('').reverse().join('') : '';
    };
};