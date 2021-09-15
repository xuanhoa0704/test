(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('lookupt', lookupt);

    lookupt.$inject = ['$log', 'GlobalSrv', 'DataService', '$translate', '$filter'];

    function lookupt($log, GlobalSrv, DataService, $translate, $filter) {
        return lookuptFilter;

        function lookuptFilter(input, domain, obj) {
            var result = input;

            if (!input) {
                return '';
            }

            if (obj) {
                result = $translate.instant($filter('lowercase')(domain + "." + obj + "." + input));
            } else {
                result = $translate.instant($filter('lowercase')(domain + "." + input));
            }


            return result;
        }
    }
})();