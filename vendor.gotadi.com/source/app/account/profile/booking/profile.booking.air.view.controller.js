(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileBookingAirViewController', ProfileBookingAirViewController);

    ProfileBookingAirViewController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$uibModal', 'CustomerService', 'DateUtils', 'DataService', 'Flight', 'DialogService', 'Base64', 'Principal', '$cookies', '$window', 'MerchantService'];

    function ProfileBookingAirViewController($log, $rootScope, $scope, $state, $stateParams, $timeout, $uibModal, CustomerService, DateUtils, DataService, Flight, DialogService, Base64, Principal, $cookies, $window, MerchantService) {
        var vm = this;
        vm.viettelPayment = viettelPayment;

        vm.showPaymentInfo = !MerchantService.isSimpleView();
        vm.showProfileInfo = !MerchantService.isSimpleView();
        vm.merchantList = ['VIETTEL', 'TIKI', 'FSOFT', 'TRUEMONEY', 'FASTGO'];

        // Get current merchant.
        vm.currentMerchant = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;
        vm.profileModel = {};
        Principal.identity().then(function(user) {
            vm.profileModel.socialUser = user.socialUser;
            $log.log(vm.profileModel.socialUser);
            //$log.log("loginuser="+ JSON.stringify(user));
            $log.log("loginuser=" + user);
        });

        CustomerService.getShortProfile().then(function(result) {
            var requester = result;
            CustomerService.getCustomerProfile(requester.requesterId).then(function(spResult) {
                //$log.log("spResult  = " + JSON.stringify(spResult));
                $log.log("spResult  = " + spResult);

                vm.shortProfile = spResult;

                //+++ initial data
                vm.profileModel = {};
                vm.profileModel.phoneNumbers = [];
                if (vm.profileModel.phoneNumbers.length === 0) {
                    vm.profileModel.phoneNumbers.push({
                        text: ''
                    });
                }

                // Init membercards
                if (!vm.profileModel.memberCards) {
                    vm.profileModel.memberCards = [];
                }
                vm.profileModel.editMemberCards = [];
                vm.profileModel.editMemberCards.push({
                    cardType: '',
                    cardNumber: ''
                });

                vm.profileModel.type = 'profile';

                // 'view', 'edit'
                // var defaultMode = 'view';
                vm.profileModel.mode = 'view';
                //---

                if (vm.shortProfile.defaultTravellerId) {
                    CustomerService.getCustomerTraveller(vm.shortProfile.defaultTravellerId).then(function success(result) {
                        vm.profileModel = result;
                        //+++ get avartar
                        CustomerService.getCustomerProfileAvatar(vm.shortProfile.id).then(function success(resultAv) {

                            vm.profileModel.avatar = resultAv;

                            if (resultAv === null || resultAv === "") {
                                vm.profileModel.avatar = {
                                    avatarImage: null,
                                    avatarImageContentType: "",
                                    profileId: 0,
                                    inUsed: true,
                                    createdDate: ""
                                };
                            }
                            vm.profileModel.profileid = vm.shortProfile.id;
                        });

                        // Init Phone
                        vm.profileModel.phoneNumbers = [];
                        if (vm.profileModel.phoneNumber1) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber1
                        });
                        if (vm.profileModel.phoneNumber2) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber2
                        });
                        if (vm.profileModel.phoneNumber3) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber3
                        });
                        if (vm.profileModel.phoneNumber4) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber4
                        });
                        if (vm.profileModel.phoneNumber5) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber5
                        });

                        if (vm.profileModel.phoneNumbers.length === 0) {
                            vm.profileModel.phoneNumbers.push({
                                text: ''
                            });
                        }

                        // Init membercards
                        if (!vm.profileModel.memberCards) {
                            vm.profileModel.memberCards = [];
                        }
                        vm.profileModel.editMemberCards = [];
                        vm.profileModel.editMemberCards.push({
                            cardType: '',
                            cardNumber: ''
                        });

                        vm.profileModel.type = 'profile';

                        // 'view', 'edit'
                        // var defaultMode = 'view';
                        vm.profileModel.mode = 'view';

                        Principal.identity().then(function(user) {
                            vm.profileModel.socialUser = user.socialUser;
                            $log.log('++++++++++++++++++++++++++');
                            $log.log('vm.profileModel.socialUser =' + vm.profileModel.socialUser);
                        });

                    }, function error(result) {
                        $log.log('+++++>> getCustomerTraveller Error: ' + result);

                        // vm.profileModel = {};
                        // vm.profileModel.phoneNumbers = [];
                        // if (vm.profileModel.phoneNumbers.length === 0) {
                        //     vm.profileModel.phoneNumbers.push({text: ''});
                        // }
                        //
                        // // Init membercards
                        // if (!vm.profileModel.memberCards) {
                        //     vm.profileModel.memberCards = [];
                        // }
                        // vm.profileModel.editMemberCards = [];
                        // vm.profileModel.editMemberCards.push({cardType: '', cardNumber: ''});
                        //
                        // vm.profileModel.type = 'profile';
                        //
                        // // 'view', 'edit'
                        // // var defaultMode = 'view';
                        // vm.profileModel.mode = 'view';
                    });
                }

                vm.profileModel.type = "profile";
                //$log.log(vm.profileModel);
                // 'view', 'edit'
                // var defaultMode = 'view';
                vm.profileModel.mode = 'view';
            });
        });
        vm.bookingModel = {};
        vm.returnBookingModel = {};
        vm.searchOptions = {};

        vm.paymentModel = {};

        vm.bookingModel.airView = true;
        vm.paymentModel.airView = true;

        //TODO: remove later
        vm.paymentModel.cardModel = {};

        vm.paymentModel.paToken = null;

        var bookingNumber = Base64.decodeString($stateParams.booking_number);

        $log.log("ProfileBookingAirViewController - bookingNumber:" + bookingNumber);

        CustomerService.getBookingByNumber(bookingNumber).then(function(result) {
            $log.log('CustomerService.getBooking result = ');

            $log.log("CustomerService.getBookingByNumber result:");
            //$log.log("data=" + JSON.stringify(result));
            $log.log("data=" + result);
            $log.log("++++++++++++++++++++++++++++");

            if (result && result.bookingInfo) {
                vm.bjson = result;

                vm.bookingModel = result.bookingInfo;
                //vm.bookingModel.duration = DateUtils.timeDiff(vm.bookingModel.departureDate, vm.bookingModel.returnDate);

                // var content = vm.bookingModel.content.bookingContent;
                // $log.log(content);
                // var obj = JSON.parse(content).items[0];

                var obj = result;

                // Process contacts view
                var contactInfos = [];
                if (obj.bookingInfo && obj.bookingInfo.contactInfos) {
                    angular.forEach(obj.bookingInfo.contactInfos, function(value, key) {
                        var c = value;

                        contactInfos.push({
                            "ciGender": c.gender,
                            "ciEmail": c.email,
                            "ciName": c.surName,
                            "ciFName": c.firstName,
                            "ciMobileCode": c.phoneCode1,
                            "ciMobile": c.phoneNumber1
                        });
                    });
                }

                obj.contacts = contactInfos;

                // Process customer view
                var customerInfos = [];
                if (obj.travelerInfo && obj.travelerInfo.airTravelers) {
                    angular.forEach(obj.travelerInfo.airTravelers, function(value, key) {
                        var c = value;

                        // var cardType;
                        // var cardNumber;
                        // if (c.memberCards && c.memberCards[0]) {
                        //     cardType = c.memberCards[0].cardType;
                        //     cardNumber = c.memberCards[0].cardNumber;
                        // }

                        var customer = {
                            /* passport info */
                            "cuPp": "Passport",
                            "cuId": c.passport.passportNumber,
                            "cuExpiredDate": c.passport.expiryDate,
                            "cuNationality": c.passport.country,
                            /* passenger info */
                            "type": c.passengerType,
                            "cuName": c.passengerName.firstName,
                            "cuFamilyName": c.passengerName.lastName,
                            "cuGender": c.passengerName.title,
                            //"cuDob": new Date(c.dateOfBirth * 1000),
                            "cuDob": c.dateOfBirth,
                            "cuCardType": c.frequentFlyerType,
                            "cuCardNo": c.frequentFlyerNumber,
                            "ssrRequest": c.specialServiceRequest
                        };

                        if (c.specialServiceRequest && c.specialServiceRequest.ssrItems) {
                            customer.departServiceRequests = [];
                            customer.returnServiceRequests = [];

                            angular.forEach(c.specialServiceRequest.ssrItems, function(ssr) {
                                if (ssr.direction == 'DEPARTURE') {
                                    var tmp = ssr;
                                    customer.departServiceRequests.push(tmp);
                                } else if (ssr.direction == 'RETURN') {
                                    var tmp = ssr;
                                    customer.returnServiceRequests.push(tmp);
                                }
                            });
                        }

                        customerInfos.push(customer);

                    });
                }

                obj.customers = customerInfos;

                // Process tax view
                obj.biCompany = vm.bookingModel.taxCompanyName;
                obj.biMst = vm.bookingModel.taxNumber;
                obj.biMobile = vm.bookingModel.taxAddress2;
                obj.biAddress = vm.bookingModel.taxAddress1;

                // process payment view
                obj.departPricedItinerary = obj.groupPricedItineraries[0].pricedItineraries[0];
                obj.departGroupItem = obj.groupPricedItineraries[0];

                vm.searchOptions.searchType = 'oneway';

                if ((obj.groupPricedItineraries && obj.groupPricedItineraries[1])) {
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
                    //vm.bookingModel.dtype = 'international';

                    // Convert for view details -- DEPART
                    vm.flightModel = {};
                    vm.bookingModel.checkIn = new Date(obj.departPricedItinerary.originDestinationOptions[0].originDateTime);
                    vm.bookingModel.checkOut = new Date(obj.departPricedItinerary.originDestinationOptions[0].destinationDateTime);
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
                    vm.bookingModel.pricedItinerary = obj.departPricedItinerary;
                    vm.bookingModel.flightSegments = obj.departPricedItinerary.originDestinationOptions[0].flightSegments;
                    // vm.bookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;


                    // Convert for view details -- RETURN
                    // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                    if (obj.returnPricedItinerary && obj.returnGroupItem) {
                        vm.returnBookingModel.bookingNumber = vm.bookingModel.bookingNumber;
                        vm.returnBookingModel.checkIn = new Date(obj.returnPricedItinerary.originDestinationOptions[1].originDateTime);
                        vm.returnBookingModel.checkOut = new Date(obj.returnPricedItinerary.originDestinationOptions[1].destinationDateTime);
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
                        vm.returnBookingModel.pricedItinerary = obj.returnPricedItinerary;
                        vm.returnBookingModel.flightSegments = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments;
                        vm.returnBookingModel.passengerNameRecords = vm.bookingModel.passengerNameRecords;
                    }

                } else {
                    vm.searchOptions.dtype = 'domestic';

                    // Convert for view details -- DEPART
                    // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                    vm.bookingModel.checkIn = new Date(obj.departPricedItinerary.originDestinationOptions[0].originDateTime);
                    vm.bookingModel.checkOut = new Date(obj.departPricedItinerary.originDestinationOptions[0].destinationDateTime);
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
                    vm.bookingModel.pricedItinerary = obj.departPricedItinerary;
                    vm.bookingModel.flightSegments = obj.departPricedItinerary.originDestinationOptions[0].flightSegments;

                    // Convert for view details -- RETURN
                    // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                    if (obj.returnPricedItinerary && obj.returnGroupItem) {
                        vm.returnBookingModel.bookingNumber = vm.bookingModel.bookingNumber;
                        vm.returnBookingModel.checkIn = new Date(obj.returnPricedItinerary.originDestinationOptions[0].originDateTime);
                        vm.returnBookingModel.checkOut = new Date(obj.returnPricedItinerary.originDestinationOptions[0].destinationDateTime);
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
                        vm.returnBookingModel.pricedItinerary = obj.returnPricedItinerary;
                        vm.returnBookingModel.flightSegments = obj.returnPricedItinerary.originDestinationOptions[0].flightSegments;
                        vm.returnBookingModel.passengerNameRecords = vm.bookingModel.passengerNameRecords;
                    }
                }

                // bind to view
                vm.orgBookingModel = obj;

                /* +++ 05Nov2017-Tung: add pricing for summary */
                var departItinTotalFare = vm.orgBookingModel.departPricedItinerary.airItineraryPricingInfo.itinTotalFare;
                var returnItinTotalFare = {};

                if (vm.orgBookingModel.returnPricedItinerary && vm.orgBookingModel.returnPricedItinerary.airItineraryPricingInfo) {
                    returnItinTotalFare = vm.orgBookingModel.returnPricedItinerary.airItineraryPricingInfo.itinTotalFare;
                }
                vm.orgBookingModel.departItinTotalFare = departItinTotalFare;
                vm.orgBookingModel.returnItinTotalFare = returnItinTotalFare;
                vm.orgBookingModel.isPerBookingType = vm.bjson.isPerBookingType;
                /* --- 05Nov2017-Tung */

                /*+++ 20Nov2017-Tung: disable pay_later */
                if (vm.bjson.bookingInfo) {
                    vm.bjson.bookingInfo.showPayLaterOption = false;
                }
                /*--- 20Nov2017-Tung */

            } else {
                $log.log("CustomerService.getBookingByNumber Booking Empty");
                // Go to
                $state.go('user-profile-booking', {
                    'tab': 'tab-a'
                });
            }
        });

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

                    // Go to
                    // $state.go('booking-result');

                    $state.go('booking-result/:booking_number/:params', {
                        "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber),
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
                    // $state.go('booking-result', {"profileBooking": vm.bookingModel});

                    $state.go('booking-result/:booking_number/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber),
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
         * Process payment and issue ticket
         */
        vm.doConfirm = function() {
            Flight.externalPayment(vm.bookingModel.bookingNumber);
            //
            // DataService.setPaymentModel(vm.paymentModel);
            // DataService.setBookingModel(vm.bookingModel);
            //
            // $log.log("doConfirm - PaymentOption:" + vm.paymentModel.paymentOption);
            //
            // // Do redeem
            // // Check need to do redeem
            // vm.bookingModel.voucher = vm.orgBookingModel.voucher;
            // if (vm.bookingModel.voucher)
            //     $log.log('vm.bookingModel.voucher.voucherValid = ' + vm.bookingModel.voucher.voucherValid);
            // if (vm.bookingModel.voucher && vm.bookingModel.voucher.voucherValid) {
            //     Flight.redeemVoucher(vm.bookingModel).then(function success(result) {
            //
            //         if (result.redeemValid && result.success) {
            //             $log.log('result.redeemValid = ' + result.redeemValid + ", result.success = " + result.success);
            //             vm.doPayment();
            //         } else {
            //             $rootScope.$broadcast("event-flight-load-completed", null);
            //
            //             // Go to
            //             // $state.go('hotel-booking-result');
            //             $log.log("error paymentBooking");
            //             //$log.log(JSON.stringify(result));
            //             $log.log(result);
            //
            //             // DialogService.openHttpAlertDilalog(result);
            //             vm.paymentModel.payFailed = true;
            //             DataService.setPaymentModel(vm.paymentModel);
            //
            //             //$state.go('booking-result');
            //             // $state.go('booking-result', {"profileBooking": vm.bookingModel});
            //             $state.go('booking-result/:booking_number/:params', {"profileBooking": vm.bookingModel
            //                 , "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber)
            //                 , "params": ''
            //                 // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
            //             });
            //         }
            //
            //     }, function error(result) {
            //         $rootScope.$broadcast("event-flight-load-completed", null);
            //
            //         // Go to
            //         // $state.go('hotel-booking-result');
            //         $log.log("error paymentBooking");
            //         //$log.log(JSON.stringify(result));
            //         $log.log(result);
            //
            //         // DialogService.openHttpAlertDilalog(result);
            //         vm.paymentModel.payFailed = true;
            //         DataService.setPaymentModel(vm.paymentModel);
            //
            //         //$state.go('booking-result');
            //         // $state.go('booking-result', {"profileBooking": vm.bookingModel});
            //         $state.go('booking-result/:booking_number/:params', {"profileBooking": vm.bookingModel
            //             , "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber)
            //             , "params": ''
            //             // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
            //         });
            //     });
            // } else {
            //     vm.doPayment();
            // }
        };

        /**
         * Process payment
         */
        vm.doPayment = function() {
            if (vm.paymentModel.paymentOption === 'ATM_DEBIT') {

                Flight.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    // alert(JSON.stringify(result));
                    // $rootScope.$broadcast("event-flight-load-completed", null);

                    if (result.hasPaymentAuth && result.paymentAuthUrl) {
                        $log.log(result.paymentAuthUrl);
                        vm.open(result.paymentAuthUrl);
                    } else {
                        DialogService.openHttpAlertDilalog(result);
                    }
                }, function(result) {
                    // $rootScope.$broadcast("event-flight-load-completed", null);

                    DialogService.openHttpAlertDilalog(result);
                });
            }
            if (vm.paymentModel.paymentOption === 'VNPAYQR') {
                Flight.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    // alert(JSON.stringify(result));
                    vnpay.open({
                        width: 900,
                        height: 800,
                        url: result.paymentAuthUrl
                    });
                });

                //window.location.href = "#/payment-vnpay-qr/"+$stateParams.booking_number+"/FLIGHT";
            }
            if (vm.paymentModel.paymentOption !== 'VNPAYQR' && vm.paymentModel.paymentOption !== 'ATM_DEBIT') {
                //+++ show waiting message
                vm.openLoading();
                //---

                // Try to payment booking
                Flight.paymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson)
                    .then(function(result) {
                        $log.log("Get Flight.paymentBooking()");
                        $log.log(result);

                        $rootScope.$broadcast("event-flight-load-completed", null);

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
                                if (vm.paymentModel.cardModel && vm.paymentModel.cardModel.cardId == -1 && vm.paymentModel.cardModel.checked) {

                                    CustomerService.createCreditCards(vm.paymentModel.cardModel, vm.paymentModel.paToken)
                                        .then(function success(result) {
                                            //$state.go('user-profile-card');
                                            $log.log("success createCreditCards");
                                        }, function error(result) {
                                            //DialogService.openHttpAlertDilalog(result);
                                            $log.log("error createCreditCards");
                                            //$log.log(JSON.stringify(result));
                                            $log.log(result);
                                        });
                                }

                                //process payment
                                $rootScope.$broadcast("IssueTicket", null);

                            } else {

                                vm.paymentModel.payFailed = !result.success;
                                DataService.setPaymentModel(vm.paymentModel);

                                // $state.go('booking-result', {"profileBooking": vm.bookingModel});

                                $state.go('booking-result/:booking_number/:params', {
                                    "profileBooking": vm.bookingModel,
                                    "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber),
                                    "params": ''
                                    // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
                                });
                            }
                        }

                        //reset payment token
                        vm.paymentModel.paToken = null;

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

                        $state.go('booking-result/:booking_number/:params', {
                            "profileBooking": vm.bookingModel,
                            "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber),
                            "params": ''
                            // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
                        });
                    });
            }

        };

        vm.viettelPaymentSubmit = function() {
            CustomerService.getBookingByNumber(vm.bookingModel.bookingNumber).then(function(bookingResult) {
                var bookingStatus = bookingResult.bookingInfo.status;
                if ("BOOKED" === bookingStatus) {
                    if (vm.currentMerchant && vm.currentMerchant === 'FASTGO') {
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
        };

        function viettelPayment(bookingNumber) {

            // alert("Implement viettel");

            Flight.getViettelPaymentURL(bookingNumber).then(function(response) {
                $window.location.href = response;

            }, function error(response) {
                $log.log('errorCallback Create viettel order');
                // $log.log("response = " + JSON.stringify(response));
            });
            return;

            // TODO: Implement Viettel payment. Can reuse code from A.Tam
        };


        /**
         * Define dialog instances
         */
        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        var modal3DAuthInstance = null;
        var reset3DAuthModal = function() {
            modal3DAuthInstance = null;
        };

        /**
         *
         * @param url
         */
        vm.open = function(url) {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/flights/payment/flight.payment.external.html',
                controller: 'FlightPaymentExternalController',
                controllerAs: 'vm',
                windowClass: 'modal-window-extension',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    paymentUrl: function() {
                        return url;
                    }
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
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
            modal3DAuthInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/flights/payment/flight.payment.3d.auth.external.html',
                controller: 'FlightPayment3DAuthExternalController',
                controllerAs: 'vm',
                windowClass: 'modal-window-extension',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    paymentUrl: function() {
                        return url;
                    },
                    paReq: function() {
                        return paReq;
                    },
                    md: function() {
                        return md;
                    },
                    termUrl: function() {
                        return termUrl;
                    }
                }
            });
            modal3DAuthInstance.result.then(
                reset3DAuthModal,
                reset3DAuthModal
            );
        };

        /**
         *
         */
        vm.cancel = function() {
            $state.go('user-profile-booking', {
                'tab': 'tab-a'
            });
        };

        /**
         *
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

    }
})();