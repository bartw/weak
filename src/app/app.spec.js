'use strict';

require('./app.js');

describe('app', function() {
    beforeEach(angular.mock.module('app'));

    describe('with $compile', function() {
        var $compile, $rootScope, element, scope;

        beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));
        
        beforeEach(function() {
            scope = $rootScope.$new();
            element = angular.element('<hello-world name="name"></hello-world>');
            element = $compile(element)(scope);
            scope.name = 'bart';
            scope.$apply();
        });

        describe('Controller: helloWorld', function() {
            var controller;
            beforeEach(function() {
                controller = element.controller('helloWorld');
            });

            it('should reverse', function() {
                controller.name = 'bart';
                expect(controller.reverse()).toBe('trab');
            });
        });
    });
});