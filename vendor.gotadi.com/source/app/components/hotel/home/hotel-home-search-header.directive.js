(function() {
    'use strict';

    gtdHotelHomeSearchHeaderController.$inject = [
        '$log', '$uibModal', '$state', '$rootScope', '$location',
        'GlobalSrv', 'Hotel', 'DialogService',
        'GtdHotelService',
        'HotelUtils', 'Base64',
        'HOTEL_STATES',
        'MerchantService',
        '$scope',
        '$cookies'
    ];

    function gtdHotelHomeSearchHeaderController(
        $log, $uibModal, $state, $rootScope, $location,
        GlobalSrv, Hotel, DialogService,
        GtdHotelService,
        HotelUtils, Base64,
        HOTEL_STATES,
        MerchantService,
        $scope,
        $cookies
    ) {

        var ctrl = this;

        ctrl.paxDetail = {
            roomQuantity: 0,
            adultQuantity: 0,
            childQuantity: 0
        };

        ctrl.hotelStates = GtdHotelService.getStates();

        ctrl.init = init;
        ctrl.openChooseRoomDetail = openChooseRoomDetail;
        ctrl.onFocusInputName = onFocusInputName;
        ctrl.onBlurInputName = onBlurInputName;

        var listener = $rootScope.$on(HOTEL_STATES, function(event, newValue) {
            if (!newValue) {
                return;
            }
            switch (newValue.state) {
                case ctrl.hotelStates.CHANGE_SEARCH_FILTER:
                    ctrl.searchOptions = newValue.payload;
                    break;
                case ctrl.hotelStates.HOTEL_PAX_CHANGED:
                    ctrl.paxDetail = GtdHotelService.getPaxSummary();
                    ctrl.searchOptions.hotelSearchBody = newValue.payload;
                default:
                    break;
            }
        });
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

        ctrl.init();

        function init() {
            ctrl.searchOptions = GtdHotelService.getSearchOptions();
            ctrl.paxDetail = GtdHotelService.getPaxSummary();
        }

        function openChooseRoomDetail() {
            GtdHotelService.openModalUpdateRoomDetail();
        }

        ctrl.searchDestinations = function(val) {
            return Hotel.searchHotelMetaData(val);
        };

        function onFocusInputName() {
            ctrl.previousHotelCode = ctrl.searchOptions.hotelSearchFilter.hotel_code;
            ctrl.searchOptions.hotelSearchFilter.hotel_code = "";
        }

        function onBlurInputName() {
            if (ctrl.searchOptions.hotelSearchFilter.hotel_code === "" && ctrl.searchOptions.hotelSearchFilter.hotel_code.trim() === "") {
                ctrl.searchOptions.hotelSearchFilter.hotel_code = ctrl.previousHotelCode;
            }
        }

        ctrl.formatLabel = function(model) {
            var destinations = GtdHotelService.getSelectedDestination();

            if (destinations && destinations.code === model) {
                return destinations.name;
            }
            return model;
        };

        ctrl.typeAHeadOnSelect = function($item, $model, $label, $event) {
            GtdHotelService.updateSelectedDestination($item);
        };

        ctrl.doSearchImpl = function() {
            // VALIDATION
            if (moment(ctrl.searchOptions.hotelSearchFilter.checkin_date, 'DD-MM-YYYY').diff(moment(ctrl.searchOptions.hotelSearchFilter.checkout_date, 'DD-MM-YYYY')) > 0) {
                DialogService.openAlertDialog({
                    "title": "Error",
                    "message": "Ngày Trả Phòng phải sau Ngày Nhận Phòng"
                });
                return;
            }

            if (!GtdHotelService.validateDateRange(ctrl.searchOptions.hotelSearchFilter.checkin_date, ctrl.searchOptions.hotelSearchFilter.checkout_date)) {
                DialogService.openAlertDialog({
                    "title": "Error",
                    "message": "Ngày Trả Phòng và Ngày Nhận Phòng không quá 30 ngày"
                });
                return;
            }

            GtdHotelService.updateSearchOptions(ctrl.searchOptions);
            if ($state.current.name !== 'hotel-search') {
                GtdHotelService.backToResult();
            } else {
                GtdHotelService.search();
            }

        };
    }

    var gtdHotelHomeSearchHeader = {
        templateUrl: 'app/components/hotel/home/hotel-home-search-header.html',
        controller: gtdHotelHomeSearchHeaderController
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelHomeSearchHeader', gtdHotelHomeSearchHeader);

    var gtdHotelSearchHeader = {
        templateUrl: 'app/components/hotel/hotel-search-header.html',
        controller: gtdHotelHomeSearchHeaderController
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelSearchHeader', gtdHotelSearchHeader);

})();