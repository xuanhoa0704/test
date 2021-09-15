(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('RequestUtils', RequestUtils);

    RequestUtils.$inject = ['$log', '$filter', '$httpParamSerializer'];

    function RequestUtils($log, $filter, $httpParamSerializer) {

        var service = {
            buildUrl: buildUrl
        };

        return service;

        function buildUrl(baseUrl, params) {
            return baseUrl + "?" + $httpParamSerializer(params);
        }

    }

})();