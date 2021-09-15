(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('VNPayQRPaymentController', VNPayQRPaymentController);

    VNPayQRPaymentController.$inject = ['$log', '$rootScope', '$scope', '$window', '$interval', '$state', '$stateParams', '$timeout', '$sce', 'Auth', 'Base64', 'Hotel', 'DataService', 'CustomerService', 'DialogService', 'Flight', 'FlightUtils', 'PricingUtils'];

    function VNPayQRPaymentController($log, $rootScope, $scope, $window, $interval, $state, $stateParams, $timeout, $sce, Auth, Base64, Hotel, DataService, CustomerService, DialogService, Flight, FlightUtils, PricingUtils) {
        var vm = this;
        vm.bookingModel = {
            voucher: {},
            departGroupItem: {},
            departPricedItinerary: {},
            departItinTotalFare: {},
            returnGroupItem: {},
            returnPricedItinerary: {},
            returnItinTotalFare: {}
        };
        //---
        vm.bookingModel.curStep = 1;

        vm.paymentModel = {};
        vm.paymentModel.cardModel = {};
        vm.paymentModel.cardModel.cardId = -1;

        $scope.$on('event-payment-voucher-redeem-succeeded', function(event, data) {
            if (data) {
                vm.tempVoucher = data;
            } else {
                vm.tempVoucher = {};
            }
        });

        var _booking_number_param = Base64.decodeString($stateParams.booking_number);
        vm.bookingModel.bookingNumber = _booking_number_param;
        vm.paymentModel.paymentOption = 'VNPAYQR'
        CustomerService.getBookingByNumber(_booking_number_param).then(function(result) {
            vm.bjson = result;
            vm.bookingModel = result;
            var model;
            if ($stateParams.params == "HOTEL") {
                vm.orderType = "HOTEL";
                model = Hotel;
            } else {
                vm.orderType = "FLIGHT";
                model = Flight;
            }
            vm.bjson.is_mobile = false;
            var tempDiscountAmount = 0;
            if (vm.tempVoucher && vm.tempVoucher.discountAmount) {
                tempDiscountAmount = vm.tempVoucher.discountAmount;
            }
            Flight.gPaymentFeeOpt(vm.bookingModel.bookingNumber, vm.paymentModel.paymentOption, tempDiscountAmount).then(function(result) {
                var paymentFeeOptions = result.peymentFees;

                angular.forEach(paymentFeeOptions, function(item, value) {
                    if (item.paymentType == vm.paymentModel.paymentOption) {
                        vm.bookingModel.bookingInfo.displayPriceInfo.paymentFee = item.amount;
                    }
                });
            });
            model.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(res) {
                vnpay_snippet({
                    height: 1500,
                    width: 900,
                    url: res.paymentAuthUrl
                });
            });
        }, function error(e) {
            $log.log('Error somewhere');

        });

    }
})();