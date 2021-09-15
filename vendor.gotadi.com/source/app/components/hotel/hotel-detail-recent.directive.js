(function() {
    'use strict';

    gtdHotelDetailRecentController.$inject = ['$log', '$scope', 'MetaData', 'GlobalSrv', 'Hotel'];

    function gtdHotelDetailRecentController($log, $scope, MetaData, GlobalSrv, Hotel) {
        var ctrl = this;

        ctrl.recentHotels = GlobalSrv.getRecentViewHotels();

    }

    var gtdHotelDetailRecent = {
        templateUrl: 'app/components/hotel/hotel-detail-recent.html',
        controller: gtdHotelDetailRecentController,
        bindings: {
            hotelModel: '=',
            searchOptions: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelDetailRecent', gtdHotelDetailRecent);

})();