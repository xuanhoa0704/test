(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('makeRange', makeRange);

    function makeRange() {
        return rangeFilter;

        function rangeFilter(input) {
            var lowBound, highBound;
            switch (input.length) {
                case 1:
                    lowBound = 0;
                    highBound = parseInt(input[0]) - 1;
                    break;
                case 2:
                    lowBound = parseInt(input[0]);
                    highBound = parseInt(input[1]);
                    break;
                default:
                    return input;
            }
            var result = [];
            for (var i = lowBound; i <= highBound; i++)
                result.push(i);
            return result;
        }
    }
})();