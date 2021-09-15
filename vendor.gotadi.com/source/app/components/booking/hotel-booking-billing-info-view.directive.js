(function() {
    'use strict';

    gtdHotelBookingBillingInfoViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdHotelBookingBillingInfoViewController($log, $scope, MetaData, Flight) {
        var ctrl = this;
    }

    var gtdHotelBookingBillingInfoView = {
        templateUrl: 'app/components/booking/hotel-booking-billing-info-view.html',
        controller: gtdHotelBookingBillingInfoViewController,
        bindings: {
            bookingModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingBillingInfoView', gtdHotelBookingBillingInfoView);

})();