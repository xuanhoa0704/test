(function() {
    'use strict';

    gtdFlightBookingSummaryDetailsController.$inject = ['$log', '$scope', 'DataService', 'MetaData', 'Flight'];

    function gtdFlightBookingSummaryDetailsController($log, $scope, DataService, MetaData, Flight) {
        var ctrl = this;

        $log.log("ctrl.bookingModel=");
        $log.log(ctrl.bookingModel);

        if (!ctrl.searchOptions) {
            ctrl.searchOptions = DataService.getSearchOption();
        }
    }

    var gtdFlightBookingSummaryDetails = {
        templateUrl: 'app/components/booking/flight-booking-summary-details.html',
        controller: gtdFlightBookingSummaryDetailsController,
        bindings: {
            bookingModel: '=',
            paymentModel: '=?',
            searchOptions: '=?',
            showCoupon: '=?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingSummaryDetails', gtdFlightBookingSummaryDetails);

})();