(function() {
    'use strict';

    gtdFlightBookingContactInfoController.$inject = ['$log', '$scope', 'Principal', 'MetaData', 'Flight', 'DataService', 'GlobalSrv', 'CustomerService'];

    function gtdFlightBookingContactInfoController($log, $scope, Principal, MetaData, Flight, DataService, GlobalSrv, CustomerService) {
        var ctrl = this;

        ctrl.isAuthenticated = Principal.isAuthenticated;
        ctrl.customerTravellers = [];
        ctrl.allCountries = GlobalSrv.getAllCountries();
        // $log.log('ctrl.allCountries=');
        // $log.log(ctrl.allCountries);
        // $log.log(ctrl.allCountries == null || ctrl.allCountries == undefined || ctrl.allCountries.length == 0);
        MetaData.searchLookups('ota_customer', 'passenger_gender').then(function success(result) {
            ctrl.titleLookups = result;
            console.log('resultSearchLookups: ');
            console.log(result);
            ctrl.adultTitleLookups = [];
            angular.forEach(ctrl.titleLookups, function(item) {
                // $log.log(item.lookupValue);
                if (item.lookupValue == 'MALE' || item.lookupValue == 'FEMALE') {
                    ctrl.adultTitleLookups.push(item);
                }
            });

        });
        //
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
        //             });
        //         } else {
        //             ctrl.customerTravellers = [];
        //         }
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
        } else {
            ctrl.customerTravellers = [];
        }

        // Startup event
        $scope.$on('gtd-load-booking-completed', function() {
            if (ctrl.allCountries == null || ctrl.allCountries == undefined || ctrl.allCountries.length == 0) {


                // $log.log('dosearchcountry');

                MetaData.getCountries().then(function success(result) {
                    ctrl.allCountries = result;

                    // $log.log('success');

                    if (result) {
                        angular.forEach(ctrl.bookingModel.contacts, function(item) {
                            // Init default
                            // $log.log('Default init');
                            if (!item.ciMobileCode) {
                                item.ciMobileCode = '84';
                            }

                        });
                    }
                }, function error(result) {
                    // $log.log('error');
                });
            } else {
                if (ctrl.bookingModel.contacts) {
                    angular.forEach(ctrl.bookingModel.contacts, function(item) {
                        // Init default
                        if (!item.ciMobileCode) {
                            item.ciMobileCode = '84';
                        }
                    });
                }

            }
            if (ctrl.bookingModel.contacts == undefined || ctrl.bookingModel.contacts.length == 0) {
                ctrl.bookingModel.contacts = [{
                    checked: false
                }];

                if (ctrl.allCountries && ctrl.allCountries.length > 0) {
                    angular.forEach(ctrl.bookingModel.contacts, function(item) {
                        // Init default
                        if (!item.ciMobileCode) {
                            item.ciMobileCode = '84';
                        }
                    });
                }

            }
            Principal.identity().then(function(user) {
                var data = {
                    // other fields
                    user: user
                };
                ctrl.identity = user;
                // do something with data only inside this inner function
                // Default Init for B2B
                var isB2B = Principal.hasAnyAuthority(['ROLE_B2B']);
                /*if (isB2B) {
                    CustomerService.getB2BProfile(ctrl.identity.login).then(function success(result) {
                        var item = ctrl.bookingModel.contacts[0];

                        var name = result.agentName;
                        var firstName = name.split(' ').slice(0, 1).join(' ');
                        var lastName = name.split(' ').slice(1).join(' ');

                        if (!item.ciFName) item.ciFName = firstName ? firstName.toUpperCase() : "";
                        if (!item.ciName) item.ciName = lastName ? lastName.toUpperCase() : "";
                        if (!item.ciEmail) item.ciEmail = result.email;
                        if (!item.ciMobile) item.ciMobile = result.mobile;

                    });
                }*/
                // End Default Init for B2B
            });
        });

        $scope.$on('gtd-update-contact-info', function(event, opt) {
            // update
            angular.forEach(ctrl.bookingModel.contacts, function(item) {
                item.ciFName = opt.model.ciFName;
                item.ciName = opt.model.ciName;
                item.ciGender = opt.model.gender;
            });
        });

        ctrl.addBlankContacts = function() {
            ctrl.bookingModel.contacts.push({
                checked: false
            });

            angular.forEach(ctrl.bookingModel.contacts, function(item) {
                // Init default
                item.ciMobileCode = '84';
            });
        };

        ctrl.removeContact = function(index) {
            ctrl.bookingModel.contacts.splice(index, 1);
        };

        ctrl.chooseContact = function(item) {
            //$log.log("item = " + JSON.stringify(item));
            $log.log("item = " + item);

            // reset customer
            item.ciGender = undefined;
            item.id = undefined;
            item.ciFName = undefined;
            item.ciName = undefined;
            item.ciEmail = undefined;
            item.ciMobile = undefined;
            item.ciMobileCode = '84';
            item.postcode = undefined;

            if (item.selectedTraveller) {
                // Contact must be ADULT so type = ADT
                if (item.selectedTraveller.gender == 'MALE' || item.selectedTraveller.gender == 'FEMALE') {
                    item.ciGender = item.selectedTraveller.gender;
                }

                item.id = item.selectedTraveller.id;
                item.ciFName = item.selectedTraveller.surName ? item.selectedTraveller.surName.toUpperCase() : '';
                item.ciName = item.selectedTraveller.firstName ? item.selectedTraveller.firstName.toUpperCase() : '';
                item.ciEmail = item.selectedTraveller.email;
                item.ciMobile = item.selectedTraveller.phoneNumber1;
                item.ciMobileCode = item.selectedTraveller.postalCode;
                item.postcode = item.selectedTraveller.postCode;
                if (!item.ciMobileCode) {
                    item.ciMobileCode = '84';
                }
            } else {
                item.id = null;
            }
        };
    }

    var gtdFlightBookingContactInfo = {
        require: {
            form: '^^form'
        },
        // bindToController : true, automatically happens
        // controllerAs : '$ctrl', automatically happens, too
        templateUrl: 'app/components/booking/flight-booking-contact-info.html',
        controller: gtdFlightBookingContactInfoController,
        bindings: {
            bookingModel: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingContactInfo', gtdFlightBookingContactInfo);

})();