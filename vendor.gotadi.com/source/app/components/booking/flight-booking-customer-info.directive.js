(function() {
    'use strict';

    gtdFlightBookingCustomerInfoController.$inject = ['$log', '$scope', '$rootScope', 'Principal', 'MetaData', 'Flight', 'DataService', 'GlobalSrv', 'CustomerService', 'DateUtils', '$location', '$cookies'];

    function gtdFlightBookingCustomerInfoController($log, $scope, $rootScope, Principal, MetaData, Flight, DataService, GlobalSrv, CustomerService, DateUtils, $location, $cookies) {
        var ctrl = this;
        $log.log("gtdFlightBookingCustomerInfoController:" + ctrl.bookingModel);

        // init liteEmbed Option
        ctrl.liteEmbed = false;
        if ($cookies.get('liteEmbed') || localStorage.getItem('liteEmbed')) {
            ctrl.liteEmbed = (($cookies.get('liteEmbed') || localStorage.getItem('liteEmbed')) === 'true');
        }

        ctrl.allCountries = GlobalSrv.getAllCountries();
        ctrl.allLookups = GlobalSrv.getAllLookups();

        ctrl.titleLookups = [];
        ctrl.cardTypeLookups = [];
        ctrl.passportTypeLookups = [];
        ctrl.customerTravellers = [];

        ctrl.setMeal = setMeal;
        ctrl.mergeSSr = mergeSSr;
        console.log(ctrl);

        function setMeal() {
            setTimeout(function() {
                $(".selectGender-meal").select2();
                $('#selectGender-meal,#selectGender-meal').on('select2:opening select2:closing', function(event) {
                    var $searchfield = $(this).parent().find('.select2-search__field');
                    $searchfield.prop('disabled', true);
                });
            }, 100);
        }

        ctrl.merchantCode = $location.search().merchant_code;
        if (!ctrl.merchantCode) ctrl.merchantCode = $cookies.get('merchant_code') || localStorage.getItem("merchant_code");

        // Startup event
        $scope.$on('gtd-load-booking-completed', function() {
            $log.log('gtd-load-booking-completed: ');
            $log.log(ctrl.bookingModel.customers);
            if (!ctrl.searchOptions) {
                ctrl.searchOptions = DataService.getSearchOption();
            }

            // find depart flight date
            departDate = ctrl.bookingModel.departPricedItinerary.originDestinationOptions[0].flightSegments[0].departureDateTime;
            ctrl.minExp = DateUtils.getMonthAgoFromBaseInDefaultFormat(departDate, -6);
            ctrl.maxExp = DateUtils.getMonthAgoFromBasePlusDaysInDefaultFormat(departDate, -6, 20 * 365);

            if (ctrl.bookingModel.customers == undefined || ctrl.bookingModel.customers.length == 0) {

                ctrl.bookingModel.customers = [];

                var adultQuantity = ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.adultFare && ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.adultFare.passengerTypeQuantities ? ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.adultFare.passengerTypeQuantities.quantity : 0;
                var childQuantity = ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.childFare && ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.childFare.passengerTypeQuantities ? ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.childFare.passengerTypeQuantities.quantity : 0;
                var infantQuantity = ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.infantFare && ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.infantFare.passengerTypeQuantities ? ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.infantFare.passengerTypeQuantities.quantity : 0;

                // create adult
                for (var i = 0; i < adultQuantity; i++) {
                    ctrl.bookingModel.customers.push({
                        checked: false,
                        type: 'ADT',
                        gid: i,
                        cuPp: 'PP',
                        min: DateUtils.getYearAgoFromBaseInDefaultFormat(departDate, 90),
                        max: DateUtils.getYearAgoFromBaseInDefaultFormat(departDate, 12)
                    });
                }


                // create child
                if (!childQuantity) {
                    ctrl.searchOptions.childrenNo = 0;
                } else {
                    ctrl.searchOptions.childrenNo = childQuantity;
                }
                for (var i = 0; i < ctrl.searchOptions.childrenNo; i++) {
                    ctrl.bookingModel.customers.push({
                        checked: false,
                        type: 'CHD',
                        gid: i,
                        cuPp: 'PP',
                        min: DateUtils.getYearAgoFromBasePlusDaysInDefaultFormat(departDate, 12, 0),
                        max: DateUtils.getYearAgoFromBaseInDefaultFormat(departDate, 2)
                    });
                }

                // create infant
                if (!infantQuantity) {
                    ctrl.searchOptions.newBornNo = 0;
                } else {
                    ctrl.searchOptions.newBornNo = infantQuantity;
                }
                for (var i = 0; i < ctrl.searchOptions.newBornNo; i++) {
                    ctrl.bookingModel.customers.push({
                        checked: false,
                        type: 'INF',
                        gid: i,
                        cuPp: 'PP',
                        min: DateUtils.getYearAgoFromBasePlusDaysInDefaultFormat(departDate, 2, 0),
                        max: DateUtils.getYearAgoFromBaseMinusDaysInDefaultFormat(departDate, 0, 14)
                    });
                }

                // ctrl.bookingModel.customers = [
                //     {checked: false}
                // ];

                angular.forEach(ctrl.bookingModel.customers, function(item) {
                    // Init default
                    // item.cuGender = 'MALE';
                    item.cuNationality = 'vn';
                });
            }
        });

        ctrl.checkListBaggage = function(item) {
            if (item.serviceType == "BAGGAGE") {
                if (ctrl.merchantCode == "FSOFT") {
                    if (item.code == "Goi (Bag) 15kgs" || item.code == "Goi (Bag) 20kgs" || item.code == "BG15" || item.code == "BG20" || item.code == "Goi (Bag) 15 kg")
                        return true;
                    else return false;
                }
                return true;
            }
            return false;
        }

        // find depart flight date
        var departDate;

        // ctrl.minExp = DateUtils.getYearAgoInDefaultFormat(0);


        // ctrl.passportExpDate = DateUtils.getMonthAgoFromBaseInDefaultFormat(departDate, 6);

        ctrl.isAuthenticated = Principal.isAuthenticated;

        Principal.identity().then(function(user) {
            var data = {
                // other fields
                user: user
            };
            ctrl.identity = user;
            // do something with data only inside this inner function
        });

        // $scope.$watch(function(scope) { return ctrl.isAuthenticated(); },
        //     function(newValue, oldValue) {
        //         //+++ Load traveler for auth customer
        //         if(Principal.isAuthenticated()) {
        //             CustomerService.getCustomerTravellersForBoth().then(function (result) {
        //                 if(result && result.length > 0) {
        //                     angular.forEach(result, function (traveller, index) {
        //                         if (index != 0) {
        //                             ctrl.customerTravellers.push(traveller);
        //                         }
        //                     });
        //                 }
        //                 $log.log("Search ALL customerTravellers");
        //                 $log.log(ctrl.customerTravellers );
        //             });
        //         } else {
        //             ctrl.customerTravellers = [];
        //         }
        //         //---
        //     }
        // );

        //+++ Load traveler for auth customer


        if (Principal.isAuthenticated()) {
            CustomerService.getCustomerTravellersForBoth().then(function(result) {
                if (result && result.length > 0) {
                    angular.forEach(result, function(traveller, index) {
                        if (index != 0) {
                            ctrl.customerTravellers.push(traveller);
                        }
                    });
                }
            });
        }
        //---

        if (ctrl.allCountries == [] || ctrl.allCountries.length == 0) {
            MetaData.getCountries().then(function success(result) {
                ctrl.allCountries = result;
            });
        }

        $log.log("Search ALL lookups");
        //$log.log("ctrl.allLookups = " + JSON.stringify(ctrl.allLookups));
        $log.log("ctrl.allLookups = " + ctrl.allLookups);

        if (ctrl.allLookups == [] || ctrl.allLookups.length == 0) {
            $log.log("Search ALL lookups");
            MetaData.searchLookups('', '', true).then(function success(result) {
                ctrl.allLookups = result;
                //$log.log("ctrl.allLookups = " + JSON.stringify(ctrl.allLookups));
                $log.log("ctrl.allLookups = " + ctrl.allLookups);
            });
        }


        MetaData.searchLookups('ota_customer', 'passenger_gender').then(function success(result) {
            ctrl.titleLookups = result;

            ctrl.adultTitleLookups = [];
            angular.forEach(ctrl.titleLookups, function(item) {
                //$log.log(item.lookupValue);
                if (item.lookupValue == 'MALE' || item.lookupValue == 'FEMALE') {
                    ctrl.adultTitleLookups.push(item);
                }
            });

            ctrl.childTitleLookups = [];
            angular.forEach(ctrl.titleLookups, function(item) {
                // $log.log(item.lookupValue);
                if (item.lookupValue == 'BOY' || item.lookupValue == 'GIRL') {
                    ctrl.childTitleLookups.push(item);
                }
            });
        });

        MetaData.searchLookups('air_member_card', '').then(function success(result) {
            if (ctrl.merchantCode == "FSOFT") {
                for (var i in result) {
                    if (result[i].lookupType == "DL") {
                        ctrl.cardTypeLookups.push(result[i]);
                    }
                }
            } else {
                ctrl.cardTypeLookups = result
            }

        });

        MetaData.searchLookups('ota_customer', 'passport_type').then(function success(result) {
            ctrl.passportTypeLookups = [];

            angular.forEach(result, function(item) {
                // $log.log(item.lookupValue);
                if (item.lookupValue == 'PP') {
                    ctrl.passportTypeLookups.push(item);
                }
            });
        });

        //dangpham
        ctrl.checkPassportForVNToEastSouthAsia = function() {
            var savedSearchOptions = DataService.getSavedSearchOption();
            var fromVNCheck = this.checkAirPortHasZoneInGroupName(savedSearchOptions.fromAirPort, 'Vietnam');
            var toEastSouthAsiaCheck = this.checkAirPortHasZoneInGroupName(savedSearchOptions.toAirPort, 'SouthEastAsia');
            return fromVNCheck && toEastSouthAsiaCheck;
        }

        ctrl.flightInternalfn = function() {
            var flightInternal = false;
            var flightAbroad = ctrl.bookingModel.departGroupItem;
            if (flightAbroad.airSupplier == 'VJ' || flightAbroad.airSupplier == 'BL' || flightAbroad.airSupplier == 'VN' || flightAbroad.airSupplier == 'QH') {
                flightInternal = true;
            }
            return flightInternal;
        };

        // dangpham
        ctrl.getGroupNameByAirPortCode = function(airPortCode) {
            var airports = GlobalSrv.getLocalAirports();
            var groupName = airports.find(function(x) {
                return x.code === airPortCode;
            }).groupName;
            return groupName;
        };

        //dangpham
        ctrl.checkAirPortHasZoneInGroupName = function(airportCode, zone) {
            var groupName = this.getGroupNameByAirPortCode(airportCode);
            var array = groupName.split(",");
            if (array.length == 1) {
                if (groupName == zone)
                    return true;
                return false;
            }

            for (var i = 0; i < array.length; i++) {
                if (zone == array[i]) {
                    return true;
                }
            }
            return false;
        }

        ctrl.addBlankCustomer = function() {
            ctrl.bookingModel.customers.push({
                checked: false
            });

            angular.forEach(ctrl.bookingModel.customers, function(item) {
                // Init default
                // item.cuGender = 'MALE';
                item.cuNationality = 'vn';
            });
        };

        ctrl.removeCustomer = function(index) {
            ctrl.bookingModel.customers.splice(index, 1);
        };

        ctrl.chooseCustomer = function(item) {
            //$log.log("item = " + JSON.stringify(item));
            $log.log("item = " + item);

            // Reset
            item.id = undefined;
            item.cuGender = undefined;
            item.cuFamilyName = undefined;
            item.cuName = undefined;
            item.cuCardType = undefined;
            item.cuCardNo = undefined;
            item.cuCardId = undefined;
            item.cuDob = undefined;
            if (ctrl.searchOptions.dtype == 'international') {
                item.cuDob = undefined;
                item.cuExpiredDate = undefined;
                item.cuPp = 'PP';
                item.cuId = undefined;
                item.cuNationality = 'vn';
            }



            if (item.selectedTraveller) {
                item.id = item.selectedTraveller.id;


                if (item.type == 'ADT') {
                    if (item.selectedTraveller.gender == 'MALE' || item.selectedTraveller.gender == 'FEMALE') {
                        item.cuGender = item.selectedTraveller.gender;
                    }
                } else if (item.type == 'CHD' || item.type == 'INF') {
                    if (item.selectedTraveller.gender == 'BOY' || item.selectedTraveller.gender == 'GIRL') {
                        item.cuGender = item.selectedTraveller.gender;
                    }

                    if (item.selectedTraveller.dob) {
                        item.cuDob = new Date(item.selectedTraveller.dob);
                    }
                }

                item.cuFamilyName = item.selectedTraveller.surName ? item.selectedTraveller.surName.toUpperCase() : '';
                item.cuName = item.selectedTraveller.firstName ? item.selectedTraveller.firstName.toUpperCase() : '';

                if (item.selectedTraveller.memberCards != null &&
                    item.selectedTraveller.memberCards != undefined &&
                    item.selectedTraveller.memberCards != []
                ) {
                    var mc = item.selectedTraveller.memberCards[0];
                    if (mc) {
                        item.cuCardType = mc.cardType;
                        item.cuCardNo = mc.cardNumber;
                        item.cuCardId = mc.id;
                    }

                }

                if (ctrl.searchOptions.dtype == 'international') {
                    if (item.selectedTraveller.dob) {
                        item.cuDob = new Date(item.selectedTraveller.dob);
                    }

                    if (item.selectedTraveller.expiredDate) {
                        item.cuExpiredDate = new Date(item.selectedTraveller.expiredDate);
                    }

                    if (item.selectedTraveller.documentType == 'PP') {
                        item.cuPp = item.selectedTraveller.documentType;

                        if (!item.cuPp) {
                            item.cuPp = 'PP';
                        }

                        item.cuId = item.selectedTraveller.documentNumber;
                    }

                    item.cuNationality = item.selectedTraveller.nationality;
                }

            } else {
                item.id = null;
            }
        };
        //select meal
        ctrl.chooseMeal = function($event) {
            //  if(ctrl.search.searchType =='oneway'){
            //      if(ctrl.searchOptions.ssrOfferItemsDepart){
            //          var depMeal = ctrl.searchOptions.ssrOfferItemsDepart[0].ssrItems;
            //          angular.forEach(ctrl.searchOptions.ssrOfferItemsDepart, function(meal){
            //              if(meal.ssrOfferItemsDepart == )
            //          })
            //      }
            //  }
        }

        ctrl.departBaggageServiceRequests = [];
        ctrl.returnBaggageServiceRequests = [];
        ctrl.departMealServiceRequests = [];
        ctrl.returnMealServiceRequests = [];


        ctrl.chooseLuggagePackage = function(type, idCustomer) {
            if (type == 'depart') {
                ctrl.departBaggageServiceRequests[idCustomer] = [];
                if (ctrl.searchOptions.ssrOfferItemsDepart) {
                    var depSsr = ctrl.searchOptions.ssrOfferItemsDepart[0].ssrItems;
                    angular.forEach(depSsr, function(srs) {
                        srs.fareSourceCode = ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                        if (ctrl.bookingModel.customers[idCustomer].cuLuggageDeparture == srs.id) {
                            ctrl.departBaggageServiceRequests[idCustomer] = srs;
                        }
                    });
                    $log.log('departBaggageServiceRequests');
                    $log.log(ctrl.departBaggageServiceRequests);
                }
            }
            if (type == 'return') {
                ctrl.returnBaggageServiceRequests[idCustomer] = [];
                if (ctrl.searchOptions.ssrOfferItemsReturn) {
                    var retSsr = ctrl.searchOptions.ssrOfferItemsReturn[0].ssrItems;
                    angular.forEach(retSsr, function(srs) {
                        srs.fareSourceCode = ctrl.bookingModel.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                        if (ctrl.bookingModel.customers[idCustomer].cuLuggageReturn == srs.id) {
                            ctrl.returnBaggageServiceRequests[idCustomer] = srs;
                        }
                    });
                }
                $log.log('returnServiceRequests');
                $log.log(ctrl.returnBaggageServiceRequests);
            }
            ctrl.mergeSSr(idCustomer);
        }

        ctrl.chooseMealPackage = function(type, idCustomer) {
            if (type == 'depart') {
                if (ctrl.searchOptions.ssrOfferItemsDepart) {
                    ctrl.departMealServiceRequests[idCustomer] = [];
                    var depSsr = ctrl.searchOptions.ssrOfferItemsDepart[0].ssrItems;
                    angular.forEach(depSsr, function(srs) {
                        srs.fareSourceCode = ctrl.bookingModel.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                        angular.forEach(ctrl.bookingModel.customers[idCustomer].cuMealDeparture, function(cuMeal) {
                            if (cuMeal == srs.id) {
                                ctrl.departMealServiceRequests[idCustomer].push(srs);
                            }
                        })
                    });
                    $log.log('departMealServiceRequests');
                    $log.log(ctrl.departMealServiceRequests);
                }
            }
            if (type == 'return') {
                if (ctrl.searchOptions.ssrOfferItemsDepart) {
                    ctrl.returnMealServiceRequests[idCustomer] = [];
                    var retSsr = ctrl.searchOptions.ssrOfferItemsReturn[0].ssrItems;
                    angular.forEach(retSsr, function(srs) {
                        srs.fareSourceCode = ctrl.bookingModel.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                        angular.forEach(ctrl.bookingModel.customers[idCustomer].cuMealReturn, function(cuMeal) {
                            if (cuMeal == srs.id) {
                                ctrl.returnMealServiceRequests[idCustomer].push(srs);
                            }
                        })
                    });
                    $log.log('returnMealServiceRequests');
                    $log.log(ctrl.returnMealServiceRequests);
                }
            }
            ctrl.mergeSSr(idCustomer);
        }

        function mergeSSr(idCustomer) {
            ctrl.bookingModel.customers[idCustomer].serviceRequests = [];
            ctrl.bookingModel.customers[idCustomer].departServiceRequests = [];
            ctrl.bookingModel.customers[idCustomer].returnServiceRequests = [];

            if (ctrl.departBaggageServiceRequests[idCustomer]) {
                ctrl.bookingModel.customers[idCustomer].serviceRequests = ctrl.bookingModel.customers[idCustomer].serviceRequests.concat(ctrl.departBaggageServiceRequests[idCustomer]);
                ctrl.bookingModel.customers[idCustomer].departServiceRequests = ctrl.bookingModel.customers[idCustomer].departServiceRequests.concat(ctrl.departBaggageServiceRequests[idCustomer]);
            }
            if (ctrl.returnBaggageServiceRequests[idCustomer]) {
                ctrl.bookingModel.customers[idCustomer].serviceRequests = ctrl.bookingModel.customers[idCustomer].serviceRequests.concat(ctrl.returnBaggageServiceRequests[idCustomer]);
                ctrl.bookingModel.customers[idCustomer].returnServiceRequests = ctrl.bookingModel.customers[idCustomer].returnServiceRequests.concat(ctrl.returnBaggageServiceRequests[idCustomer]);
            }
            if (ctrl.departMealServiceRequests[idCustomer]) {
                ctrl.bookingModel.customers[idCustomer].serviceRequests = ctrl.bookingModel.customers[idCustomer].serviceRequests.concat(ctrl.departMealServiceRequests[idCustomer]);
                ctrl.bookingModel.customers[idCustomer].departServiceRequests = ctrl.bookingModel.customers[idCustomer].departServiceRequests.concat(ctrl.departMealServiceRequests[idCustomer]);
            }
            if (ctrl.returnMealServiceRequests[idCustomer]) {
                ctrl.bookingModel.customers[idCustomer].serviceRequests = ctrl.bookingModel.customers[idCustomer].serviceRequests.concat(ctrl.returnMealServiceRequests[idCustomer]);
                ctrl.bookingModel.customers[idCustomer].returnServiceRequests = ctrl.bookingModel.customers[idCustomer].returnServiceRequests.concat(ctrl.returnMealServiceRequests[idCustomer]);
            }
            // $log.log('ctrl.bookingModel.customers');
            // $log.log(ctrl.bookingModel.customers);
        }
        ctrl.chooseMemberCard = function(item) {
            item.cuCardNo = '';
            item.cuCardId = null;

            if (item.selectedTraveller && item.selectedTraveller.memberCards) {
                angular.forEach(item.selectedTraveller.memberCards, function(mc) {
                    if (item.cuCardType == mc.cardType) {
                        item.cuCardNo = mc.cardNumber;
                        item.cuCardId = mc.id;
                    }
                });

            }
        };

        ctrl.updateSelection = function(position, entities) {
            angular.forEach(entities, function(item, index) {
                if (position != index) {
                    item.checked = false;
                } else {
                    // update contact info
                    // alert('$rootScope.$broadcast' + JSON.stringify(item));
                    if (item.checked) {
                        $rootScope.$broadcast('gtd-update-contact-info', {
                            model: item
                        });
                    } else {
                        //$rootScope.$broadcast('gtd-update-contact-info', {model: {}});
                    }
                }
            });
        };

        $scope.fooChanged = function(index) {
            $('.checkedSelectContact').not('.selectContact' + index).prop('checked', false);
            var first_name = $('#cuFamilyName' + index).val();
            var last_name = $('#cuName' + index).val();
            var gender = $('#bookingCuGender' + index).val();
            var infoContact = {
                ciFName: first_name,
                ciName: last_name,
                gender: gender
            };
            $rootScope.$broadcast('gtd-update-contact-info', {
                model: infoContact
            });
        };
        $scope.changeInput = function(index, type, value) {
            if ($('.selectContact' + index).is(':checked')) {
                var first_name = $('#cuFamilyName' + index).val();
                var last_name = $('#cuName' + index).val();
                var gender = $('#bookingCuGender' + index).val();
                var infoContact = {
                    ciFName: first_name,
                    ciName: last_name,
                    gender: gender
                };
                $rootScope.$broadcast('gtd-update-contact-info', {
                    model: infoContact
                });
            }
        };
        $scope.changeSelect = function(index, value) {
            if ($('.selectContact' + index).is(':checked')) {
                var first_name = $('#cuFamilyName' + index).val();
                var last_name = $('#cuName' + index).val();
                var gender = $('#bookingCuGender' + index).val();
                var infoContact = {
                    ciFName: first_name,
                    ciName: last_name,
                    gender: gender
                };
                $rootScope.$broadcast('gtd-update-contact-info', {
                    model: infoContact
                });
            }
        };
    }

    var gtdFlightBookingCustomerInfo = {
        require: {
            form: '^^form'
        },
        // bindToController : true, automatically happens
        // controllerAs : '$ctrl', automatically happens, too

        templateUrl: 'app/components/booking/flight-booking-customer-info.html',
        controller: gtdFlightBookingCustomerInfoController,
        bindings: {
            bookingModel: '=',
            searchOptions: '=?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingCustomerInfo', gtdFlightBookingCustomerInfo);

})();