(function() {
    'use strict';

    gtdFlightSearchHeaderController.$inject = ['$log', '$scope', '$rootScope', '$uibModal', '$attrs', 'DataService', 'GlobalSrv', 'MetaData', 'DialogService', 'Flight', '$timeout', 'ValidationUtils', 'DEFAULT_PAGE_SIZE', 'DEFAULT_DATE_FORMAT', 'MerchantService'];

    function gtdFlightSearchHeaderController($log, $scope, $rootScope, $uibModal, $attrs, DataService, GlobalSrv, MetaData, DialogService, Flight, $timeout, ValidationUtils, DEFAULT_PAGE_SIZE, DEFAULT_DATE_FORMAT, MerchantService) {
        var ctrl = this;

        ctrl.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // Reset New Transaction Time
        DataService.setNewStartTransactionTime();

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        if (!ctrl.searchOptions) {
            // Default init
            ctrl.searchOptions = DataService.getSearchOption();

            if (!ctrl.searchOptions.searchType) ctrl.searchOptions.searchType = "oneway"; //roundtrip -- diff with defautl values in Home Search
            if (!ctrl.searchOptions.dtype) ctrl.searchOptions.dtype = "domestic"; //international
            ctrl.searchOptions.size = DEFAULT_PAGE_SIZE; //15
            ctrl.searchOptions.page = 0;
            if (!ctrl.searchOptions.adultNo) ctrl.searchOptions.adultNo = 1;
        }

        ctrl.initControl = function() {

            $timeout(function() {
                $('#fromAirPort').trigger('change');
                $('#toAirPort').trigger('change');

                angular.element($('#adultNo')).triggerHandler('change');
                angular.element($('#childrenNo')).triggerHandler('change');
            }, 1000);


        };


        ctrl.doSearchImpl = function() {
            if ($("#roundtrip").hasClass("selected")) {
                ctrl.searchOptions.searchType = 'roundtrip';
            }
            if ($("#oneway").hasClass("selected")) {
                ctrl.searchOptions.searchType = 'oneway';
            }
            $rootScope.$broadcast("event-close-confirm-booking", null);

            DataService.setNewStartTransactionTime();

            // Validate search criteria
            if (!ValidationUtils.validateFlightSearch(ctrl.searchOptions)) {
                return;
            }
            // DO SEARCH
            ctrl.searchOptions.page = 0;
            ctrl.searchOptions.size = DEFAULT_PAGE_SIZE; //15

            var searchType = ctrl.searchOptions.searchType;

            var searchSpecialType = ctrl.getSearchSpecialType();

            ctrl.searchOptions.searchSpecialType = searchSpecialType;
            ctrl.searchOptions.selectStep = 1;
            ctrl.searchOptions.returnDomestic = false;

            //+++ TungNQ-17Sept17: reset temp cache of search option
            ctrl.searchOptions.departureItinerary = {};
            ctrl.searchOptions.returnSearchId = null;
            ctrl.searchOptions.searchId = null;
            ctrl.searchOptions.ssrOfferItemsDepart = [];
            ctrl.searchOptions.ssrOfferItemsReturn = [];
            ctrl.searchOptions.airLine = [];
            //---

            // Show Dialogs:
            this.open();

            $log.log('$ctrl.searchOptions.toAirPort =' + ctrl.searchOptions.toAirPort);
            $log.log('$ctrl.searchOptions.fromAirPort =' + ctrl.searchOptions.fromAirPort);

            DataService.setSearchOption(ctrl.searchOptions);
            DataService.setSearchResult(ctrl.searchResult);

            DataService.setSavedSearchOption(jQuery.extend({}, ctrl.searchOptions));

            // var departSearchOptions = ctrl.searchOptions;
            // var departSearchResult = ctrl.searchResult;
            var departSearchOptions = jQuery.extend({}, ctrl.searchOptions);
            var departSearchResult = jQuery.extend({}, ctrl.searchResult);

            departSearchOptions.departureDate = ctrl.searchOptions.departureDate;

            /*
            if (ctrl.searchOptions.dtype != 'international') {
                departSearchOptions.returnDate = ctrl.searchOptions.departureDate;
            }
            */

            departSearchOptions.fromAirPort = ctrl.searchOptions.fromAirPort;
            departSearchOptions.toAirPort = ctrl.searchOptions.toAirPort;


            if (departSearchOptions.dtype == 'international') {
                var myDataPromise = Flight.searchFlightInternational(departSearchOptions);
                myDataPromise.then(function(result) {
                    ctrl.searchResult = result;
                    departSearchResult = result;

                    ctrl.searchOptions.searchId = result.searchId;
                    departSearchOptions.searchId = result.searchId;

                    $log.log("Get result from flight.search.service");
                    // $log.log("ctrl.searchResult = " + JSON.stringify(ctrl.searchResult));

                    // Do get advance filter options
                    Flight.getAdvanceFilterOptions(ctrl.searchOptions).then(function(result) {
                        DataService.setAdvanceSearchFilterOptions(result);
                        ctrl.searchOptions.advanceFilterOptions = result;
                        departSearchOptions.advanceFilterOptions = result;

                        DataService.setDepartSearchResult(departSearchResult);
                        DataService.setDepartSearchOption(departSearchOptions);

                        var returnSearchOptions = jQuery.extend({}, departSearchResult);
                        var returnSearchResult = jQuery.extend({}, departSearchOptions);

                        DataService.setReturnSearchResult(returnSearchOptions);
                        DataService.setReturnSearchOption(returnSearchResult);

                        ctrl.doSearch({
                            $searchResult: ctrl.searchResult,
                            $searchOptions: ctrl.searchOptions
                        });
                    });

                }, function error(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
            } else {
                var merchant = MerchantService.getMerchant();
                if (merchant == 'FSOFT') {
                    departSearchOptions.suppliers = MerchantService.filterArraySupplier();
                }

                var myDataPromise = Flight.searchFlight(departSearchOptions);
                myDataPromise.then(function(result) {
                    ctrl.searchResult = result;
                    departSearchResult = result;

                    ctrl.searchOptions.searchId = result.searchId;
                    ctrl.searchOptions.returnSearchId = result.returnSearchId;
                    departSearchOptions.searchId = result.searchId;

                    $log.log("Get result from flight.search.service");
                    // $log.log("ctrl.searchResult = " + JSON.stringify(ctrl.searchResult));

                    // Do get advance filter options
                    Flight.getAdvanceFilterOptions(ctrl.searchOptions).then(function(result) {
                        DataService.setAdvanceSearchFilterOptions(result);
                        ctrl.searchOptions.advanceFilterOptions = result;
                        departSearchOptions.advanceFilterOptions = result;

                        DataService.setDepartSearchResult(departSearchResult);
                        DataService.setDepartSearchOption(departSearchOptions);

                        ctrl.doSearch({
                            $searchResult: ctrl.searchResult,
                            $searchOptions: ctrl.searchOptions
                        });
                    });

                    // Setup Search Return trip
                    if (ctrl.searchOptions.searchType == 'roundtrip') {
                        var returnSearchOptions = jQuery.extend({}, ctrl.searchOptions);
                        var returnSearchResult = jQuery.extend({}, ctrl.searchResult);
                        // var returnSearchOptions = ctrl.searchOptions;
                        // var returnSearchResult = ctrl.searchResult;

                        returnSearchOptions.departureDate = ctrl.searchOptions.returnDate;
                        returnSearchOptions.returnDate = ctrl.searchOptions.returnDate;
                        returnSearchOptions.fromAirPort = ctrl.searchOptions.toAirPort;
                        returnSearchOptions.toAirPort = ctrl.searchOptions.fromAirPort;
                        returnSearchOptions.searchId = result.returnSearchId;

                        DataService.setReturnSearchOption(returnSearchOptions);

                    }

                }, function error(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
            }


        };

        ctrl.open = function() {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/flights/search/flight.search.loading.html',
                controller: 'FlightSearchLoadingController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    searchOptions: function() {
                        return ctrl.searchOptions;
                    }
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };

        ctrl.getSearchSpecialType = function() {
            // oneway, domestic, international
            var searchdirectiontype = 'oneway';

            var searchType = ctrl.searchOptions.searchType;
            var dtype = ctrl.searchOptions.dtype;

            if (ctrl.searchOptions.searchType != 'roundtrip') {
                return 'oneway';
            } else {
                return dtype;
            }

        };

        var toggleProcessing = false;
        ctrl.switchTypeAhead = function() {

            if (toggleProcessing) {
                return;
            } else {
                toggleProcessing = true;
                var toVal = ctrl.searchOptions.toAirPort;
                var fromVal = ctrl.searchOptions.fromAirPort;


                ctrl.searchOptions.fromAirPort = toVal;
                $timeout(function() {
                    ctrl.searchOptions.toAirPort = fromVal;
                    $timeout(function() {
                        toggleProcessing = false;
                    }, 100);
                }, 100);
            }
        };

        ctrl.searchAirports = function(val, type) {
            // return MetaData.searchAirportsWithout(val, ctrl.searchOptions, type);
            if (ctrl.searchOptions.dtype == 'domestic') {
                return MetaData.searchAirportsLocal('VN');
            } else {
                return MetaData.searchAirportsWithout(val, ctrl.searchOptions, type);
            }
        };

        ctrl.formatLabel = function(model) {
            var airports = GlobalSrv.getLocalAirports();

            for (var idx in airports) {
                if (airports[idx].code == model) {
                    // return airports[idx].city + ' (' + airports[idx].code + ')';
                    return airports[idx].city + ' (' + airports[idx].code + ')' + ', ' + airports[idx].country;
                }
            }

            return model;
        };

        ctrl.$postLink = function() {
            $timeout(function() {
                ctrl.initControl();
            }, 0);
            if (ctrl.init && !ctrl.searchCompleted) {
                $log.log('+++++++++++++++ SEARCH AGAIN ++++++++++++++++');
                $log.log('ctrl.init:' + ctrl.init + ", ctrl.searchCompleted:" + ctrl.searchCompleted);

                ctrl.doSearchImpl();

                $timeout(function() {
                    ctrl.searchCompleted = true;
                    $rootScope.$broadcast("gtd-flight-search-header-serch-completed", null);
                }, 100);


            }
        };

        $scope.changeSelect = function(value) {
            $('.flight-search-header .selectType').removeClass('selected');
            $('.flight-search-header .select-' + value).addClass('selected');
            // ctrl.searchOptions.searchType = value;

            if (value == 'roundtrip') {
                $('.flight-search-header .itemDatetime').removeClass('disable');
                //ctrl.searchOptions.searchSpecialType = 'domestic';
            } else {
                $('.flight-search-header .itemDatetime').addClass('disable');
            }

        }

        $scope.$on('gtd-reinit-search', function() {
            $log.log('gtd-reinit-search');
            ctrl.doSearchImpl();
        });

    }

    var gtdFlightSearchHeader = {
        templateUrl: 'app/components/flight/flight-search-header.html',
        controller: gtdFlightSearchHeaderController,
        bindings: {
            searchType: '=',
            init: '=',
            searchCompleted: '=',
            doSearch: '&',
            searchResult: '=?searchResult',
            searchOptions: '=?searchOptions'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightSearchHeader', gtdFlightSearchHeader);

})();