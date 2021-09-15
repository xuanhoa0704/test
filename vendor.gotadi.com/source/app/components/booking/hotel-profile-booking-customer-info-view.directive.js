(function() {
    'use strict';

    gtdHotelProfileBookingCustomerInfoViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdHotelProfileBookingCustomerInfoViewController($log, $scope, MetaData, Flight) {
        var ctrl = this;
    }

    var gtdHotelProfileBookingCustomerInfoView = {
        templateUrl: 'app/components/booking/hotel-profile-booking-customer-info-view.html',
        controller: gtdHotelProfileBookingCustomerInfoViewController,
        bindings: {
            bookingModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelProfileBookingCustomerInfoView', gtdHotelProfileBookingCustomerInfoView);

})();