(function() {
    'use strict';

    gtdFlightInfoController.$inject = ['$log', '$scope', 'MetaData', 'Flight', 'IBE_KEYS'];

    function gtdFlightInfoController($log, $scope, MetaData, Flight, IBE_KEYS) {
        var ctrl = this;
        $scope.ibeKeys = IBE_KEYS;
    }

    var gtdFlightInfo = {
        templateUrl: 'app/components/flight/flight-info.html',
        controller: gtdFlightInfoController,
        bindings: {
            flightModel: '=',
            gtdShowHeader: '@',
            gtdShowCustomer: '@'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightInfo', gtdFlightInfo);

})();