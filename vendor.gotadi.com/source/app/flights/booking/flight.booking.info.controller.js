(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightBookingInfoController', FlightBookingInfoController);

    FlightBookingInfoController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$interval', 'Flight', 'DataService', 'Principal', 'ValidationUtils', 'Base64', 'CustomerService', 'FlightUtils', '$cookies', '$uibModalStack'];

    function FlightBookingInfoController($log, $rootScope, $scope, $state, $stateParams, $timeout, $interval, Flight, DataService, Principal, ValidationUtils, Base64, CustomerService, FlightUtils, $cookies, $uibModalStack) {
        var vm = this;

        // Merchant will be redirect to detail page.
        // Note: Alternative flow.
        vm.merchantList = ['VIETTEL', 'TIKI', 'TRUEMONEY', 'FASTGO'];

        // Get current merchant.
        vm.currentMerchant = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;

        $log.log('booking info - $stateParams - booking number:' + $stateParams.booking_number);

        vm.departFlightModel = DataService.getDepartFlight();
        vm.returnFlightModel = DataService.getReturnFlight();
        vm.paymentModel = DataService.getPaymentModel();

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
        //update default phonecode 11/2/2019
        vm.bookingModel.curStep = 1;
        vm.bookingModel.biMobileCode = '84';
        vm.bookingModel.tPCPhoneCode = '84';

        /**
         *
         * @param _booking_number_param
         * @private
         */
        vm._loadBookingInfo = function(_booking_number_param) {
            CustomerService.getBookingByNumber(_booking_number_param).then(function(result) {
                // $log.log("FlightBookingInfoController::getBookingByNumber() - result: " + JSON.stringify(result));

                var oldVm = FlightUtils.convertBookingToVM(result);

                // $log.log("FlightBookingInfoController::getBookingByNumber() - oldVm: " + JSON.stringify(oldVm));


                if (oldVm && oldVm.orgBookingModel && oldVm.orgBookingModel.bookingInfo) {
                    // Check status
                    // $log.log('vm.orgBookingModel=');
                    // $log.log(oldVm.orgBookingModel);

                    var bookingStatus = oldVm.orgBookingModel.bookingInfo.status;
                    var paymentStatus = oldVm.orgBookingModel.bookingInfo.paymentStatus;
                    var issueStatus = oldVm.orgBookingModel.bookingInfo.issuedStatus;
                    var supplierBookingStatus = oldVm.orgBookingModel.bookingInfo.supplierBookingStatus;


                    $log.log('bookingStatus=' + bookingStatus + ", paymentStatus = " + paymentStatus + ", issuedStatus = " + issueStatus + ", supplierBookingStatus = " + supplierBookingStatus);

                    if (bookingStatus == 'PENDING') {
                        // ok
                        $log.log('VIEW - Booking Info');
                    } else if (bookingStatus == 'BOOKED') {
                        if (paymentStatus == 'PENDING' || paymentStatus == 'FAILED') {

                            if (vm.merchantList.indexOf(vm.currentMerchant) > -1) {
                                var bookingNumber = Base64.encodeString(result.bookingInfo.bookingNumber);
                                $state.go('user-profile-booking-air/:booking_number/:mode', {
                                    "booking_number": bookingNumber,
                                    "mode": 'view'
                                });
                                return;
                            } else {
                                $log.log('GOTO - booking-payment');
                                $state.go('booking-info/:booking_number/:params', {
                                    "searchOptions": vm.searchOptions,
                                    "searchResult": vm.searchResult,
                                    "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber),
                                    "params": ''
                                });
                            }

                            // $log.log('GOTO - booking-payment');
                            // $state.go('booking-payment/:booking_number/:params', {
                            //     "searchOptions": vm.searchOptions
                            //     , "searchResult": vm.searchResult
                            //     , "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber)
                            //     , "params": ''
                            // });
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

                    if (DataService.getBookingModel() && DataService.getBookingModel().bookingNumber) {
                        $log.log('get booking from data-service');
                        vm.bookingModel = DataService.getBookingModel();

                        // update default phonecode 11/2/2019
                        vm.bookingModel.curStep = 1;
                        vm.bookingModel.biMobileCode = '84';
                        vm.bookingModel.tPCPhoneCode = '84';

                        //+++ reset booking_info to display data
                        vm.bookingModel.bookingInfo = {};
                        if (oldVm.orgBookingModel && oldVm.orgBookingModel.bookingInfo) {
                            vm.bookingModel.bookingInfo = oldVm.orgBookingModel.bookingInfo;
                        }
                        //---

                        vm.searchOptions = DataService.getSearchOption();
                    } else {
                        $log.log('get booking from BE');
                        vm.bookingModel = oldVm.orgBookingModel;
                        // update default phonecode 11/2/2019
                        vm.bookingModel.curStep = 1;
                        vm.bookingModel.biMobileCode = '84';
                        vm.bookingModel.tPCPhoneCode = '84';

                        vm.searchOptions = oldVm.searchOptions;
                    }

                    // $log.log("FlightBookingInfoController - vm.bookingModel: " + JSON.stringify(vm.bookingModel));

                    // Get SSR
                    Flight.getTicketSsr(_booking_number_param).then(function success(result) {
                        vm.searchOptions.ssrOfferItemsDepart = result.departSsrOfferItems;
                        vm.searchOptions.ssrOfferItemsReturn = result.returnSsrOfferItems;
                    }, function error(err) {
                        $log.log("getTicketSsr - err: " + err);
                    });


                    // BACK 2U
                    DataService.setBookingModel(vm.bookingModel);
                    DataService.setSearchOption(vm.searchOptions);

                    $timeout(function() {
                        $rootScope.$broadcast("gtd-load-booking-completed", null);
                    }, 1000);


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
            $log.log("flight.booking.info - LOADING - _booking_number_param: " + _booking_number_param);
            vm._loadBookingInfo(_booking_number_param);

        } else {
            $log.log('++++ NO Booking Number - GOTO - flight');
            $state.go('flight-search-home');
        }

        //+++ handle authentication event
        $rootScope.$on('authenticationSuccess', function() {
            var isBookingInfoStage = $state.is('booking-info/:booking_number/:params');
            $log.log("flight.booking.info - IS booking-info/:booking_number/:params: " + isBookingInfoStage);

            var _bookingNumber = DataService.getBookingModel().bookingNumber;

            if (isBookingInfoStage && _bookingNumber) {
                $log.log("flight.booking.info - authenticationSuccess --- Checking.... ");

                //step 1:
                $log.log("flight.booking.info - CHANGE BOOKING OWNER - vm.bookingModel.bookingNumber: " + _bookingNumber);
                Flight.changeDraftBookingOwner(_bookingNumber).then(function(result) {
                    $log.log("flight.booking.info - changeDraftBookingOwner result: " + result);

                    //step 2:
                    $log.log("flight.booking.info - RELOAD - vm.bookingModel.bookingNumber: " + _bookingNumber);
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

        /**
         *
         * @param bookingForm
         * @returns {boolean}
         */
        vm.doConfirm = function(bookingForm) {
            if (!bookingForm.$valid) {
                angular.element("[name='" + bookingForm.$name + "']").find('.ng-invalid:visible:first').focus();
                return false;
            } else {
                DataService.setBookingModel(vm.bookingModel);

                $log.log('GOTO - booking-confirm');
                $state.go('booking-confirm/:booking_number/:params', {
                    "searchOptions": vm.searchOptions,
                    "searchResult": vm.searchResult,
                    "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber),
                    "params": ''
                });
                // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))});
                // $state.go('booking-confirm');
            }
        };


        /**
         *
         * @param step
         */
        vm.doBack = function(step) {
            var searchOptions = vm.searchOptions;
            var departSearchOptions = vm.departSearchOptions;

            if (searchOptions.searchType == 'oneway') {
                step = 1;
            } else {
                step = 2;
            }

            // TODO: remove later, current workaround for IE, force user to research
            $log.log('isIE = ' + ValidationUtils.isIE());
            if (ValidationUtils.isIE()) {
                searchOptions = {};
                step = 1;
            }

            var searchResult;
            $log.log(searchResult);

            // if (searchOptions.dtype == 'domestic') {
            if (step == 1) {
                searchOptions.returnDomestic = false;
                searchResult = DataService.getDepartSearchResult();
            } else if (step == 2) {
                if (searchOptions.dtype != 'international') {
                    searchOptions.returnDomestic = true;
                }

                searchResult = DataService.getReturnSearchResult();
            }

            searchOptions.selectStep = step;
            // search option is now return option -> for domestic need to set searchId back to departSearchId if change depart flight
            if (searchOptions.dtype == 'domestic' && searchOptions.selectStep == 1 && searchOptions.searchType == 'roundtrip') {
                searchOptions.searchId = departSearchOptions.searchId;
            }

            // calculate searchCompleted
            var searchCompleted;
            if (searchResult.groupPricedItineraries) {
                searchCompleted = true;
            } else {
                searchCompleted = false;
            }

            // TODO: remove later, current workaround for IE, force user to research
            $log.log('isIE = ' + ValidationUtils.isIE());
            if (ValidationUtils.isIE()) {
                searchCompleted = false;
                searchResult = {};
            }

            // $state.go('flight-search', {"searchOptions": searchOptions, "searchResult": searchResult});
            $log.log('GOTO - flight-search');

            $state.go('flight-search', {
                "searchOptions": searchOptions,
                "searchResult": searchResult,
                "searchCompleted": searchCompleted,
                "params": Base64.encodeJson(searchOptions)
                // , "params": Base64.encodeJson(vm.searchOptions)
            });

            $timeout(function() {
                // alert("BROADCAST");
                $rootScope.$broadcast("gtd-refresh-adv-search-result", null);
            }, 1000);
        };

        /** BEGIN CHECK TIMEOUT **/
        var promise;

        vm.checkTimeOut = function() {
            /* check for enter direct link */
            vm.timeout = !ValidationUtils.checkBookingTimeout(vm.bookingModel, DataService.getPaymentModel());
            if (vm.timeout) return;
        };
        $rootScope.$on('$stateChangeSuccess', function() {
            $uibModalStack.dismissAll();
        });

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

        vm.checkShowBillingInfo = function() {
            if (vm.currentMerchant == "FSOFT") {
                return false;
            }
            return true;
        }

    }
})();