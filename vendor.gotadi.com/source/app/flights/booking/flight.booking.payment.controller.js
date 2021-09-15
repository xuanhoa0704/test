(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightBookingPaymentController', FlightBookingPaymentController);

    FlightBookingPaymentController.$inject = ['$window', '$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$interval', '$uibModal', 'Principal', 'Flight', 'Hotel', 'DataService', 'CustomerService', 'DialogService', 'ValidationUtils', 'FlightUtils', 'Base64', '$cookies', '$filter', '$sce', 'gtdFormPayment3D', 'PricingUtils', 'AuthServerProvider'];

    function FlightBookingPaymentController($window, $log, $rootScope, $scope, $state, $stateParams, $timeout, $interval, $uibModal, Principal, Flight, Hotel, DataService, CustomerService, DialogService, ValidationUtils, FlightUtils, Base64, $cookies, $filter, $sce, gtdFormPayment3D, PricingUtils, AuthServerProvider) {
        var vm = this;

        vm.departFlightModel = DataService.getDepartFlight();
        vm.returnFlightModel = DataService.getReturnFlight();

        vm.paymentModel = {};
        vm.bjson = {};
        vm.bjson.bookingInfo = {};

        $log.log('booking payment - $stateParams - booking number:' + $stateParams.booking_number);

        /**
         *
         * @param _booking_number_param
         * @private
         */
        vm._loadBookingInfo = function(_booking_number_param) {
            CustomerService.getBookingByNumber(_booking_number_param).then(function(result) {

                vm.bjson = result;
                $log.log("++ vm.bjson ++ ");
                $log.log(vm.bjson);

                var oldVm = FlightUtils.convertBookingToVM(result);
                if (oldVm && oldVm.orgBookingModel && oldVm.orgBookingModel.bookingInfo) {
                    // Check status
                    $log.log('vm.orgBookingModel=');
                    $log.log(oldVm.orgBookingModel);

                    var bookingStatus = oldVm.orgBookingModel.bookingInfo.status;
                    var paymentStatus = oldVm.orgBookingModel.bookingInfo.paymentStatus;
                    var issueStatus = oldVm.orgBookingModel.bookingInfo.issuedStatus;
                    var supplierBookingStatus = oldVm.orgBookingModel.bookingInfo.supplierBookingStatus;
                    $log.log('bookingStatus=' + bookingStatus + ", paymentStatus = " + paymentStatus + ", issuedStatus = " + issueStatus + ", supplierBookingStatus = " + supplierBookingStatus);

                    if (bookingStatus == 'PENDING') {
                        $log.log('GOTO - flight-search');
                        $state.go('flight-search', {
                            "searchOptions": vm.searchOptions,
                            "searchResult": vm.searchResult,
                            "params": Base64.encodeJson(vm.searchOptions)
                        });

                    } else if (bookingStatus == 'BOOKED') {
                        if (paymentStatus == 'PENDING' || paymentStatus == 'FAILED') {
                            // ok
                            $log.log('VIEW - booking-payment');
                        } else {
                            $log.log('GOTO - booking-result');
                            $state.go('booking-result/:booking_number/:is_mobile/:params', {
                                "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber),
                                "is_mobile": vm.paymentModel.isMobileApp ? 'mobile' : ''
                            });
                        }
                    } else {
                        $log.log('GOTO - booking-result');
                        $state.go('booking-result/:booking_number/:is_mobile/:params', {
                            "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber),
                            "is_mobile": vm.paymentModel.isMobileApp ? 'mobile' : ''
                        });
                    }

                    vm.bookingModel = oldVm.orgBookingModel;
                    vm.searchOptions = oldVm.searchOptions;
                    vm.bookingModel.curStep = 3;

                    // BACK 2U
                    DataService.setBookingModel(vm.bookingModel);
                    DataService.setSearchOption(vm.searchOptions);

                    $timeout(function() {
                        $rootScope.$broadcast("gtd-load-booking-completed", null);
                    }, 1000);

                    vm.profileBooking = {};
                    vm.profileBooking = vm.bookingModel;


                    $scope.start();
                } else {
                    $log.log('++++ Booking Not FOUND - GOTO - flight');
                    $state.go('flight-search-home');
                }
            }, function error(result) {
                $log.log('GOTO - flight-search');
                $state.go('flight-search', {
                    "searchOptions": vm.searchOptions,
                    "searchResult": vm.searchResult,
                    "params": Base64.encodeJson(vm.searchOptions)
                });
            });
        };


        /**
         * Process main logic
         */
        if ($stateParams.booking_number) {
            //++++ initial parameter
            var _booking_number_param = Base64.decodeString($stateParams.booking_number);
            //---

            $log.log("flight.booking.payment - LOADING - _booking_number_param: " + _booking_number_param);
            vm._loadBookingInfo(_booking_number_param);

        } else {
            $log.log('++++ NO Booking Number - GOTO - flight');
            $state.go('flight-search-home');
        }

        /**
         * NAM.HUYNHPHUONG - Mobile payment
         */
        vm.paymentModel.isMobileApp = false;
        if ($stateParams.is_mobile) {
            //++++ initial parameter
            if ($stateParams.is_mobile === 'mobile') {
                var _is_mobile = true;
                $log.log("_is_mobile = " + _is_mobile);
                vm.paymentModel.isMobileApp = _is_mobile;
            }

            if ($stateParams.payment_method) {
                //++++ initial parameter
                var _payment_method = $stateParams.payment_method;
                $log.log("_payment_method = " + _payment_method);
                vm.paymentModel.paymentOption = _payment_method;
            }
        }


        //+++ handle authentication event
        $rootScope.$on('authenticationSuccess', function() {
            var isBookingConfirmStage = $state.is('booking-payment/:booking_number/:params');
            $log.log("flight.booking.payment - IS booking-payment/:booking_number/:params: " + isBookingConfirmStage);

            var _bookingNumber = DataService.getBookingModel().bookingNumber;

            if (isBookingConfirmStage && _bookingNumber) {
                $log.log("flight.booking.payment - authenticationSuccess --- Checking.... ");

                //step 1:
                $log.log("flight.booking.payment - CHANGE BOOKING OWNER - vm.bookingModel.bookingNumber: " + _bookingNumber);
                Flight.changeDraftBookingOwner(_bookingNumber).then(function(result) {
                    $log.log("flight.booking.payment - changeDraftBookingOwner result: " + result);

                    //step 2:
                    $log.log("flight.booking.payment - RELOAD - vm.bookingModel.bookingNumber: " + _bookingNumber);
                    vm._loadBookingInfo(_bookingNumber);

                }, function error(result) {
                    $log.log('GOTO - flight-search');
                    $state.go('flight-search', {
                        "searchOptions": vm.searchOptions,
                        "searchResult": vm.searchResult,
                        "params": Base64.encodeJson(vm.searchOptions)
                    });
                });
            }
        });
        //---

        vm.departFlightModel = DataService.getDepartFlight();
        vm.returnFlightModel = DataService.getReturnFlight();
        // vm.paymentModel = DataService.getPaymentModel();

        vm.profileBooking = {};
        vm.profileBooking = vm.bookingModel;

        /**
         * reset voucher event
         */
        $scope.$on('event-payment-voucher-reset', function(event, item) {
            vm.bookingModel.voucher = {};
        });

        /**
         * Handler IssueTicket from Popup payment for ATM_DEBIT
         */
        $scope.$on('IssueTicket', function(event, item) {
            //+++ show waiting message
            vm.openLoading();
            //---

            Flight.orderTickets(vm.bookingModel)
                .then(function(result1) {
                    $log.log("Get Flight.orderTickets()");
                    $log.log(result1);

                    vm.paymentModel.payFailed = !result1.success;
                    DataService.setPaymentModel(vm.paymentModel);

                    $rootScope.$broadcast("event-flight-load-completed", null);

                    if (vm.paymentModel.isMobileApp) {
                        CustomerService.getFinalBookingByNumber(DataService.getBookingModel().bookingNumber).then(function(result) {
                            var oldVm = FlightUtils.convertBookingToVM(result);
                            if (oldVm && oldVm.orgBookingModel && oldVm.orgBookingModel.bookingInfo) {
                                var bookingStatus = oldVm.orgBookingModel.bookingInfo.status;
                                var paymentStatus = oldVm.orgBookingModel.bookingInfo.paymentStatus;
                                var issueStatus = oldVm.orgBookingModel.bookingInfo.issuedStatus;
                                $state.go('mobile-booking-result?:booking_status&:payment_status&:issue_status', {
                                    'booking_status': bookingStatus,
                                    'payment_status': paymentStatus,
                                    'issue_status': issueStatus
                                });
                            }
                        });
                    }

                    // Go to
                    $state.go('booking-result/:booking_number/:is_mobile/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                        "is_mobile": vm.paymentModel.isMobileApp ? 'mobile' : '',
                        "params": ''
                        // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
                    });
                }, function error(result1) {
                    // Go to
                    // $state.go('hotel-booking-result');
                    $log.log("error orderTickets");
                    //$log.log(JSON.stringify(result1));
                    $log.log(result1);

                    // DialogService.openHttpAlertDilalog(result1);
                    vm.paymentModel.payFailed = true;
                    DataService.setPaymentModel(vm.paymentModel);

                    $rootScope.$broadcast("event-flight-load-completed", null);

                    //$state.go('booking-result');
                    $state.go('booking-result/:booking_number/:is_mobile/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                        "is_mobile": vm.paymentModel.isMobileApp ? 'mobile' : '',
                        "params": ''
                        // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
                    });
                });
        });

        /**
         *
         */
        $scope.$on('DoPaymentWith3DAuthConfirmation', function(event, item) {
            $log.log("DoPaymentWith3DAuth - " + item);
            vm.paymentModel.paToken = item;

            vm.doPayment();
        });

        /**
         * Process Redeem --> Payment and issue ticket
         */
        vm.doConfirm = function() {
            DataService.setPaymentModel(vm.paymentModel);
            // Do redeem
            // Check need to do redeem
            if (vm.bookingModel.voucher) {
                $log.log('vm.bookingModel.voucher.voucherValid = ' + vm.bookingModel.voucher.voucherValid);
            }

            //send event before revalidate voucher
            $rootScope.$broadcast("event-payment-voucher-pre-send-data", null);

            if (vm.bookingModel.voucher && vm.bookingModel.voucher.voucherValid) {
                $log.log("Payment::doConfirm - process redeem booking...");
                Flight.redeemVoucher(vm.bookingModel).then(function success(result) {
                    if (result.redeemValid && result.success) {
                        $log.log('Payment::doConfirm - result.redeemValid = ' + result.redeemValid + ", result.success = " + result.success);
                        vm.doPayment();
                    } else {
                        $log.log("Payment::doConfirm - payment voucher redeem invalid...");
                        $rootScope.$broadcast("event-payment-voucher-redeem-invalid", result);
                    }
                }, function error(result) {
                    $log.log("Payment::doConfirm - payment voucher redeem error...");
                    $rootScope.$broadcast("event-payment-voucher-redeem-invalid", result);
                });
            } else if (vm.paymentModel.promotions && vm.paymentModel.promotions !== null) {
                if ((typeof vm.paymentModel.cardModel.chosenCardNumber !== "undefined") && vm.paymentModel.cardModel.chosenCardNumber !== null && vm.paymentModel.cardModel.chosenCardNumber !== '' && vm.paymentModel.cardModel.chosenCardNumber !== "-1" && vm.paymentModel.cardModel.chosenCardNumber !== -1) {
                    var s = (vm.paymentModel.cardModel.chosenCardNumber).slice(0, 7).toUpperCase();
                    if (s === "XXXX-XX") {
                        var errorLog = {
                            status: 406,
                            data: {
                                message: $filter('translate')('flight.booking.payment.addnewCard')
                            }
                        }
                        DialogService.openHttpAlertDilalog(errorLog);
                        vm.paymentModel.cardModel.chosenCardNumber = -1;
                        return;
                    }
                    vm.paymentModel.cardModel.cardNumber = vm.paymentModel.cardModel.chosenCardNumber;
                }
                Flight.redeemPromo(vm.paymentModel, vm.bookingModel).then(function success(result) {
                    if (result.errorCode === "PC1000" || result.errorCode === "PC1100" && result.success) {
                        $log.log('Payment::doConfirm - result.redeemValid = ' + result.redeemValid + ", result.success = " + result.success);
                        vm.doPayment();
                    } else {
                        var errorLog = {};
                        if (result.errorCode === 'PC1002') { //no active
                            Flight.gPaymentPromotion(vm.bookingModel.supplierType, "PUBLISHING", 0, 20).then(function(result_n) {
                                if (result_n.content) {
                                    vm.paymentModel.paymentPromo = result_n.content;
                                }
                            });
                        }
                        if (result.errorCode === 'PC1003') {
                            errorLog = {
                                status: result.errorCode,
                                data: {
                                    message: $filter('translate')('flight.booking.payment.wrongCard')
                                }
                            }
                            vm.paymentModel.cardModel.cardNumber = '';
                            vm.paymentModel.cardModel.chosenCardNumber = -1;
                        }
                        if (result.errorCode === 'PC406') {
                            errorLog = {
                                status: result.errorCode,
                                data: {
                                    message: 'Số vé khuyến mãi trong ngày đã hết, quý khách vui lòng thực hiện giao dịch sau.'
                                }
                            }
                        }
                        if (result.errorCode === 'PC407') {
                            errorLog = {
                                status: result.errorCode,
                                data: {
                                    message: 'Vui lòng đăng nhập để được hưởng ưu đãi.'
                                }
                            }
                        }
                        if (result.errorCode === 'PC408') {
                            errorLog = {
                                status: result.errorCode,
                                data: {
                                    message: 'Số vé khuyến mãi trong ngày đã hết, quý khách vui lòng thực hiện giao dịch sau.'
                                }
                            }
                        }
                        if (result.errorCode === 'PC1010') {
                            errorLog = {
                                status: result.errorCode,
                                data: {
                                    message: $filter('translate')('flight.booking.payment.money') + ' ' + $filter('number')(vm.paymentModel.promotions.lowerPrice) + ' ' + $filter('translate')('flight.booking.payment.money2')
                                }
                            }
                        }
                        if (result.errorCode === 'PC1408') {
                            errorLog = {
                                status: result.errorCode,
                                data: {
                                    message: $filter('translate')('flight.booking.payment.anotherCard')
                                }
                            }
                        }
                        if (result.errorCode === 'PC1406') {
                            errorLog = {
                                status: result.errorCode,
                                data: {
                                    message: $filter('translate')('flight.booking.payment.anotherCard')
                                }
                            }
                        }
                        if (result.errorCode === 'PC1004') {
                            errorLog = {
                                status: result.errors[0].message,
                                data: {
                                    message: $filter('translate')('flight.booking.payment.time') + ' ' + vm.paymentModel.promotions.name + ' ' + $filter('translate')('flight.booking.payment.time2') + ' ' + vm.paymentModel.promotions.startTime + ' ' + $filter('translate')('flight.booking.payment.to') + ' ' + vm.paymentModel.promotions.endTime
                                }
                            }
                        }
                        if (result.errorCode === 'PC1011') {
                            errorLog = {
                                status: result.errors[0].message,
                                data: {
                                    message: $filter('translate')('flight.booking.payment.finish')
                                }
                            }
                        }
                        DialogService.openHttpAlertDilalog(errorLog);
                    }
                }, function error(result) {
                    $log.log("Payment::doConfirm - payment promo redeem error...");
                    DialogService.openHttpAlertDilalog(result);
                });
            } else {
                $log.log("Payment::doConfirm - process payment...");
                vm.doPayment();
            }
        };

        /**
         * Do payment for ticket Later, Credit, Balance, NganLuong
         */
        vm.doPayment = function() {
            // Try to payment booking
            if (vm.paymentModel.paymentOption === 'ATM_DEBIT') {
                Flight.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    // alert(JSON.stringify(result));

                    if (result.hasPaymentAuth && result.paymentAuthUrl) {
                        $log.log(result.paymentAuthUrl);
                        $window.open(result.paymentAuthUrl, '_top');
                    } else {
                        DialogService.openHttpAlertDilalog(result);
                    }
                }, function(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
            }
            if (vm.paymentModel.paymentOption === 'VIETTELPAY') {
                Flight.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    $log.log('result_vtpayment');
                    $log.log(result);
                    if (result.hasPaymentAuth && result.paymentAuthUrl) {
                        $log.log(result.paymentAuthUrl);
                        $window.open(result.paymentAuthUrl, '_top');
                    } else {
                        DialogService.openHttpAlertDilalog(result);
                    }
                }, function(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
            }
            // Try to payment booking VNPAY
            if (vm.paymentModel.paymentOption === 'VNPAYQR') {
                Flight.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    vnpay.open({
                        width: 900,
                        height: 800,
                        url: result.paymentAuthUrl
                    });
                });
            }

            if (vm.paymentModel.paymentOption === 'MOMO') {
                Flight.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    $log.log("MOMO call payment");
                    $log.log(result);
                    if (result.errors && result.errors.length > 0 && result.errors[0].code && result.errors[0].code == '-4000') {
                        DialogService.openHttpAlertMessage($filter('translate')('flight.booking.payment.momoLimitAmountTitle'), $filter('translate')('flight.booking.payment.momoLimitAmount'));
                    } else {
                        $window.open(result.paymentAuthUrl, '_top');
                    }
                });
            }

            if (vm.paymentModel.paymentOption === 'PAYOO') {
                Flight.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    $log.log("PAYOO call payment");
                    $log.log(result);
                    if (result.errors && result.errors.length > 0 && result.errors[0].code && result.errors[0].code == '-4000') {
                        DialogService.openHttpAlertMessage($filter('translate')('flight.booking.payment.momoLimitAmountTitle'), $filter('translate')('flight.booking.payment.momoLimitAmount'));
                    } else {
                        vm.openPayoo(result.returnUrlPayoo, vm.paymentModel.isMobileApp);
                    }
                });
            }

            if (vm.paymentModel.paymentOption !== 'VNPAYQR' && vm.paymentModel.paymentOption !== 'ATM_DEBIT' &&
                vm.paymentModel.paymentOption !== 'VIETTELPAY' && vm.paymentModel.paymentOption !== 'MOMO' &&
                vm.paymentModel.paymentOption !== 'PAYOO' && vm.paymentModel.paymentOption !== 'BALANCE' &&
                vm.paymentModel.paymentOption !== 'ZALO') {
                vm.openLoading();
                Flight.paymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson)
                    .then(function(result) {

                        $rootScope.$broadcast("event-flight-load-completed", null);

                        $log.log("Payment::doConfirm - Get Flight.paymentBooking()");
                        $log.log(result);

                        // if (vm.paymentModel.cardModel && vm.paymentModel.cardModel.id) {
                        //     delete vm.paymentModel.cardModel.id;
                        // }
                        // if (vm.paymentModel.cardModel && vm.paymentModel.cardModel.chosenCardNumber) {
                        //     delete vm.paymentModel.cardModel.chosenCardNumber;
                        // }

                        // vm.saveCardReq = false;
                        // if (vm.paymentModel.cardModel && vm.paymentModel.cardModel.checked) {
                        //     vm.saveCardReq = vm.paymentModel.cardModel.checked;
                        //     delete vm.paymentModel.cardModel.checked;
                        // }

                        // var data = {
                        //     "bookingPaymentType" : {
                        //         bookingNumber: vm.bookingModel.bookingNumber,
                        //         paymentType: vm.paymentModel.paymentOption
                        //     },
                        //     "payByCreditCardReq" : {
                        //         bookingNumber: vm.bookingModel.bookingNumber,
                        //         bookingCode: vm.bjson.bookingInfo.bookingCode,
                        //         amount: PricingUtils.getTotalPricing(vm.bjson),
                        //         card: vm.paymentModel.cardModel,
                        //         paToken: vm.paymentModel.paToken,
                        //         saveCardReq: vm.saveCardReq,
                        //         ibeSessionId : AuthServerProvider.getToken()
                        //     }
                        // };

                        if (result.hasPaymentAuth && result.paymentAuthUrl) {
                            $log.log(result.paymentAuthUrl);
                            vm.open3DAuth(
                                result.paymentAuthUrl, result.paReq, result.md, result.termUrl
                            );
                        } else {
                            // Try to order - tickets
                            if (vm.paymentModel.paymentOption === 'CREDIT') {
                                // Try to save credit card for auth customer
                                if (Principal.isAuthenticated()) {
                                    if (vm.paymentModel.cardModel && vm.paymentModel.cardModel.cardId == -1 && vm.paymentModel.cardModel.checked) {

                                        CustomerService.createCreditCards(vm.paymentModel.cardModel).then(function success(result) {
                                            //$state.go('user-profile-card');
                                            $log.log("success createCreditCards");
                                        }, function error(result) {
                                            //DialogService.openHttpAlertDilalog(result);
                                            $log.log("error createCreditCards");
                                            //$log.log(JSON.stringify(result));
                                            $log.log(result);
                                        });
                                        $log.log('huyxx2');
                                        $log.log(result);
                                    }
                                }

                                //process payment
                                $rootScope.$broadcast("IssueTicket", null);
                            } else if (vm.paymentModel.paymentOption === 'BALANCE') {
                                var totalfare;
                                if (vm.profileBooking.voucher.discountAmount) {
                                    totalfare = $filter('number')((vm.bookingModel.bookingInfo.totalFare) - (vm.profileBooking.voucher.discountAmount));
                                } else {
                                    totalfare = $filter('number')(vm.bookingModel.bookingInfo.totalFare);
                                }

                                var message = {};
                                message.title = $filter('translate')('flight.booking.payment.conf');
                                message.message = $filter('translate')('flight.booking.payment.paymentBalance.popupPaymentBalance') + '<br>' +
                                    '<b>' + vm.bookingModel.bookingInfo.supplierName +
                                    ' - ' + $filter('translate')('flight.booking.payment.paymentBalance.code') + ' ' + vm.bookingModel.bookingInfo.airline + vm.bookingModel.bookingInfo.carrierNo + ' - ' +
                                    $filter('translate')('flight.booking.payment.paymentBalance.totalAmount') + ': ' + totalfare + ' VND?' + '</b>';
                                var dialogBalance = DialogService.DialogBalance(message);
                                dialogBalance.result.then(function(result) {
                                    // Try to save credit card for auth customer
                                    if (Principal.isAuthenticated()) {
                                        if (vm.paymentModel.cardModel && vm.paymentModel.cardModel.cardId == -1 && vm.paymentModel.cardModel.checked) {

                                            CustomerService.createCreditCards(vm.paymentModel.cardModel).then(function success(result) {
                                                $log.log("success createCreditCards");
                                            }, function error(result) {
                                                $log.log("error createCreditCards");
                                                $log.log(result);
                                            });
                                        }
                                    }

                                    //process payment
                                    $rootScope.$broadcast("IssueTicket", null);
                                }, function(cancel) {});
                            } else {

                                vm.paymentModel.payFailed = !result.success;
                                DataService.setPaymentModel(vm.paymentModel);
                                // $state.go('booking-result', {"profileBooking": vm.bookingModel});
                                $state.go('booking-result/:booking_number/:is_mobile/:params', {
                                    "profileBooking": vm.bookingModel,
                                    "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                                    "is_mobile": vm.paymentModel.isMobileApp ? 'mobile' : '',
                                    "params": ''
                                    // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
                                });
                            }

                            //reset payment token
                            vm.paymentModel.paToken = null;
                        }

                        // Go to
                        //$state.go('hotel-booking-result');
                    }, function error(result) {

                        $rootScope.$broadcast("event-flight-load-completed", null);

                        // Go to
                        // $state.go('hotel-booking-result');
                        $log.log("error paymentBooking");
                        //$log.log(JSON.stringify(result));
                        $log.log(result);

                        // DialogService.openHttpAlertDilalog(result);
                        vm.paymentModel.payFailed = true;
                        DataService.setPaymentModel(vm.paymentModel);

                        //$state.go('booking-result');
                        // $state.go('booking-result', {"profileBooking": vm.bookingModel});
                        $state.go('booking-result/:booking_number/:is_mobile/:params', {
                            "profileBooking": vm.bookingModel,
                            "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                            "is_mobile": vm.paymentModel.isMobileApp ? 'mobile' : '',
                            "params": ''
                            // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
                        });
                    });
            }
        };

        /**
         * Define dialog instances
         */

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        var modalAtmInstance = null;
        var resetAtmModal = function() {
            modalAtmInstance = null;
        };

        var modal3DAuthInstance = null;
        var reset3DAuthModal = function() {
            modal3DAuthInstance = null;
        };

        /**
         * Open payment dialog for DEBIT ATM option
         *
         * @param url
         */
        vm.open = function(url, isMobileApp) {
            $scope.payooUrl = url;
            var classModal = isMobileApp ? 'modal-fullscreen' : 'modal-window-extension';
            if (modalAtmInstance !== null) return;
            modalAtmInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/flights/payment/flight.payment.external.html',
                controller: 'FlightPaymentExternalController',
                controllerAs: 'vm',
                windowClass: classModal,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    paymentUrl: function() {
                        return url;
                    },
                    idOption: function() {
                        return 'other';
                    },
                    isMobile: function() {
                        return isMobileApp;
                    }
                }
            });
            modalAtmInstance.result.then(
                resetAtmModal,
                resetAtmModal
            );
        };

        /**
         * Open 3D Authentication for CREDIT payment option
         *
         * @param url
         * @param paReq
         * @param md
         * @param termUrl
         */
        vm.openVT = function(url, isMobileApp) {

            var classModal = isMobileApp ? 'modal-fullscreen viettelPayModal' : 'modal-window-extension viettelPayModal';
            if (modalAtmInstance !== null) return;
            modalAtmInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/flights/payment/flight.payment.external.html',
                controller: 'FlightPaymentExternalController',
                controllerAs: 'vm',
                windowClass: classModal,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    paymentUrl: function() {
                        return url;
                    },
                    idOption: function() {
                        return 'viettelPay';
                    },
                    booking_number: function() {
                        return $stateParams.booking_number;
                    },
                    isMobile: function() {
                        return isMobileApp;
                    }
                }
            });
            modalAtmInstance.result.then(
                resetAtmModal,
                resetAtmModal
            );
        };
        vm.openMomo = function(url, isMobileApp) {

            var classModal = isMobileApp ? 'modal-fullscreen MomoModal' : 'modal-window-extension MomoModal';
            if (modalAtmInstance !== null) return;
            modalAtmInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/flights/payment/flight.payment.external.html',
                controller: 'FlightPaymentExternalController',
                controllerAs: 'vm',
                windowClass: classModal,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    paymentUrl: function() {
                        return url;
                    },
                    idOption: function() {
                        return 'momo';
                    },
                    booking_number: function() {
                        return $stateParams.booking_number;
                    },
                    isMobile: function() {
                        return isMobileApp;
                    }
                }
            });
            modalAtmInstance.result.then(
                resetAtmModal,
                resetAtmModal
            );
        };

        /**
         * Open 3D Authentication for CREDIT payment option
         *
         * @param url
         * @param paReq
         * @param md
         * @param termUrl
         */
        vm.open3DAuth = function(url, paReq, md, termUrl) {
            var classModal = 'modal-window-extension open3DAuth';
            if (modal3DAuthInstance !== null) return;
            var givenUrl = $sce.trustAsResourceUrl(url);

            gtdFormPayment3D.redirectPayment3D(givenUrl, paReq, md, termUrl);
        };


        vm.openPayoo = function(url, isMobileApp) {

            var classModal = isMobileApp ? 'modal-fullscreen' : 'modal-window-extension';
            if (modalAtmInstance !== null) return;
            modalAtmInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/dialogs/payoo-popup.html',
                controller: 'FlightPaymentExternalController',
                controllerAs: 'vm',
                windowClass: classModal,
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('payment');
                        return $translate.refresh();
                    }],
                    paymentUrl: function() {
                        return url;
                    },
                    idOption: function() {
                        return 'payoo';
                    },
                    booking_number: function() {},
                    isMobile: function() {
                        // return isMobileApp;
                    }
                }
            });
            modalAtmInstance.result.then(
                resetAtmModal,
                resetAtmModal
            );
        };
        /**
         * Open loading dialog for waiting info
         */
        vm.openLoading = function() {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/flights/flight.loading.html',
                controller: 'FlightLoadingController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }]
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };

        vm.doBack = function() {
            //TODO - why dont have booking_number???
            $state.go('booking-confirm');
        };

        /** BEGIN CHECK TIMEOUT **/
        var promise;

        vm.checkTimeOut = function() {
            /* check for enter direct link */
            vm.timeout = !ValidationUtils.checkBookingTimeout(DataService.getBookingModel(), DataService.getPaymentModel(), /** ignore true **/ true);
            if (vm.timeout) return;
        };

        // starts the interval
        $scope.start = function() {
            // stops any running interval to avoid two intervals running at the same time
            $scope.stop();

            // Reset New Transaction Time
            // DataService.setNewStartTransactionTime();

            // store the interval promise
            promise = $interval(vm.checkTimeOut, 1000);
        };

        // stops the interval
        $scope.stop = function() {
            $interval.cancel(promise);
        };

        // starting the interval by default
        // $scope.start();

        // stops the interval when the scope is destroyed,
        // this usually happens when a route is changed and
        // the ItemsController $scope gets destroyed. The
        // destruction of the ItemsController scope does not
        // guarantee the stopping of any intervals, you must
        // be responsible of stopping it when the scope is
        // is destroyed.
        $scope.$on('$destroy', function() {
            $scope.stop();
        });
        /** END CHECK TIMEOUT **/
    }
})();