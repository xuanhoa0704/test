(function() {
    'use strict';

    gtdFlightSearchDatePaginatorController.$inject = ['$log', '$scope', '$timeout', 'MetaData', 'Flight'];

    function gtdFlightSearchDatePaginatorController($log, $scope, $timeout, MetaData, Flight) {
        var ctrl = this;

        ctrl.activeDateIdx = 1;

        $scope.$watch(function(scope) {
                return ctrl.searchOptions.advanceFilterOptions;
            },
            function(newValue, oldValue) {
                $log.log('1d');
                ctrl.dateCarouselArrays = Flight.getDateAvailableOptions();
            }
        );

    }

    var gtdFlightSearchDatePaginator = {
        templateUrl: 'app/components/flight/flight-search-date-paginator.html',
        controller: gtdFlightSearchDatePaginatorController,
        bindings: {
            searchResult: '=',
            searchOptions: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightSearchDatePaginator', gtdFlightSearchDatePaginator);

})();