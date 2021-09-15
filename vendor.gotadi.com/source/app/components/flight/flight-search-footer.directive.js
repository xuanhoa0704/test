(function() {
    'use strict';

    var gtdFlightSearchFooter = {
        templateUrl: 'app/components/flight/flight-search-footer.html',
        controller: gtdFlightSearchFooterController
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightSearchFooter', gtdFlightSearchFooter);

    gtdFlightSearchFooterController.$inject = ['$log', '$scope', 'Flight'];

    function gtdFlightSearchFooterController($log, $scope, Flight) {
        var ctrl = this;

        ctrl.popularPlaces = Flight.getPopularPlaces();
        ctrl.popularFlights = Flight.getPopularFlights();
        ctrl.popularHotels = Flight.getPopularHotels();

        // vm.alerts = AlertService.get();
        $scope.$on('$destroy', function() {
            ctrl.popularPlaces = [];
            ctrl.popularFlights = [];
            ctrl.popularHotels = [];
        });
    }
})();