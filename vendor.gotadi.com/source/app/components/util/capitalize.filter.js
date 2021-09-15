(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('capitalize', capitalize);

    capitalize.$inject = ['$log'];

    function capitalize($log) {
        return capitalizeFilter;

        function capitalizeFilter(input) {
            // if (input) {
            //     input = input.toLowerCase();
            //     input = input.substring(0, 1).toUpperCase() + input.substring(1);
            // }
            // return input;
            return (input) ? input.split(' ').map(function(wrd) {
                return wrd.charAt(0).toUpperCase() + wrd.substr(1).toLowerCase();
            }).join(' ') : '';

        }
    }
})();