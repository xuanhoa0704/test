(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('country', country);

    country.$inject = ['$log', 'GlobalSrv', 'DataService'];

    function country($log, GlobalSrv, DataService) {
        return countryFilter;

        function countryFilter(input) {
            var result = input;

            var data = GlobalSrv.getAllCountries();
            data.forEach(function(item) {
                // $log.log(item.code + ":" + input + ":" + (item.code == input));
                if (item.code == input) {
                    result = item.name;
                }
            });

            return result;
        }
    }
})();