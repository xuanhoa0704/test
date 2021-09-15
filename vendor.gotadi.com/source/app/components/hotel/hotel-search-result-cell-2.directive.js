(function() {
    'use strict';

    gtdHotelSearchResultCell2Controller.$inject = ['$log', '$scope', '$state', '$uibModal', 'MetaData', 'Hotel', 'DataService'];

    function gtdHotelSearchResultCell2Controller($log, $scope, $state, $uibModal, MetaData, Hotel, DataService) {
        var ctrl = this;

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        ctrl.bookingClicked = function(item) {
            // ctrl.currentItem = item;
            DataService.setSelectedHotel(item);

            $state.go('hotel-detail');
        };

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
                    }]
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };

    }

    var gtdHotelSearchResultCell2 = {
        templateUrl: 'app/components/hotel/hotel-search-result-cell-2.html',
        controller: gtdHotelSearchResultCell2Controller,
        bindings: {
            searchResult: '=',
            searchOptions: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelSearchResultCell2', gtdHotelSearchResultCell2);

})();