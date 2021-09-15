(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('split', split);

    split.$inject = [];

    function split() {
        return function(input, idx) {
            if (input) {
                var arr = input.split("::");
                return arr[idx];
            } else {
                return input;
            }

        };
    }
})();