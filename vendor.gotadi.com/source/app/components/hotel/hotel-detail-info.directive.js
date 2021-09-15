(function() {
    'use strict';

    gtdHotelDetailInfoController.$inject = ['$log', '$scope', 'MetaData', 'Hotel'];

    function gtdHotelDetailInfoController($log, $scope, MetaData, Hotel) {
        var ctrl = this;

    }

    var gtdHotelDetailInfo = {
        templateUrl: 'app/components/hotel/hotel-detail-info.html',
        controller: gtdHotelDetailInfoController,
        bindings: {
            hotelModel: '=',
            searchOptions: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelDetailInfo', gtdHotelDetailInfo);

})();