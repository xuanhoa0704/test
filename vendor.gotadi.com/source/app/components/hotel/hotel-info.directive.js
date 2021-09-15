(function() {
    'use strict';

    gtdHotelInfoController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdHotelInfoController($log, $scope, MetaData, Flight) {
        var ctrl = this;
    }

    var gtdHotelInfo = {
        templateUrl: 'app/components/hotel/hotel-info.html',
        controller: gtdHotelInfoController,
        bindings: {
            selectedHotel: '=',
            selectedHotelRoom: '=',
            selectedHotelProduct: '=',
            bookingModel: '=',
            jsonmodel: '=?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelInfo', gtdHotelInfo);

})();