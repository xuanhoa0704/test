(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightPaymentExternalController', FlightPaymentExternalController);

    FlightPaymentExternalController.$inject = ['$log', '$rootScope', '$scope', '$window', '$interval', '$state', '$timeout', '$sce', 'Auth', '$uibModalInstance', 'paymentUrl', 'idOption', 'booking_number', 'CustomerService', 'FlightUtils', '$location', 'API_URL'];

    function FlightPaymentExternalController($log, $rootScope, $scope, $window, $interval, $state, $timeout, $sce, Auth, $uibModalInstance, paymentUrl, idOption, booking_number, CustomerService, FlightUtils, $location, API_URL) {
        var vm = this;

        vm.progress = 0;
        vm.givenUrl = $sce.trustAsResourceUrl(paymentUrl);
        vm.cancel = cancel;
        vm.idOption = $sce.trustAsResourceUrl(idOption);
        vm.booking_number = $sce.trustAsResourceUrl(booking_number);

        $scope.billingCode = API_URL + paymentUrl.split('billingCode=')[1] != null ? API_URL + paymentUrl.split('billingCode=')[1] : null;
        console.log("Billing Code: " + $scope.billingCode);


        // $scope.$on('message', function (event, item) {
        //     cancel();
        // });

        var listener = function(e) {
            //$log.log("FlightPaymentExternalController - listener: " + e.data);
            //console.log("FlightPaymentExternalController - listener - %j", e.data);
            //$rootScope.$broadcast('message', e.data);
            if (e.data.slice(0, 5) !== "IPGDI") return;
            vm.cancel();

            $window.removeEventListener('message', listener);

            if (e.data && angular.isString(e.data) && e.data.indexOf("true") !== -1) {
                $rootScope.$broadcast('IssueTicket');
            }
        };

        function cancel() {
            $uibModalInstance.dismiss('cancel');

            $window.removeEventListener('message', listener);
        }

        $window.addEventListener('message', listener);

        // $window.postMessage("hello", "http://localhost:8080");

        function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        }

        //TODO: remove
        //$uibModalInstance.dismiss('cancel');

        // store the interval promise in this variable
        var promise;

        vm.setProgress = function() {
            // $log.log(vm.progress);
            vm.progress = vm.progress + (100 - vm.progress) / 10;
            // $log.log(vm.progress);
        };

        // starts the interval
        $scope.start = function() {
            // stops any running interval to avoid two intervals running at the same time
            $scope.stop();

            // store the interval promise
            promise = $interval(vm.setProgress, 1000);
        };

        // stops the interval
        $scope.stop = function() {
            $interval.cancel(promise);
        };


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
                        if (paymentStatus == 'PENDING') {
                            $state.go();
                        } else if (paymentStatus == 'FAILED') {
                            $log.log('GOTO - booking-payment');
                            $state.go('booking-payment/:booking_number/:params', {
                                "searchOptions": vm.searchOptions,
                                "searchResult": vm.searchResult,
                                "booking_number": Base64.encodeString(oldVm.orgBookingModel.bookingNumber),
                                "params": ''
                            });
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
        $scope.onIframeLoad = function(bookingNumber) {
            console.log('PageLoaded ' + bookingNumber);
            $('.modal-content .modal-header .modal-title .btn').click();
            vm._loadBookingInfo(bookingNumber);
        }
        // $scope.onIframeLoad();
        // starting the interval by default
        $scope.start();

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

        vm.closePayoo = function() {
            $uibModalInstance.dismiss('cancel');
            $window.location.href = paymentUrl;
        };

    }
})();