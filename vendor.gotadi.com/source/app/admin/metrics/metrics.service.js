(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('OtaMetricsService', OtaMetricsService);

    OtaMetricsService.$inject = ['$rootScope', '$http', 'API_URL'];

    function OtaMetricsService($rootScope, $http, API_URL) {
        var service = {
            getMetrics: getMetrics,
            threadDump: threadDump
        };

        return service;

        function getMetrics() {
            return $http.get(API_URL + '/management/metrics').then(function(response) {
                return response.data;
            });
        }

        function threadDump() {
            return $http.get(API_URL + '/management/dump').then(function(response) {
                return response.data;
            });
        }
    }
})();