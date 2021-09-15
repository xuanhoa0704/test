(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('MobileVNPayQRSuccessController', MobileVNPayQRSuccessController);

    MobileVNPayQRSuccessController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$uibModal', '$interval', 'Flight', 'DataService', 'DateUtils', 'ValidationUtils', 'CustomerService', 'FlightUtils', 'Base64', 'DialogService', '$location'];

    function MobileVNPayQRSuccessController($log, $rootScope, $scope, $state, $stateParams, $timeout, $uibModal, $interval, Flight, DataService, DateUtils, ValidationUtils, CustomerService, FlightUtils, Base64, DialogService, $location) {
        var vm = this;
        var _booking_number_param = Base64.decodeString($stateParams.booking_number);
        //++++ initial parameter
        if (_booking_number_param) {
            CustomerService.getFinalBookingByNumber(_booking_number_param).then(function(result) {
                window.location.href = '#/mobile-booking-result?' + $stateParams.booking_number + "&booking_status=" + result.bookingInfo.status + "&payment_status=" + result.bookingInfo.paymentStatus + "&issue_status=" + result.bookingInfo.issuedStatus;
            });
        }
    }
})();