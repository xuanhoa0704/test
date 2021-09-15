(function() {
    'use strict';

    gtdFlightHomeSearchHeaderController.$inject = ['$log', '$scope', '$q', '$uibModal', '$attrs', 'GlobalSrv', 'MetaData', 'DataService', 'DialogService', 'Flight', '$timeout', 'ValidationUtils', 'DEFAULT_PAGE_SIZE', 'DEFAULT_DATE_FORMAT', 'DEFAULT_MOMENT_DATE_FORMAT', '$location', '$cookies', 'MerchantService'];

    function gtdFlightHomeSearchHeaderController($log, $scope, $q, $uibModal, $attrs, GlobalSrv, MetaData, DataService, DialogService, Flight, $timeout, ValidationUtils, DEFAULT_PAGE_SIZE, DEFAULT_DATE_FORMAT, DEFAULT_MOMENT_DATE_FORMAT, $location, $cookies, MerchantService) {
        var ctrl = this;

        ctrl.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // init liteEmbed Option
        ctrl.liteEmbed = false;
        if ($cookies.get('liteEmbed') || localStorage.getItem('liteEmbed')) {
            ctrl.liteEmbed = (($cookies.get('liteEmbed') || localStorage.getItem('liteEmbed')) === 'true');
        }

        // Reset New Transaction Time
        DataService.setNewStartTransactionTime();
        var merchant_code = '',
            msisdn = '';
        if ($location.search().merchant_code) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);
            merchant_code = String($location.search().merchant_code).toUpperCase();
            $scope.merchant_code = merchant_code;
            localStorage.setItem('merchant_code', merchant_code);
            $cookies.put('merchant_code', merchant_code, {
                'expires': expireDate
            });
            if ($location.search().msisdn) {
                msisdn = $location.search().msisdn;
                $scope.msisdn = $location.search().msisdn;
                $cookies.put('msisdn', msisdn, {
                    'expires': expireDate
                });
                localStorage.setItem('msisdn', msisdn);
            }
        }
        ctrl.isSignleLayout = MerchantService.isSingleLayout();

        ctrl.flight_tab_url = 'flight';
        ctrl.hotel_tab_url = 'hotel';
        merchant_code = $cookies.get("merchant_code") || localStorage.getItem("merchant_code");
        if (merchant_code) {
            ctrl.flight_tab_url += '?merchant_code=' + merchant_code;
            ctrl.hotel_tab_url += '?merchant_code=' + merchant_code;
            ctrl.merchant_code = merchant_code;
        }
        msisdn = $cookies.get("msisdn") || localStorage.getItem("msisdn");
        if (msisdn) {
            ctrl.flight_tab_url += '&msisdn=' + msisdn;
            ctrl.hotel_tab_url += '&msisdn=' + msisdn;
        }

        ctrl.checkShowInternationalFlight = function() {
            if (merchant_code == 'FSOFT') return false;
            return true;
        }

        ctrl.adultQtt = [];
        ctrl.childQtt = [];
        ctrl.infantQtt = [];
        for (var i = 1; i <= 9; i++) {
            ctrl.adultQtt.push(i);
        }
        $log.log(ctrl.searchOptions.searchType)
        $log.log("ctrl.searchOptions.searchType")

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        ctrl.airlineDataSource = [];

        ctrl.domesticAirlines = {
            "VIETJET": false,
            "VNA": false,
            "JETSTAR": false,
            "BAMBOO": false,
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

        ctrl.switchDtype = function() {
            if (ctrl.searchOptions.dtype == 'domestic') {
                ctrl.searchOptions.searchType = "oneway";
            } else {
                ctrl.searchOptions.searchType = "roundtrip";
            }
            $log.log("ctrl.searchOptions.searchType")
            $log.log(ctrl.searchOptions.searchType)
            ctrl.searchOptions.fromAirPort = '';
            ctrl.searchOptions.toAirPort = '';
        };

        ctrl.searchAirports = function(val, type) {
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
                    return airports[idx].city + ' (' + airports[idx].code + ')' + ', ' + airports[idx].country;
                }
            }

            return model;
        };

        ctrl.doSearchImpl = function() {

            // Validate search criteria
            if (!ValidationUtils.validateFlightSearch(ctrl.searchOptions)) {
                return;
            }

            // DO SEARCH

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
            //---

            // Show Dialogs:
            this.open();

            DataService.setSearchOption(ctrl.searchOptions);
            DataService.setSearchResult(ctrl.searchResult);

            DataService.setSavedSearchOption(jQuery.extend({}, ctrl.searchOptions));
            var departSearchOptions = jQuery.extend({}, ctrl.searchOptions);
            var departSearchResult = jQuery.extend({}, ctrl.searchResult);

            departSearchOptions.departureDate = ctrl.searchOptions.departureDate;

            // nam.huynhphuong GPM-233
            if (ctrl.searchOptions.dtype != 'international') {
                departSearchOptions.suppliers = ctrl.searchOptions.selectAirlines;
                $log.log("departSearchOptions.suppliers = " + departSearchOptions.suppliers);
            }

            departSearchOptions.fromAirPort = ctrl.searchOptions.fromAirPort;
            departSearchOptions.toAirPort = ctrl.searchOptions.toAirPort;

            if (departSearchOptions.dtype == 'international') {
                var myDataPromise = Flight.searchFlightInternational(departSearchOptions);
                myDataPromise.then(function(result) {
                    ctrl.searchResult = result;
                    departSearchResult = result;

                    ctrl.searchOptions.searchId = result.searchId;
                    departSearchOptions.searchId = result.searchId;

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
                var myDataPromise = Flight.searchFlight(departSearchOptions);
                myDataPromise.then(function(result) {
                    ctrl.searchResult = result;
                    departSearchResult = result;

                    ctrl.searchOptions.searchId = result.searchId;
                    ctrl.searchOptions.returnSearchId = result.returnSearchId;
                    departSearchOptions.searchId = result.searchId;

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

        ctrl.initControl = function() {
            $timeout(function() {
                $('#fromAirPort').trigger('change');
                $('#toAirPort').trigger('change');

                $('#fAdtQttIdx').trigger('change');
                $timeout(function() {
                    $('#fChdQttIdx').trigger('change');
                }, 100);
            }, 1000);
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
            var searchdirectiontype = 'oneway';

            var searchType = ctrl.searchOptions.searchType;
            var dtype = ctrl.searchOptions.dtype;

            if (ctrl.searchOptions.searchType != 'roundtrip') {
                return 'oneway';
            } else {
                return dtype;
            }
        };

        ctrl.$postLink = function() {
            $timeout(function() {
                ctrl.initControl();
            }, 0);
        };
        // improve
        ctrl.clickAirline1 = '0';
        ctrl.searchOptions.selectAirlines = [];
        $scope.selectAirline = function(value) {
            if (ctrl.clickAirline1 === '0') {
                ctrl.searchOptions.selectAirlines = ['BL', 'VJ', 'VN', 'QH'];
            }
            if ($('.select-airlines .' + value + ' .itemAirline').is(':checked')) {
                if (ctrl.searchOptions.selectAirlines.indexOf(value) == -1) {
                    ctrl.searchOptions.selectAirlines.push(value);
                }
            } else {
                var indexAl = ctrl.searchOptions.selectAirlines.indexOf(value);
                ctrl.searchOptions.selectAirlines.splice(indexAl, 1);
            }
            ctrl.clickAirline1 = '1';
        }
    }

    var gtdFlightHomeSearchHeader = {
        templateUrl: 'app/components/flight/home/flight-home-search-header.html',
        controller: gtdFlightHomeSearchHeaderController,
        bindings: {
            searchType: '=',
            doSearch: '&',
            searchResult: '=?searchResult',
            searchOptions: '=?searchOptions'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightHomeSearchHeader', gtdFlightHomeSearchHeader);

})();