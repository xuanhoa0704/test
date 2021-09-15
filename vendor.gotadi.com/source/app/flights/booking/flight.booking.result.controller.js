(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightBookingResultController', FlightBookingResultController);

    FlightBookingResultController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$uibModal', '$interval', 'Flight', 'DataService', 'DateUtils', 'ValidationUtils', 'CustomerService', 'FlightUtils', 'Base64', 'DialogService', '$location'];

    function FlightBookingResultController($log, $rootScope, $scope, $state, $stateParams, $timeout, $uibModal, $interval, Flight, DataService, DateUtils, ValidationUtils, CustomerService, FlightUtils, Base64, DialogService, $location) {
        var vm = this;
        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        // @..@ NAM.HUYNHPHUONG - close VNPAY popup
        if ($location.search().vnp_Amount) {
            if ($('#vnpay_close')) {
                $('#vnpay_close').click();
            }
            $state.reload();
        }

        //+++ initial data
        vm.profileBooking = $stateParams.profileBooking;

        if (!vm.searchOptions) {
            vm.searchOptions = {};
        }
        //---

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
        vm.closeLoading = function() {
            if (modalInstance == null) return;
            modalInstance.close();
        };
        vm.openLoading();

        // vm.departFlightModel = DataService.getDepartFlight();
        // vm.returnFlightModel = DataService.getReturnFlight();
        // vm.bookingModel = DataService.getBookingModel();
        // vm.paymentModel = DataService.getPaymentModel();

        $log.log('booking result - $stateParams - booking number:' + $stateParams.booking_number);

        //++++ initial parameter
        var _booking_number_param = Base64.decodeString($stateParams.booking_number);
        //---

        /**
         * NAM.HUYNHPHUONG - Mobile payment
         */
        if ($stateParams.is_mobile) {
            //++++ initial parameter
            if ($stateParams.is_mobile === 'mobile') {
                if ($stateParams.booking_number) {
                    CustomerService.getFinalBookingByNumber(_booking_number_param).then(function(result) {
                        var oldVm = FlightUtils.convertBookingToVM(result);
                        if (oldVm && oldVm.orgBookingModel && oldVm.orgBookingModel.bookingInfo) {
                            var bookingStatus = oldVm.orgBookingModel.bookingInfo.status;
                            var paymentStatus = oldVm.orgBookingModel.bookingInfo.paymentStatus;
                            var issueStatus = oldVm.orgBookingModel.bookingInfo.issuedStatus;
                            $state.go('mobile-booking-result?booking_status=:booking_status&payment_status=:payment_status&issue_status=:issue_status', {
                                'booking_status': bookingStatus,
                                'payment_status': paymentStatus,
                                'issue_status': issueStatus
                            });
                        }
                    });
                }
            }
        }

        if ($stateParams.booking_number) {
            CustomerService.getFinalBookingByNumber(_booking_number_param).then(function(result) {

                vm.closeLoading();

                var oldVm = FlightUtils.convertBookingToVM(result);
                if (oldVm && oldVm.orgBookingModel && oldVm.orgBookingModel.bookingInfo) {
                    // Check status
                    $log.log('vm.orgBookingModel=');
                    $log.log(oldVm.orgBookingModel);

                    var bookingStatus = oldVm.orgBookingModel.bookingInfo.status;
                    var paymentStatus = oldVm.orgBookingModel.bookingInfo.paymentStatus;
                    var issueStatus = oldVm.orgBookingModel.bookingInfo.issuedStatus;
                    var supplierBookingStatus = oldVm.orgBookingModel.bookingInfo.supplierBookingStatus;

                    //process all status
                    $log.log('bookingStatus=' + bookingStatus + ", paymentStatus = " + paymentStatus + ", issuedStatus = " + issueStatus + ", supplierBookingStatus = " + supplierBookingStatus);

                    $log.log('VIEW - Booking Result');

                    //+++ initial data
                    vm.bookingModel = oldVm.orgBookingModel;
                    vm.searchOptions = oldVm.searchOptions;

                    // if(angular.isUndefined(vm.searchOptions) || vm.searchOptions === null) {
                    //     vm.searchOptions = {};
                    // }
                    if (!vm.searchOptions) {
                        vm.searchOptions = {};
                    }
                    //---

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


                /** BEGIN OLD CODE **/
                vm.bkgroup = result;
                $log.log("+++++ vm.bkgroup = ");
                $log.log(vm.bkgroup);

                if (vm.bkgroup) {
                    // CustomerService.searchBookings({
                    //     "bookingCode": vm.bookingModel.bookingNumber,
                    //     "supplierType": 'AIR'
                    // }).then(function(result) {
                    //     $log.log('CustomerService.getBooking result = ');
                    //     $log.log(result);

                    // vm.bookingModel = result[0];
                    // vm.bookingModel.duration = DateUtils.timeDiff(vm.bookingModel.departureDate, vm.bookingModel.returnDate);

                    // var content = vm.bookingModel.content.bookingContent;

                    // $log.log(content);
                    //
                    // var obj = JSON.parse(content).items[0];

                    var obj = vm.bkgroup;

                    // Process contacts view
                    var contactInfos = [];
                    if (obj.travelerInfo) {
                        angular.forEach(obj.travelerInfo.contactInfos, function(value, key) {
                            var c = value;

                            // var idx = c.phoneNumber1.indexOf(" ");
                            // var mobileCode = c.phoneNumber1.substr(idx + 1);
                            // var mobile = c.phoneNumber1.substr(0, idx);

                            contactInfos.push({
                                "ciEmail": c.email,
                                "ciName": c.firstName + " " + c.lastName,
                                // "ciMobileCode": c.phoneNumber1,
                                "ciMobileCode": "",
                                "ciMobile": c.phoneNumber1
                            });
                        });
                    }

                    obj.contacts = contactInfos;

                    // Process customer view
                    var customerInfos = [];
                    if (obj.travelerInfo) {
                        angular.forEach(obj.travelerInfo.airTravelers, function(value, key) {
                            var c = value;

                            // var idx = c.phoneNumber1.indexOf(" ");
                            // var mobileCode = c.phoneNumber1.substr(idx + 1);
                            // var mobile = c.phoneNumber1.substr(0, idx);

                            var cardType;
                            var cardNumber;
                            if (c.memberCards && c.memberCards[0]) {
                                cardType = c.memberCards[0].cardType;
                                cardNumber = c.memberCards[0].cardNumber;
                            }

                            customerInfos.push({
                                "cuDob": c.dateOfBirth,
                                "cuId": c.passport.passportNumber,
                                "cuPp": "Passport",
                                "cuName": c.passengerName.firstName,
                                "cuGender": c.passengerName.title,
                                "cuCardNo": c.frequentFlyerNumber,
                                "cuNationality": c.passport.country,
                                "cuFamilyName": c.passengerName.lastName
                            });

                        });
                    }

                    obj.customers = customerInfos;

                    // Process tax view
                    obj.biCompany = vm.taxCompanyName;
                    obj.biMst = vm.taxNumber;
                    obj.biMobile = vm.taxAddress2;
                    obj.biAddress = vm.taxAddress1;

                    // process payment view
                    obj.departPricedItinerary = obj.groupPricedItineraries[0].pricedItineraries[0];
                    obj.departGroupItem = obj.groupPricedItineraries[0];


                    vm.searchOptions.searchType = 'oneway';

                    if (obj.groupPricedItineraries && obj.groupPricedItineraries[1]) {
                        obj.returnGroupItem = obj.groupPricedItineraries[1];
                        obj.returnPricedItinerary = obj.groupPricedItineraries[1].pricedItineraries[0];

                        vm.searchOptions.searchType = 'roundtrip';
                    } else if (obj.groupPricedItineraries[0].pricedItineraries[0].directionInd == 'RETURN') {
                        obj.returnGroupItem = obj.groupPricedItineraries[0];
                        obj.returnPricedItinerary = obj.groupPricedItineraries[0].pricedItineraries[0];

                        vm.searchOptions.searchType = 'roundtrip';
                    }

                    // Process flight view
                    if (obj.departGroupItem.flightType == 'INTERNATIONAL') {
                        vm.searchOptions.dtype = 'international';

                        // Convert for view details -- DEPART
                        vm.flightModel = {};
                        vm.bookingModel.checkIn = obj.departPricedItinerary.originDestinationOptions[0].originDateTime;
                        vm.bookingModel.checkOut = obj.departPricedItinerary.originDestinationOptions[0].destinationDateTime;
                        vm.bookingModel.noOfTransit = obj.departPricedItinerary.originDestinationOptions[0].flightSegments.length;
                        vm.bookingModel.supplierName = obj.departGroupItem.airlineName;
                        vm.bookingModel.airline = obj.departGroupItem.airline;
                        vm.bookingModel.carrierNo = obj.departGroupItem.fightNo;
                        vm.bookingModel.originLocationCode = obj.departGroupItem.originLocationCode;
                        vm.bookingModel.destinationLocationCode = obj.departGroupItem.destinationLocationCode;
                        vm.bookingModel.duration = obj.departPricedItinerary.originDestinationOptions[0].journeyDuration;
                        vm.bookingModel.supplierCode = obj.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                        vm.bookingModel.cabinClassName = obj.departPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
                        vm.bookingModel.flightIdx = 1;
                        vm.bookingModel.searchType = vm.searchOptions.searchType;
                        vm.bookingModel.booking = {};
                        vm.bookingModel.travelerInfo = obj.travelerInfo;
                        vm.bookingModel.pricedItinerary = obj.departPricedItinerary;
                        vm.bookingModel.flightSegments = obj.departPricedItinerary.originDestinationOptions[0].flightSegments;
                        vm.bookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;

                        // Convert for view details -- RETURN
                        // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                        if (obj.returnPricedItinerary && obj.returnGroupItem) {
                            vm.returnBookingModel.bookingNumber = vm.bookingModel.bookingNumber;
                            vm.returnBookingModel.checkIn = obj.returnPricedItinerary.originDestinationOptions[1].originDateTime;
                            vm.returnBookingModel.checkOut = obj.returnPricedItinerary.originDestinationOptions[1].destinationDateTime;
                            vm.returnBookingModel.noOfTransit = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments.length;
                            vm.returnBookingModel.supplierName = obj.returnGroupItem.airlineName;
                            vm.returnBookingModel.airline = obj.returnGroupItem.airline;
                            vm.returnBookingModel.carrierNo = obj.returnGroupItem.fightNo;
                            vm.returnBookingModel.originLocationCode = obj.returnPricedItinerary.originDestinationOptions[1].originLocationCode;
                            vm.returnBookingModel.destinationLocationCode = obj.returnPricedItinerary.originDestinationOptions[1].destinationLocationCode;
                            vm.returnBookingModel.duration = obj.returnPricedItinerary.originDestinationOptions[1].journeyDuration;
                            vm.returnBookingModel.supplierCode = obj.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                            vm.returnBookingModel.cabinClassName = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments[0].cabinClassName;
                            vm.returnBookingModel.flightIdx = 2;
                            vm.returnBookingModel.searchType = vm.searchOptions.searchType;
                            vm.returnBookingModel.booking = {};
                            vm.returnBookingModel.travelerInfo = obj.travelerInfo;
                            vm.returnBookingModel.pricedItinerary = obj.returnPricedItinerary;
                            vm.returnBookingModel.flightSegments = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments;
                            vm.returnBookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;
                        }

                    } else {
                        vm.searchOptions.dtype = 'domestic';

                        // Convert for view details -- DEPART
                        // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                        vm.bookingModel.checkIn = obj.departPricedItinerary.originDestinationOptions[0].originDateTime;
                        vm.bookingModel.checkOut = obj.departPricedItinerary.originDestinationOptions[0].destinationDateTime;
                        vm.bookingModel.noOfTransit = 1;
                        vm.bookingModel.supplierName = obj.departGroupItem.airlineName;
                        vm.bookingModel.airline = obj.departGroupItem.airline;
                        vm.bookingModel.carrierNo = obj.departGroupItem.fightNo;
                        vm.bookingModel.originLocationCode = obj.departGroupItem.originLocationCode;
                        vm.bookingModel.destinationLocationCode = obj.departGroupItem.destinationLocationCode;
                        vm.bookingModel.duration = obj.departPricedItinerary.originDestinationOptions[0].journeyDuration;
                        vm.bookingModel.supplierCode = obj.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                        vm.bookingModel.cabinClassName = obj.departPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
                        vm.bookingModel.flightIdx = 1;
                        vm.bookingModel.searchType = vm.searchOptions.searchType;
                        vm.bookingModel.booking = {};
                        vm.bookingModel.travelerInfo = obj.travelerInfo;
                        vm.bookingModel.pricedItinerary = obj.departPricedItinerary;
                        vm.bookingModel.flightSegments = obj.departPricedItinerary.originDestinationOptions[0].flightSegments;
                        vm.bookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;

                        // Convert for view details -- RETURN
                        // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                        if (obj.returnPricedItinerary && obj.returnGroupItem) {
                            vm.returnBookingModel.bookingNumber = vm.bookingModel.bookingNumber;
                            vm.returnBookingModel.checkIn = obj.returnPricedItinerary.originDestinationOptions[0].originDateTime;
                            vm.returnBookingModel.checkOut = obj.returnPricedItinerary.originDestinationOptions[0].destinationDateTime;
                            vm.returnBookingModel.noOfTransit = 1;
                            vm.returnBookingModel.supplierName = obj.returnGroupItem.airlineName;
                            vm.returnBookingModel.airline = obj.returnGroupItem.airline;
                            vm.returnBookingModel.carrierNo = obj.returnGroupItem.fightNo;
                            vm.returnBookingModel.originLocationCode = obj.returnGroupItem.originLocationCode;
                            vm.returnBookingModel.destinationLocationCode = obj.returnGroupItem.destinationLocationCode;
                            vm.returnBookingModel.duration = obj.returnPricedItinerary.originDestinationOptions[0].journeyDuration;
                            vm.returnBookingModel.supplierCode = obj.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                            vm.returnBookingModel.cabinClassName = obj.returnPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
                            vm.returnBookingModel.flightIdx = 2;
                            vm.returnBookingModel.searchType = vm.searchOptions.searchType;
                            vm.returnBookingModel.booking = {};
                            vm.returnBookingModel.travelerInfo = obj.travelerInfo;
                            vm.returnBookingModel.pricedItinerary = obj.returnPricedItinerary;
                            vm.returnBookingModel.flightSegments = obj.returnPricedItinerary.originDestinationOptions[0].flightSegments;
                            vm.returnBookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;
                        }
                    }

                    // bind to view
                    vm.orgBookingModel = obj;
                    // }, function(result) {
                    //     vm.productBooking = {};
                    //     $log.log("++ vm.productBooking failed ++ ");
                    // });
                } else {
                    $log.log('++++ Booking Not FOUND - GOTO - flight');
                    $state.go('flight-search-home');
                }
                /** END OLD CODE **/
            }, function error(result) {
                $log.log('flight-search');
                $state.go('flight-search', {
                    "searchOptions": vm.searchOptions,
                    "searchResult": vm.searchResult,
                    "params": Base64.encodeJson(vm.searchOptions)
                });
            });

        } else {
            $log.log('++++ NO Booking Number - GOTO - flight');
            $state.go('flight-search-home');
        }

        vm.departFlightModel = DataService.getDepartFlight();
        vm.returnFlightModel = DataService.getReturnFlight();
        vm.paymentModel = DataService.getPaymentModel();

        // if ($stateParams.params) {
        //     try {
        //         vm.bookingModel =  JSON.parse(Base64.decode($stateParams.params));
        //
        //         // vm.bookingModel.departGroupItem = DataService.getDepartGroupItem();
        //         // vm.bookingModel.departPricedItinerary = DataService.getDepartPricedItinerary();
        //         //
        //         // vm.bookingModel.returnGroupItem = DataService.getReturnGroupItem();
        //         // vm.bookingModel.returnPricedItinerary = DataService.getReturnPricedItinerary();
        //
        //         vm.departSearchOptions = vm.bookingModel.departSearchOptions;
        //         vm.returnSearchOptions = vm.bookingModel.returnSearchOptions;
        //         // vm.searchResult = DataService.getSearchResult();
        //         vm.searchOptions = vm.bookingModel.searchOptions;
        //
        //
        //         // BACK 2U
        //         DataService.setBookingModel(vm.bookingModel);
        //         DataService.setSearchOption(vm.searchOptions);
        //
        //     } catch (err) {
        //         $log.log(err);
        //         $state.go('flight-search', {"searchOptions": vm.searchOptions, "searchResult": vm.searchResult
        //             , "params": Base64.encode(JSON.stringify(vm.searchOptions))});
        //     }
        // }

        /** BEGIN CHECK TIMEOUT **/
        // Reset New Transaction Time
        // DataService.setNewStartTransactionTime();

        vm.checkTimeOut = function() {
            /* check for enter direct link */
            vm.timeout = !ValidationUtils.checkBookingTimeout(DataService.getBookingModel(), DataService.getPaymentModel(), /** ignore true **/ true);
            if (vm.timeout) return;
        };

        // starts the interval
        $scope.start = function() {
            vm.checkTimeOut();
        };

        // starting the interval by default
        // $scope.start();
        /** END CHECK TIMEOUT **/

        //TODO: remove later
        // vm.paymentModel.paymentOption = 'reserve';
        vm.returnBookingModel = {};

        // vm.bookingModel.departGroupItem = DataService.getDepartGroupItem();
        // vm.bookingModel.departPricedItinerary = DataService.getDepartPricedItinerary();
        //
        // vm.bookingModel.returnGroupItem = DataService.getReturnGroupItem();
        // vm.bookingModel.returnPricedItinerary = DataService.getReturnPricedItinerary();
        //
        // vm.departSearchOptions = DataService.getDepartSearchOption();
        // vm.returnSearchOptions = DataService.getReturnSearchOption();

        // vm.searchOptions = DataService.getSearchOption();

        // $log.log(vm.bookingModel.departGroupItem);
        // $log.log(vm.bookingModel.departPricedItinerary);
        // $log.log(vm.bookingModel);

        $log.log('+++++ START vm.bkgroup = "');
        if (vm.profileBooking) {
            vm.bookingModel = vm.profileBooking;
        }

        if (!vm.bookingModel) {
            vm.bookingModel = {};
        }

        // TODO: for testing
        // vm.bookingModel.bookingNumber = 'AICO1707100003822';

        // CustomerService.getBookingByNumber(_booking_number_param).then(function (result) {
        //     vm.bkgroup = result;
        //     $log.log("+++++ vm.bkgroup = ");
        //     $log.log(vm.bkgroup);
        //
        //     if(vm.bkgroup) {
        //         // CustomerService.searchBookings({
        //         //     "bookingCode": vm.bookingModel.bookingNumber,
        //         //     "supplierType": 'AIR'
        //         // }).then(function(result) {
        //         //     $log.log('CustomerService.getBooking result = ');
        //         //     $log.log(result);
        //
        //         // vm.bookingModel = result[0];
        //         // vm.bookingModel.duration = DateUtils.timeDiff(vm.bookingModel.departureDate, vm.bookingModel.returnDate);
        //
        //         // var content = vm.bookingModel.content.bookingContent;
        //
        //         // $log.log(content);
        //         //
        //         // var obj = JSON.parse(content).items[0];
        //
        //         var obj = vm.bkgroup;
        //
        //         // Process contacts view
        //         var contactInfos = [];
        //         if (obj.travelerInfo) {
        //             angular.forEach(obj.travelerInfo.contactInfos, function (value, key) {
        //                 var c = value;
        //
        //                 // var idx = c.phoneNumber1.indexOf(" ");
        //                 // var mobileCode = c.phoneNumber1.substr(idx + 1);
        //                 // var mobile = c.phoneNumber1.substr(0, idx);
        //
        //                 contactInfos.push(
        //                     {
        //                         "ciEmail": c.email,
        //                         "ciName": c.firstName + " " + c.lastName,
        //                         // "ciMobileCode": c.phoneNumber1,
        //                         "ciMobileCode": "",
        //                         "ciMobile": c.phoneNumber1
        //                     }
        //                 );
        //             });
        //         }
        //
        //         obj.contacts = contactInfos;
        //
        //         // Process customer view
        //         var customerInfos = [];
        //         if (obj.travelerInfo) {
        //             angular.forEach(obj.travelerInfo.airTravelers, function (value, key) {
        //                 var c = value;
        //
        //                 // var idx = c.phoneNumber1.indexOf(" ");
        //                 // var mobileCode = c.phoneNumber1.substr(idx + 1);
        //                 // var mobile = c.phoneNumber1.substr(0, idx);
        //
        //                 var cardType;
        //                 var cardNumber;
        //                 if (c.memberCards && c.memberCards[0]) {
        //                     cardType = c.memberCards[0].cardType;
        //                     cardNumber = c.memberCards[0].cardNumber;
        //                 }
        //
        //                 customerInfos.push(
        //                     {
        //                         "cuDob": c.dateOfBirth,
        //                         "cuId": c.passport.passportNumber,
        //                         "cuPp": "Passport",
        //                         "cuName": c.passengerName.firstName,
        //                         "cuGender": c.passengerName.title,
        //                         "cuCardNo": c.frequentFlyerNumber,
        //                         "cuNationality": c.passport.country,
        //                         "cuFamilyName": c.passengerName.lastName
        //                     }
        //                 );
        //
        //             });
        //         }
        //
        //         obj.customers = customerInfos;
        //
        //         // Process tax view
        //         obj.biCompany = vm.taxCompanyName;
        //         obj.biMst = vm.taxNumber;
        //         obj.biMobile = vm.taxAddress2;
        //         obj.biAddress = vm.taxAddress1;
        //
        //         // process payment view
        //         obj.departPricedItinerary = obj.groupPricedItineraries[0].pricedItineraries[0];
        //         obj.departGroupItem = obj.groupPricedItineraries[0];
        //
        //
        //         vm.searchOptions.searchType = 'oneway';
        //
        //         if (obj.groupPricedItineraries && obj.groupPricedItineraries[1]) {
        //             obj.returnGroupItem = obj.groupPricedItineraries[1];
        //             obj.returnPricedItinerary = obj.groupPricedItineraries[1].pricedItineraries[0];
        //
        //             vm.searchOptions.searchType = 'roundtrip';
        //         } else if (obj.groupPricedItineraries[0].pricedItineraries[0].directionInd == 'RETURN') {
        //             obj.returnGroupItem = obj.groupPricedItineraries[0];
        //             obj.returnPricedItinerary = obj.groupPricedItineraries[0].pricedItineraries[0];
        //
        //             vm.searchOptions.searchType = 'roundtrip';
        //         }
        //
        //         // Process flight view
        //         if (obj.departGroupItem.flightType == 'INTERNATIONAL') {
        //             vm.searchOptions.dtype = 'international';
        //
        //             // Convert for view details -- DEPART
        //             vm.flightModel = {};
        //             vm.bookingModel.checkIn = obj.departPricedItinerary.originDestinationOptions[0].originDateTime;
        //             vm.bookingModel.checkOut = obj.departPricedItinerary.originDestinationOptions[0].destinationDateTime;
        //             vm.bookingModel.noOfTransit = obj.departPricedItinerary.originDestinationOptions[0].flightSegments.length;
        //             vm.bookingModel.supplierName = obj.departGroupItem.airlineName;
        //             vm.bookingModel.airline = obj.departGroupItem.airline;
        //             vm.bookingModel.carrierNo = obj.departGroupItem.fightNo;
        //             vm.bookingModel.originLocationCode = obj.departGroupItem.originLocationCode;
        //             vm.bookingModel.destinationLocationCode = obj.departGroupItem.destinationLocationCode;
        //             vm.bookingModel.duration = obj.departPricedItinerary.originDestinationOptions[0].journeyDuration;
        //             vm.bookingModel.supplierCode = obj.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
        //             vm.bookingModel.cabinClassName = obj.departPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
        //             vm.bookingModel.flightIdx = 1;
        //             vm.bookingModel.searchType = vm.searchOptions.searchType;
        //             vm.bookingModel.booking = {};
        //             vm.bookingModel.travelerInfo = obj.travelerInfo;
        //             vm.bookingModel.pricedItinerary = obj.departPricedItinerary;
        //             vm.bookingModel.flightSegments = obj.departPricedItinerary.originDestinationOptions[0].flightSegments;
        //             vm.bookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;
        //
        //             // Convert for view details -- RETURN
        //             // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
        //             if (obj.returnPricedItinerary && obj.returnGroupItem) {
        //                 vm.returnBookingModel.bookingNumber = vm.bookingModel.bookingNumber;
        //                 vm.returnBookingModel.checkIn = obj.returnPricedItinerary.originDestinationOptions[1].originDateTime;
        //                 vm.returnBookingModel.checkOut = obj.returnPricedItinerary.originDestinationOptions[1].destinationDateTime;
        //                 vm.returnBookingModel.noOfTransit = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments.length;
        //                 vm.returnBookingModel.supplierName = obj.returnGroupItem.airlineName;
        //                 vm.returnBookingModel.airline = obj.returnGroupItem.airline;
        //                 vm.returnBookingModel.carrierNo = obj.returnGroupItem.fightNo;
        //                 vm.returnBookingModel.originLocationCode = obj.returnPricedItinerary.originDestinationOptions[1].originLocationCode;
        //                 vm.returnBookingModel.destinationLocationCode = obj.returnPricedItinerary.originDestinationOptions[1].destinationLocationCode;
        //                 vm.returnBookingModel.duration = obj.returnPricedItinerary.originDestinationOptions[1].journeyDuration;
        //                 vm.returnBookingModel.supplierCode = obj.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
        //                 vm.returnBookingModel.cabinClassName = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments[0].cabinClassName;
        //                 vm.returnBookingModel.flightIdx = 2;
        //                 vm.returnBookingModel.searchType = vm.searchOptions.searchType;
        //                 vm.returnBookingModel.booking = {};
        //                 vm.returnBookingModel.travelerInfo = obj.travelerInfo;
        //                 vm.returnBookingModel.pricedItinerary = obj.returnPricedItinerary;
        //                 vm.returnBookingModel.flightSegments = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments;
        //                 vm.returnBookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;
        //             }
        //
        //         } else {
        //             vm.searchOptions.dtype = 'domestic';
        //
        //             // Convert for view details -- DEPART
        //             // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
        //             vm.bookingModel.checkIn = obj.departPricedItinerary.originDestinationOptions[0].originDateTime;
        //             vm.bookingModel.checkOut = obj.departPricedItinerary.originDestinationOptions[0].destinationDateTime;
        //             vm.bookingModel.noOfTransit = 1;
        //             vm.bookingModel.supplierName = obj.departGroupItem.airlineName;
        //             vm.bookingModel.airline = obj.departGroupItem.airline;
        //             vm.bookingModel.carrierNo = obj.departGroupItem.fightNo;
        //             vm.bookingModel.originLocationCode = obj.departGroupItem.originLocationCode;
        //             vm.bookingModel.destinationLocationCode = obj.departGroupItem.destinationLocationCode;
        //             vm.bookingModel.duration = obj.departPricedItinerary.originDestinationOptions[0].journeyDuration;
        //             vm.bookingModel.supplierCode = obj.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
        //             vm.bookingModel.cabinClassName = obj.departPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
        //             vm.bookingModel.flightIdx = 1;
        //             vm.bookingModel.searchType = vm.searchOptions.searchType;
        //             vm.bookingModel.booking = {};
        //             vm.bookingModel.travelerInfo = obj.travelerInfo;
        //             vm.bookingModel.pricedItinerary = obj.departPricedItinerary;
        //             vm.bookingModel.flightSegments = obj.departPricedItinerary.originDestinationOptions[0].flightSegments;
        //             vm.bookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;
        //
        //             // Convert for view details -- RETURN
        //             // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
        //             if (obj.returnPricedItinerary && obj.returnGroupItem) {
        //                 vm.returnBookingModel.bookingNumber = vm.bookingModel.bookingNumber;
        //                 vm.returnBookingModel.checkIn = obj.returnPricedItinerary.originDestinationOptions[0].originDateTime;
        //                 vm.returnBookingModel.checkOut = obj.returnPricedItinerary.originDestinationOptions[0].destinationDateTime;
        //                 vm.returnBookingModel.noOfTransit = 1;
        //                 vm.returnBookingModel.supplierName = obj.returnGroupItem.airlineName;
        //                 vm.returnBookingModel.airline = obj.returnGroupItem.airline;
        //                 vm.returnBookingModel.carrierNo = obj.returnGroupItem.fightNo;
        //                 vm.returnBookingModel.originLocationCode = obj.returnGroupItem.originLocationCode;
        //                 vm.returnBookingModel.destinationLocationCode = obj.returnGroupItem.destinationLocationCode;
        //                 vm.returnBookingModel.duration = obj.returnPricedItinerary.originDestinationOptions[0].journeyDuration;
        //                 vm.returnBookingModel.supplierCode = obj.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
        //                 vm.returnBookingModel.cabinClassName = obj.returnPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
        //                 vm.returnBookingModel.flightIdx = 2;
        //                 vm.returnBookingModel.searchType = vm.searchOptions.searchType;
        //                 vm.returnBookingModel.booking = {};
        //                 vm.returnBookingModel.travelerInfo = obj.travelerInfo;
        //                 vm.returnBookingModel.pricedItinerary = obj.returnPricedItinerary;
        //                 vm.returnBookingModel.flightSegments = obj.returnPricedItinerary.originDestinationOptions[0].flightSegments;
        //                 vm.returnBookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;
        //             }
        //         }
        //
        //         // bind to view
        //         vm.orgBookingModel = obj;
        //         // }, function(result) {
        //         //     vm.productBooking = {};
        //         //     $log.log("++ vm.productBooking failed ++ ");
        //         // });
        //     } else {
        //         $log.log('++++ Booking Not FOUND - GOTO - flight');
        //         $state.go('flight-search-home');
        //     }
        // }, function error(result) {
        //     $log.log('flight-search');
        //     $state.go('flight-search', {"searchOptions": vm.searchOptions, "searchResult": vm.searchResult
        //         , "params": Base64.encodeJson(vm.searchOptions)});
        // });
        // $log.log('+++++ END vm.bkgroup = "');


        // if (vm.profileBooking) {
        //     vm.flightModel = vm.profileBooking;
        // } else {
        //     if (vm.searchOptions.dtype == 'international') {
        //         // Convert for view details -- DEPART
        //         vm.flightModel = {};
        //         vm.flightModel.bookingNumber = vm.bookingModel.bookingNumber;
        //         vm.flightModel.checkIn = vm.bookingModel.departPricedItinerary.originDestinationOptions[0].originDateTime;
        //         vm.flightModel.checkOut = vm.bookingModel.departPricedItinerary.originDestinationOptions[0].destinationDateTime;
        //         vm.flightModel.noOfTransit = vm.bookingModel.departPricedItinerary.originDestinationOptions[0].flightSegments.length;
        //         vm.flightModel.supplierName = vm.bookingModel.departGroupItem.airline;
        //         vm.flightModel.carrierNo = vm.bookingModel.departGroupItem.fightNo;
        //         vm.flightModel.originLocationCode = vm.bookingModel.departGroupItem.originLocationCode;
        //         vm.flightModel.destinationLocationCode = vm.bookingModel.departGroupItem.destinationLocationCode;
        //         vm.flightModel.duration = vm.bookingModel.departPricedItinerary.originDestinationOptions[0].journeyDuration;
        //         vm.flightModel.supplierCode = vm.bookingModel.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
        //         vm.flightModel.booking = {};
        //
        //     } else {
        //         // Convert for view details -- DEPART
        //         vm.flightModel = {};
        //         vm.flightModel.bookingNumber = vm.bookingModel.bookingNumber;
        //         vm.flightModel.checkIn = vm.bookingModel.departPricedItinerary.originDestinationOptions[0].flightSegments[0].departureDateTime;
        //         vm.flightModel.checkOut = vm.bookingModel.departPricedItinerary.originDestinationOptions[0].flightSegments[0].arrivalDateTime;
        //         vm.flightModel.noOfTransit = 1;
        //         vm.flightModel.supplierName = vm.bookingModel.departGroupItem.airline;
        //         vm.flightModel.carrierNo = vm.bookingModel.departGroupItem.fightNo;
        //         vm.flightModel.originLocationCode = vm.bookingModel.departGroupItem.originLocationCode;
        //         vm.flightModel.destinationLocationCode = vm.bookingModel.departGroupItem.destinationLocationCode;
        //         vm.flightModel.duration = DateUtils.timeDiff(vm.flightModel.checkIn, vm.flightModel.checkOut);
        //         vm.flightModel.supplierCode = vm.bookingModel.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
        //         vm.flightModel.booking = {};
        //
        //         // Convert for view details -- RETURN
        //         // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
        //         // if (vm.searchOptions ) {
        //         //     vm.returnBookingModel.checkIn = new Date(obj.returnPricedItinerary.originDestinationOptions[0].originDateTime*1000);
        //         //     vm.returnBookingModel.checkOut = new Date(obj.returnPricedItinerary.originDestinationOptions[0].destinationDateTime*1000);
        //         //     vm.returnBookingModel.noOfTransit = 1;
        //         //     vm.returnBookingModel.supplierName = obj.returnGroupItem.airline;
        //         //     vm.returnBookingModel.carrierNo = obj.returnGroupItem.fightNo;
        //         //     vm.returnBookingModel.originLocationCode = obj.returnGroupItem.originLocationCode;
        //         //     vm.returnBookingModel.destinationLocationCode = obj.returnGroupItem.destinationLocationCode;
        //         //     vm.returnBookingModel.duration = obj.returnPricedItinerary.originDestinationOptions[0].journeyDuration;
        //         //     vm.returnBookingModel.supplierCode = obj.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
        //         //     vm.returnBookingModel.booking = {};
        //         // }
        //     }
        // }

        //vm.bookingModel.curStep = 3;

        vm.doConfirm = function() {
            //TODO - why dont have booking_number???
            // TAN - TODO
            // if($ctrl.paymentModel.isMobileApp && $ctrl.paymentModel.isMobileApp == true) {
            //     $log.log('bookingStatus=' + bookingStatus + ", paymentStatus = " + paymentStatus + ", issuedStatus = " + issueStatus + ", supplierBookingStatus = " + supplierBookingStatus);
            // TODO
            // Step 1 - get booking detail
            // Step 2 - redirect URL http://mobiapp/x/y/z
            //     $state.go('booking-mobile-result');
            // } else {
            // $state.go('booking-result');
            // }
            $state.go('booking-result');
        };

        vm.doBack = function() {
            //TODO - why dont have booking_number???
            $state.go('booking-confirm');
        };
    }
})();