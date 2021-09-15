(function() {
    'use strict';

    gtdHotelBookingContactInfoViewController.$inject = ['$log', '$scope', 'MetaData', 'Flight'];

    function gtdHotelBookingContactInfoViewController($log, $scope, MetaData, Flight) {
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

    var gtdHotelBookingContactInfoView = {
        templateUrl: 'app/components/booking/hotel-booking-contact-info-view.html',
        controller: gtdHotelBookingContactInfoViewController,
        bindings: {
            bookingModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '=',
            mode: '@?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingContactInfoView', gtdHotelBookingContactInfoView);

})();