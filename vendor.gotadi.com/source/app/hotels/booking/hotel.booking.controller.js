(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelBookingController', HotelBookingController);

    HotelBookingController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$uibModal', '$log', 'Principal', 'Hotel', 'DataService', 'CustomerService', 'DialogService', 'Base64', '$cookies', 'Flight', '$window', 'gtdFormPayment3D'];

    function HotelBookingController($rootScope, $scope, $state, $stateParams, $timeout, $uibModal, $log, Principal, Hotel, DataService, CustomerService, DialogService, Base64, $cookies, Flight, $window, gtdFormPayment3D) {
        var vm = this;

        // Merchant will be redirect to detail page.
        // Note: Alternative flow.
        vm.merchantList = ['VIETTEL', 'TIKI', 'TRUEMONEY', 'FASTGO'];

        // Get current merchant.
        vm.currentMerchant = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;

        vm.viettelPayment = viettelPayment;
        vm.externalPayment = externalPayment;
        vm.tikiPayment = tikiPayment;

        // Init liteEmbed Option
        var liteEmbed = false;
        if ($cookies.get('liteEmbed') || localStorage.getItem('liteEmbed')) {
            liteEmbed = (($cookies.get('liteEmbed') || localStorage.getItem('liteEmbed')) === 'true');
        }

        // vm.departFlightModel = DataService.getDepartFlight();
        // vm.returnFlightModel = DataService.getReturnFlight();
        // vm.bookingModel = DataService.getHotelBookingModel();
        // vm.paymentModel = DataService.getHotelPaymentModel();

        //+++ initial bookingModel
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

        vm.paymentModel = {};
        vm.paymentModel.cardModel = {};
        vm.paymentModel.cardModel.cardId = -1;
        vm.hotelId = $stateParams.hotelId;

        vm.bjson = {};
        vm.bjson.bookingInfo = {};

        vm.searchOptions = DataService.getHotelSearchOptions();

        // vm.selectedHotel = DataService.getSelectedHotel();
        // vm.selectedHotelProduct = DataService.getSelectedHotelProduct();
        // vm.selectedHotelRoom = DataService.getSelectedHotelRoom();

        vm.bookingModel.curStep = 1;
        vm.bookingModel.biMobileCode = '84';
        vm.bookingModel.tPCPhoneCode = '84';

        //++++ initial parameter
        vm.bookingModel.bookingNumber = Base64.decodeString($stateParams.booking_number);
        $log.log('$stateParams.booking_number = ');
        $log.log(vm.bookingModel.bookingNumber);

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

        vm.termChange = termChange;

        function termChange(value) {
            vm.checkedTerm = value;
        }


        // Update data for step 3
        CustomerService.getBookingByNumber(vm.bookingModel.bookingNumber).then(function(result) {
            vm.bjson = result;
            $log.log("++ vm.bjson ++ ");
            $log.log(vm.bjson);

            //+++ check status
            var bookingStatus = vm.bjson.bookingInfo.status;
            var paymentStatus = vm.bjson.bookingInfo.paymentStatus;
            var issueStatus = vm.bjson.bookingInfo.issuedStatus;
            var supplierBookingStatus = vm.bjson.bookingInfo.supplierBookingStatus;

            $log.log('bookingStatus=' + bookingStatus + ", paymentStatus = " + paymentStatus + ", issuedStatus = " + issueStatus + ", supplierBookingStatus = " + supplierBookingStatus);

            if (bookingStatus == 'PENDING') {
                // ok
                $log.log('VIEW - Booking Info');

            } else if (bookingStatus == 'BOOKED') {
                if (paymentStatus == 'PENDING' || paymentStatus == 'FAILED') {
                    $log.log('GOTO - booking-payment');


                    if (vm.merchantList.indexOf(vm.currentMerchant) > -1) {
                        var bookingNumber = Base64.encodeString(vm.bookingModel.bookingNumber);
                        if (supplierBookingStatus == 'BOOKED') {
                            vm.bookingModel.curStep = 3;
                        } else {
                            $state.go('user-profile-booking-htl/:booking_number/:mode', {
                                "booking_number": bookingNumber,
                                "mode": 'view'
                            });
                            return;
                        }
                    } else {
                        vm.bookingModel.curStep = 3;
                    }

                } else {
                    $log.log('GOTO - booking-result');
                    $state.go('hotel-booking-result/:booking_number/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)
                    });
                }
            } else {
                $log.log('GOTO - booking-result');

                $state.go('hotel-booking-result/:booking_number/:params', {
                    "profileBooking": vm.bookingModel,
                    "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)
                });
            }
            //---

            vm.selectedHotel = vm.bjson.hotelAvailability;
            vm.selectedHotelProduct = vm.bjson.hotelAvailability.products[0];
            vm.selectedHotelRoom = vm.bjson.hotelAvailability.products[0].rooms[0];
            vm.selectedHotelProduct.totalPerson = 0;
            vm.selectedHotelProduct.totalAdultQuantity = 0;
            if (vm.selectedHotelProduct && vm.selectedHotelProduct.rooms) {
                vm.selectedHotelProduct.rooms.forEach(function(room) {

                    //+++ keep productCode for add to customer
                    room.productCode = room.id;
                    //---

                    vm.selectedHotelProduct.totalPerson += room.pax.adultQuantity + room.pax.childQuantity;
                    vm.selectedHotelProduct.totalAdultQuantity += room.pax.adultQuantity;

                });
            }

            $log.log("+++ Hotel booking +++");
            //$log.log("selectedHotel=" + JSON.stringify(vm.selectedHotel));
            //$log.log("selectedHotelProduct=" + JSON.stringify(vm.selectedHotelProduct));
            //$log.log("selectedHotelRoom=" + JSON.stringify(vm.selectedHotelRoom));
            $log.log("selectedHotel=" + vm.selectedHotel);
            $log.log(vm.selectedHotel);
            $log.log("selectedHotelProduct=" + vm.selectedHotelProduct);
            $log.log(vm.selectedHotelProduct);
            $log.log("selectedHotelRoom=" + vm.selectedHotelRoom);
            $log.log(vm.selectedHotelRoom);

            $timeout(function() {
                $rootScope.$broadcast("gtd-load-booking-completed", null);
            }, 1000);

            // $log.log("+++++++++++++++++");
            // $log.log(vm.hotelBookingModel);
            //
            // vm.hotelBookingModel = result;
        }, function(result) {
            $log.log("++ vm.productBooking failed ++ ");
        });



        /**
         * Handler IssueTicket from Popup payment for ATM_DEBIT and CREDIT
         */
        $scope.$on('IssueTicket', function(event, item) {
            //+++ show waiting message
            vm.openLoading();
            //---

            Hotel.orderTickets(vm.bookingModel, vm.bjson)
                .then(function(result1) {
                    $log.log("Get Flight.orderTickets()");
                    $log.log(result1);

                    vm.paymentModel.payFailed = !result1.success;
                    DataService.setHotelPaymentModel(vm.paymentModel);

                    $rootScope.$broadcast("event-flight-load-completed", null);

                    if (vm.paymentModel.isMobileApp) {
                        CustomerService.getFinalBookingByNumber(vm.bookingModel.bookingNumber).then(function(result) {
                            if (!!result.bookingInfo) {
                                var bookingStatus = result.bookingInfo.status;
                                var paymentStatus = result.bookingInfo.paymentStatus;
                                var issueStatus = result.bookingInfo.issuedStatus;
                                $state.go('mobile-booking-result?:booking_status&:payment_status&:issue_status', {
                                    'booking_status': bookingStatus,
                                    'payment_status': paymentStatus,
                                    'issue_status': issueStatus
                                });
                            }
                        });
                        return;
                    }

                    // // Go to
                    // $state.go('hotel-booking-result/:booking_number/:params', {"profileBooking": vm.bookingModel
                    // , "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)});
                    // Go to
                    $state.go('hotel-booking-result/:booking_number/:is_mobile/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber),
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
                    DataService.setHotelPaymentModel(vm.paymentModel);

                    $rootScope.$broadcast("event-flight-load-completed", null);

                    //$state.go('booking-result');
                    // $state.go('hotel-booking-result/:booking_number/:params', {"profileBooking": vm.bookingModel
                    //     , "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)});
                    $state.go('hotel-booking-result/:booking_number/:is_mobile/:params', {
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
            $log.log("Hotel - DoPaymentWith3DAuthConfirmation - " + item);
            vm.paymentModel.paToken = item;

            vm.doPayment();
        });

        /**
         * Process Debit Payment with NganLuong
         */
        vm.doDebitPayment = function() {
            if (vm.paymentModel.paymentOption === 'ATM_DEBIT') {
                Hotel.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    // alert(JSON.stringify(result));

                    if (result.hasPaymentAuth && result.paymentAuthUrl) {
                        $log.log(result.paymentAuthUrl);
                        // vm.open(result.paymentAuthUrl, vm.paymentModel.isMobileApp);
                        $window.open(result.paymentAuthUrl, '_top');
                    } else {
                        DialogService.openHttpAlertDilalog(result);
                    }
                }, function(result) {

                    DialogService.openHttpAlertDilalog(result);
                });
            }
        };

        function externalPayment(type, payload) {
            switch (type) {
                case "TIKI":
                    vm.tikiPayment(payload.bookingNumber);
                    break;
                case "VIETTEL":
                    vm.viettelPayment(payload.bookingNumber);
                    break;

                default:
                    break;
            }

        }

        function tikiPayment(bookingNumber) {
            var customerID = $cookies.get('msisdn') || localStorage.getItem('msisdn');
            // var customerID = 100090562;
            Flight.createOrderTiki(bookingNumber, customerID).then(function(response) {
                $window.location.href = response.redirect_url;

            }, function error(response) {
                $log.log('errorCallback Create Tiki order');
                // $log.log("response = " + JSON.stringify(response));
            });
            return;
        }

        function viettelPayment(bookingNumber) {

            Flight.getViettelPaymentURL(bookingNumber).then(function(response) {
                $window.location.href = response;

            }, function error(response) {
                $log.log('errorCallback Create viettel order');
                // $log.log("response = " + JSON.stringify(response));
            });
            return;
        }

        /**
         * 171-VY.LTT
         */
        $("#button").click(function() {
            $('html, body').animate({
                scrollTop: $("#action-bar-mobile").offset().top
            }, 1000);
        });


        /**
         * Process other payment option Later, Credit, Balance
         */
        vm.doPayment = function() {
            //+++ show waiting message
            vm.openLoading();
            //---

            Hotel.paymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson)
                .then(function(result) {

                    $rootScope.$broadcast("event-flight-load-completed", null);

                    $log.log("Get Hotel.paymentBooking()");
                    $log.log(result);

                    if (result.hasPaymentAuth && result.paymentAuthUrl) {
                        $log.log(result.paymentAuthUrl);
                        vm.open3DAuth(
                            result.paymentAuthUrl, result.paReq, result.md, result.termUrl
                        );

                    } else {
                        // Try to order - tickets
                        if (vm.paymentModel.paymentOption === 'CREDIT' ||
                            vm.paymentModel.paymentOption === 'BALANCE') {
                            // Try to save credit card for later
                            // vm.paymentModel.cardModel.type = $scope.cardForm.cardNumber.$ccType ? $scope.cardForm.cardNumber.$ccType.toUpperCase() : "OTHER";
                            if (Principal.isAuthenticated()) {
                                if (vm.paymentModel.cardModel && vm.paymentModel.cardModel.cardId == -1 && vm.paymentModel.cardModel.checked) {

                                    CustomerService.createCreditCards(vm.paymentModel.cardModel, vm.paymentModel.paToken).then(function success(result) {
                                        //$state.go('user-profile-card');
                                        $log.log("success createCreditCards");
                                    }, function error(result) {
                                        //DialogService.openHttpAlertDilalog(result);
                                        $log.log("error createCreditCards");
                                        //$log.log(JSON.stringify(result));
                                        $log.log(result);
                                    });
                                }
                            }

                            //process payment
                            $rootScope.$broadcast("IssueTicket", null);

                        } else {

                            // $rootScope.$broadcast("event-flight-load-completed", null);

                            vm.paymentModel.payFailed = !result.success;
                            DataService.setHotelPaymentModel(vm.paymentModel);

                            // $state.go('hotel-booking-result', {"profileBooking": vm.bookingModel});
                            $state.go('hotel-booking-result/:booking_number/:params', {
                                "profileBooking": vm.bookingModel,
                                "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)
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
                    DataService.setHotelPaymentModel(vm.paymentModel);

                    //$state.go('booking-result');
                    // $state.go('hotel-booking-result', {"profileBooking": vm.bookingModel});
                    $state.go('hotel-booking-result/:booking_number/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)
                    });
                });
        }

        /**
         * Process when user click on Confirm button on screen
         *
         * @param bookingForm
         * @returns {boolean}
         */
        vm.doConfirm = function(bookingForm) {

            // Scroll to top in iFrame.
            if ('parentIFrame' in window) {
                window.parentIFrame.scrollTo(0, 0);
            }

            if (!bookingForm.$valid) {
                angular.element("[name='" + bookingForm.$name + "']").find('.ng-invalid:visible:first').focus();
                return false;
            }

            // vm.bookingModel.selectedHotelProduct = vm.selectedHotelProduct;
            vm.bookingModel.customers = vm.selectedHotelProduct.rooms;

            DataService.setHotelBookingModel(vm.bookingModel);

            $log.log("vm.bookingModel.curStep = " + vm.bookingModel.curStep);
            //$log.log("vm.bookingModel = " + JSON.stringify(vm.bookingModel));
            //$log.log("vm.paymentModel = " + JSON.stringify(vm.paymentModel));
            $log.log("vm.bookingModel = " + vm.bookingModel);
            $log.log("vm.paymentModel = " + vm.paymentModel);

            if (vm.bookingModel.curStep === 3) {
                //process payment
                DataService.setHotelPaymentModel(vm.paymentModel);

                if (vm.bookingModel.voucher) {
                    $log.log('vm.bookingModel.voucher.voucherValid = ' + vm.bookingModel.voucher.voucherValid);
                }
                $rootScope.$broadcast("event-payment-voucher-pre-send-data", null);

                if (vm.bookingModel.voucher && vm.bookingModel.voucher.voucherValid) {
                    $log.log("Payment::doConfirm - process redeem booking...");
                    Hotel.redeemVoucher(vm.bookingModel).then(function success(result) {
                        if (result.redeemValid && result.success) {
                            $log.log('Payment::doConfirm - result.redeemValid = ' + result.redeemValid + ", result.success = " + result.success);

                            if (vm.paymentModel.paymentOption === 'ATM_DEBIT') {
                                vm.doDebitPayment();
                            }
                            if (vm.paymentModel.paymentOption === 'VNPAYQR') {
                                Hotel.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                                    vnpay.open({
                                        width: 900,
                                        height: 800,
                                        url: result.paymentAuthUrl
                                    });
                                });

                                // window.location.href = "#/payment-vnpay-qr/"+$stateParams.booking_number+"/FLIGHT"
                            }
                            if (vm.paymentModel.paymentOption !== 'VNPAYQR' && vm.paymentModel.paymentOption !== 'ATM_DEBIT') {
                                vm.doPayment();
                            }

                        } else {
                            $log.log("Payment::doConfirm - payment voucher redeem invalid...");
                            $rootScope.$broadcast("event-payment-voucher-redeem-invalid", null);
                        }
                    }, function error(result) {
                        $log.log("Payment::doConfirm - payment voucher redeem error...");
                        $rootScope.$broadcast("event-payment-voucher-redeem-invalid", null);
                    });
                } else {
                    $log.log("Payment::doConfirm - process payment...");
                    if (vm.paymentModel.paymentOption === 'ATM_DEBIT') {
                        vm.doDebitPayment();

                    }
                    if (vm.paymentModel.paymentOption === 'VNPAYQR') {
                        Hotel.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                            vnpay.open({
                                width: 900,
                                height: 800,
                                url: result.paymentAuthUrl
                            });
                            // window.location.href = "#/payment-vnpay-qr/"+$stateParams.booking_number+"/FLIGHT"
                        });
                    }

                    if (vm.paymentModel.paymentOption !== 'VNPAYQR' && vm.paymentModel.paymentOption !== 'ATM_DEBIT') {
                        vm.doPayment();
                    }
                }
                // Update data for step 3
                CustomerService.getBookingByNumber(vm.bookingModel.bookingNumber).then(function(result) {
                    // vm.bjson = result;
                    // $log.log("++ vm.bjson ++ ");
                    // $log.log(vm.bjson);

                    // $log.log("+++++++++++++++++");
                    // $log.log(vm.hotelBookingModel);
                    //
                    // vm.hotelBookingModel = result;
                }, function(result) {
                    $log.log("++ vm.productBooking failed ++ ");
                });

                //$state.go('hotel-booking-result');
            } else if (vm.bookingModel.curStep === 2) {
                // Sync to CustomerTravellers
                CustomerService.addCustomerTravellers(vm.bookingModel).then(function(result) {
                    $log.log("Get addCustomerTravellers from customer.service");
                    $log.log(result);

                    //DialogService.openHttpAlertDilalog(result);
                }, function error(result) {
                    // DialogService.openHttpAlertDilalog(result);
                });

                // Try to create booking travellers
                Hotel.addHotelTravellers(vm.searchOptions, vm.bookingModel).then(function(result) {
                    $log.log("Get addTicketTravellers from flight.service");
                    $log.log(result);

                    if (DialogService.isResponseSuccess(result)) {
                        vm.bookingModel.code = result;
                        DataService.setHotelBookingModel(vm.bookingModel);




                        // Update data for step 3
                        CustomerService.getBookingByNumber(vm.bookingModel.bookingNumber).then(function(result) {
                            vm.bjson = result;
                            $log.log("++ vm.bjson ++ ");
                            $log.log(vm.bjson);
                            var bookingStatus = result.bookingInfo.status;
                            if ("BOOKED" === bookingStatus) {
                                // vm.externalPayment($cookies.get('merchant_code'),result);
                                if (vm.currentMerchant && vm.currentMerchant === 'FASTGO' || liteEmbed === true) {
                                    $log.log('GOTO - booking-payment===');
                                    $state.go('hotel-booking/:booking_number/:params', {
                                        "searchOptions": vm.searchOptions,
                                        "searchResult": vm.searchResult,
                                        "booking_number": Base64.encodeString(result.bookingNumber),
                                        "params": ''
                                    });
                                } else {
                                    Flight.externalPayment(result.bookingNumber);
                                    return;
                                }
                                // vm.externalPayment($cookies.get('merchant_code'),result);
                                // Flight.externalPayment(result.bookingNumber);
                                // return;
                            } else {
                                $state.go('hotel-booking-result/:booking_number/:params', {
                                    "searchOptions": vm.searchOptions,
                                    "searchResult": vm.searchResult,
                                    "booking_number": Base64.encodeString(result.bookingNumber),
                                    "params": ''
                                });
                                return;
                            }


                            // Go to
                            vm.bookingModel.curStep++;
                            // $state.go('booking-payment');

                            // $log.log("+++++++++++++++++");
                            // $log.log(vm.hotelBookingModel);
                            //
                            // vm.hotelBookingModel = result;
                        }, function(result) {
                            $log.log("++ vm.productBooking failed ++ ");
                        });


                    } else {
                        DialogService.openHttpAlertDilalog(result);
                    }
                }, function error(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
            } else {
                // curstep = 1 -> adv to 2
                vm.bookingModel.curStep++;
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
            if (modal3DAuthInstance !== null) return;
            // var givenUrl = $sce.trustAsResourceUrl(url);
            gtdFormPayment3D.redirectPayment3D(url, paReq, md, termUrl);
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

        /**
         * Process back to view hotel_detail
         */
        vm.doBack = function() {
            $state.go('hotel-detail/:hotel_id/:params', {
                "hotel_id": vm.hotelId,
                "params": Base64.encodeJson(vm.searchOptions)
            }, {
                reload: true
            });
        };

    }
})();