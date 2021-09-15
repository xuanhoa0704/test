(function() {
    /*jshint bitwise: false*/
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('FlightUtils', FlightUtils);

    FlightUtils.$inject = ['$log', '$uibModal', '$translate', '$state', 'DataService', 'TRANS_TIME_OUT', 'DialogService', 'GlobalSrv'];

    function FlightUtils($log, $uibModal, $translate, $state, DataService, TRANS_TIME_OUT, DialogService, GlobalSrv) {

        var service = {
            convertBookingToVM: convertBookingToVM
        };

        return service;


        function convertBookingToVM(result) {

            var vm = {};
            vm.returnBookingModel = {};
            vm.searchOptions = {};

            if (result && result.bookingInfo) {
                vm.bjson = result;

                vm.bookingModel = result.bookingInfo;

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

                return vm;
            }
        }
    }
})();