(function() {
    'use strict';

    gtdHotelDetailViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdHotelDetailViewController($log, $scope, MetaData, Flight) {
        var ctrl = this;
    }

    var gtdHotelDetailView = {
        templateUrl: 'app/components/hotel/hotel-detail-view.html',
        controller: gtdHotelDetailViewController,
        bindings: {
            hotelModel: '=',
            searchOptions: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelDetailView', gtdHotelDetailView);

})();