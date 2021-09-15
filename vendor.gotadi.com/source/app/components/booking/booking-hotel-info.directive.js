(function() {
    'use strict';

    gtdBookingHotelInfoController.$inject = ['$log', '$scope', 'MetaData', 'Flight', 'LoginService', 'Principal'];

    function gtdBookingHotelInfoController($log, $scope, MetaData, Flight, LoginService, Principal) {
        var ctrl = this;

        ctrl.isAuthenticated = Principal.isAuthenticated;

        ctrl.openLogin = function() {
            LoginService.open();
        };
    }

    var gtdBookingHotelInfo = {
        templateUrl: 'app/components/booking/booking-hotel-info.html',
        controller: gtdBookingHotelInfoController,
        bindings: {
            bookingModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdBookingHotelInfo', gtdBookingHotelInfo);

})();