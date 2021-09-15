(function() {
    'use strict';

    gtdFlightBookingCustomerInfoViewController.$inject = ['$log', '$state', '$scope', 'MetaData', 'Flight', 'DataService', 'Base64'];

    function gtdFlightBookingCustomerInfoViewController($log, $state, $scope, MetaData, Flight, DataService, Base64) {
        var ctrl = this;

        $log.log($scope.mode + ":" + ctrl.mode);

        if (!ctrl.searchOptions) {
            ctrl.searchOptions = DataService.getSearchOption();
        }

        // Startup event
        $scope.$on('gtd-load-booking-completed', function() {
            $log.log('gtd-load-booking-completed: ');
            $log.log(ctrl.bookingModel.customers);
            if (ctrl.mode == 'flight') {
                angular.forEach(ctrl.bookingModel.customers, function(item) {
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

        ctrl.doBack = function() {
            // $state.go('booking-info');
            $state.go('booking-info/:booking_number/:params', {
                "searchOptions": ctrl.searchOptions,
                "searchResult": ctrl.searchResult,
                "booking_number": Base64.encodeString(DataService.getBookingModel().bookingNumber),
                "params": ''
            });
        };
    }

    var gtdFlightBookingCustomerInfoView = {
        templateUrl: 'app/components/booking/flight-booking-customer-info-view.html',
        controller: gtdFlightBookingCustomerInfoViewController,
        bindings: {
            bookingModel: '=',
            mode: '@?',
            searchOptions: '=?'
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightBookingCustomerInfoView', gtdFlightBookingCustomerInfoView);

})();