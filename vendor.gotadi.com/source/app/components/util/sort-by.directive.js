(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('jhSortBy', jhSortBy);

    jhSortBy.$inject = ['$log'];

    function jhSortBy($log) {
        var directive = {
            restrict: 'A',
            scope: false,
            require: '^jhSort',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs, parentCtrl) {
            element.bind('click', function() {
                parentCtrl.sort(attrs.jhSortBy);
            });
        }
    }
})();