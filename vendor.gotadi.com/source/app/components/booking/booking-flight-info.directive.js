(function() {
    'use strict';

    gtdBookingFlightInfoController.$inject = ['$log', '$state', '$scope', '$timeout', '$rootScope', 'DataService', 'MetaData', 'Flight', 'LoginService', 'Principal', 'Auth', 'IBE_KEYS', 'Base64', 'ValidationUtils'];

    function gtdBookingFlightInfoController($log, $state, $scope, $timeout, $rootScope, DataService, MetaData, Flight, LoginService, Principal, Auth, IBE_KEYS, Base64, ValidationUtils) {
        var ctrl = this;

        ctrl.departFlightModel.expand = false;
        ctrl.returnFlightModel.expand = false;

        $scope.ibeKeys = IBE_KEYS;

        ctrl.searchOptions = DataService.getSearchOption();

        ctrl.isAuthenticated = Principal.isAuthenticated;

        Principal.identity().then(function(user) {
            var data = {
                // other fields
                user: user
            };
            ctrl.identity = user;
            // do something with data only inside this inner function
            //$log.log("ctrl.identity = " + JSON.stringify(user));
            $log.log("ctrl.identity = " + user);
        });

        ctrl.openLogin = function() {
            LoginService.open();
        };


        ctrl.logout = function() {
            Auth.logout();
        };

        ctrl.changeFlight = function(step) {
            var searchOptions = DataService.getSearchOption();
            var departSearchOptions = DataService.getDepartSearchOption();

            // TODO: remove later, current workaround for IE, force user to research
            $log.log('isIE = ' + ValidationUtils.isIE());
            if (ValidationUtils.isIE()) {
                searchOptions = {};
            }

            var searchResult;

            $log.log(searchResult);

            // if (searchOptions.dtype == 'domestic') {
            if (step == 1) {
                searchOptions.returnDomestic = false;
                searchResult = DataService.getDepartSearchResult();
            } else if (step == 2) {
                if (searchOptions.dtype != 'international') {
                    searchOptions.returnDomestic = true;
                }

                searchResult = DataService.getReturnSearchResult();
            }
            // } else {
            //     // searchResult = DataService.getSearchResult();
            //     searchResult = DataService.getDepartSearchResult();
            //     // alert(JSON.stringify(searchResult));
            // }

            searchOptions.selectStep = step;
            // search option is now return option -> for domestic need to set searchId back to departSearchId if change depart flight
            if (searchOptions.dtype == 'domestic' && searchOptions.selectStep == 1 && searchOptions.searchType == 'roundtrip') {
                searchOptions.searchId = departSearchOptions.searchId;
            }

            // calculate searchCompleted
            var searchCompleted;
            if (searchResult.groupPricedItineraries) {
                searchCompleted = true;
            } else {
                searchCompleted = false;
            }

            // TODO: remove later, current workaround for IE, force user to research
            $log.log('isIE = ' + ValidationUtils.isIE());
            if (ValidationUtils.isIE()) {
                searchCompleted = false;
                searchResult = {};
            }

            // $state.go('flight-search', {"searchOptions": searchOptions, "searchResult": searchResult});
            $state.go('flight-search', {
                "searchOptions": searchOptions,
                "searchResult": searchResult,
                "searchCompleted": searchCompleted,
                "params": Base64.encodeJson(searchOptions)
            });


            $timeout(function() {
                // alert("BROADCAST");
                $rootScope.$broadcast("gtd-refresh-adv-search-result", null);
            }, 5000);
        };
    }

    var gtdBookingFlightInfo = {
        templateUrl: 'app/components/booking/booking-flight-info.html',
        controller: gtdBookingFlightInfoController,
        bindings: {
            bookingModel: '=',
            departFlightModel: '=',
            returnFlightModel: '=',
            showChangeFlight: '@?',
            notShowLoginSection: '@?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdBookingFlightInfo', gtdBookingFlightInfo);

})();