(function() {
    'use strict';

    gtdFlightDetailViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight', 'IBE_KEYS'];

    function gtdFlightDetailViewController($log, $scope, MetaData, Flight, IBE_KEYS) {
        var ctrl = this;
        $scope.ibeKeys = IBE_KEYS;
    }

    var gtdFlightDetailView = {
        templateUrl: 'app/components/flight/flight-detail-view.html',
        controller: gtdFlightDetailViewController,
        bindings: {
            flightModel: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightDetailView', gtdFlightDetailView);

})();