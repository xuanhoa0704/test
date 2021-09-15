(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('BookingPaymentExternalController', BookingPaymentExternalController);

    BookingPaymentExternalController.$inject = ['$log', '$state', 'Base64', 'Flight'];

    function BookingPaymentExternalController($log, $state, Base64, Flight) {

        var vm = this;

        vm.parram = $state.params;
        vm.bookingNumber = vm.parram.bookingNumber;
        vm.merchant = vm.parram.merchant;
        vm.backUrl = vm.parram.backUrl;
        vm.data = vm.parram.data;
        vm.key = vm.parram.key;
        vm.agent_site = vm.parram.agent_site;

        // Controller methods
        vm.initController = initController;

        vm.initController();

        function initController() {
            Flight.lienVietPayment(vm.data, vm.key, vm.agent_site).then(
                function(response) {
                    // TODO: Handle redirect to result paage with back button.
                    // /products/external-final-booking-detail?booking_number:partner_id

                    if (response.success) {
                        $state.go('external-booking-detail', {
                            "booking_number": vm.bookingNumber,
                            "partner_id": 'LIENVIETBANK',
                            "back_url": response.result.replace(/['"]+/g, '')
                        });
                    } else {
                        $state.go('external-booking-detail', {
                            "booking_number": vm.bookingNumber,
                            "partner_id": 'LIENVIETBANK',
                            "back_url": response.result.replace(/['"]+/g, ''),
                            "error_code": response.textMessage
                        });
                    }

                },
                function(error) {

                }
            );
        }

    }
})();