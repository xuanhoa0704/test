(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('airline', airline);

    airline.$inject = ['$log', 'GlobalSrv', 'DataService', 'MetaData'];

    function airline($log, GlobalSrv, DataService, MetaData) {
        return airlineFilter;

        function airlineFilter(input, type) {
            var result = input;

            var allAirlines = DataService.getAllAirlines();
            if (allAirlines == null || allAirlines == undefined || allAirlines) {
                MetaData.getAirlines().then(function success() {
                    allAirlines = DataService.getAllAirlines();
                });
            }
            $log.log(allAirlines);

            allAirlines.forEach(function(item) {
                if (item.code == input) {
                    result = item.name;
                }
            });

            return result;
        }
    }
})();