(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelBookingResultController', HotelBookingResultController);

    HotelBookingResultController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$uibModal', 'Flight', 'DataService', 'CustomerService', 'Base64', 'DialogService', '$location', 'FlightUtils'];

    function HotelBookingResultController($log, $rootScope, $scope, $state, $stateParams, $timeout, $uibModal, Flight, DataService, CustomerService, Base64, DialogService, $location, FlightUtils) {

        //vm.paymentModel.paymentOption = 'atm';
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


        //TODO: remove later

        // vm.searchOptions = DataService.getHotelSearchOptions();

        // vm.selectedHotel = DataService.getSelectedHotel();
        // vm.selectedHotelProduct = DataService.getSelectedHotelProduct();
        // vm.selectedHotelRoom = DataService.getSelectedHotelRoom();

        //$log.log("vm.bookingModel=" + JSON.stringify(vm.bookingModel));
        // $log.log("vm.bookingModel=" + vm.bookingModel);

        //++++ initial parameter
        vm.bookingModel.bookingNumber = Base64.decodeString($stateParams.booking_number);
        $log.log('$stateParams.booking_number = ');
        $log.log(vm.bookingModel.bookingNumber);

        /**
         * NAM.HUYNHPHUONG - Mobile payment
         */
        if ($stateParams.is_mobile) {
            //++++ initial parameter
            if ($stateParams.is_mobile === 'mobile') {
                if ($stateParams.booking_number) {
                    CustomerService.getFinalBookingByNumber(vm.bookingModel.bookingNumber).then(function(result) {
                        if (!!result.bookingInfo) {
                            var bookingStatus = result.bookingInfo.status;
                            var paymentStatus = result.bookingInfo.paymentStatus;
                            var issueStatus = result.bookingInfo.issuedStatus;
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


        CustomerService.getFinalBookingByNumber(vm.bookingModel.bookingNumber).then(function(result) {
            vm.closeLoading();

            vm.bkgroup = result;
            $log.log("+++++ vm.bkgroup = ");
            $log.log(vm.bkgroup);

            vm.selectedHotel = vm.bkgroup.hotelAvailability;
            vm.selectedHotelProduct = vm.bkgroup.hotelAvailability.products[0];
            vm.selectedHotelRoom = vm.bkgroup.hotelAvailability.products[0].rooms[0];

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
        });

        //vm.bookingModel.curStep = 3;



        vm.doConfirm = function() {
            //$state.go('booking-result');
        };

        vm.doBack = function() {
            //$state.go('booking-confirm');
        };

    }
})();