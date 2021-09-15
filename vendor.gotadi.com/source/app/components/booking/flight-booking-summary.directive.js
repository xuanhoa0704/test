(function() {
    'use strict';

    gtdFlightBookingSummaryController.$inject = ['$log', '$rootScope', '$scope', 'MetaData', 'Flight', 'DataService'];

    function gtdFlightBookingSummaryController($log, $rootScope, $scope, MetaData, Flight, DataService) {
        var ctrl = this;

        // $log.log("ctrl.bookingModel=");
        // $log.log(ctrl.bookingModel);

        if (!ctrl.searchOptions) {
            ctrl.searchOptions = DataService.getSearchOption();
        }

        /**
         * validate voucher
         */
        ctrl.validateVoucher = function() {
            ctrl.wrongVoucher = false;
            var myDataPromise = Flight.validateVoucher(ctrl.bookingModel);
            myDataPromise.then(function(result) {
                var voucher = result;
                ctrl.bookingModel.voucher = voucher;

                $log.log('voucher.voucherValid = ' + voucher.voucherValid);

                //send data to process data
                $rootScope.$broadcast("event-payment-voucher-redeem-succeeded", voucher);

                if (!voucher.voucherValid) {
                    ctrl.wrongVoucher = true;
                }

            }, function error(result) {
                ctrl.bookingModel.voucher = {};
                $log.log(result);

                ctrl.wrongVoucher = true;
            });
        };

        /**
         * Handle redeem invalid
         */
        $scope.$on('event-payment-voucher-redeem-invalid', function(event, item) {
            ctrl.wrongVoucher = true;
        });

        /**
         * Handle voucher reset
         */
        $scope.$on('event-payment-voucher-reset', function(event, item) {
            ctrl.wrongVoucher = false;
        });

        /**
         * Handle before sending data to server
         */
        $scope.$on('event-payment-voucher-pre-send-data', function(event, item) {
            ctrl.wrongVoucher = false;
        });
    }

    var gtdFlightBookingSummary = {
        templateUrl: 'app/components/booking/flight-booking-summary.html',
        controller: gtdFlightBookingSummaryController,
        bindings: {
            bookingModel: '=',
            paymentModel: '=?',
            searchOptions: '=?',
            bjson: '=',
            showCoupon: '=?',
            showPriceCoupon: '=?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingSummary', gtdFlightBookingSummary);

})();