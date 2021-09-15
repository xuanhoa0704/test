(function() {
    'use strict';

    gtdHotelBookingBillingInfoController.$inject = ['$log', '$scope', 'MetaData', 'Flight', 'DataService', 'GlobalSrv', 'CustomerService', 'Principal'];

    function gtdHotelBookingBillingInfoController($log, $scope, MetaData, Flight, DataService, GlobalSrv, CustomerService, Principal) {
        var ctrl = this;
        ctrl.isAuthenticated = Principal.isAuthenticated;
        ctrl.allCountries = GlobalSrv.getAllCountries();

        // if (!ctrl.bookingModel.showForm) {
        //     ctrl.bookingModel.showForm = false;
        // }
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

        $scope.$on('gtd-load-booking-completed', function() {
            $log.log('gtd-load-booking-completed: ');
            if (!ctrl.bookingModel.showForm) {
                ctrl.bookingModel.showForm = false;
            }
        });

        if (!ctrl.allCountries) {
            MetaData.getCountries().then(function success(result) {
                ctrl.allCountries = result;
            });
        }

        ctrl.doShowForm = function() {
            // ctrl.bookingModel.showForm = !ctrl.bookingModel.showForm;

            if (!ctrl.bookingModel.showForm) {
                ctrl.bookingModel.biCompany = undefined;
                ctrl.bookingModel.biMst = undefined;
                ctrl.bookingModel.biMobileCode = '84';
                ctrl.bookingModel.biMobile = undefined;
                ctrl.bookingModel.biAddress = undefined;
                ctrl.bookingModel.tPCfName = undefined;
                ctrl.bookingModel.tPCName = undefined;
                ctrl.bookingModel.tPCPhoneCode = '84';
                ctrl.bookingModel.tPCPhone = undefined;
                ctrl.bookingModel.tPCemail = undefined;
                ctrl.bookingModel.tPCNote = undefined;
            }
        };

        ctrl.chooseContact = function(item) {
            //$log.log("item = " + JSON.stringify(item));
            $log.log("item = " + item);

            // reset customer
            item.ciGender = undefined;
            item.id = undefined;
            ctrl.bookingModel.tPCfName = undefined;
            ctrl.bookingModel.tPCName = undefined;
            ctrl.bookingModel.tPCPhone = undefined;
            ctrl.bookingModel.tPCemail = undefined;
            ctrl.bookingModel.tPCPhoneCode = '84';
            item.postcode = undefined;

            if (item.selectedTraveller) {
                // Contact must be ADULT so type = ADT
                if (item.selectedTraveller.gender == 'MALE' || item.selectedTraveller.gender == 'FEMALE') {
                    item.ciGender = item.selectedTraveller.gender;
                }

                item.id = item.selectedTraveller.id;
                ctrl.bookingModel.tPCfName = item.selectedTraveller.surName ? item.selectedTraveller.surName.toUpperCase() : '';
                ctrl.bookingModel.tPCName = item.selectedTraveller.firstName ? item.selectedTraveller.firstName.toUpperCase() : '';
                ctrl.bookingModel.tPCemail = item.selectedTraveller.email;
                ctrl.bookingModel.tPCPhone = item.selectedTraveller.phoneNumber1;
                ctrl.bookingModel.tPCPhoneCode = item.selectedTraveller.postalCode;
                ctrl.bookingModel.postcode = item.selectedTraveller.postCode;
                if (!ctrl.bookingModel.tPCPhoneCode) {
                    ctrl.bookingModel.tPCPhoneCode = '84';
                }
            } else {
                item.id = null;
            }
            $log.log(item)
        };

        ctrl.updateBillingInfo = function() {
            // alert(ctrl.bookingModel.biChecked);
            // console.log(ctrl.bookingModel);
            if (ctrl.bookingModel.biChecked) {
                ctrl.bookingModel.biFName = ctrl.bookingModel.contacts[0].ciFName;
                ctrl.bookingModel.biLName = ctrl.bookingModel.contacts[0].ciName;
                ctrl.bookingModel.biMobileCode = ctrl.bookingModel.contacts[0].ciMobileCode;
                ctrl.bookingModel.biMobile = ctrl.bookingModel.contacts[0].ciMobile;
                ctrl.bookingModel.biEmail = ctrl.bookingModel.contacts[0].ciEmail;
            }
        };
    }

    var gtdHotelBookingBillingInfo = {
        require: {
            form: '^^form'
        },
        // bindToController : true, automatically happens
        // controllerAs : '$ctrl', automatically happens, too
        templateUrl: 'app/components/booking/hotel-booking-billing-info.html',
        controller: gtdHotelBookingBillingInfoController,
        bindings: {
            bookingModel: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingBillingInfo', gtdHotelBookingBillingInfo);

})();