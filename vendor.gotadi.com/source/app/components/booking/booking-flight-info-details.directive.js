(function() {
    'use strict';

    gtdBookingFlightInfoDetailsController.$inject = ['$log', '$scope', 'MetaData', 'Flight', 'LoginService', 'Principal'];

    function gtdBookingFlightInfoDetailsController($log, $scope, MetaData, Flight, LoginService, Principal) {
        var ctrl = this;

        ctrl.departFlightModel.expand = false;
        ctrl.returnFlightModel.expand = false;
        // ctrl.departFlightModel.popId = 'myPopoverTemplate.html';
        // alert(ctrl.paymentModel.paymentOption);

        ctrl.isAuthenticated = Principal.isAuthenticated;

        ctrl.openLogin = function() {
            LoginService.open();
        };
    }

    var gtdBookingFlightInfoDetails = {
        templateUrl: 'app/components/booking/booking-flight-info-details.html',
        controller: gtdBookingFlightInfoDetailsController,
        bindings: {
            bookingModel: '=',
            departFlightModel: '=',
            returnFlightModel: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdBookingFlightInfoDetails', gtdBookingFlightInfoDetails);

})();