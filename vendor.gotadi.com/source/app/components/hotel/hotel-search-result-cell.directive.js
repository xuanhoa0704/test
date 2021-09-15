(function() {
    'use strict';

    gtdHotelSearchResultCellController.$inject = [
        '$log', '$scope', '$state', '$uibModal',
        'MetaData', 'HotelUtils', 'Hotel', 'DataService', 'GlobalSrv', 'DialogService', 'Base64', 'GtdHotelService',
        '$window'
    ];

    function gtdHotelSearchResultCellController(
        $log, $scope, $state, $uibModal,
        MetaData, HotelUtils, Hotel, DataService, GlobalSrv, DialogService, Base64, GtdHotelService,
        $window
    ) {
        var ctrl = this;
        ctrl.resetModal = resetModal;

        ctrl.modalInstance = null;

        function resetModal() {
            ctrl.modalInstance = null;
        }

        ctrl.openMapPlaceAround = openMapPlaceAround;

        HotelUtils.getFacilities(ctrl.item);
        localStorage.setItem('ctrl.item.supplierSessionId', ctrl.item.supplierSessionId);
        if (ctrl.item && ctrl.item.products[0] && ctrl.item.products[0].promo && ctrl.item.products[0].promoDescription) {
            ctrl.item.products[0].promoPercen = ctrl.item.products[0].promoDescription.match(new RegExp("\\d+%", 'g'));
        }


        ctrl.getFacility = function(fac) {
            return HotelUtils.getFacilityClass(fac);
        };

        ctrl.bookingClicked = function(item) {
            GtdHotelService.goToDetail(item);

        };

        function openMapPlaceAround() {
            if (ctrl.modalInstance !== null) return;
            DataService.setHotelSearchOptions(ctrl.searchOptions);
            ctrl.modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/components/hotel/hotel-place-around.html',
                controller: 'HotelPlaceAroundController',
                controllerAs: 'vm',
                windowClass: 'hotel-detail-map-full-window',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('hotel');
                        return $translate.refresh();
                    }],
                    selectedHotel: function() {
                        return ctrl.item;
                    }
                }
            });
            ctrl.modalInstance.result.then(
                ctrl.resetModal,
                ctrl.resetModal
            );
        }
    }

    var gtdHotelSearchResultCell = {
        templateUrl: 'app/components/hotel/hotel-search-result-cell.html',
        controller: gtdHotelSearchResultCellController,
        bindings: {
            item: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelSearchResultCell', gtdHotelSearchResultCell);

})();