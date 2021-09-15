(function() {
    'use strict';

    gtdHotelBookingSummaryController.$inject = ['$log', '$rootScope', '$scope', 'MetaData', 'Hotel', 'Flight', 'Principal', 'DialogService', 'LoginService'];

    function gtdHotelBookingSummaryController($log, $rootScope, $scope, MetaData, Hotel, Flight, Principal, DialogService, LoginService) {
        var ctrl = this;

        $log.log("ctrl.bookingModel=");
        $log.log(ctrl.bookingModel);
        $log.log(ctrl.selectedHotelProduct);

        $log.log('step = ' + ctrl.bookingModel.step);

        if (ctrl.selectedHotelProduct) {
            ctrl.selectedHotelProduct.totalPerson = 0;
            ctrl.selectedHotelProduct.totalAdultQuantity = 0;
            if (ctrl.selectedHotelProduct.rooms) {
                ctrl.selectedHotelProduct.rooms.forEach(function(room) {

                    //+++ keep productCode for add to customer
                    room.productCode = room.id;
                    //---

                    ctrl.selectedHotelProduct.totalPerson += room.pax.adultQuantity + room.pax.childQuantity;
                    ctrl.selectedHotelProduct.totalAdultQuantity += room.pax.adultQuantity;

                });
            }
        }
        $scope.$on('vali-payment-promo', function(event, item) {
            ctrl.promoDiscount = item;
        });

        /**
         * validate voucher
         */
        ctrl.validateVoucher = function() {
            if (ctrl.bookingModel.voucher.voucherCode != null && !Principal.isAuthenticated()) {
                var message = {};
                message.title = 'Rất tiếc';
                message.message = 'Khuyến mãi này chỉ áp dụng cho thành viên của Gotadi. Vui lòng đăng nhập hoặc đăng ký để hưởng khuyến mãi và nhiều ưu đãi khác.';
                var modalInstance = DialogService.openDialogForceLogin(message);

                modalInstance.closed.then(
                    function() {
                        LoginService.open();
                    }
                );
                return;
            }
            ctrl.wrongVoucher = false;
            var myDataPromise = Flight.validateVoucher(ctrl.bookingModel);
            myDataPromise.then(function(result) {
                var voucher = result;
                ctrl.bookingModel.voucher = voucher;
                ctrl.bjson.voucher = voucher;

                $log.log('voucher.voucherValid = ' + voucher.voucherValid);

                //send data to process data
                $rootScope.$broadcast("event-payment-voucher-redeem-succeeded", voucher);

                if (!voucher.voucherValid) {
                    ctrl.wrongVoucher = true;
                }

            }, function error(result) {
                ctrl.bookingModel.voucher = {};
                ctrl.bjson.voucher = {};
                $log.log(result);

                ctrl.wrongVoucher = true;
            });
        };

        $scope.$on('update-promo-select-success', function(event, value) {
            $log.log('update-promo-select-success');
            ctrl.promoSelect = true;
            ctrl.bookingModel.voucher = {};
            ctrl.bjson.voucher = {};
            if (value == "PERCENT") {
                ctrl.typePriceDiscount = "%";
            } else {
                ctrl.typePriceDiscount = "VNĐ";
            }
        });
        $scope.$on('update-promo-remove-success', function(event, value) {
            $log.log('update-promo-remove-success');
            ctrl.promoSelect = false;
            ctrl.promoDiscount = 0;
            ctrl.bookingModel.voucher = {};
            ctrl.bjson.voucher = {};
            ctrl.beyondQuota = false;
        });
        /**
         * Handle redeem invalid
         */
        $scope.$on('event-payment-voucher-redeem-invalid', function(event, item) {
            if (item.textMessage === "PC1406") {
                ctrl.beyondQuota = true;
                return;
            }
            ctrl.beyondQuota = false;
            ctrl.wrongVoucher = true;
        });

        /**
         * Handle voucher reset
         */
        $scope.$on('event-payment-voucher-reset', function(event, item) {
            ctrl.wrongVoucher = false;
            ctrl.beyondQuota = false;
        });

        /**
         * Handle before sending data to server
         */
        $scope.$on('event-payment-voucher-pre-send-data', function(event, item) {
            ctrl.wrongVoucher = false;
            ctrl.beyondQuota = false;
        });

    }

    var gtdHotelBookingSummary = {
        templateUrl: 'app/components/booking/hotel-booking-summary.html',
        controller: gtdHotelBookingSummaryController,
        bindings: {
            bookingModel: '=',
            bjson: '=',
            paymentModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '=',
            showCoupon: '=?',
            showPriceCoupon: '=?',
            promoSelect: '=?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingSummary', gtdHotelBookingSummary);

})();