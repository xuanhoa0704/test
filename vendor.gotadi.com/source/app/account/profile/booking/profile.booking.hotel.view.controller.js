(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileBookingHotelViewController', ProfileBookingHotelViewController);

    ProfileBookingHotelViewController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$uibModal', 'CustomerService', 'DateUtils', 'DataService', 'Hotel', 'DialogService', 'Base64', 'Principal', 'Flight', '$window', '$cookies', 'MerchantService'];

    function ProfileBookingHotelViewController($log, $rootScope, $scope, $state, $stateParams, $timeout, $uibModal, CustomerService, DateUtils, DataService, Hotel, DialogService, Base64, Principal, Flight, $window, $cookies, MerchantService) {
        var vm = this;

        vm.viettelPayment = viettelPayment;

        vm.showPaymentInfo = !MerchantService.isSimpleView();
        vm.showProfileInfo = !MerchantService.isSimpleView();
        vm.merchantList = ['FASTGO'];
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

        $log.log("ProfileBookingHotelViewController - bookingNumber:" + bookingNumber);

        CustomerService.getBookingByNumber(bookingNumber).then(function(result) {

            vm.bkgroup = result;
            $log.log("+++++ vm.bkgroup = ");
            $log.log(vm.bkgroup);

            vm.selectedHotel = vm.bkgroup.hotelAvailability;
            vm.selectedHotelProduct = vm.bkgroup.hotelAvailability.products[0];
            vm.selectedHotelRoom = vm.bkgroup.hotelAvailability.products[0].rooms[0];

            $log.log('CustomerService.getBooking result = ');

            $log.log("CustomerService.getBookingByNumber result:");
            //$log.log("data=" + JSON.stringify(result));
            $log.log("data=" + result);
            $log.log("++++++++++++++++++++++++++++");

            if (result && result.bookingInfo) {
                vm.bjson = result;

                vm.bookingModel = result.bookingInfo;

                $log.log('vn.bookingModel = ');
                $log.log(vm.bookingModel);
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

                // bind to view
                vm.orgBookingModel = obj;

                /*+++ 20Nov2017-Tung: disable pay_later */
                if (vm.bjson.bookingInfo) {
                    vm.bjson.bookingInfo.showPayLaterOption = false;
                }
                /*--- 20Nov2017-Tung */

            } else {
                $log.log("CustomerService.getBookingByNumber Booking Empty");
                // Go to
                $state.go('user-profile-booking', {
                    'tab': 'tab-h'
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

            Hotel.orderTickets(vm.bookingModel, vm.bjson)
                .then(function(result1) {
                    $log.log("Get Flight.orderTickets()");
                    $log.log(result1);

                    vm.paymentModel.payFailed = !result1.success;
                    DataService.setHotelPaymentModel(vm.paymentModel);

                    $rootScope.$broadcast("event-flight-load-completed", null);

                    // Go to
                    $state.go('hotel-booking-result/:booking_number/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)
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
                    $state.go('hotel-booking-result/:booking_number/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)
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
            DataService.setPaymentModel(vm.paymentModel);
            DataService.setBookingModel(vm.bookingModel);

            $log.log("doConfirm - PaymentOption:" + vm.paymentModel.paymentOption);

            // Do redeem
            // Check need to do redeem
            vm.bookingModel.voucher = vm.orgBookingModel.voucher;
            if (vm.bookingModel.voucher)
                $log.log('vm.bookingModel.voucher.voucherValid = ' + vm.bookingModel.voucher.voucherValid);
            if (vm.bookingModel.voucher && vm.bookingModel.voucher.voucherValid) {
                Hotel.redeemVoucher(vm.bookingModel).then(function success(result) {

                    if (result.redeemValid && result.success) {
                        $log.log('result.redeemValid = ' + result.redeemValid + ", result.success = " + result.success);
                        vm.doPayment();
                    } else {
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
                        $state.go('hotel-booking-result/:booking_number/:params', {
                            "profileBooking": vm.bookingModel,
                            "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                            "params": ''
                            // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
                        });
                    }

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
                    $state.go('hotel-booking-result/:booking_number/:params', {
                        "profileBooking": vm.bookingModel,
                        "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                        "params": ''
                        // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))
                    });
                });
            } else {
                vm.doPayment();
            }
        };

        /**
         *
         */
        vm.doPayment = function() {

            // Try to payment booking
            if (vm.paymentModel.paymentOption === 'ATM_DEBIT') {
                Hotel.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    // alert(JSON.stringify(result));

                    if (result.hasPaymentAuth && result.paymentAuthUrl) {
                        $log.log(result.paymentAuthUrl);
                        vm.open(result.paymentAuthUrl);
                    } else {
                        DialogService.openHttpAlertDilalog(result);
                    }
                }, function(result) {

                    DialogService.openHttpAlertDilalog(result);
                });
            }
            if (vm.paymentModel.paymentOption === 'VNPAYQR') {
                Hotel.gPaymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson).then(function(result) {
                    // alert(JSON.stringify(result));
                    vnpay.open({
                        width: 900,
                        height: 800,
                        url: result.paymentAuthUrl
                    });
                });

                // window.location.href = "#/payment-vnpay-qr/"+$stateParams.booking_number+"/FLIGHT";         
            }
            if (vm.paymentModel.paymentOption !== 'VNPAYQR' && vm.paymentModel.paymentOption !== 'ATM_DEBIT') {
                //+++ show waiting message
                vm.openLoading();
                //---

                Hotel.paymentBooking(vm.bookingModel, vm.paymentModel, vm.bjson)
                    .then(function(result) {

                        $log.log("Get Hotel.paymentBooking()");
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

                                // $rootScope.$broadcast("event-flight-load-completed", null);

                                vm.paymentModel.payFailed = !result.success;
                                DataService.setHotelPaymentModel(vm.paymentModel);

                                // $state.go('hotel-booking-result', {"profileBooking": vm.bookingModel});
                                $state.go('hotel-booking-result/:booking_number/:params', {
                                    "profileBooking": vm.bookingModel,
                                    "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)
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
                        DataService.setHotelPaymentModel(vm.paymentModel);

                        //$state.go('booking-result');
                        // $state.go('hotel-booking-result', {"profileBooking": vm.bookingModel});
                        $state.go('hotel-booking-result/:booking_number/:params', {
                            "profileBooking": vm.bookingModel,
                            "booking_number": Base64.encodeString(vm.bookingModel.bookingNumber)
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
                controller: 'HotelPaymentExternalController',
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
                'tab': 'tab-h'
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
                controller: 'HotelLoadingController',
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
        }


        vm.viettelPaymentSubmit = function() {
            CustomerService.getBookingByNumber(vm.bookingModel.bookingNumber).then(function(bookingResult) {
                var bookingStatus = bookingResult.bookingInfo.status;
                if ("BOOKED" === bookingStatus) {
                    if (vm.currentMerchant && vm.currentMerchant === 'FASTGO') {
                        $log.log('GOTO - booking-payment');
                        $state.go('hotel-booking/:booking_number/:params', {
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

    }
})();