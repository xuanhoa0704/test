(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('diffprice', diffprice);

    diffprice.$inject = ['$log', 'GlobalSrv'];

    function diffprice($log, GlobalSrv) {
        return diffpriceFilter;

        function diffpriceFilter(input, base) {
            var result = 0;

            if (!base) {
                base = 0;
            }

            result = input - base;

            return result;
        }
    }
})();