(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('airport', airport);

    airport.$inject = ['$log', 'GlobalSrv'];

    function airport($log, GlobalSrv) {
        return airportFilter;

        function airportFilter(input, type) {
            var result = input;

            var data = GlobalSrv.getLocalAirports();
            data.forEach(function(item) {
                if (item.code == input) {
                    if (type == 'city') {
                        result = item.city;
                    } else if (type == 'name') {
                        result = item.name;
                    } else if (type == 'city-code') {
                        result = item.city + ' (' + item.code + ')';
                    } else if (type == 'name-code') {
                        result = item.name + ' (' + item.code + ')';
                    } else {
                        result = item.code;
                    }
                }
            });

            return result;
        }
    }
})();