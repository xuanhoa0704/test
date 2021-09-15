(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightSearchController', FlightSearchController);

    FlightSearchController.$inject = ['$cookies', '$localStorage', '$location', '$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$interval', 'Flight', 'DataService', 'ValidationUtils', 'Base64', 'MerchantService'];

    function FlightSearchController($cookies, $localStorage, $location, $log, $rootScope, $scope, $state, $stateParams, $timeout, $interval, Flight, DataService, ValidationUtils, Base64, MerchantService) {
        var vm = this;


        $log.log($stateParams.searchOptions);
        $log.log($stateParams.searchResult);

        vm.searchResult = $stateParams.searchResult;
        vm.searchOptions = $stateParams.searchOptions;
        vm.params = $stateParams.params;
        vm.init = $stateParams.init;
        vm.searchCompleted = $stateParams.searchCompleted;
        vm.filterCompleted = $stateParams.filterCompleted;

        $log.log("Do refresh vm.init =: " + vm.init + ", searchCompleted=" + vm.searchCompleted);

        if (!vm.searchOptions) {
            vm.searchOptions = DataService.getSearchOption();
        }

        if (vm.params) {
            try {
                vm.searchOptions = Base64.decodeJson(vm.params);
                // check deserialize nothing (searchoptions is rebuild when user referesh another page -> have nothing
                if (!vm.searchOptions.fromAirPort || !vm.searchOptions.toAirPort) {
                    throw "Deseriaize null object";
                }

                if (vm.searchOptions.dtype == 'international' && vm.searchOptions.selectStep == 2) {
                    if (!(vm.searchResult && vm.searchResult.groupPricedItineraries && vm.searchResult.groupPricedItineraries.length > 0 && vm.searchResult.groupPricedItineraries[0].pricedItineraries && vm.searchResult.groupPricedItineraries[0].pricedItineraries.length > 0)) {
                        vm.init = true;
                    }
                } else {
                    if (!vm.searchResult || (vm.searchResult && !vm.searchResult.page)) {
                        vm.init = true;
                    }
                }
            } catch (err) {
                $log.log('Deseriaize issues - get back from cache');
                $log.log(err);
                var savedSearchOptions = DataService.getSavedSearchOption();
                vm.searchOptions.fromAirPort = savedSearchOptions.fromAirPort;
                vm.searchOptions.toAirPort = savedSearchOptions.toAirPort;
                vm.searchOptions.departureDate = savedSearchOptions.departureDate;
                vm.searchOptions.returnDate = savedSearchOptions.returnDate;
                vm.searchOptions.searchType = savedSearchOptions.searchType;
                vm.searchOptions.dtype = savedSearchOptions.dtype;
                vm.searchOptions.adultNo = savedSearchOptions.adultNo;
                vm.searchOptions.childrenNo = savedSearchOptions.childrenNo;
                vm.searchOptions.newBornNo = savedSearchOptions.newBornNo;

                if (vm.searchOptions.dtype == 'international' && vm.searchOptions.selectStep == 2) {
                    if (!(vm.searchResult && vm.searchResult.groupPricedItineraries && vm.searchResult.groupPricedItineraries.length > 0 && vm.searchResult.groupPricedItineraries[0].pricedItineraries && vm.searchResult.groupPricedItineraries[0].pricedItineraries.length > 0)) {
                        vm.init = true;
                    }
                } else {
                    if (!vm.searchResult || (vm.searchResult && !vm.searchResult.page)) {
                        vm.init = true;
                    }
                }
            }
        } else {
            var savedSearchOptions = DataService.getSavedSearchOption();
            vm.searchOptions.fromAirPort = savedSearchOptions.fromAirPort;
            vm.searchOptions.toAirPort = savedSearchOptions.toAirPort;
            vm.searchOptions.departureDate = savedSearchOptions.departureDate;
            vm.searchOptions.returnDate = savedSearchOptions.returnDate;
            vm.searchOptions.searchType = savedSearchOptions.searchType;
            vm.searchOptions.dtype = savedSearchOptions.dtype;
            vm.searchOptions.adultNo = savedSearchOptions.adultNo;
            vm.searchOptions.childrenNo = savedSearchOptions.childrenNo;
            vm.searchOptions.newBornNo = savedSearchOptions.newBornNo;

            if (vm.searchOptions.dtype == 'international' && vm.searchOptions.selectStep == 2) {
                if (!(vm.searchResult && vm.searchResult.groupPricedItineraries && vm.searchResult.groupPricedItineraries.length > 0 && vm.searchResult.groupPricedItineraries[0].pricedItineraries && vm.searchResult.groupPricedItineraries[0].pricedItineraries.length > 0)) {
                    vm.init = true;
                }
            } else {
                if (!vm.searchResult || (vm.searchResult && !vm.searchResult.page)) {
                    vm.init = true;
                }
            }
        }

        vm.merchantCode = MerchantService.getMerchant();


        // init means Need To Init
        $scope.$on('gtd-filter-completed-off', function() {
            vm.filterCompleted = false;
        });
        $scope.$on('gtd-filter-completed-on', function() {
            vm.filterCompleted = true;
        });
        $scope.$on('gtd-search-completed-off', function() {
            vm.searchCompleted = false;
        });
        $scope.$on('gtd-search-completed-on', function() {
            vm.searchCompleted = true;
        });
        $scope.$on('gtd-init-off', function() {
            vm.init = false;
        });
        $scope.$on('gtd-init-on', function() {
            vm.init = true;
        });

        $scope.$on('gtd-adv-do-filter', function() {
            vm.alreadyFilter = true;
        });

        // vm.searchResult = Flight.searchFlight();

        vm.doSearch = function($searchResult, $searchOptions) {
            vm.searchResult = $searchResult;
            vm.searchOptions = $searchOptions;
            vm.searchCompleted = true;

            vm.filterCompleted = false;

            if (vm.searchResult && vm.searchResult.page && vm.searchResult.page.totalElements > 0) {
                $state.go('flight-search', {
                    "searchOptions": vm.searchOptions,
                    "searchResult": vm.searchResult,
                    "searchCompleted": true,
                    "filterCompleted": false,
                    "params": Base64.encodeJson(vm.searchOptions)
                });
            } else {
                $state.go('flight-search', {
                    "searchOptions": vm.searchOptions,
                    "searchResult": vm.searchResult,
                    "searchCompleted": true,
                    "filterCompleted": true,
                    "params": Base64.encodeJson(vm.searchOptions)
                });
            }

            // $state.go('flight-search', {"searchOptions": vm.searchOptions, "searchResult": vm.searchResult
            //     , "searchCompleted": true
            //     , "filterCompleted": false
            //     , "params": Base64.encodeJson(vm.searchOptions)});

            $timeout(function() {
                // alert("BROADCAST");
                // $rootScope.$broadcast("gtd-refresh-airline-carousel", null);
            }, 1000);
        };

        /** BEGIN CHECK TIMEOUT **/
        var promise;

        vm.checkTimeOut = function() {
            /* check for enter direct link */
            if (!vm.init) {
                vm.timeout = !ValidationUtils.checkSearchTimeout(vm.searchOptions, $stateParams.searchResult);
                if (vm.timeout) return;
            }
        };

        // starts the interval
        $scope.start = function() {
            // stops any running interval to avoid two intervals running at the same time
            $scope.stop();

            // store the interval promise
            promise = $interval(vm.checkTimeOut, 1000);
        };

        // stops the interval
        $scope.stop = function() {
            $interval.cancel(promise);
        };

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
        /** END CHECK TIMEOUT **/
        $scope.changeItinerary = function() {
            $('.flight-search-header').slideToggle();
        };
        $scope.filterItinerary = function() {
            $('.formFilter').toggleClass('show');
            $('.sm-form-filter').show();
        };
        $scope.closeFilterItinerary = function() {
            $('.formFilter').removeClass('show');
            $('.sm-form-filter').hide();
        };
    }
})();