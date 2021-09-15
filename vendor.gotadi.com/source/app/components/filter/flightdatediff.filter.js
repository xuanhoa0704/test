(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('flightdatediff', flightdatediff);

    flightdatediff.$inject = ['$log'];

    function flightdatediff($log) {
        return flightdatediffFilter;

        function flightdatediffFilter(originDestinationOption) {
            var result = '';

            var originDateTime = moment.utc(originDestinationOption.originDateTime.substr(0, 10), 'YYYY-MM-DD');
            var destinationDateTime = moment.utc(originDestinationOption.destinationDateTime.substr(0, 10), 'YYYY-MM-DD');

            var datediff = destinationDateTime.diff(originDateTime, 'days');

            // $log.log(originDateTime + ":" + destinationDateTime + ":" + datediff);

            if (datediff > 0) {
                result = '+' + datediff;
            }

            return result;
        }
    }
})();