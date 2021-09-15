(function() {
    'use strict';

    gtdHotelBookingCustomerInfoController.$inject = [
        '$log', '$rootScope', '$scope',
        'MetaData', 'Flight', 'CustomerService', 'GlobalSrv', 'DataService', 'DateUtils', 'Principal', 'GtdHotelService'
    ];

    function gtdHotelBookingCustomerInfoController(
        $log, $rootScope, $scope,
        MetaData, Flight, CustomerService, GlobalSrv, DataService, DateUtils, Principal, GtdHotelService
    ) {

        var ctrl = this;
        $log.log(ctrl.bookingModel);

        ctrl.allLookups = GlobalSrv.getAllLookups();

        ctrl.titleLookups = [];

        ctrl.searchOptions = GtdHotelService.getSearchOptions();

        ctrl.isAuthenticated = Principal.isAuthenticated;

        ctrl.customerTravellers = [];

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
                        //ctrl.customerTravellers = result;
                        ctrl.customerTravellers = [];
                        angular.forEach(result, function(item) {
                            //if (item.gender == 'MALE' || item.gender == 'FEMALE' || item.adultType == 'ADT') {
                            ctrl.customerTravellers.push(item);
                            //}
                        });
                        $log.log(ctrl.customerTravellers);
                    });
                }
            }
        );

        //+++ Load traveler for auth customer
        if (Principal.isAuthenticated()) {
            CustomerService.getCustomerTravellersForBoth().then(function(result) {
                ctrl.customerTravellers = [];
                angular.forEach(result, function(item) {
                    //if (item.gender == 'MALE' || item.gender == 'FEMALE' || item.adultType == 'ADT') {
                    ctrl.customerTravellers.push(item);
                    //}
                });
                $log.log(ctrl.customerTravellers);
                // ctrl.customerTravellers = result;
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
        });

        MetaData.searchLookups('ota_customer', 'passenger_gender').then(function success(result) {
            ctrl.titleLookups = result;

            ctrl.adultTitleLookups = [];
            angular.forEach(ctrl.titleLookups, function(item) {
                // $log.log(item.lookupValue);
                if (item.lookupValue == 'MALE' || item.lookupValue == 'FEMALE') {
                    ctrl.adultTitleLookups.push(item);
                }
            });

        });

        // find depart flight date
        // var departDate = ctrl.selectedHotel.checkIn;


        if (ctrl.bookingModel.customers == undefined) {

            ctrl.bookingModel.customers = [];

            // create adult
            for (var i = 0; i < ctrl.searchOptions.hotelSearchBody.length; i++) {
                ctrl.bookingModel.customers.push({
                    checked: false,
                    type: 'ADT',
                    gid: i,
                    cuPp: 'PP'
                    // min: DateUtils.getYearAgoFromBaseInDefaultFormat(departDate, 90),
                    // max: DateUtils.getYearAgoFromBaseInDefaultFormat(departDate, 12)
                });
            }

            $log.log(ctrl.bookingModel.customers);
            $log.log("++++++++++++++++++++++++++");
            $log.log(ctrl.searchOptions.pax);


            // create infant
            // if (!ctrl.searchOptions.childrenNo) ctrl.searchOptions.childrenNo = 0;
            // for (var i = 0; i < ctrl.searchOptions.childrenNo; i++) {
            //     ctrl.bookingModel.customers.push({
            //         checked: false,
            //         type: 'CHD',
            //         gid: i,
            //         cuPp: 'PP'
            //     });
            // }

            angular.forEach(ctrl.bookingModel.customers, function(item) {
                // Init default
                item.cuGender = 'MR';
                item.cuNationality = 'vn';
            });

        }

        ctrl.addBlankCustomer = function() {
            ctrl.bookingModel.customers.push({
                checked: false
            });

            angular.forEach(ctrl.bookingModel.customers, function(item) {
                // Init default
                item.cuGender = 'MR';
                item.cuNationality = 'vn';
            });
        };

        ctrl.removeCustomer = function(index) {
            ctrl.bookingModel.customers.splice(index, 1);
        };

        ctrl.chooseCustomer = function(item) {
            //$log.log("item = " + JSON.stringify(item));
            $log.log("item = " + item);

            item.id = undefined;
            item.cuGender = undefined;
            item.cuFamilyName = undefined;
            item.cuName = undefined;
            item.cuCardType = undefined;
            item.cuCardNo = undefined;
            item.cuCardId = undefined;
            item.cuDob = undefined;

            if (item.selectedTraveller) {
                item.id = item.selectedTraveller.id;
                item.cuGender = item.selectedTraveller.gender;
                item.cuFamilyName = item.selectedTraveller.surName;
                item.cuName = item.selectedTraveller.firstName;
                if (item.selectedTraveller.dob) {
                    item.cuDob = new Date(item.selectedTraveller.dob);
                }
                // item.cuDob = item.selectedTraveller.dob;
                // item.cuDobd = item.selectedTraveller.dob;
                // item.cuDobm = item.selectedTraveller.dob;
                // item.cuDoby = item.selectedTraveller.dob;
                item.cuPp = item.selectedTraveller.documentType;

                if (!item.cuPp) {
                    item.cuPp = 'PP';
                }

                item.cuId = item.selectedTraveller.documentNumber;
                item.cuNationality = item.selectedTraveller.nationality;

                if (item.selectedTraveller.memberCards != null &&
                    item.selectedTraveller.memberCards != undefined &&
                    item.selectedTraveller.memberCards != []
                ) {
                    var mc = item.selectedTraveller.memberCards[0];
                    if (mc) {
                        item.cuCardType = mc.cardType;
                        item.cuCardNo = mc.cardNumber;
                    }

                }
            } else {
                item.id = null;
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

        ctrl.syncContactInfo = function(entities) {
            angular.forEach(entities, function(item, index) {
                // if (position != index) {
                //     item.checked = false;
                // } else {

                // update contact info
                // alert('$rootScope.$broadcast' + JSON.stringify(item));
                if (item.checked) {
                    $rootScope.$broadcast('gtd-update-contact-info', {
                        model: item
                    });
                }
                //     else {
                //         //$rootScope.$broadcast('gtd-update-contact-info', {model: {}});
                //     }
                // }
            });
        };

        // ctrl.syncContactInfo = function() {
        //     var message = {
        //         'name': 'name'
        //     };
        //     alert(1);
        //     //$rootScope.$broad
        // };

        $log.log(ctrl.bookingModel.requestOptions);
        //if (ctrl.bookingModel.requestOptions == undefined) {
        ctrl.bookingModel.requestOptions = [{
            id: "0",
            text: "Phòng yên tĩnh",
            selected: false
        }, {
            id: "1",
            text: "Phòng không hút thuốc",
            selected: false
        }, {
            id: "2",
            text: "Phòng tầng trệt",
            selected: false
        }, {
            id: "3",
            text: "Phòng tầng cao",
            selected: false
        }];


        // END MERGE
    }

    var gtdHotelBookingCustomerInfo = {
        require: {
            form: '^^form'
        },
        templateUrl: 'app/components/booking/hotel-booking-customer-info.html',
        controller: gtdHotelBookingCustomerInfoController,
        bindings: {
            bookingModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingCustomerInfo', gtdHotelBookingCustomerInfo);

})();