(function() {
    'use strict';

    gtdHotelSearchResultController.$inject = [
        '$uibModal', '$rootScope', 'GtdHotelService', 'HOTEL_STATES'
    ];

    function gtdHotelSearchResultController(
        $uibModal, $rootScope, GtdHotelService, HOTEL_STATES
    ) {
        var ctrl = this;
        ctrl.hotelStates = GtdHotelService.getStates();
        ctrl.selectedDestination = GtdHotelService.getSelectedDestination();

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        ctrl.searchOptions = GtdHotelService.getSearchOptions();

        ctrl.paxSummary = GtdHotelService.getPaxSummary();

        angular.forEach(ctrl.searchResult.hotels, function(item) {
            if (item.hotelMeta) {
                item.hotelContent = item.hotelMeta;
            }
        });

        ctrl.listener = $rootScope.$on(HOTEL_STATES, function(event, newValue) {
            if (!newValue) {
                return;
            }
            switch (newValue.state) {
                case ctrl.hotelStates.HOTEL_ADVANCE_SEARCH_CHANGED:
                    ctrl.searchOptions = GtdHotelService.getSearchOptions();
                    break;
                default:
                    break;
            }
        });

        ctrl.openFullMap = function() {
            if (modalInstance !== null) return;

            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/components/hotel/hotel-detail-map-full.html',
                controller: 'HotelDetailMapFullController',
                controllerAs: 'vm',
                windowClass: 'hotel-detail-map-full-window',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('hotel');
                        return $translate.refresh();
                    }],
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };

    }

    var gtdHotelSearchResult = {
        templateUrl: 'app/components/hotel/hotel-search-result.html',
        controller: gtdHotelSearchResultController,
        bindings: {
            searchResult: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelSearchResult', gtdHotelSearchResult);

})();