(function() {
    'use strict';

    gtdFlightBookingHistoryBillingInfoViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdFlightBookingHistoryBillingInfoViewController($log, $scope, MetaData, Flight) {
        var ctrl = this;
        $log.log('ctrl.bookingModel4 : ');
        if (ctrl.bookingModel) {
            ctrl.bookingModel.bookingInfo.taxPersonalInfoContact = angular.fromJson(ctrl.bookingModel.bookingInfo.taxPersonalInfoContact);
        }
        // (ctrl.bookingModel.bookingInfo.taxPersonalInfoContact)? ctrl.bookingModel.bookingInfo.taxPersonalInfoContact = angular.fromJson(ctrl.bookingModel.bookingInfo.taxPersonalInfoContact) : '';
        $log.log(ctrl.bookingModel);
    }

    var gtdFlightBookingHistoryBillingInfoView = {
        templateUrl: 'app/components/booking/flight-booking-history-billing-info-view.html',
        controller: gtdFlightBookingHistoryBillingInfoViewController,
        bindings: {
            bookingModel: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingHistoryBillingInfoView', gtdFlightBookingHistoryBillingInfoView);

})();