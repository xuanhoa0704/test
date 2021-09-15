(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('GtdHotelService', GtdHotelService);

    GtdHotelService.$inject = [
        '$log', '$http', '$localStorage', '$rootScope', '$timeout', '$uibModal', '$state', '$window', '$q',
        'DataService', 'Base64', 'GlobalSrv',
        'HOTEL_SEARCH_URL', 'DEFAULT_PAGE_SIZE', 'HOTEL_STATES', 'HOTEL_SEARCH_CACHE_URL', 'HOTEL_CHECK_AVAILABILITY_URL', 'API_URL'
    ];

    function GtdHotelService(
        $log, $http, $localStorage, $rootScope, $timeout, $uibModal, $state, $window, $q,
        DataService, Base64, GlobalSrv,
        HOTEL_SEARCH_URL, DEFAULT_PAGE_SIZE, HOTEL_STATES, HOTEL_SEARCH_CACHE_URL, HOTEL_CHECK_AVAILABILITY_URL, API_URL
    ) {
        var canceler = $q.defer();
        var resolved = false;
        var timer;

        var isFirstTime = false;

        // Search option Attributes name
        var HOTEL_SEARCH_OPTIONS = "hotelSearchOptions";
        var HOTEL_SEARCH_FILTER = "hotelSearchFilter";
        var HOTEL_SEARCH_ADVANCE = "hotelSearchAdvance";
        var HOTEL_SEARCH_BODY = "hotelSearchBody";
        var HOTEL_SEARCH_FROM_CACHE = "hotelSearchFromCache";
        // Retry limit
        var RETRY_LIMIT = 0;

        // Current retry times
        var countRetry = 0;

        // Default filter values
        var filterParams = {
            checkin_date: moment(new Date(new Date().getTime() + 1 * 86400000)).format('DD-MM-YYYY'),
            checkout_date: moment(new Date(new Date().getTime() + 2 * 86400000)).format('DD-MM-YYYY'),
            hotel_code: null,
            page: 0,
            size: DEFAULT_PAGE_SIZE
        };

        // Default filter from cache
        var filterFromCache = {
            page: 0,
            size: DEFAULT_PAGE_SIZE,
            searchId: null,
            subSearchIds: null,
            sort: null,
            totalPages: 0
        };

        // Default pax values
        var filterBody = [{
            adultQuantity: 2,
            childQuantity: 0,
            childrenAges: []
        }];

        // Default advance search values
        var filterAdvance = {
            featureOptions: [],
            lat: null,
            lng: null,
            nameOptions: [],
            priceOptions: [],
            sameLoc: null,
            starOptions: null
        };

        var selectedDestination = {};

        // Hotel UI states will be handled.
        var hotelStates = {
            CHANGE_SEARCH_FILTER: '[Hotel] Search filter changed',
            DO_SEARCH: '[Hotel] Do search',
            RETRY_SEARCH: '[Hotel] Retry search',
            FINISH_SEARCH: '[Hotel] Finish Search',
            SHOW_LOADING: '[Hotel] Show loading',
            SHOW_SUB_LOADING: '[Hotel] Show sub loading',
            HIDE_LOADING: '[Hotel] Hide loading',
            SEARCH_ERROR: '[Hotel] Search error',
            PAGEABLE_CHANGED: '[Hotel] Pageable changed',
            HOTEL_AVAILABILITY_CHANGED: '[Hotel] Availability changed',
            HOTEL_ADVANCE_SEARCH_CHANGED: '[Hotel] Advance searech changed',
            HOTEL_SELECTED_DESTINATION_CHANGED: '[Hotel] Selected destination changed',
            HOTEL_PAX_CHANGED: '[Hotel] Hotel pax changed'
        };

        // Export funtions
        var services = {
            getStates: getStates,
            initStates: initStates,
            saveSearchFilter: saveSearchFilter,
            search: search,
            showLoading: showLoading,
            hideLoading: hideLoading,
            updateSearchOptions: updateSearchOptions,
            getSearchOptions: getSearchOptions,
            getPaxFilter: getPaxFilter,
            updatePaxInfo: updatePaxInfo,
            updatePaxDisplay: updatePaxDisplay,
            openModalUpdateRoomDetail: openModalUpdateRoomDetail,
            getPaxSummary: getPaxSummary,
            smartSearch: smartSearch,
            getPagination: getPagination,
            chageSmartSearchPage: chageSmartSearchPage,
            updateFilterAdvanceName: updateFilterAdvanceName,
            updateFilterAdcancePrices: updateFilterAdcancePrices,
            updateFilterAdcanceStarts: updateFilterAdcanceStarts,
            getFilterAdvance: getFilterAdvance,
            changeSort: changeSort,
            getFilterParams: getFilterParams,
            goToDetail: goToDetail,
            checkHotelAvailability: checkHotelAvailability,
            backToResult: backToResult,
            resetPage: resetPage,
            validateDateRange: validateDateRange,
            getSelectedDestination: getSelectedDestination,
            updateSelectedDestination: updateSelectedDestination,
            resetSearchOption: resetSearchOption
        };

        init();

        // Constructor service
        function init() {
            var destination = $localStorage.localDestinations;
            selectedDestination = destination || {};

            var searchOption = $localStorage[HOTEL_SEARCH_OPTIONS];
            if (searchOption) {
                filterParams = searchOption[HOTEL_SEARCH_FILTER] ? searchOption[HOTEL_SEARCH_FILTER] : filterParams;
                filterBody = searchOption[HOTEL_SEARCH_BODY] ? searchOption[HOTEL_SEARCH_BODY] : filterBody;
                filterAdvance = searchOption[HOTEL_SEARCH_ADVANCE] ? searchOption[HOTEL_SEARCH_ADVANCE] : filterAdvance;
            }

            filterParams.hotel_code = selectedDestination.code || "";
        }

        function getSelectedDestination() {
            return angular.copy(selectedDestination);
        }

        function updateSelectedDestination(destination) {
            selectedDestination = destination;
            filterParams.hotel_code = selectedDestination.code;
            _updateState(hotelStates.HOTEL_SELECTED_DESTINATION_CHANGED, selectedDestination);
        }

        function _saveSelectedDestinationToLocalStorate() {
            $localStorage.localDestinations = selectedDestination;
        }

        function resetSearchOption() {
            filterParams = {
                checkin_date: moment(new Date(new Date().getTime() + 1 * 86400000)).format('DD-MM-YYYY'),
                checkout_date: moment(new Date(new Date().getTime() + 2 * 86400000)).format('DD-MM-YYYY'),
                hotel_code: filterParams.hotel_code,
                page: 0,
                size: DEFAULT_PAGE_SIZE
            };
            filterBody = [{
                adultQuantity: 2,
                childQuantity: 0,
                childrenAges: []
            }];
            filterAdvance = {
                featureOptions: [],
                lat: null,
                lng: null,
                nameOptions: [],
                priceOptions: [],
                sameLoc: null,
                starOptions: null
            };
        }

        // Save user search filter to localstorage.
        function saveSearchFilter() {
            var searchOptions = {};
            searchOptions[HOTEL_SEARCH_FILTER] = filterParams;
            searchOptions[HOTEL_SEARCH_BODY] = filterBody;
            searchOptions[HOTEL_SEARCH_ADVANCE] = filterAdvance;
            $localStorage[HOTEL_SEARCH_OPTIONS] = searchOptions;
        }

        function getFilterParams() {
            return filterParams;
        }

        function updateFilterAdvanceName(hotelName) {
            filterAdvance.nameOptions = [hotelName];
        }

        function updateFilterAdcancePrices(prices) {
            filterAdvance.priceOptions = prices;
        }

        function updateFilterAdcanceStarts(starts) {
            filterAdvance.starOptions = starts;
        }

        // Update search filter when user changed
        function updateSearchOptions(searchOption) {
            filterParams = searchOption[HOTEL_SEARCH_FILTER] ? searchOption[HOTEL_SEARCH_FILTER] : filterParams;
            filterBody = searchOption[HOTEL_SEARCH_BODY] ? searchOption[HOTEL_SEARCH_BODY] : filterBody;
            filterAdvance = searchOption[HOTEL_SEARCH_ADVANCE] ? searchOption[HOTEL_SEARCH_ADVANCE] : filterAdvance;
            filterFromCache = searchOption[HOTEL_SEARCH_FROM_CACHE] ? searchOption[HOTEL_SEARCH_FROM_CACHE] : filterFromCache;
            filterParams.hotel_code = selectedDestination.code || "";
            _searchFilterChanged();
        }

        // Update pax info whan user changed
        function updatePaxInfo(pax) {
            filterBody = pax;
            _paxInfoChanged();
        }

        function _paxInfoChanged() {
            _updateState(hotelStates.HOTEL_PAX_CHANGED, filterBody);
        }

        function hotelAvailabilityChanged(data) {
            _updateState(hotelStates.HOTEL_AVAILABILITY_CHANGED, data);
        }

        // Get Hotel UI states will be handled.
        // TODO: Consider move states to constants.
        function getStates() {
            return hotelStates;
        }

        // Get current search options
        function getSearchOptions() {
            var serchOptions = {};
            serchOptions[HOTEL_SEARCH_FILTER] = filterParams;
            serchOptions[HOTEL_SEARCH_BODY] = filterBody;
            serchOptions[HOTEL_SEARCH_ADVANCE] = filterAdvance;
            serchOptions[HOTEL_SEARCH_FROM_CACHE] = filterFromCache;

            return angular.copy(serchOptions);
        }

        // Get current pax detail
        function getPaxFilter() {
            return angular.copy(filterBody);
        }

        function initStates(params) {

        }

        function checkHotelAvailability(selectedHotel) {

            $log.log("selectedHotel = " + selectedHotel);
            var data = {
                searchId: filterFromCache.searchId,
                hotelId: selectedHotel.id,
                hotelAvailabilityId: selectedHotel.id + "|" + selectedHotel.supplierSessionId,
                pax: filterBody,
                checkIn: moment(filterParams.checkin_date, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                checkOut: moment(filterParams.checkout_date, 'DD-MM-YYYY').format('MM-DD-YYYY')
            };

            showLoading();

            return $http.post(
                    API_URL + HOTEL_CHECK_AVAILABILITY_URL, data)
                .then(function successCallback(response) {
                    hideLoading();
                    $log.log('successCallback checkHotelAvailability');
                    $log.log("response = " + response);
                    hotelAvailabilityChanged(response.data ? response.data : {});
                }, function(error) {
                    hideLoading();
                });
        }

        function saveTheLastSearchDestination(destination) {

        }

        // Update pax detail which showed in UI.
        function updatePaxDisplay() {

            var paxDetail = {
                roomQuantity: 0,
                adultQuantity: 0,
                childQuantity: 0
            };

            var searchOptions = getSearchOptions();

            paxDetail.roomQuantity = searchOptions.hotelSearchBody.length;
            searchOptions.hotelSearchBody.forEach(function name(pax) {
                paxDetail.adultQuantity += +pax.adultQuantity;
                paxDetail.childQuantity += +pax.childQuantity;
            });

            return paxDetail;

        }

        function _resetFilterFromCache() {
            filterFromCache = {
                page: 0,
                size: DEFAULT_PAGE_SIZE,
                searchId: null,
                subSearchIds: null,
                sort: null,
                totalPages: 0
            };

            _pageableChanged();
        }

        function _resetFilterAdvance() {
            filterAdvance = {
                featureOptions: [],
                lat: null,
                lng: null,
                nameOptions: [],
                priceOptions: [],
                sameLoc: null,
                starOptions: null
            };
            _filterAdvanceChanged();
        }

        function chageSmartSearchPage(pageNum) {
            filterFromCache.page = pageNum;
            _pageableChanged();
        }

        function changeSort(sort) {
            filterFromCache.sort = sort;
            _pageableChanged();
        }

        function getFilterAdvance() {
            return filterAdvance;
        }

        function goToDetail(item) {
            DataService.setSelectedHotel(item);

            var url = $state.go('hotel-detail/:hotel_id/:params', {
                "hotel_id": item.id,
                "params": Base64.encodeJson(getSearchOptions())
            }, {
                absolute: true
            });

            // $window.open(url, '_blank').focus();

            GlobalSrv.addRecentViewHotels(item);
        }

        function resetPage() {
            filterFromCache.page = 0;
        }

        function _cancelSearch() {

            canceler.reject("http call aborted");
        }

        function _clearTimeoutRequest() {
            // $timeout.cancel(timer);
            clearTimeout(timer);
        }

        function _scrollToTop() {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }

        // Call smart search API
        function smartSearch(withoutLoading) {
            if (resolved) {
                _cancelSearch();
            }

            canceler = $q.defer();
            resolved = true;

            if (!withoutLoading) {
                showLoading();
            }

            var filterBody = {
                searchId: filterFromCache.searchId,

                filter: filterAdvance,
            };

            if (isFirstTime) {
                isFirstTime = false;
                filterBody.subSearchIds = [filterFromCache.searchId];
            }

            var reqParams = {
                page: filterFromCache.page,
                size: filterFromCache.size,
                sort: filterFromCache.sort
            };
            _scrollToTop();

            $http.post(
                API_URL + HOTEL_SEARCH_CACHE_URL,
                filterBody, {
                    params: reqParams,
                    timeout: canceler.promise
                }
            ).then(
                searchSuccessHandle,
                searchFailedHandle
            );

        }

        function backToResult() {
            $state.go('hotel-search', {
                "params": Base64.encodeJson(getSearchOptions())
            });
        }

        // Call search API
        function search() {
            if (resolved) {
                _cancelSearch();
            }
            _clearTimeoutRequest();

            canceler = $q.defer();
            resolved = true;

            _resetFilterFromCache();
            _resetFilterAdvance();
            showLoading();
            App.scrollTop();
            // Build request body
            // NOTE: Always re-format data to match backend datetime format.
            var filterReq = {
                checkin_date: moment(filterParams.checkin_date, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                checkout_date: moment(filterParams.checkout_date, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                hotel_code: filterParams.hotel_code,
                page: "0",
                size: DEFAULT_PAGE_SIZE
            };

            countRetry++;
            isFirstTime = true;

            _saveSelectedDestinationToLocalStorate();
            saveSearchFilter();

            $http.post(
                API_URL +
                HOTEL_SEARCH_URL,
                filterBody, {
                    params: filterReq,
                    timeout: canceler.promise
                }
            ).then(
                function(response) {
                    // response.data.hotels = [response.data.hotels[0], response.data.hotels[1]];
                    searchSuccessHandle(response);
                    if (!response.data.errors && response.data.hotels && response.data.hotels.length > 0) {
                        showSubLoading();
                        timer = setTimeout(_callSmartSearch, 2000);
                    }

                },
                searchFailedHandle
            );
        }

        function validateDateRange(checkin, checkout) {
            var checkinDate = moment(checkin, 'DD-MM-YYYY');
            var checkoutDate = moment(checkout, 'DD-MM-YYYY');
            var compareDate = checkoutDate.subtract(30, "days");

            if (moment(checkinDate).isSameOrAfter(compareDate)) {
                return true;
            } else { // Over 30 days
                return false;
            }
        }

        function _callSmartSearch() {
            smartSearch(true);
        }

        // Handle search success
        function searchSuccessHandle(response) {
            resolved = false;
            hideLoading();
            if (response.data.errors) {
                searchError();
            } else {

                if (response.data.hotels && response.data.hotels.length > 0) {
                    _searchResultChanged(response.data);
                    _updateSearchFromCacheFilter(response.data.page, response.data.searchId);
                } else {
                    searchError();
                }
            }
        }

        function _updateSearchFromCacheFilter(pageable, searchId) {
            // Update currentpage
            filterFromCache.page = pageable.pageNumber;
            filterFromCache.searchId = searchId;
            filterFromCache.subSearchIds = [searchId];
            filterFromCache.totalPages = pageable.totalPage;
            filterFromCache.size = pageable.offset;
            _pageableChanged();
        }


        function getPagination() {
            return filterFromCache;
        }

        // Handle search failed
        function searchFailedHandle(error) {
            resolved = false;
            if (countRetry <= RETRY_LIMIT) {
                timer = setTimeout(function() {
                    search();
                }, 1000);
                showLoading();

            } else {
                hideLoading();
                searchError();
                countRetry = 0;
            }
        }

        // Notify to action when Search Error occured
        function searchError() {
            _updateState(hotelStates.SEARCH_ERROR);
        }

        // Notify to action show loading
        function showSubLoading() {
            _updateState(hotelStates.SHOW_SUB_LOADING);
        }

        // Notify to action show loading
        function showLoading() {
            _updateState(hotelStates.SHOW_LOADING);
        }

        // Notify to action hide loading
        function hideLoading() {
            _updateState(hotelStates.HIDE_LOADING);
        }

        function _pageableChanged() {
            _updateState(hotelStates.PAGEABLE_CHANGED, filterFromCache);
        }

        function _filterAdvanceChanged() {
            _updateState(hotelStates.HOTEL_ADVANCE_SEARCH_CHANGED, filterAdvance);
        }

        // Notify to action when search finish success. Include smart search and search function
        function _searchResultChanged(data) {
            _updateState(hotelStates.FINISH_SEARCH, data);
        }

        // Notify to action when search filter changed
        function _searchFilterChanged() {
            saveSearchFilter();
            _updateState(hotelStates.CHANGE_SEARCH_FILTER, getSearchOptions());
        }

        // Ulti function to notify states changed
        function _updateState(state, payload) {
            $log.debug("=== State changed ===");
            $log.info(state);
            $log.debug(payload);

            $rootScope.$emit(HOTEL_STATES, {
                state: state,
                payload: angular.copy(payload)
            });
        }

        // Ulti function to open modal update pax detail
        function openModalUpdateRoomDetail() {
            $uibModal.open({
                animation: true,
                backdrop: true,
                templateUrl: 'app/hotels/hotel.chooseroom.html',
                controller: 'HotelChooseroomController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hotel');
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }]
                }
            });
        }

        // Util funtion to get sumary pax info
        function getPaxSummary() {
            var paxDetail = {
                roomQuantity: 0,
                adultQuantity: 0,
                childQuantity: 0
            };
            paxDetail.roomQuantity = filterBody.length;
            filterBody.forEach(function name(pax) {
                paxDetail.adultQuantity += +pax.adultQuantity;
                paxDetail.childQuantity += +pax.childQuantity;
            });

            return paxDetail;
        }

        return services;
    }
})();