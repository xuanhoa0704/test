(function() {
    'use strict';

    gtdFlightBookingSummaryDetailsItemController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdFlightBookingSummaryDetailsItemController($log, $scope, MetaData, Flight) {
        var ctrl = this;

        //+++ using displayPriceInfo to display additional_price
        if (ctrl.pricedItinerary && ctrl.bookingModel && ctrl.bookingModel.bookingInfo && ctrl.bookingModel.bookingInfo.displayPriceInfo) {
            ctrl.pricedItinerary.displayPriceInfo = ctrl.bookingModel.bookingInfo.displayPriceInfo;
        }
        //--
        // $log.log("+++++>>>>> gtdFlightBookingSummaryDetailsItemController");
    }

    var gtdFlightBookingSummaryDetailsItem = {
        templateUrl: 'app/components/booking/flight-booking-summary-details-item.html',
        controller: gtdFlightBookingSummaryDetailsItemController,
        bindings: {
            groupItem: '=',
            pricedItinerary: '=',
            itinTotalFareInfo: '=',
            searchOptions: '=?',
            flightIdx: '@?',
            bookingModel: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingSummaryDetailsItem', gtdFlightBookingSummaryDetailsItem);

})();