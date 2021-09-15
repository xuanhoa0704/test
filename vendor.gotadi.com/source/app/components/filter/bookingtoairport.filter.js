(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('bookingtoairport', bookingtoairport);

    bookingtoairport.$inject = ['$log'];

    function bookingtoairport($log) {
        return function(input, type) {
            if (input) {
                var arr = input.split("::");
                var fromTo = arr[1];

                var locArr = fromTo.split("-");


                if (type == 'F') {
                    return locArr[0];
                } else if (type == 'T') {
                    return locArr[1];
                }
            }
            return input;


        };
    }
})();