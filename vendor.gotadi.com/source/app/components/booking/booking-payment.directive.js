(function() {
    'use strict';

    gtdBookingPaymentController.$inject = ['$log', '$rootScope', '$scope', 'Principal', 'MetaData', 'Flight', 'Hotel', 'CustomerService', 'GlobalSrv', '$uibModal', 'DialogService', 'LoginService', '$filter', '$timeout', 'PROMO_EVENT', '$cookies'];

    function gtdBookingPaymentController($log, $rootScope, $scope, Principal, MetaData, Flight, Hotel, CustomerService, GlobalSrv, $uibModal, DialogService, LoginService, $filter, $timeout, PROMO_EVENT, $cookies) {
        var ctrl = this;
        var VOUCHER_TYPE = 'VOUCHER';
        var PROMO_TYPE = 'PROMO';

        ctrl.tempPromo = 0;
        ctrl.tempPromo2 = 0;
        ctrl.tempDiscountAmount = 0;
        ctrl.chosenCardNumber = '';
        ctrl.getAir = getAir;
        ctrl.getHotel = getHotel;
        ctrl.deletePromoAir = deletePromoAir;
        ctrl.updateDiscountAmount = updateDiscountAmount;
        ctrl.discountType;
        ctrl.selectedCardChanged = selectedCardChanged;
        ctrl.currentMerchant = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;

        $log.log("--->>> ctrl.paymentModel.paymentOption: " + ctrl.paymentModel.paymentOption);
        $log.log("--->>> ctrl.bookingModel.bookingInfo.showPayLaterOption: " + ctrl.bookingModel.bookingInfo.showPayLaterOption);
        $log.log("--->>> ctrl.bookingModel.bookingInfo.showPayNowOption: " + ctrl.bookingModel.bookingInfo.showPayNowOption);

        ctrl.isAuthenticated = Principal.isAuthenticated;
        ctrl.listPaymentType = [];

        function selectedCardChanged(selectedCard) {
            if (ctrl.paymentModel.cardModel.chosenCardNumber == -1) {
                ctrl.paymentModel.cardModel.cardId = -1;
            }
            ctrl.paymentModel.cardModel.chosenCardNumber = selectedCard.cardNumber;
            ctrl.paymentModel.cardModel.cardId = selectedCard.id;
        }

        var currentTime = new Date();

        ctrl.currentMonth = currentTime.getMonth() + 1;
        ctrl.currentYear = currentTime.getFullYear();
        ctrl.maxYear = ctrl.currentYear + 20;

        ctrl.allCountries = GlobalSrv.getAllCountries();
        if (ctrl.allCountries == [] || ctrl.allCountries.length == 0) {
            MetaData.getCountries().then(function success(result) {
                ctrl.allCountries = result;
            });
        }
        CustomerService.getAvailablePaymentType().then(function(result) {
            ctrl.listPaymentType = result;
        });
        MetaData.getAtmDebitOptions().then(function success(result) {
            ctrl.allDebitOptions = result;
            ctrl.allDebitOptions.sort();
        });

        if (ctrl.bookingModel.bookingInfo.supplierType == "HOTEL") {
            Hotel.gPaymentPromotion('HOTEL', "PUBLISHING", 0, 20).then(function(result) {
                if (result.content) {
                    ctrl.paymentModel.paymentPromo = result.content;
                }
            });
        }
        if (ctrl.bookingModel.bookingInfo.supplierType == "AIR") {
            Flight.gPaymentPromotion('AIR', "PUBLISHING", 0, 20).then(function(result) {
                if (result.content) {
                    ctrl.paymentModel.paymentPromo = result.content;
                }
            });
        }
        ctrl.creditCards = [];
        //+++ Load credit_cards for auth customer
        // if (vm.currentMerchant && vm.currentMerchant === 'FASTGO') {
        // if (Principal.isAuthenticated() && ctrl.currentMerchant !== 'FASTGO') {
        //     CustomerService.getCreditCards().then(function (result) {
        //         ctrl.creditCards = result;
        //         angular.forEach(ctrl.creditCards, function (item, value) {
        //             item.checked = false;
        //         });
        //     });
        // }

        // Reload cards when login
        Principal.identity().then(function(user) {
            var data = {
                // other fields
                user: user
            };
            ctrl.identity = user;
            // do something with data only inside this inner function
        });
        $scope.$watch(function(scope) {
                return ctrl.isAuthenticated();
            },
            function(newValue, oldValue) {
                //+++ Load traveler for auth customer
                if (Principal.isAuthenticated()) {
                    CustomerService.getCustomerTravellersForBoth().then(function(result) {
                        ctrl.customerTravellers = result;
                    });
                } else {
                    ctrl.customerTravellers = [];
                }
            }
        );
        $scope.$watch(function(scope) {
                return ctrl.isAuthenticated();
            },
            function(newValue, oldValue) {
                //+++ Load credit_cards for auth customer
                // if (Principal.isAuthenticated()) {
                //     CustomerService.getCreditCards().then(function (result) {
                //         ctrl.creditCards = result;
                //         angular.forEach(ctrl.creditCards, function (item, value) {
                //             item.checked = false;
                //         });
                //     });
                // } else {
                //     ctrl.creditCards = [];
                // }
            }
        );

        $rootScope.$on('changeVoucher', function(event, data) {
            ctrl.discountType = VOUCHER_TYPE;
            ctrl.previousPromotionAirName = ctrl.promotionAirName;
            ctrl.promotionAirName = null;
            if (ctrl.tempVoucher && ctrl.tempVoucher.discountAmount) {
                ctrl.tempPromo2 = 0;
                ctrl.tempDiscountAmount = ctrl.tempVoucher.discountAmount;
                // ctrl.bookingModel.bookingInfo.displayPriceInfo.discountAmount = ctrl.tempVoucher.discountAmount;
                ctrl.updateDiscountAmount(ctrl.tempVoucher.discountAmount);
            }
        });
        //+++ process change payment option
        ctrl.selectTypePaymentAir;
        ctrl.previousSelectTypePaymentAir;
        ctrl.previousSelectTypePaymentVoucherAir;
        $rootScope.$on('changePromo', function(event, data) {
            ctrl.discountType = PROMO_TYPE;
            ctrl.tempVoucher = null;
            if (ctrl.tempPromo2 != 0) {
                ctrl.tempPromo = 0;
                ctrl.tempVoucher = null;
                // ctrl.bookingModel.bookingInfo.displayPriceInfo.discountAmount = ctrl.tempPromo2;
                ctrl.updateDiscountAmount(ctrl.tempPromo2);
                ctrl.tempDiscountAmount = ctrl.tempPromo2;
            }
            if (!ctrl.openingPopup) {
                ctrl.tempVoucher = null;
                ctrl.selectTypePayment = ctrl.previousSelectTypePayment;
                ctrl.selectTypePaymentAir = ctrl.previousSelectTypePaymentAir;
                ctrl.changeRadio();
            }

        });
        $scope.$on('dismissPromo', function(event, data) {
            ctrl.selectTypePayment = ctrl.previousSelectTypePaymentVoucher;
        });
        ctrl.previousSelectTypePayment;
        ctrl.previousSelectTypePaymentVoucher;
        ctrl.changePromotion = function() {
            ctrl.discountType = PROMO_TYPE;
            if (ctrl.bookingModel.bookingInfo.discountVoucherCode !== null || !!ctrl.tempVoucher) {
                var message = {};
                message.title = $filter('translate')('flight.booking.payment.conf');
                message.message = $filter('translate')('flight.booking.payment.mess-conf');
                var modalInstance = DialogService.PromoMessagge(message, PROMO_EVENT);
                ctrl.previousSelectTypePayment = ctrl.selectTypePayment;
                ctrl.previousSelectTypePaymentAir = ctrl.selectTypePaymentAir;
                ctrl.selectTypePayment = "";
                ctrl.selectTypePaymentAir = "";
            } else {
                ctrl.tempVoucher = null;

                ctrl.changeRadio();

            }
        };

        //+++ process change payment option
        ctrl.changeRadio = function() {
            ctrl.previousSelectTypePaymentVoucher = ctrl.selectTypePayment;
            if (ctrl.bookingModel.bookingInfo.promotionID > 0 && ctrl.selectTypePayment.charAt(0) === '_') {
                Flight.voidPromo(ctrl.bookingModel.bookingNumber, ctrl.bookingModel.bookingInfo.promotionID[0]).then(function(result) {

                });
            }

            if (ctrl.selectTypePayment.indexOf("_") == 0 && !Principal.isAuthenticated()) {
                var message = {};
                message.title = 'Rất tiếc';
                message.message = 'Khuyến mãi này chỉ áp dụng cho thành viên của Gotadi. Vui lòng đăng nhập hoặc đăng ký để hưởng khuyến mãi và nhiều ưu đãi khác.';
                var modalInstance = DialogService.openDialogForceLogin(message);

                modalInstance.closed.then(
                    function() {
                        LoginService.open();
                    }
                );
                ctrl.selectTypePayment = "";
            }
            //+++ reset temp_voucher
            ctrl.tempPromo = 0;
            // ctrl.tempVoucher = null;
            if (!ctrl.DatapromoAir) {
                ctrl.paymentModel.promotions = null;
            }
            //---
            if (ctrl.selectTypePayment.charAt(0) === '_') {
                ctrl.promotionAirName = null;
                ctrl.paymentModel.paymentOption = 'CREDIT';
                var _params = ctrl.selectTypePayment.split("_");
                ctrl.tempVoucher = null;
                if (_params.length >= 1) {
                    ctrl.promoSelect = true;
                    $rootScope.$broadcast("select-payment-promo-succeeded", _params[1]);
                    if (ctrl.bookingModel && ctrl.bookingModel.bookingInfo && ctrl.bookingModel.bookingInfo.displayPriceInfo) {
                        Flight.gPaymentPromoDiscount(ctrl.bookingModel.bookingNumber, ctrl.bookingModel.bookingCode, parseInt(_params[1]), 'CREDIT_CARD').then(function(result) {
                            if (result.discountAmount) {
                                // ctrl.bookingModel.bookingInfo.displayPriceInfo.discountAmount = result.discountAmount;
                                ctrl.updateDiscountAmount(result.discountAmount);
                                ctrl.tempPromo = result.discountAmount;
                            }
                            ctrl.calcPaymentFee();
                        });
                    } else {
                        ctrl.calcPaymentFee();
                        ctrl.promoSelect = false;
                    }
                } else {
                    $rootScope.$broadcast("update-promo-remove-success", null);
                    ctrl.promoSelect = false;
                    ctrl.calcPaymentFee();

                }
            } else {
                ctrl.paymentModel.paymentOption = ctrl.selectTypePayment;
                $rootScope.$broadcast("update-promo-remove-success", null);
                ctrl.tempPromo = 0;
                ctrl.promoSelect = false;
                ctrl.calcPaymentFee();

                if (ctrl.bookingModel.bookingInfo.promotionID > 0 && ctrl.selectTypePayment.charAt(0) !== '_') {
                    ctrl.calcPaymentFee();
                }
            }
            if (ctrl.bookingModel.bookingInfo.promotionID > 0 && ctrl.selectTypePayment.charAt(0) === '_') {
                ctrl.tempPromo = 0;
                ctrl.tempPromo2 = 0;
                ctrl.calcPaymentFee();
            }
            $rootScope.$broadcast("event-payment-voucher-reset", null);
            ctrl.calcPaymentFee();
        };

        //---
        ctrl.selectCheckbox = function(promotionId) {
            ctrl.selectTypePayment = null;
            ctrl.previousSelectTypePaymentVoucherAir = ctrl.selectTypePaymentAir;
            if (ctrl.bookingModel.bookingInfo.promotionID > 0) {
                Flight.voidPromo(ctrl.bookingModel.bookingNumber, ctrl.bookingModel.bookingInfo.promotionID[0]).then(function(result) {});
            }
            //+++ reset temp_voucher
            ctrl.tempVoucher = null;
            ctrl.tempPromo2 = 0;
            ctrl.paymentModel.promotions = null;
            //set default payment to show paymentfee and discounAmount
            ctrl.paymentModel.paymentOption = 'CREDIT';
            ctrl.selectTypePayment = 'CREDIT';
            ctrl.promoSelect = true;
            $rootScope.$broadcast("select-payment-promo-succeeded-2", promotionId);
            if (ctrl.bookingModel && ctrl.bookingModel.bookingInfo && ctrl.bookingModel.bookingInfo.displayPriceInfo) {
                Flight.gPaymentPromoDiscount(ctrl.bookingModel.bookingNumber, ctrl.bookingModel.bookingCode, promotionId, 'AIRLINES_CODE').then(function(result) {
                    if (result.discountAmount) {
                        // ctrl.bookingModel.bookingInfo.displayPriceInfo.discountAmount = result.discountAmount;
                        ctrl.updateDiscountAmount(result.discountAmount);
                        ctrl.tempPromo2 = result.discountAmount;
                    }
                    ctrl.calcPaymentFee();
                });
            } else {
                $rootScope.$broadcast("update-promo-remove-success", null);
                ctrl.promoSelect = false;
                ctrl.calcPaymentFee();
            }
        };

        function deletePromoAir() {
            if (ctrl.bookingModel.bookingInfo.promotionID > 0) {
                Flight.voidPromo(ctrl.bookingModel.bookingNumber, ctrl.bookingModel.bookingInfo.promotionID[0]).then(function(result) {});
            }
            ctrl.paymentModel.promotions = null;
            ctrl.promotionAirName = null;
            ctrl.paymentModel.paymentOption = ctrl.selectTypePayment;
            $rootScope.$broadcast("update-promo-remove-success", null);
            ctrl.tempPromo2 = 0;
            ctrl.tempPromo = 0;
            ctrl.calcPaymentFee();
            ctrl.promoSelect = false;
        }
        //---
        $scope.$on('select-payment-promo-succeeded-2', function(event, data) {

            console.log(data);
            angular.forEach(ctrl.paymentModel.paymentPromo, function(item, value) {
                if (item.id == data) {
                    ctrl.paymentModel.promotions = item;
                    $rootScope.$broadcast("update-promo-select-success", item.discountValueType);
                }
            });
        });
        /**
         * Handle redeem voucher
         */
        $scope.$on('event-payment-voucher-redeem-succeeded', function(event, data) {
            if (data) {
                ctrl.tempVoucher = data;
            } else {
                ctrl.tempVoucher = {};
            }
            ctrl.calcPaymentFee();
        });

        //+++ calculate payment fee
        ctrl.chooseContact = function(item) {
            //$log.log("item = " + JSON.stringify(item));
            $log.log("item = " + item);

            // reset customer
            item.ciGender = undefined;
            item.id = undefined;
            ctrl.paymentModel.cardModel.firstName = undefined;
            ctrl.paymentModel.cardModel.lastName = undefined;
            ctrl.paymentModel.cardModel.email = undefined;
            ctrl.paymentModel.cardModel.phoneNumber = undefined;
            item.postcode = undefined;

            if (item.selectedTraveller) {
                // Contact must be ADULT so type = ADT
                if (item.selectedTraveller.gender == 'MALE' || item.selectedTraveller.gender == 'FEMALE') {
                    item.ciGender = item.selectedTraveller.gender;
                }

                item.id = item.selectedTraveller.id;
                ctrl.paymentModel.cardModel.firstName = item.selectedTraveller.surName ? item.selectedTraveller.surName.toUpperCase() : '';
                ctrl.paymentModel.cardModel.lastName = item.selectedTraveller.firstName ? item.selectedTraveller.firstName.toUpperCase() : '';
                ctrl.paymentModel.cardModel.email = item.selectedTraveller.email;
                ctrl.paymentModel.cardModel.phoneNumber = item.selectedTraveller.phoneNumber1;
                if (!ctrl.bookingModel.tPCPhoneCode) {
                    ctrl.bookingModel.tPCPhoneCode = '84';
                }
            } else {
                item.id = null;
            }
            $log.log(item)
        };

        function getHotel() {
            Flight.gPaymentPromotion('HOTEL', "PUBLISHING", 0, 20).then(function(result) {
                var index = result.content.findIndex(function(s) {
                    return s.id == +ctrl.bookingModel.bookingInfo.promotionID[0];
                });
                if (index == -1) {
                    Flight.voidPromo(ctrl.bookingModel.bookingNumber, ctrl.bookingModel.bookingInfo.promotionID[0]).then(function(result) {
                        ctrl.calcPaymentFee();
                        ctrl.promotionAirName = null;
                    });
                }
                if (ctrl.paymentModel.paymentPromo[index].bankCode !== null && ctrl.paymentModel.paymentPromo[index].promotionType === 'CREDIT_CARD') {
                    ctrl.selectTypePayment = "_" + ctrl.bookingModel.bookingInfo.promotionID[0];
                    ctrl.tempPromo = ctrl.bookingModel.bookingInfo.displayPriceInfo.discountAmount;
                    if (ctrl.selectTypePayment.charAt(0) === '_') {
                        ctrl.paymentModel.paymentOption = 'CREDIT';
                    }
                }
                ctrl.calcPaymentFee();
            });
        }

        function getAir() {
            Flight.gPaymentPromotion('AIR', "PUBLISHING", 0, 20).then(function(result) {
                if (ctrl.bookingModel.bookingInfo.promotionID.length > 0) {
                    ctrl.discountType = PROMO_TYPE;
                }
                var index = result.content.findIndex(function(s) {
                    return s.id == +ctrl.bookingModel.bookingInfo.promotionID[0];
                });
                if (index == -1) {
                    Flight.voidPromo(ctrl.bookingModel.bookingNumber, ctrl.bookingModel.bookingInfo.promotionID[0]).then(function(result) {
                        ctrl.calcPaymentFee();
                        ctrl.promotionAirName = null;
                    });
                } else {
                    if (ctrl.paymentModel.paymentPromo[index].bankCode !== null && ctrl.paymentModel.paymentPromo[index].promotionType === 'CREDIT_CARD') {
                        ctrl.selectTypePayment = "_" + ctrl.bookingModel.bookingInfo.promotionID[0];
                        ctrl.tempPromo = ctrl.bookingModel.bookingInfo.displayPriceInfo.discountAmount;
                        if (ctrl.selectTypePayment.charAt(0) === '_') {
                            ctrl.paymentModel.paymentOption = 'CREDIT';
                        }
                    } else {
                        if (ctrl.paymentModel.paymentPromo[index].productType[0] === 'AIR' && (!!ctrl.paymentModel.paymentPromo[index].bankCode && ctrl.paymentModel.paymentPromo[index].bankCode.length === 0)) {
                            ctrl.promotionAirName = ctrl.paymentModel.paymentPromo[index].description;
                            ctrl.disAmount = ctrl.paymentModel.paymentPromo[index].discountAmount;
                            ctrl.selectTypePayment = ctrl.bookingModel.bookingInfo.paymentType;
                            ctrl.paymentModel.paymentOption = ctrl.bookingModel.bookingInfo.paymentType;
                            ctrl.tempPromo2 = ctrl.bookingModel.bookingInfo.displayPriceInfo.discountAmount;
                            if (ctrl.paymentModel.paymentPromo[index].discountValueType == 'PERCENT') {
                                ctrl.paymentModel.paymentPromo[index].discountValueType == '%';
                                ctrl.discountvalue = ctrl.paymentModel.paymentPromo[index].discountValueType;
                            } else {
                                ctrl.paymentModel.paymentPromo[index].discountValueType == 'VNĐ';
                                ctrl.discountvalue = ctrl.paymentModel.paymentPromo[index].discountValueType;
                            }
                        }
                    }

                }
                if ('OTHER' !== ctrl.paymentModel.paymentOption) {
                    ctrl.calcPaymentFee();
                }
            });
        }

        this.$onChanges = function(changes) {
            if (changes.bookingModelOneWay.currentValue.bookingInfo.discountVoucherCode !== null) {
                ctrl.selectTypePayment = changes.bookingModelOneWay.currentValue.bookingInfo.paymentType;
            }
            if (changes.bookingModelOneWay.currentValue.bookingInfo.promotionID && changes.bookingModelOneWay.currentValue.bookingInfo.promotionID > 0) {
                if (changes.bookingModelOneWay.currentValue.bookingInfo.supplierType === "HOTEL") {
                    ctrl.getHotel();
                }
                if (changes.bookingModelOneWay.currentValue.bookingInfo.supplierType === "AIR") {
                    ctrl.getAir();
                }
            }
            ctrl.paymentModel = {
                cardModel: {
                    firstName: changes.bookingModelOneWay.currentValue.travelerInfo.contactInfos[0].firstName,
                    lastName: changes.bookingModelOneWay.currentValue.travelerInfo.contactInfos[0].lastName,
                    address: '194 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
                    city: 'HCMC',
                    state: 'HCMC',
                    phoneNumber: changes.bookingModelOneWay.currentValue.travelerInfo.contactInfos[0].phoneNumber1,
                    email: changes.bookingModelOneWay.currentValue.travelerInfo.contactInfos[0].email,
                    postalCode: (changes.bookingModelOneWay.currentValue.travelerInfo.contactInfos[0].postCode) ? (changes.bookingModelOneWay.currentValue.travelerInfo.contactInfos[0].postCode) : '700000',
                },
            };
            // $log.log(changes);
            // internal = JSON.parse(JSON.stringify(currentvalue));
        };

        ctrl.validatePaymentPromo = function(event, id) {
            ctrl.wrongPromo = false;
            var myDataPromise = Flight.validatePromo(ctrl.bookingModel, id);
            myDataPromise.then(function(result) {
                var voucher = result;
                ctrl.bookingModel.voucher = voucher;

                $log.log('voucher.voucherValid = ' + voucher.voucherValid);
                $log.log(voucher);
                //send data to process data
                // $rootScope.$broadcast("event-payment-voucher-redeem-succeeded", voucher);

                if (!voucher.voucherValid) {
                    ctrl.wrongPromo = true;
                }

            }, function error(result) {
                ctrl.bookingModel.voucher = {};
                $log.log(result);

                ctrl.wrongPromo = true;
            });
        };
        $scope.$on('event-payment-promo-redeem-invalid', function(event, item) {
            ctrl.wrongPromo = true;
        });

        $scope.$on('select-payment-promo-succeeded', function(event, data) {
            angular.forEach(ctrl.paymentModel.paymentPromo, function(item, value) {
                if (item.id == data) {
                    ctrl.paymentModel.promotions = item;
                    $rootScope.$broadcast("update-promo-select-success", item.discountValueType);
                }
            });
        });
        $scope.$on('remove-payment-promo-succeeded', function(event, data) {
            if (data) {
                ctrl.tempPromo = data;
            } else {
                ctrl.tempPromo = 0;
            }
            ctrl.calcPaymentFee();
        });
        $scope.$on('remove-payment-promo-succeeded-2', function(event, data) {
            if (data) {
                ctrl.tempPromo2 = data;
            } else {
                ctrl.tempPromo2 = 0;
            }
            ctrl.calcPaymentFee();
        });
        ctrl.calcPaymentFee = function() {
            if (ctrl.bookingModel && ctrl.bookingModel.bookingInfo && ctrl.bookingModel.bookingInfo.displayPriceInfo) {
                ctrl.bookingModel.bookingInfo.displayPriceInfo.paymentFee = 0;
                ctrl.updateDiscountAmount(0);
                if ('CREDIT' === ctrl.paymentModel.paymentOption || 'ATM_DEBIT' === ctrl.paymentModel.paymentOption || 'VNPAYQR' === ctrl.paymentModel.paymentOption || 'VIETTELPAY' === ctrl.paymentModel.paymentOption || 'MOMO' === ctrl.paymentModel.paymentOption) {
                    //+++ loading all payment_fee option
                    var tempDiscountAmount = 0;
                    if (ctrl.discountType === VOUCHER_TYPE) {
                        tempDiscountAmount = ctrl.tempVoucher.discountAmount;
                        ctrl.updateDiscountAmount(ctrl.tempVoucher.discountAmount);
                    }
                    if (ctrl.discountType === PROMO_TYPE) {

                        if (ctrl.tempPromo != 0) {
                            ctrl.tempPromo2 = 0;
                            ctrl.tempVoucher = null;
                            tempDiscountAmount = ctrl.tempPromo;
                            ctrl.updateDiscountAmount(ctrl.tempPromo);
                        } else if (ctrl.tempPromo2 != 0) {
                            ctrl.tempPromo = 0;
                            ctrl.tempVoucher = null;
                            tempDiscountAmount = ctrl.tempPromo2;
                            ctrl.updateDiscountAmount(ctrl.tempPromo2);
                        }
                    }
                    Flight.gPaymentFeeOpt(ctrl.bookingModel.bookingNumber, ctrl.paymentModel.paymentOption, tempDiscountAmount, ctrl.bookingModel.bookingInfo.totalFare, ctrl.bookingModel.bookingInfo.totalSsrValue).then(function(result) {
                        var paymentFeeOptions = result.peymentFees;


                        angular.forEach(paymentFeeOptions, function(item, value) {
                            if (item.paymentType == ctrl.paymentModel.paymentOption) {

                                ctrl.bookingModel.bookingInfo.displayPriceInfo.paymentFee = item.amount;
                            }
                        });
                    });
                }
            }
        };

        function updateDiscountAmount(amount) {
            $timeout(function() {
                ctrl.bookingModel.bookingInfo.displayPriceInfo.discountAmount = amount;
                // $rootScope.$emit('booking-model-changed', ctrl.bookingModel);
            }, 0);
        }
        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };
        ctrl.open = function(url) {
            ctrl.tempPromo = 0;
            // ctrl.paymentModel.paymentOption  = '';
            if (modalInstance !== null) return;
            ctrl.openingPopup = true;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/components/booking/flight-booking-promotion-air.html',
                controller: 'flightBookingPromotionAirController',
                controllerAs: '$ctrl',
                windowClass: 'modal-window-extension',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    paymentUrl: function() {
                        return url;
                    },
                    bookingInfo: function() {
                        return ctrl.bookingModel.bookingInfo;
                    },
                    paymentModel: function() {
                        return ctrl.paymentModel;
                    },
                    bookingModel: function() {
                        return ctrl.bookingModel;
                    },
                    previousSelectedPromoId: function() {
                        return ctrl.selectTypePayment;
                    },
                    voucher: function() {
                        return ctrl.tempVoucher;
                    }
                }
            });
            modalInstance.result.then(function(result) {
                ctrl.discountType = PROMO_TYPE;
                ctrl.selectTypePayment = result.id;
                ctrl.selectTypePaymentAir = result.id;
                ctrl.promotionAirName = result.description;
                ctrl.previousPromotionAirName = ctrl.promotionAirName;
                ctrl.disAmount = result.discountAmount;
                ctrl.discountvalue = result.discountValueType;
                ctrl.DatapromoAir = result;
                ctrl.promotionTypeAir = result.promotionType;
                ctrl.selectCheckbox(result.id);
                ctrl.calcPaymentFee();
                ctrl.openingPopup = false;
                resetModal();
                // if(result ===){
                //     ctrl.selectTypePayment = null;

                // }
            });
            resetModal();
        };

        ctrl.classValid = "";
        ctrl.expireMonthYear = function() {
            var filter = new RegExp("(0[123456789]|10|11|12)([/])(1[89]|2[0123456789])");
            if (filter.test(ctrl.monthYear)) {
                ctrl.dateCardClass = '';
                var parseDate = ctrl.monthYear.split('/');
                ctrl.paymentModel.cardModel.expireMonth = parseInt(parseDate[0]);
                ctrl.paymentModel.cardModel.expireYear = parseInt(parseDate[1]);
            } else {
                ctrl.dateCardClass = 'errorMessageDate';
                ctrl.paymentModel.cardModel.expireMonth = '';
                ctrl.paymentModel.cardModel.expireYear = '';
            }
        };

    }
    var gtdBookingPayment = {
        templateUrl: 'app/components/booking/booking-payment.html',
        controller: gtdBookingPaymentController,
        bindings: {
            paymentModel: '=',
            bookingModel: '=',
            bookingModelOneWay: '<'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdBookingPayment', gtdBookingPayment);
})();