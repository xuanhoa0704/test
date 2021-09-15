(function() {
    'use strict';

    gtdHotelBookingCustomerInfoViewController.$inject = ['$log', 'Base64', '$timeout', '$state'];

    function gtdHotelBookingCustomerInfoViewController($log, Base64, $timeout, $state) {
        var ctrl = this;

        $timeout(function() {
            angular.forEach(ctrl.bookingModel.customers, function(item) {
                item.show = true;
            });
        }, 10);

        ctrl.hideCust = function(item) {
            item.show = false;
        };

        ctrl.showCust = function(item) {
            item.show = true;
        };

        ctrl.doBack = function() {
            ctrl.bookingModel.curStep = 1;
        };
    }

    var gtdHotelBookingCustomerInfoView = {
        templateUrl: 'app/components/booking/hotel-booking-customer-info-view.html',
        controller: gtdHotelBookingCustomerInfoViewController,
        bindings: {
            bookingModel: '=',
            selectedHotel: '=',
            selectedHotelProduct: '=',
            selectedHotelRoom: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingCustomerInfoView', gtdHotelBookingCustomerInfoView);

})();