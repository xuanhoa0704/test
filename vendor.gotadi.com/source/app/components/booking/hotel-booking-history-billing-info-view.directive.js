(function() {
    'use strict';

    gtdHotelBookingHistoryBillingInfoViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdHotelBookingHistoryBillingInfoViewController($log, $scope, MetaData, Flight) {
        var ctrl = this;
        $log.log('ctrl.bookingModel4 : ');
        if (ctrl.bookingModel) {
            ctrl.bookingModel.bookingInfo.taxPersonalInfoContact = angular.fromJson(ctrl.bookingModel.bookingInfo.taxPersonalInfoContact);
        }
        $log.log(ctrl.bookingModel);
    }

    var gtdHotelBookingHistoryBillingInfoView = {
        templateUrl: 'app/components/booking/hotel-booking-history-billing-info-view.html',
        controller: gtdHotelBookingHistoryBillingInfoViewController,
        bindings: {
            bookingModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingHistoryBillingInfoView', gtdHotelBookingHistoryBillingInfoView);

})();