(function() {
    'use strict';

    gtdFlightBookingContactInfoViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdFlightBookingContactInfoViewController($log, $scope, MetaData, Flight) {
        var ctrl = this;

        $scope.$on('gtd-load-booking-completed', function() {
            $log.log('gtd-load-booking-completed: ');
            if (ctrl.mode == 'flight') {
                angular.forEach(ctrl.bookingModel.contacts, function(item) {
                    item.show = true;
                });
            }
        });

        ctrl.hideCust = function(item) {
            item.show = false;
        };

        ctrl.showCust = function(item) {
            item.show = true;
        };
    }

    var gtdFlightBookingContactInfoView = {
        templateUrl: 'app/components/booking/flight-booking-contact-info-view.html',
        controller: gtdFlightBookingContactInfoViewController,
        bindings: {
            bookingModel: '=',
            mode: '@?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingContactInfoView', gtdFlightBookingContactInfoView);

})();