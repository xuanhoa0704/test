(function() {
    'use strict';

    gtdHotelPaginationComponent.$inject = [
        '$log', '$rootScope', '$scope',
        'GtdHotelService',
        'HOTEL_STATES'
    ];

    function gtdHotelPaginationComponent(
        $log, $rootScope, $scope,
        GtdHotelService,
        HOTEL_STATES) {

        var vm = this;
        vm.getNumber = getNumber;
        vm.changePage = changePage;
        vm.toLast = toLast;
        vm.toFirst = toFirst;
        vm.nextPage = nextPage;
        vm.previousPage = previousPage;

        vm.disableNext = false;
        vm.disablePrevious = false;
        vm.siblingPage = -1;
        vm.currentpage = -1;

        vm.currentPagination = GtdHotelService.getPagination();

        vm.hotelStates = GtdHotelService.getStates();

        vm.listener = $rootScope.$on(HOTEL_STATES, function(event, newValue) {
            if (!newValue) {
                return;
            }
            switch (newValue.state) {
                case vm.hotelStates.PAGEABLE_CHANGED:
                    vm.currentPagination = newValue.payload;
                    break;
                default:
                    break;
            }
        });

        $scope.$on('$viewContentLoaded', function(event) {
            // code that will be executed ... 
            // every time this view is loaded


        });

        this.$onInit = function() {
            updatePagination(vm.currentPagination.page);
            $log.debug("gtdHotelPaginationComponent Init");
        };

        this.$onDestroy = function() {
            $log.debug("gtdHotelPaginationComponent Destroy");
            vm.listener = null;
        };

        function getNumber() {
            return Array.apply(null, {
                length: vm.currentPagination.totalPages
            }).map(Number.call, Number);
        }

        function changePage(pageMum) {
            GtdHotelService.chageSmartSearchPage(pageMum);
            GtdHotelService.smartSearch();
        }

        function updatePagination(pageMum) {
            vm.currentpage = pageMum;

            if (pageMum === 0) {
                vm.disablePrevious = true;
            } else {
                vm.siblingPage = pageMum - 1;
                vm.disablePrevious = false;
            }

            if (pageMum === vm.currentPagination.totalPages - 1) {
                vm.disableNext = true;
            } else {
                vm.disableNext = false;
            }
        }

        function toFirst() {
            GtdHotelService.chageSmartSearchPage(0);
            GtdHotelService.smartSearch();
        }

        function toLast() {
            GtdHotelService.chageSmartSearchPage(vm.currentPagination.totalPages - 1);
            GtdHotelService.smartSearch();
        }

        function nextPage() {
            GtdHotelService.chageSmartSearchPage(vm.currentPagination.page + 1);
            GtdHotelService.smartSearch();
        }

        function previousPage() {
            GtdHotelService.chageSmartSearchPage(vm.currentPagination.page - 1);
            GtdHotelService.smartSearch();
        }

    }

    var gtdHotelPagination = {
        templateUrl: 'app/components/hotel/hotel-pagination.component.html',
        controller: gtdHotelPaginationComponent,
        controllerAs: 'vm'
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelPagination', gtdHotelPagination);

})();