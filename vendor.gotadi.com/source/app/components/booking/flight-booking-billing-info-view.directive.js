(function() {
    'use strict';

    gtdFlightBookingBillingInfoViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdFlightBookingBillingInfoViewController($log, $scope, MetaData, Flight) {
        var ctrl = this;
        $log.log('ctrl.bookingModel4 : ');
        if (ctrl.bookingModel) {
            ctrl.bookingModel.bookingInfo.taxPersonalInfoContact = angular.fromJson(ctrl.bookingModel.bookingInfo.taxPersonalInfoContact);
        }
        $log.log(ctrl.bookingModel);
    }

    var gtdFlightBookingBillingInfoView = {
        templateUrl: 'app/components/booking/flight-booking-billing-info-view.html',
        controller: gtdFlightBookingBillingInfoViewController,
        bindings: {
            bookingModel: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingBillingInfoView', gtdFlightBookingBillingInfoView);

})();