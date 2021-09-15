(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightBookingConfirmController', FlightBookingConfirmController);

    FlightBookingConfirmController.$inject = ['$location', '$log', '$uibModal', '$rootScope', '$scope', '$state', '$stateParams', '$q', '$timeout', '$interval', 'Principal', 'Flight', 'DataService', 'CustomerService', 'DialogService', 'ValidationUtils', 'FlightUtils', 'Base64', '$cookies', '$translate', '$window'];

    function FlightBookingConfirmController($location, $log, $uibModal, $rootScope, $scope, $state, $stateParams, $q, $timeout, $interval, Principal, Flight, DataService, CustomerService, DialogService, ValidationUtils, FlightUtils, Base64, $cookies, $translate, $window) {
        var vm = this;

        vm.viettelPayment = viettelPayment;
        vm.externalPayment = externalPayment;
        vm.tikiPayment = tikiPayment;
        vm.fsoftPayment = fsoftPayment;

        // Init liteEmbed Option
        var liteEmbed = false;
        if ($cookies.get('liteEmbed') || localStorage.getItem('liteEmbed')) {
            liteEmbed = (($cookies.get('liteEmbed') || localStorage.getItem('liteEmbed')) === 'true');
        }

        // Merchant will be redirect to detail page.
        // Note: Alternative flow.
        vm.merchantList = ['VIETTEL', 'TIKI', 'FSOFT', 'TRUEMONEY', 'FASTGO'];

        // Get current merchant.
        vm.currentMerchant = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;

        $log.log('booking confirm - $stateParams - booking number:' + $stateParams.booking_number);

        /**
         *
         * @param _booking_number_param
         * @private
         */
        vm._loadBookingInfo = function(_booking_number_param) {
            CustomerService.getBookingByNumber(_booking_number_param).then(function(result) {
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
                        var dbm = DataService.getBookingModel();
                        if (dbm.contacts != null && dbm.contacts.length > 0) {
                            // ok
                            $log.log('VIEW - booking-confirm');
                        } else {
                            $log.log('GOTO - booking-info');

                            $state.go('booking-info/:booking_number/:params', {
                                "searchOptions": vm.searchOptions,
                                "searchResult": vm.searchResult,
                                "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber),
                                "params": ''
                            });
                            // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))});
                        }

                    } else if (bookingStatus == 'BOOKED') {
                        if (paymentStatus == 'PENDING' || paymentStatus == 'FAILED') {
                            // Redirect to detail page
                            if (vm.merchantList.indexOf(vm.currentMerchant) > -1) {
                                var bookingNumber = Base64.encodeString(result.bookingInfo.bookingNumber);
                                $state.go('user-profile-booking-air/:booking_number/:mode', {
                                    "booking_number": bookingNumber,
                                    "mode": 'view'
                                });
                                return;
                            } else {
                                $log.log('GOTO - booking-payment');
                                $state.go('booking-payment/:booking_number/:params', {
                                    "searchOptions": vm.searchOptions,
                                    "searchResult": vm.searchResult,
                                    "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber),
                                    "params": ''
                                });
                            }
                        } else {
                            $log.log('GOTO - booking-result');
                            $state.go('booking-result/:booking_number/:params', {
                                "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber)
                            });
                        }
                    } else {
                        $log.log('GOTO - booking-result');
                        $state.go('booking-result/:booking_number/:params', {
                            "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber)
                        });
                    }

                    var cookieVL = $cookies.get('aff_id');
                    if (cookieVL == "accesstrade") {
                        // TODO - update booking tags
                        Flight.updateBookingTags(oldVm.orgBookingModel.bookingInfo.id, cookieVL);
                    }

                    $timeout(function() {
                        $rootScope.$broadcast("gtd-load-booking-completed", null);
                    }, 1000);

                    vm.bookingModel = DataService.getBookingModel();
                    vm.searchOptions = DataService.getSearchOption();
                    vm.bookingModel.curStep = 2;

                    vm.airline = {
                        term_condition_url: "",
                        airline_name: "",
                        show_airline: true
                    };
                    switch (vm.bookingModel.departGroupItem.airline) {
                        case "BL":
                            vm.airline.term_condition_url = "https://www.jetstar.com/vn/vi/terms-and-conditions";
                            vm.airline.airline_name = "Jetstar Pacific";
                            break;
                        case "VN":
                            vm.airline.term_condition_url = "https://www.vietnamairlines.com/vn/vi/terms-and-conditions/";
                            vm.airline.airline_name = "VietNam Airlines";
                            break;
                        case "VJ":
                            vm.language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
                            if (vm.language == 'vi') {
                                vm.airline.term_condition_url = "https://www.vietjetair.com/Sites/Web/vi-VN/News/thong-tin-chuyen-bay/619/dieu-le-van-chuyen";
                                vm.airline.airline_name = "Vietjet Air";
                            }
                            if (vm.language == 'en') {
                                vm.airline.term_condition_url = "https://www.vietjetair.com/Sites/Web/en-US/News/flight-information/645/terms-and-conditions";
                                vm.airline.airline_name = "Vietjet Air";
                            }
                            break;
                        case "QH":
                            vm.airline.term_condition_url = "https://www.bambooairways.com/vi/dieu-kien-gia-ve-bamboo-airways/";
                            vm.airline.airline_name = "Bamboo Airways";
                            break;
                        default:
                            vm.airline.show_airline = false;
                            break;
                    }
                    // BACK 2U
                    // DataService.setBookingModel(vm.bookingModel);
                    // DataService.setSearchOption(vm.searchOptions);

                    $scope.start();
                } else {
                    $log.log('++++ Booking Not FOUND - GOTO - flight');
                    $state.go('flight-search-home');
                }
            }, function error(result) {
                $log.log('flight-search');
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
            $log.log("flight.booking.confirm - LOADING - _booking_number_param: " + _booking_number_param);
            vm._loadBookingInfo(_booking_number_param);

        } else {
            $log.log('++++ NO Booking Number - GOTO - flight');
            $state.go('flight-search-home');
        }

        //+++ handle authentication event
        $rootScope.$on('authenticationSuccess', function() {
            var isBookingConfirmStage = $state.is('booking-confirm/:booking_number/:params');
            $log.log("flight.booking.info - IS booking-confirm/:booking_number/:params: " + isBookingConfirmStage);

            var _bookingNumber = DataService.getBookingModel().bookingNumber;

            if (isBookingConfirmStage && _bookingNumber) {
                $log.log("flight.booking.confirm - authenticationSuccess --- Checking.... ");

                //step 1:
                $log.log("flight.booking.confirm - CHANGE BOOKING OWNER - vm.bookingModel.bookingNumber: " + _bookingNumber);
                Flight.changeDraftBookingOwner(_bookingNumber).then(function(result) {
                    $log.log("flight.booking.confirm - changeDraftBookingOwner result: " + result);

                    //step 2:
                    $log.log("flight.booking.confirm - RELOAD - vm.bookingModel.bookingNumber: " + _bookingNumber);
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
        vm.paymentModel = DataService.getPaymentModel();

        /**
         * confirm to hold booking
         */


        vm.doConfirm = function() {
            if (!vm.checkedRuleVJ) {
                $log.log("vm.airline")
                $log.log(vm.airline)
                DialogService.openAlertDialog({
                    "title": "Thông báo",
                    "message": "Quý khách vui lòng đọc và xác nhận Đồng ý với điều kiện giá vé & điều lệ vận chuyển đối với các chuyến bay " + vm.airline.airline_name
                });
                return false;
            }

            // var ck_merchant = $cookies.get("merchant_code") || localStorage.getItem("merchant_code");
            //
            // // $window.parent.postMessage("Hello", "https://davidwalsh.name");
            // console.log("FSOFT" + ck_merchant);
            // switch (ck_merchant) {
            //     case 'FSOFT':
            //         DialogService.openAlertDialog({
            //             "title": "Thông báo",
            //             "message": "Quý khách vui lòng đọc và xác nhận Đồng ý với điều kiện giá vé & điều lệ vận chuyển đối với các chuyến bay " + vm.airline.airline_name
            //         });
            //         return false;
            //         break;
            //     default:
            //         // TODO: Implement redirect to unknown merchant.
            //         break;
            // }

            // Show Dialogs
            vm.open();



            if (Principal.isAuthenticated()) {
                // Sync to CustomerTravellers
                CustomerService.addCustomerTravellers(vm.bookingModel).then(function(result) {
                    $log.log("Get addCustomerTravellers from customer.service");
                    $log.log(result);

                    //DialogService.openHttpAlertDilalog(result);
                }, function error(result) {
                    // DialogService.openHttpAlertDilalog(result);
                });
            }

            function passedOTP(result) {
                // Show Dialogs
                vm.closeLoading();
                // $rootScope.$broadcast("event-flight-load-completed", null);

                if (DialogService.isResponseSuccess(result)) {
                    vm.bookingModel.code = result;
                    DataService.setBookingModel(vm.bookingModel);

                    CustomerService.getBookingByNumber(_booking_number_param).then(function(bookingResult) {

                        if (vm.currentMerchant && vm.currentMerchant === 'FSOFT') {
                            var data = {};
                            data.orderId = bookingResult.bookingInfo.bookingNumber;
                            data.roundInfo = [];

                            var roundInfoData = {};
                            roundInfoData.routeType = bookingResult.bookingInfo.roundType;
                            roundInfoData.conformance = "";
                            roundInfoData.explanation = "";
                            data.roundInfo.push(roundInfoData);

                            data.roundInfo = roundInfoData;
                            data.reserveInfo = false;

                            $window.parent.postMessage(data, '*');
                        }

                        var bookingStatus = bookingResult.bookingInfo.status;
                        if ("BOOKED" === bookingStatus) {
                            if ((vm.currentMerchant && vm.currentMerchant === 'FASTGO') || liteEmbed === true) {
                                $log.log('GOTO - booking-payment');
                                $state.go('booking-payment/:booking_number/:params', {
                                    "searchOptions": vm.searchOptions,
                                    "searchResult": vm.searchResult,
                                    "booking_number": Base64.encodeString(bookingResult.bookingNumber),
                                    "params": ''
                                });
                            } else {
                                Flight.externalPayment(bookingResult.bookingNumber);
                            }
                        } else {
                            $state.go('booking-result/:booking_number/:params', {
                                "searchOptions": vm.searchOptions,
                                "searchResult": vm.searchResult,
                                "booking_number": Base64.encodeString(bookingResult.bookingNumber),
                                "params": ''
                            });
                        }
                    });

                    return;
                } else {
                    // Flight.externalPayment(vm.bookingModel.bookingNumber);
                    $state.go('booking-result/:booking_number/:params', {
                        "searchOptions": vm.searchOptions,
                        "searchResult": vm.searchResult,
                        "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                        "params": ''
                    });
                    return;
                }
            }

            function verifyPhoneNumber(result) {
                if (result.errors && result.errors.length > 0 && result.errors[0].code === "403") {
                    DialogService.openAlertDialog({
                        "title": "KHÔNG THỰC HIỆN ĐẶT CHỔ",
                        "message": result.errors[0].message
                    });
                }
                if (result.otpServiceRes && result.otpServiceRes.notFound && result.otpServiceRes.notFound) {
                    //phone number is not verified
                    vm.language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
                    var otpModalInstance = $uibModal.open({
                        animation: true,
                        backdrop: true,
                        templateUrl: 'app/dialogs/otp.popup.html',
                        controller: 'FlightPaymentOTPController',
                        controllerAs: 'vm',
                        windowClass: "popupOtpModal",
                        resolve: {
                            translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('flight');
                                return $translate.refresh();
                            }],
                            bookingModel: function() {
                                return vm.bookingModel;
                            },
                            searchOptions: function() {
                                return vm.searchOptions;
                            },
                            searchResult: function() {
                                return vm.searchResult;
                            },
                            bookingRes: function() {
                                return result;
                            },
                            Flight: function() {
                                return Flight;
                            },
                            language: function() {
                                return vm.language;
                            }
                        }
                    });

                    otpModalInstance.result.then(function(success) {
                        if (success) {
                            passedOTP(result);
                        }

                    }, function(verificationCode) {
                        console.log(verificationCode);
                        // if (verificationCode.length >= 0) {
                        //     Flight.otpService(vm.bookingModel, vm.paymentModel, null, verificationCode).then(function (result) {});
                        // }
                    });
                } else {
                    passedOTP(result);
                }
            }

            // Try to create booking travellers
            if (vm.searchOptions.searchType == 'oneway') {
                Flight.addTicketTravellers(vm.searchOptions, vm.bookingModel)
                    .then(function(result) {
                        $log.log("Get Flight.addTicketTravellers");
                        $log.log(result);
                        vm.closeLoading();
                        verifyPhoneNumber(result);
                        // $rootScope.$broadcast("event-flight-load-completed", null);

                        // if (DialogService.isResponseSuccess(result)) {
                        //     vm.bookingModel.code = result;
                        //     DataService.setBookingModel(vm.bookingModel);

                        //     CustomerService.getBookingByNumber(_booking_number_param).then(function (bookingResult) {

                        //         if(vm.currentMerchant && vm.currentMerchant === 'FSOFT')
                        //         {
                        //             var data = {};
                        //             data.orderId = bookingResult.bookingInfo.bookingNumber;
                        //             data.roundInfo = [];

                        //             var roundInfoData = {};
                        //             roundInfoData.routeType = bookingResult.bookingInfo.roundType;
                        //             roundInfoData.conformance = "";
                        //             roundInfoData.explanation = "";
                        //             data.roundInfo.push(roundInfoData);

                        //             data.roundInfo = roundInfoData;
                        //             data.reserveInfo = false;

                        //             $window.parent.postMessage(data,'*');
                        //         }

                        //         var bookingStatus = bookingResult.bookingInfo.status;
                        //         if ("BOOKED" === bookingStatus) {
                        //             Flight.externalPayment(bookingResult.bookingNumber);
                        //         } else {
                        //             $state.go('booking-result/:booking_number/:params', {
                        //                 "searchOptions": vm.searchOptions
                        //                 , "searchResult": vm.searchResult
                        //                 , "booking_number": Base64.encodeString(bookingResult.bookingNumber)
                        //                 , "params": ''
                        //             });
                        //         }
                        //     });

                        //     return;
                        // } else {
                        //     // Flight.externalPayment(vm.bookingModel.bookingNumber);
                        //     $state.go('booking-result/:booking_number/:params', {
                        //         "searchOptions": vm.searchOptions, "searchResult": vm.searchResult,
                        //         "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber)
                        //         , "params": ''
                        //     });
                        //     return;
                        // }
                    }, function error(result) {
                        vm.closeLoading();
                        // Flight.externalPayment(vm.bookingModel.bookingNumber);
                        $state.go('booking-result/:booking_number/:params', {
                            "searchOptions": vm.searchOptions,
                            "searchResult": vm.searchResult,
                            "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                            "params": ''
                        });
                        return;
                    });
            } else {

                Flight.addTicketTravellers(vm.departSearchOptions, vm.bookingModel).then(function(result) {
                    $log.log("Get addTicketTravellers from flight.service");
                    $log.log(result);
                    verifyPhoneNumber(result);
                    // $rootScope.$broadcast("event-flight-load-completed", null);

                    // if (DialogService.isResponseSuccess(result)) {
                    //     vm.bookingModel.code = result;
                    //     DataService.setBookingModel(vm.bookingModel);

                    //     CustomerService.getBookingByNumber(_booking_number_param).then(function (bookingResult) {
                    //         if(vm.currentMerchant && vm.currentMerchant === 'FSOFT'){
                    //             var data = {};
                    //             data.orderId = bookingResult.bookingInfo.bookingNumber;
                    //             data.roundInfo = [];

                    //             var roundInfoData = {};
                    //             roundInfoData.routeType = bookingResult.bookingInfo.roundType;
                    //             roundInfoData.conformance = "";
                    //             roundInfoData.explanation = "";
                    //             data.roundInfo.push(roundInfoData);

                    //             data.roundInfo = roundInfoData;
                    //             data.reserveInfo = false;

                    //             $window.parent.postMessage(data,'*');
                    //         }
                    //         var bookingStatus = bookingResult.bookingInfo.status;
                    //         if ("BOOKED" === bookingStatus) {
                    //             Flight.externalPayment(bookingResult.bookingNumber);
                    //         } else {
                    //             $state.go('booking-result/:booking_number/:params', {
                    //                 "searchOptions": vm.searchOptions
                    //                 , "searchResult": vm.searchResult
                    //                 , "booking_number": Base64.encodeString(bookingResult.bookingNumber)
                    //                 , "params": ''
                    //             });
                    //         }
                    //     });
                    //     return;
                    // } else {
                    //     // DialogService.openHttpAlertDilalog(result, true);
                    //     $state.go('booking-result/:booking_number/:params', {
                    //         "searchOptions": vm.searchOptions, "searchResult": vm.searchResult,
                    //         "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber)
                    //         , "params": ''
                    //     });
                    //     // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))});
                    // }
                }, function error(result) {

                    $rootScope.$broadcast("event-flight-load-completed", null);

                    // DialogService.openHttpAlertDilalog(result, true);
                    // $state.go('booking-result');
                    $state.go('booking-result/:booking_number/:params', {
                        "searchOptions": vm.searchOptions,
                        "searchResult": vm.searchResult,
                        "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                        "params": ''
                    });
                    // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))});
                });
            }
        };

        /**
         * go back to booking-info
         */
        vm.doBack = function() {
            $state.go('booking-info/:booking_number/:params', {
                "searchOptions": vm.searchOptions,
                "searchResult": vm.searchResult,
                "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                "params": ''
            });
            // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))});
            // $state.go('booking-info');
        };

        function externalPayment(type, payload) {
            switch (type) {
                case "TIKI":
                    vm.tikiPayment(payload.bookingNumber);
                    break;
                case "VIETTEL":
                    vm.viettelPayment(payload.bookingNumber);
                    break;
                case "FSOFT":
                    vm.fsoftPayment(payload.bookingNumber);
                    break;
                default:
                    break;
            }

        }

        function fsoftPayment(bookingNumber) {

            return;
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

            // alert("Implement viettel");

            Flight.getViettelPaymentURL(bookingNumber).then(function(response) {
                $window.location.href = response;

            }, function error(response) {
                $log.log('errorCallback Create viettel order');
                // $log.log("response = " + JSON.stringify(response));
            });
            return;
        }


        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        vm.closeLoading = function() {
            if (modalInstance === null) return;
            modalInstance.close();
        };

        vm.open = function() {
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

        /** BEGIN CHECK TIMEOUT **/
        var promise;

        vm.checkTimeOut = function() {
            /* check for enter direct link */
            vm.timeout = !ValidationUtils.checkBookingTimeout(DataService.getBookingModel(), DataService.getPaymentModel());
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