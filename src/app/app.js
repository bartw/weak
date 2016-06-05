require('angular');

angular.module('app', [])
    .component('helloWorld', {
        template: '<div ng-show="$ctrl.name"><span>Hey what\'s up {{$ctrl.name}}?</span> <span>{{$ctrl.reverse()}}</div>',
        bindings: { name: '<' },
        controller: function() {
            var ctrl = this;
            
            ctrl.reverse = function() {
                return ctrl.name ? ctrl.name.split('').reverse().join('') : '';
            };
        }
    });