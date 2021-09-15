(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('cc', cc);

    cc.$inject = ['$log'];

    function cc($log) {
        return ccFilter;

        function ccFilter(input) {
            var result = input;

            var orig = input;
            var edited = orig;
            result = edited.slice(4).replace(/\d/g, 'x') + edited.slice(-4);

            return result;
        }
    }
})();