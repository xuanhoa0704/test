(function() {
    'use strict';

    gtdFlightBookingProgressController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdFlightBookingProgressController($log, $scope, MetaData, Flight) {
        var ctrl = this;

        $log.info('mode = ' + ctrl.mode);
    }

    var gtdFlightBookingProgress = {
        templateUrl: 'app/components/booking/flight-booking-progress.html',
        controller: gtdFlightBookingProgressController,
        bindings: {
            bookingModel: '=',
            mode: '=?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingProgress', gtdFlightBookingProgress);

})();