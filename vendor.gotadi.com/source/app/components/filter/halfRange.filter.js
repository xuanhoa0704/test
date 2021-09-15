(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('halfRange', halfRange);

    function halfRange() {
        return rangeFilter;

        function rangeFilter(input) {
            var result = [];
            angular.forEach(input, function(item) {
                if (item && item.toString().includes('.5')) {
                    result.push(1);
                }
            });
            return result;
        }
    }
})();