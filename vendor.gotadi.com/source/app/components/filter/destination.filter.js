(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('destination', destination);

    destination.$inject = ['$log', 'GlobalSrv'];

    function destination($log, GlobalSrv) {
        return destinationFilter;

        function destinationFilter(input, type) {
            var result = input;

            var data = GlobalSrv.getLocalDestinations();
            data.forEach(function(item) {
                if (item.code == input) {
                    result = item.name;
                }
            });

            return result;
        }
    }
})();