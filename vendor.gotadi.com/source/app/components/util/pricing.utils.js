(function() {
    /*jshint bitwise: false*/
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('PricingUtils', PricingUtils);

    PricingUtils.$inject = ['$log', '$filter'];

    function PricingUtils($log, $filter) {

        var service = {
            getTotalPricing: getTotalPricing,
            getHotelTotalPricing: getHotelTotalPricing
        };

        return service;

        function getTotalPricing(booking) {
            var price = 0;

            if (booking) {
                angular.forEach(booking.groupPricedItineraries, function(group) {
                    price += group.pricedItineraries[0].airItineraryPricingInfo.itinTotalFare.totalFare.amount;
                });
            }

            return price;
        }

        function getHotelTotalPricing(booking) {
            var price = 0;

            $log.log('PricingUtils.getHotelTotalPricing: bookingModel=');
            $log.log(booking);

            if (booking) {
                // price = booking.bookingInfo.displayPriceInfo.totalFare;

                price = $filter('bookingPriceInfo')(booking, 'total_price');
            }

            return price;
        }
    }
})();