(function() {
    'use strict';

    var gtdHotelSearchFooter = {
        templateUrl: 'app/components/hotel/hotel-search-footer.html',
        controller: gtdHotelSearchFooterController
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelSearchFooter', gtdHotelSearchFooter);

    gtdHotelSearchFooterController.$inject = ['$log', '$scope', 'Hotel'];

    function gtdHotelSearchFooterController($log, $scope, Hotel) {
        var ctrl = this;

        ctrl.popularPlaces = Hotel.getPopularPlaces();
        ctrl.popularHotels = Hotel.getPopularHotels();
        ctrl.popularHotels = Hotel.getPopularHotels();

        // vm.alerts = AlertService.get();
        $scope.$on('$destroy', function() {
            ctrl.popularPlaces = [];
            ctrl.popularHotels = [];
            ctrl.popularHotels = [];
        });
    }
})();