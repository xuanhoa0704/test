(function() {
    'use strict';
    gtdHotelSearchAdvController.$inject = [
        '$scope', '$rootScope',
        'HOTEL_STATES',
        'GtdHotelService', 'MetaData'
    ];

    function gtdHotelSearchAdvController(
        $scope, $rootScope,
        HOTEL_STATES,
        GtdHotelService, MetaData) {
        var ctrl = this;

        ctrl.enableReset = false;

        ctrl.hotelPriceArrays = [];
        ctrl.hotelRatingArrays = [];
        ctrl.hotelName = "";
        ctrl.sort = "";

        ctrl.init = init;
        ctrl.advanceSearch = advanceSearch;
        ctrl.resetFilter = resetFilter;
        ctrl.resetClick = resetClick;
        ctrl.filterByName = filterByName;
        ctrl.filterByStar = filterByStar;
        ctrl.filterByPrice = filterByPrice;

        ctrl.hotelStates = GtdHotelService.getStates();

        ctrl.init();

        function init() {
            ctrl.hotelPriceArrays = MetaData.getPriceOptions();
            ctrl.hotelRatingArrays = MetaData.getStarRatingOptions();
            var pagination = GtdHotelService.getPagination();
            ctrl.sort = pagination.sort;

            $scope.$watch(
                function() {
                    return ctrl.sort;
                },
                function name(newVal, oldVal) {
                    if (newVal !== oldVal) {
                        ctrl.advanceSearch();
                    }
                }
            );

            ctrl.listener = $rootScope.$on(HOTEL_STATES, function(event, newValue) {
                if (!newValue) {
                    return;
                }
                switch (newValue.state) {
                    case ctrl.hotelStates.HOTEL_ADVANCE_SEARCH_CHANGED:
                        ctrl.resetFilter();
                        break;
                    default:
                        break;
                }
            });
        }

        function filterByName() {
            // if (ctrl.hotelName.trim() === "") {
            //     return;
            // }
            advanceSearch();
        }

        function filterByStar() {
            advanceSearch();
        }

        function filterByPrice() {
            advanceSearch();
        }

        function enableResetButton() {
            ctrl.enableReset = true;
        }

        function disableResetButton() {
            ctrl.enableReset = false;
        }

        function advanceSearch() {

            GtdHotelService.resetPage();

            GtdHotelService.updateFilterAdvanceName(ctrl.hotelName);

            var prices = [];
            ctrl.hotelPriceArrays.forEach(function(price) {
                if (price.checked) {
                    prices.push(price.from + ":" + price.to);
                }
            });
            GtdHotelService.updateFilterAdcancePrices(prices);

            var ratings = [];
            ctrl.hotelRatingArrays.forEach(function(rating) {
                if (rating.checked) {
                    ratings.push(rating.text);
                    if (rating.text >= 1) {
                        ratings.push(JSON.stringify(rating.text - 0.5));
                    }
                }
            });
            GtdHotelService.updateFilterAdcanceStarts(ratings);
            GtdHotelService.changeSort(ctrl.sort);

            if (ratings.length === 0 && prices.length === 0 && ctrl.hotelName.trim() === "") {
                disableResetButton();
            } else {
                enableResetButton();
            }

            GtdHotelService.smartSearch();
        }

        function resetFilter() {

            ctrl.hotelPriceArrays.forEach(function(price) {
                price.checked = false;
            });

            ctrl.hotelRatingArrays.forEach(function(rating) {
                rating.checked = false;
            });

            ctrl.hotelName = "";
            ctrl.sort = null;
        }

        function resetClick() {
            ctrl.enableReset = false;
            ctrl.resetFilter();
            ctrl.advanceSearch();
        }
    }

    var gtdHotelSearchAdv = {
        templateUrl: 'app/components/hotel/hotel-search-adv.html',
        controller: gtdHotelSearchAdvController,
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelSearchAdv', gtdHotelSearchAdv);

})();