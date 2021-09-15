(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('hotelprice', hotelprice);

    hotelprice.$inject = ['$log', 'GlobalSrv'];

    function hotelprice($log, GlobalSrv) {
        return hotelpriceFilter;

        function hotelpriceFilter(input) {
            var result = 0;
            if (input) {
                result = Math.min.apply(Math, input.map(function(item) {
                    return item.price;
                }));
            }

            return result;
        }
    }
})();