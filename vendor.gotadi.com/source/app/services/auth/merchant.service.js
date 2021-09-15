(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('MerchantService', MerchantService);

    MerchantService.$inject = ['$location', 'AuthServerProvider', 'Principal', '$cookies', '$http', '$rootScope', '$q', '$translate', '$window', 'DialogService', '$state',
        'LIENVIET_URL', 'API_URL', 'API_URL_CALLBACK', 'SEA_URL', 'FSOFT_URL',
        '$log', 'ValidationUtils', 'Base64', '$uibModal', 'DataService', 'Flight'
    ];


    function MerchantService($location, AuthServerProvider, Principal, $cookies, $http, $rootScope, $q, $translate, $window, DialogService, $state,
        LIENVIET_URL, API_URL, API_URL_CALLBACK, SEA_URL, FSOFT_URL,
        $log, ValidationUtils, Base64, $uibModal, DataService, Flight
    ) {
        var ctrl = this;

        ctrl.searchOptions = {};
        ctrl.searchResult = [];
        var modalInstance = null;
        var merchantCode = getMerchant();
        var msisdn = $location.search().msisdn;
        var resetModal = function() {
            modalInstance = null;
        };
        var serv = {
            login: getLoggedIn,
            isSimpleView: isSimpleView,
            updateMerchantName: updateMerchantName,
            updateMsisdn: updateMsisdn,
            lienVietValidate: lienVietValidate,
            fSoftValidate: fSoftValidate,
            fSoftSearchFlight: fSoftSearchFlight,
            seaBankValidate: seaBankValidate,
            isIframeView: isIframeView,
            scrollToTopIframe: scrollToTopIframe,
            loginWithToken: loginWithToken,
            isSingleLayout: isSingleLayout,
            getMerchant: getMerchant,
            filterArraySupplier: filterArraySupplier,
            verifyMerchant: verifyMerchant
        };

        function verifyMerchant() {
            var url = API_URL + '/api/partner/ibe-internal-config/agency/' + merchantCode;

            return $http({
                method: 'GET',
                url: url,
                noAuth: true
            });
        }

        var simpleViewMerchant = ['VIETTEL', 'TIKI', 'LIENVIETBANK', 'SEABANK', 'LOOPBACK', 'TRUEMONEY', 'FASTGO', 'SMARTPAY'];

        var iFrameMerchant = ['TIKI', 'FSOFT'];

        if (!msisdn) msisdn = $cookies.get('msisdn') || localStorage.getItem('msisdn');

        var data;
        var key;

        // Use for LIENVIETBANK
        if (merchantCode == 'LIENVIETBANK') {
            // data = $location.search().data;
            // if (!data) data = $cookies.get('data');
            // key = $location.search().key;
            // if (!key) key = $cookies.get('key');
        }
        // Use for FSOFT-TSS
        if (merchantCode == 'FSOFT') {
            data = $location.search().user_data;
            if (!data) data = $cookies.get('user_data');
            key = $location.search().signature;
            if (!key) key = $cookies.get('signature');
        }

        ctrl.isSignleLayout = false;

        var layout = $location.search().layout;
        if (layout) {
            switch (layout) {
                case 'single':
                    ctrl.isSignleLayout = true;
                    break;
                case 'dual':
                    ctrl.isSignleLayout = false;
                    break;
                default:
                    break;
            }
        }

        function isSingleLayout() {
            if (merchantCode === 'SEABANK' || merchantCode === 'FASTGO') {
                return true;
            }

            return ctrl.isSignleLayout;
        }

        function loginWithToken(token) {
            AuthServerProvider.loginWithToken(token, true);
            $rootScope.$broadcast('authenticationSuccess');
        }

        function getLoggedIn() {

            if (!merchantCode || !msisdn) return;
            var cb = angular.noop;
            var deferred = $q.defer();

            // Check user status
            AuthServerProvider.login({
                    username: msisdn + "@gotadi.com",
                    password: msisdn,
                    rememberMe: true
                })
                .then(loginThen)
                .catch(register);

            // User exist and login success
            function loginThen(data) {
                Principal.identity(true).then(function(account) {
                    $rootScope.msisdn = msisdn;
                    $rootScope.$broadcast('authenticationSuccess');
                    if (account !== null) {
                        $translate.use(account.langKey).then(function() {
                            $translate.refresh();
                        });
                    }
                    deferred.resolve(data);
                });
                return cb();
            }

            // User not existed then create the new one and logoin
            function register(data) {
                $http({
                    method: 'POST',
                    url: API_URL + '/api/merchant/register',
                    data: {
                        "merchantCode": merchantCode,
                        "phone": msisdn
                    }
                }).then(function success() {
                    AuthServerProvider.login({
                        username: msisdn + "@gotadi.com",
                        password: msisdn,
                        rememberMe: true
                    }).then(function(res) {
                        Principal.identity(true).then(function(acc) {
                            $rootScope.msisdn = msisdn;
                            $rootScope.$broadcast('authenticationSuccess');
                        });
                    });
                }, function errorCallback(response) {
                    // var error = {};
                    // error.title = 'Error';
                    // error.message = 'Có vấn đề xảy ra. Vui lòng quay lại sau hoặc liên hệ với tổng đài viên để được hỗ trợ!';
                    // DialogService.openNoActionDialog(error);
                    window.location.href = "#/error-partner";
                });
            }


            return deferred.promise;
        }


        function isSimpleView() {
            var currentMerchant = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;
            if (simpleViewMerchant.indexOf(currentMerchant) > -1) {
                return true;
            }

            return false;
        }


        function isIframeView() {
            var currentMerchant = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;
            if (iFrameMerchant.indexOf(currentMerchant) > -1) {
                return true;
            }

            return false;
        }


        function seaBankValidate(user, signature) {
            var url = API_URL_CALLBACK + SEA_URL + "/booking/validate?user=?" + user + "&signature=" + signature;
            return $http({
                method: 'POST',
                url: url,
                noAuth: true
            });

        }

        function lienVietValidate(data, key) {
            $cookies.put("lienviet-data", data);
            $cookies.put("lienviet-key", key);

            var url = API_URL_CALLBACK + LIENVIET_URL + "/validate?data=?" + data + "&key=" + key;
            return $http({
                method: 'POST',
                url: url,
                noAuth: true
            });
        }


        function fSoftValidate() {

            $cookies.put("user_data", data);
            var sig = key.split(' ').join('%2B');
            $cookies.put("signature", sig);

            var url = API_URL + FSOFT_URL + "/validate?data=" + data + "&key=" + sig;
            return $http({
                method: 'POST',
                url: url,
                noAuth: true
            });
        }

        function fSoftSearchFlight(data) {


            var fSoftSearchParam = {
                IsAutoSearch: data.IsAutoSearch,
                IsDomestic: data.IsDomestic,
                NCRange: data.NCRange,
                Prefill_EndTime: data.Prefill_EndTime,
                Prefill_StartTime: data.Prefill_StartTime,
                RoleLevel: data.RoleLevel,
                RouteType: data.RouteType,
                Suppliers: data.Suppliers,
                arrivalLocation: data.arrivalLocation,
                departureLocation: data.departureLocation,
                email: data.email,
                fullName: data.fullName,
                mobileNumber: data.mobileNumber,
                userId: data.userId

            };

            ctrl.searchOptions.fromAirPort = data.departureLocation;
            ctrl.searchOptions.toAirPort = data.arrivalLocation;
            var arrayTimeStartTime = data.Prefill_StartTime.split("/");
            if (arrayTimeStartTime.length > 0) {
                ctrl.searchOptions.departureDate = data.Prefill_StartTime.split("/").join("-");
            } else {
                ctrl.searchOptions.departureDate = data.Prefill_StartTime;
            }

            var arrayTimeEndTime = data.Prefill_EndTime.split("/");
            if (arrayTimeEndTime.length > 0) {
                ctrl.searchOptions.returnDate = data.Prefill_EndTime.split("/").join("-");
            } else {
                ctrl.searchOptions.returnDate = "";
            }


            if (data.IsDomestic) {
                ctrl.searchOptions.dtype = "domestic";
            } else {
                ctrl.searchOptions.dtype = "international";
            }
            if (data.RouteType == 'ONEWAY') {
                ctrl.searchOptions.searchType = "oneway";
                ctrl.searchOptions.returnDate = "";
            } else {
                ctrl.searchOptions.searchType = "roundtrip";

            }
            ctrl.searchOptions.adultNo = 1;
            ctrl.searchOptions.childrenNo = 0;
            ctrl.searchOptions.newBornNo = 0;
            ctrl.searchOptions.class = "E";
            ctrl.searchOptions.NCRange = data.NCRange;
            ctrl.searchOptions.RoleLevel = data.RoleLevel;
            ctrl.searchOptions.Suppliers = ['VJ', 'VN', '0V']

            searchFlight();

        }

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

        function searchFlight() {

            // Validate search criteria
            if (!ValidationUtils.validateFlightSearch(ctrl.searchOptions)) {
                return;
            }

            // DO SEARCH

            var searchSpecialType = ctrl.getSearchSpecialType();

            ctrl.searchOptions.searchSpecialType = searchSpecialType;
            ctrl.searchOptions.selectStep = 1;
            ctrl.searchOptions.returnDomestic = false;

            ctrl.searchOptions.departureItinerary = {};
            ctrl.searchOptions.returnSearchId = null;
            ctrl.searchOptions.searchId = null;
            ctrl.searchOptions.ssrOfferItemsDepart = [];
            ctrl.searchOptions.ssrOfferItemsReturn = [];
            ctrl.searchOptions.page = 0;
            ctrl.searchOptions.size = 15;
            ctrl.searchOptions.airLine = [];
            ctrl.searchOptions.selectAirlines = [];

            if (merchantCode && merchantCode == 'FSOFT') {
                var RoleLevel = +ctrl.searchOptions.RoleLevel;
                var NCRange = +ctrl.searchOptions.NCRange;
                if (RoleLevel == 1 && NCRange > 0) {
                    // ctrl.searchOptions.selectAirlines = ["VJ", "VN"];

                }
                if (RoleLevel == 2) {
                    // see all airSupplier
                    // ctrl.searchOptions.selectAirlines = ["VJ", "VN", "BL"];
                }
                if (RoleLevel == 1 && NCRange == 0) {

                    ctrl.searchOptions.selectAirlines = ["VN"];
                }

            }

            ctrl.searchOptions.advanceFilterOptions = {};
            DataService.setSearchOption(ctrl.searchOptions);
            // Show Dialogs:
            // open();

            DataService.setSearchOption(ctrl.searchOptions);
            DataService.setSearchResult(ctrl.searchResult);

            DataService.setSavedSearchOption(jQuery.extend({}, ctrl.searchOptions));
            var departSearchOptions = jQuery.extend({}, ctrl.searchOptions);
            var departSearchResult = jQuery.extend({}, ctrl.searchResult);

            departSearchOptions.departureDate = ctrl.searchOptions.departureDate;

            if (ctrl.searchOptions.dtype != 'international') {
                departSearchOptions.suppliers = ctrl.searchOptions.selectAirlines;
                $log.log("departSearchOptions.suppliers = " + departSearchOptions.suppliers);
            }

            departSearchOptions.fromAirPort = ctrl.searchOptions.fromAirPort;
            departSearchOptions.toAirPort = ctrl.searchOptions.toAirPort;

            if (departSearchOptions.dtype == 'international') {
                open();
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

                        // ctrl.doSearch({
                        //     $searchResult: ctrl.searchResult
                        //     , $searchOptions: ctrl.searchOptions
                        // });
                        $state.go('flight-search', {
                            "searchOptions": ctrl.searchOptions,
                            "searchResult": ctrl.searchResult,
                            "searchCompleted": true,
                            "filterCompleted": false,
                            "params": Base64.encodeJson(ctrl.searchOptions)
                        });
                    });

                }, function error(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
            } else {
                open();
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

                        // ctrl.doSearch({
                        //     $searchResult: ctrl.searchResult
                        //     , $searchOptions: ctrl.searchOptions
                        // });
                        $state.go('flight-search', {
                            "searchOptions": ctrl.searchOptions,
                            "searchResult": ctrl.searchResult,
                            "searchCompleted": true,
                            "filterCompleted": false,
                            "params": Base64.encodeJson(ctrl.searchOptions)
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

            // $state.go('flight-search', {"searchOptions": ctrl.searchOptions, "searchResult": ctrl.searchResult
            //     , "searchCompleted": true
            //     , "filterCompleted": true
            //     , "params": Base64.encodeJson(ctrl.searchOptions)});


        };


        function open() {
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

        function updateMerchantName(newValue) {
            merchantCode = newValue;

        }

        function updateMsisdn(newValue) {
            msisdn = newValue;
        }

        function scrollToTopIframe() {
            App.scrollTop(); // scroll to the top on content load
            if ('parentIFrame' in window) {
                window.parentIFrame.scrollTo(0, 0);
            }
        }

        function getMerchant() {
            var merchantCode = $location.search().merchant_code;
            if (!merchantCode) merchantCode = $cookies.get('merchant_code') || localStorage.getItem("merchant_code");
            return merchantCode;
        }

        function filterArraySupplier() {
            var result = ['VN', 'VJ', '0V'];
            return result;
        }

        return serv;
    }
})();