(function() {
    'use strict';

    gtdHotelDetailSimillarController.$inject = ['$log', '$scope', 'MetaData', 'Hotel'];

    function gtdHotelDetailSimillarController($log, $scope, MetaData, Hotel) {
        var ctrl = this;

    }

    var gtdHotelDetailSimillar = {
        templateUrl: 'app/components/hotel/hotel-detail-simillar.html',
        controller: gtdHotelDetailSimillarController,
        bindings: {
            hotelModel: '=',
            searchOptions: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelDetailSimillar', gtdHotelDetailSimillar);

})();