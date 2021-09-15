(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelSearchController', HotelSearchController);

    HotelSearchController.$inject = [
        '$log', '$scope', '$state', '$stateParams', '$rootScope',
        'Base64', 'GtdHotelService',
        'HOTEL_STATES'
    ];

    function HotelSearchController(
        $log, $scope, $state, $stateParams, $rootScope,
        Base64, GtdHotelService,
        HOTEL_STATES) {

        var vm = this;

        vm.paxDetail = {
            roomQuantity: 0,
            adultQuantity: 0,
            childQuantity: 0
        };

        vm.params = $stateParams.params;

        // Default show nothing
        vm.displayState = null;

        vm.hotelStates = GtdHotelService.getStates();

        vm.updatePaxDisplay = updatePaxDisplay;
        vm.retry = retry;

        vm.showLoading = true;
        vm.showSubLoading = false;

        var listener = $rootScope.$on(HOTEL_STATES, function(event, newValue) {
            if (!newValue) {
                return;
            }
            switch (newValue.state) {
                case vm.hotelStates.SHOW_SUB_LOADING:
                    vm.showSubLoading = true;
                    break;
                case vm.hotelStates.SHOW_LOADING:
                    vm.displayState = newValue.state;
                    vm.showLoading = true;
                    break;
                case vm.hotelStates.HIDE_LOADING:
                    vm.displayState = newValue.state;
                    vm.showLoading = false;
                    vm.showSubLoading = false;
                    break;
                case vm.hotelStates.SEARCH_ERROR:
                    vm.displayState = newValue.state;
                    break;
                case vm.hotelStates.FINISH_SEARCH:
                    vm.displayState = newValue.state;
                    vm.searchResult = newValue.payload;
                    break;
                case vm.hotelStates.CHANGE_SEARCH_FILTER:
                    vm.searchOptions = newValue.payload;
                    vm.updatePaxDisplay();
                    break;
                default:
                    break;
            }
        });

        function updatePaxDisplay() {
            vm.paxDetail = {
                roomQuantity: 0,
                adultQuantity: 0,
                childQuantity: 0
            };
            vm.paxDetail.roomQuantity = vm.searchOptions.hotelSearchBody.length;
            vm.searchOptions.hotelSearchBody.forEach(function name(pax) {
                vm.paxDetail.adultQuantity += vm.searchOptions.hotelSearchBody.adultQuantity;
                vm.paxDetail.childQuantity += vm.searchOptions.hotelSearchBody.childQuantity;
            });

        }

        function retry() {
            GtdHotelService.search();
        }

        $scope.$watch('$root.hotelStates', function(newValue, oldValue) {

        });

        if (vm.params) {
            try {

                vm.searchOptions = Base64.decodeJson(vm.params);

                GtdHotelService.updateSearchOptions(vm.searchOptions);

                vm.updatePaxDisplay();

                GtdHotelService.search();

            } catch (err) {
                $log.log(err);
            }
        }

        // stops the interval when the scope is destroyed,
        // this usually happens when a route is changed and
        // the ItemsController $scope gets destroyed. The
        // destruction of the ItemsController scope does not
        // guarantee the stopping of any intervals, you must
        // be responsible of stopping it when the scope is
        // is destroyed.
        $scope.$on('$destroy', function() {
            listener = null;
        });
        /** END CHECK TIMEOUT **/
        $scope.changeItinerary = function() {
            $('.hotel-search-header').slideToggle();
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