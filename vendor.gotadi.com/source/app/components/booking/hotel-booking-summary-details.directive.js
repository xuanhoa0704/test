(function() {
    'use strict';

    gtdHotelBookingSummaryDetailsController.$inject = ['$log', '$scope', 'DataService', 'MetaData', 'Hotel'];

    function gtdHotelBookingSummaryDetailsController($log, $scope, DataService, MetaData, Hotel) {
        var ctrl = this;

        $log.log("ctrl.bookingModel=");
        $log.log(ctrl.bookingModel);

        ctrl.searchOptions = DataService.getHotelSearchOptions();
        $scope.$on('update-promo-select-success', function(event, value) {
            $log.log('update-promo-select-success');
            ctrl.promoSelect = true;
            if (value == "PERCENT") {
                ctrl.typePriceDiscount = "%";
            } else {
                ctrl.typePriceDiscount = "VNĐ";
            }
        });
        $scope.$on('update-promo-remove-success', function(event, value) {
            $log.log('update-promo-remove-success');
            ctrl.promoSelect = false;
        });
    }

    var gtdHotelBookingSummaryDetails = {
        templateUrl: 'app/components/booking/hotel-booking-summary-details.html',
        controller: gtdHotelBookingSummaryDetailsController,
        bindings: {
            bookingModel: '=',
            bjson: '=',
            paymentModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '=',
            showCoupon: '=?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingSummaryDetails', gtdHotelBookingSummaryDetails);

})();