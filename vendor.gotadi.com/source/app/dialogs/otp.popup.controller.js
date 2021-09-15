(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightPaymentOTPController', FlightPaymentOTPController);

    FlightPaymentOTPController.$inject = ['$log', '$rootScope', '$scope', '$window', '$interval', '$state', '$timeout', '$sce', 'Auth', '$uibModalInstance', 'bookingModel', 'bookingRes', 'Flight', 'language', '$translate', 'searchResult', 'searchOptions', 'Base64'];

    function FlightPaymentOTPController($log, $rootScope, $scope, $window, $interval, $state, $timeout, $sce, Auth, $uibModalInstance, bookingModel, bookingRes, Flight, language, $translate, searchResult, searchOptions, Base64) {
        var $ctrl = this;
        $scope.otpCode = '';
        $scope.checking = false;
        $scope.verificationCode = '';
        $scope.phoneNumber = '';
        $scope.timeOut;
        $scope.showTimeOut = false;
        $scope.showDiv = true;
        $scope.alerts = [];
        $scope.expDate;
        $scope.doBack = function() {
            $log.log('klasdjkjsada');
            $state.go('booking-info/:booking_number/:params', {
                "searchOptions": searchOptions,
                "searchResult": searchResult,
                "booking_number": Base64.encodeString(bookingModel.bookingNumber),
                "params": ''
            });
            // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))});
            // $state.go('booking-info');
        };
        $scope.getOTP = function() {
            if ($scope.checking) return;
            $scope.checking = true;
            var otpRequest = {
                lang: language.toUpperCase(),
            }
            Flight.flightBookingOTPService(bookingModel, otpRequest).then(function(result) {
                var messageLimit = $translate.storage().get('NG_TRANSLATE_LANG_KEY') == 'vi' ? 'Quá nhiều mã xác thực đã gửi vào số điện thoại này hôm nay.' : 'This phone number have received too many OTP codes, please use another one.';
                var sendOTPError = $translate.storage().get('NG_TRANSLATE_LANG_KEY') == 'vi' ? 'Gửi OTP không thành công.' : 'Unable to send OTP code, please try again.';
                if (result.otpServiceRes) {
                    if (result.otpServiceRes.success) {
                        $scope.verificationCode = result.otpServiceRes.verificationCode;
                        $scope.startCountDown(result.otpServiceRes.lifeTimeInMin);
                        $scope.expDate = result.otpServiceRes.expDate;
                        $scope.showTimeOut = true;
                        $scope.phoneNumber = result.otpServiceRes.phoneNumber;
                    } else {
                        if (result.otpServiceRes.fullQuota !== null && result.otpServiceRes.fullQuota) {
                            $scope.showDiv = false;
                            $scope.addAlert(messageLimit, "noValidPhone");
                            $timeout(function() {
                                $ctrl.ok(false);
                            }, 10000);
                        } else {
                            $scope.showDiv = false;
                            $scope.addAlert(sendOTPError, "noValidPhone");
                            $timeout(function() {
                                $ctrl.ok(false);
                            }, 10000);
                        }
                    }
                } else {
                    $scope.showDiv = false;
                    $scope.addAlert(sendOTPError, "noValidPhone");
                    $timeout(function() {
                        $ctrl.ok(false);
                    }, 5000);
                }
            });

            $scope.checking = false;
        };

        $scope.startCountDown = function(timeInMin) {
            var time = (timeInMin * 60);
            $interval(function() {
                time--;
                $scope.timeOut = time;
                if ($scope.timeOut === 0) {
                    $scope.showDiv = false;
                    var messageExpired = $translate.storage().get('NG_TRANSLATE_LANG_KEY') == 'vi' ? 'Mã xác thực đã hết hạn' : 'TThe OTP code has expired';
                    $scope.addAlert(messageExpired, "danger");
                    var otpRequest = {
                        otpCode: null,
                        verificationCode: $scope.verificationCode
                    };
                    Flight.flightBookingOTPService(bookingModel, otpRequest).then(function(result) {
                        $timeout(function() {
                            $ctrl.ok(false);
                        }, 10000);
                    });
                }
            }, 1000, 0);
        };


        $scope.verify = function() {
            if ($scope.checking) return;
            $('.errorMessageOtp').hide();
            $scope.checking = true;
            var otpCodeTemp = "";
            $('.otpVal').each(function() {
                otpCodeTemp = otpCodeTemp + $(this).val();
            });
            $scope.otpCode = otpCodeTemp;
            if ($scope.otpCode !== '') {
                var otpRequest = {
                    otpCode: $scope.otpCode,
                    verificationCode: $scope.verificationCode
                };
                Flight.flightBookingOTPService(bookingModel, otpRequest).then(function(result) {
                    if (result.otpServiceRes.success) {
                        $ctrl.ok(true);
                    } else {
                        var messageCorrect = $translate.storage().get('NG_TRANSLATE_LANG_KEY') == 'vi' ? 'Mã xác thực không đúng!' : 'OTP code is not correct!';
                        var messageLimit = $translate.storage().get('NG_TRANSLATE_LANG_KEY') == 'vi' ? 'Đã hết lượt nhập mã xác thực' : 'The OTP code has ended';
                        var messageExpired = $translate.storage().get('NG_TRANSLATE_LANG_KEY') == 'vi' ? 'Mã xác thực đã hết hạn' : 'TThe OTP code has expired';
                        $scope.verificationCode = result.otpServiceRes.verificationCode;
                        if (result.otpServiceRes.matched !== null && !result.otpServiceRes.matched) {
                            $scope.addAlert(messageCorrect, "danger");
                        }
                        if (result.otpServiceRes.outOfSlot !== null && result.otpServiceRes.outOfSlot) {
                            $scope.showDiv = false;
                            $scope.showTimeOut = false;
                            $scope.addAlert(messageLimit, "danger");
                            $timeout(function() {
                                $ctrl.ok(false);
                            }, 10000);
                        }
                        if (result.otpServiceRes.expired !== null && result.otpServiceRes.expired) {
                            $scope.showDiv = false;
                            $scope.addAlert(messageExpired, "danger");
                            $scope.showTimeOut = false;
                            $timeout(function() {
                                $ctrl.ok(false);
                            }, 10000);
                        }
                    }
                });
            } else {
                $('.errorMessageOtp').show();
            }
            $scope.checking = false;
        };

        $ctrl.ok = function(success) {
            $uibModalInstance.close(success);
        };

        // $ctrl.dismiss = function () {
        //     if ($scope.verificationCode.length == 0) return;
        //     var otpRequest = {
        //         otpCode: null,
        //         verificationCode: $scope.verificationCode,
        //     }
        //     Flight.otpService(bookingModel, otpRequest).then(function (result) {
        //     });
        //     $uibModalInstance.dismiss($scope.verificationCode);
        // };



        $scope.addAlert = function(msg, danger) {
            $scope.alerts.push({
                type: danger,
                msg: msg
            });
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();