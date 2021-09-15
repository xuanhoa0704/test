(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightSearchConfirmBookingController', FlightSearchConfirmBookingController);

    FlightSearchConfirmBookingController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$q', 'Flight', 'DataService', '$uibModalInstance', 'searchOptions', 'DialogService', 'currentGroupItem', 'currentPricedItinerary', 'IBE_KEYS', 'Base64', '$window', 'MerchantService'];

    function FlightSearchConfirmBookingController($log, $rootScope, $scope, $state, $stateParams, $timeout, $q, Flight, DataService, $uibModalInstance, searchOptions, DialogService, currentGroupItem, currentPricedItinerary, IBE_KEYS, Base64, $window, MerchantService

    ) {
        var vm = this;
        $scope.ibeKeys = IBE_KEYS;
        vm.searchOptions = searchOptions;
        if (vm.searchOptions.searchType == 'oneway') {
            vm.currentGroupItem = currentGroupItem;
            vm.currentPricedItinerary = currentPricedItinerary;
        } else {
            vm.currentGroupItem = DataService.getDepartGroupItem();
            vm.currentPricedItinerary = DataService.getDepartPricedItinerary();
        }

        vm.returnGroupItem = DataService.getReturnGroupItem();
        vm.returnPricedItinerary = DataService.getReturnPricedItinerary();

        vm.departSearchOptions = DataService.getDepartSearchOption();
        vm.returnSearchOptions = DataService.getReturnSearchOption();

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.$on('event-close-confirm-booking', function(event, item) {
            vm.cancel();
        });

        vm.doSubmit = function() {
            //vm.openWindow("https://google.com");
            // Validate ticket
            var newWindow = $window;
            if (vm.searchOptions.searchType == 'oneway') {
                var myDataPromise = Flight.revalidateTicket(vm.searchOptions, vm.currentGroupItem, vm.currentPricedItinerary);
                myDataPromise.then(function(result) {
                    $log.log("Get revalidate from flight.service - result.valid:" + result.valid);

                    if (result.valid) {

                        // vm.searchOptions.ssrOfferItemsDepart = result.ssrOfferItems;

                        //TODO: create draft booking
                        Flight.createDraftBooking(vm.searchOptions, vm.currentGroupItem, vm.currentPricedItinerary)
                            .then(function(result) {
                                // $log.log("Get createDraftBooking from flight.service ONEWAY - " + JSON.stringify(result));
                                $log.log("Get createDraftBooking from flight.service ONEWAY");

                                if (DialogService.isResponseSuccess(result)) {
                                    //+++ Nov052017: Tung fix
                                    /**
                                     * BookingModel = {
                                     *  "bookingCode": "string",
                                     *  "bookingNumber": "string"
                                     *  "draftBookingInfo": {
                                     *      .....
                                     *  }
                                     * }
                                     */
                                    // var _bookingModel = result.bookingCode;
                                    // _bookingModel.draftBookingInfo = result;

                                    var _bookingModel = {};
                                    _bookingModel.bookingCode = result.bookingCode.bookingCode;
                                    _bookingModel.bookingNumber = result.bookingCode.bookingNumber;
                                    _bookingModel.draftBookingInfo = result;

                                    $log.log("Get createDraftBooking from flight.service ONEWAY - _bookingModel: " + JSON.stringify(_bookingModel));

                                    DataService.setBookingModel(_bookingModel);
                                    //---

                                    DataService.setSearchOption(vm.searchOptions);
                                    // DataService.setSearchResult(vm.searchResult);
                                    //
                                    // alert(JSON.stringify(vm.searchResult));

                                    // Go to

                                    vm.preSubmit(_bookingModel);

                                    var url = $state.go('booking-info/:booking_number/:params', {
                                        "booking_number": Base64.encodeString(_bookingModel.bookingNumber),
                                        "searchOptions": vm.searchOptions,
                                        "searchResult": vm.searchResult,
                                        "params": ''
                                    }, {
                                        absolute: true
                                    });
                                    $log.log(url);
                                    // newWindow.location = url;
                                    //$window.open(url).focus();
                                    //                                    $state.go('booking-info/:booking_number/:params', {"searchOptions": vm.searchOptions, "searchResult": vm.searchResult,
                                    //                                        "booking_number": Base64.encodeString(_bookingModel.bookingNumber)
                                    //                                        , "params": ''});


                                } else {
                                    newWindow.close();
                                    DialogService.openHttpAlertDilalog(result);
                                }
                            }, function error(result) {
                                newWindow.close();
                                DialogService.openHttpAlertDilalog(result);
                            });
                    } else {
                        // alert('The ticket is not available. Please choose another one!');
                        DialogService.openAlertDialog({
                            "title": "Error",
                            "message": "The ticket is not available. Please choose another one!"
                        });
                        //swal('Error', 'The ticket is not available. Please choose another one!', 'error');
                    }

                    $uibModalInstance.dismiss('cancel');


                });
            } else {
                // Roundtrip
                if (vm.departSearchOptions.dtype == 'international') {
                    vm.returnSearchOptions = vm.departSearchOptions;
                    DataService.setReturnSearchOption(vm.returnSearchOptions);
                }

                $q.all([
                    Flight.revalidateTicket(vm.departSearchOptions, vm.currentGroupItem, vm.currentPricedItinerary),
                    Flight.revalidateTicket(vm.returnSearchOptions, vm.returnGroupItem, vm.returnPricedItinerary)
                ]).then(function(data) {
                    $log.log("Get revalidate from flight.service");
                    $log.log('Validate roundtrip result: ' + data[0].valid + ":" + data[1].valid);

                    // vm.searchOptions.ssrOfferItemsDepart = data[0].ssrOfferItems;
                    // vm.searchOptions.ssrOfferItemsReturn = data[1].ssrOfferItems;

                    if (data[0].valid && data[1].valid) {
                        Flight.createDraftBooking(vm.departSearchOptions, vm.currentGroupItem, vm.currentPricedItinerary,
                                vm.returnSearchOptions, vm.returnGroupItem, vm.returnPricedItinerary
                            )
                            .then(function(result) {
                                // $log.log("Get createDraftBooking from flight.service ROUNDTRIP - " + JSON.stringify(result));
                                $log.log("Get createDraftBooking from flight.service ROUNDTRIP");

                                if (DialogService.isResponseSuccess(result)) {
                                    //+++ Nov052017: Tung fix
                                    /**
                                     * BookingModel = {
                                     *  "bookingCode": "string",
                                     *  "bookingNumber": "string"
                                     *  "draftBookingInfo": {
                                     *      .....
                                     *  }
                                     * }
                                     */
                                    // var _bookingModel = result.bookingCode;
                                    // _bookingModel.draftBookingInfo = result;

                                    var _bookingModel = {};
                                    _bookingModel.bookingCode = result.bookingCode.bookingCode;
                                    _bookingModel.bookingNumber = result.bookingCode.bookingNumber;
                                    _bookingModel.draftBookingInfo = result;

                                    $log.log("Get createDraftBooking from flight.service ROUNDTRIP - _bookingModel: " + JSON.stringify(_bookingModel));

                                    DataService.setBookingModel(_bookingModel);
                                    //---

                                    DataService.setSearchOption(vm.searchOptions);
                                    // DataService.setSearchResult(vm.searchResult);
                                    //
                                    // alert(JSON.stringify(vm.searchResult));

                                    // Go to
                                    vm.preSubmit(_bookingModel);
                                    //                                    $state.go('booking-info/:booking_number/:params', {"searchOptions": vm.searchOptions, "searchResult": vm.searchResult,
                                    //                                        "booking_number": Base64.encodeString(_bookingModel.bookingNumber)
                                    //                                        , "params": ''});
                                    var url = $state.go('booking-info/:booking_number/:params', {
                                        "booking_number": Base64.encodeString(_bookingModel.bookingNumber),
                                        "searchOptions": vm.searchOptions,
                                        "searchResult": vm.searchResult,
                                        "params": ''
                                    }, {
                                        absolute: true
                                    });
                                    $log.log(url);
                                    // newWindow.location = url;
                                    // , "params": Base64.encode(JSON.stringify(DataService.getBookingModel()))});
                                } else {
                                    DialogService.openHttpAlertDilalog(result);
                                    newWindow.close();
                                }

                            }, function error(result) {
                                newWindow.close();
                                DialogService.openHttpAlertDilalog(result);
                            });
                    } else {
                        DialogService.openAlertDialog({
                            "title": "Error",
                            "message": "The ticket is not available. Please choose another one!"
                        });
                        //swal('Error', 'The ticket is not available. Please choose another one!', 'error');
                    }

                    $uibModalInstance.dismiss('cancel');
                });
            }

        };

        vm.preSubmit = function(_bookingModel) {

            _bookingModel.curStep = 1;
            if (!_bookingModel.biMobileCode) {
                _bookingModel.biMobileCode = '84';
            }

            _bookingModel.departSearchOptions = DataService.getDepartSearchOption();
            _bookingModel.returnSearchOptions = DataService.getReturnSearchOption();
            _bookingModel.searchOptions = DataService.getSearchOption();
            _bookingModel.departGroupItem = DataService.getDepartGroupItem();
            _bookingModel.departPricedItinerary = DataService.getDepartPricedItinerary();
            _bookingModel.returnGroupItem = DataService.getReturnGroupItem();
            _bookingModel.returnPricedItinerary = DataService.getReturnPricedItinerary();

            /* +++ 05Nov2017-Tung: add pricing for summary */
            var departItinTotalFare = {};
            var returnItinTotalFare = {};
            var isPerBookingType = false;

            if (_bookingModel.draftBookingInfo) {
                /* if a is NOT negative,undefined,null,empty value then... */
                isPerBookingType = _bookingModel.draftBookingInfo.isPerBookingType;

                departItinTotalFare = _bookingModel.draftBookingInfo.departDraftItineraryInfo.itinTotalFare;

                if (_bookingModel.draftBookingInfo.returnDraftItineraryInfo) {
                    returnItinTotalFare = _bookingModel.draftBookingInfo.returnDraftItineraryInfo.itinTotalFare;
                }
            } else {
                /* get defailt vaule from ticket */
                if (_bookingModel.departPricedItinerary && _bookingModel.departPricedItinerary.airItineraryPricingInfo) {
                    departItinTotalFare = _bookingModel.departPricedItinerary.airItineraryPricingInfo.itinTotalFare;
                }
                // departItinTotalFare = _bookingModel.departPricedItinerary.airItineraryPricingInfo.itinTotalFare;

                if (_bookingModel.returnPricedItinerary && _bookingModel.returnPricedItinerary.airItineraryPricingInfo) {
                    returnItinTotalFare = _bookingModel.returnPricedItinerary.airItineraryPricingInfo.itinTotalFare;
                }
            }
            _bookingModel.departItinTotalFare = departItinTotalFare;
            _bookingModel.returnItinTotalFare = returnItinTotalFare;
            _bookingModel.isPerBookingType = isPerBookingType;
            /* --- 05Nov2017-Tung */

            DataService.setBookingModel(_bookingModel);
        };

        vm.skipDialog = skipDialog;

        vm.doSubmit();
        //vm.skipDialog();

        function skipDialog() {
            if (MerchantService.isIframeView()) {
                vm.doSubmit();
            }
        }

    }
})();