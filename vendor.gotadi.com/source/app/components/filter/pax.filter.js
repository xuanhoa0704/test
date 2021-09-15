(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('pax', pax);

    pax.$inject = ['$log', 'GlobalSrv'];

    function pax($log, GlobalSrv) {
        return paxFilter;

        function paxFilter(input, type) {
            var result;

            if (type === 'adult') {
                result = 0;
                angular.forEach(input, function(item) {
                    result += parseInt(item.adultNo);
                });
            } else if (type === 'child') {
                result = 0;
                angular.forEach(input, function(item) {
                    result += item.paxDetails.length;
                });

            } else {
                // default is # of rooms
                result = input.length;
            }

            return result;
        }
    }
})();