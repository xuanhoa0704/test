(function() {
    'use strict';

    gtdHotelBookingSummaryDetailsItemController.$inject = ['$log', '$scope', 'MetaData', 'Hotel'];

    function gtdHotelBookingSummaryDetailsItemController($log, $scope, MetaData, Hotel) {
        var ctrl = this;

        ctrl.BASE_RATE = 'base_rate';
        ctrl.ORTHER_RATE = 'orther_rate';

        ctrl.nightlyFee = {};
        ctrl.orderedDate = [];

        ctrl.feeTypes = [
            "tax_and_service_fee",
            "extra_person_fee",
            "compensation",
            "property_fee",
            "sales_tax",
            "adjustment",
            "recovery_charges_and_fees",
            "mandatory_fee",
            "resort_fee",
            "mandatory_tax"
        ];

        ctrl.reOrderFee = reOrderFee;
        ctrl.reOrderNight = reOrderNight;

        this.$onInit = function() {
            ctrl.reOrderFee();
            ctrl.reOrderNight();
        };

        function reOrderFee() {
            ctrl.nightlyFee = {}; // Reset array.
            // Travel nightly rates of room.
            ctrl.room.ratesPerNight.forEach(function(rate) {
                if (!ctrl.nightlyFee[rate.date]) {
                    ctrl.nightlyFee[rate.date] = {};
                }
                ctrl.nightlyFee[rate.date][rate.id] = rate.amount;
            });
            $log.log('ctrl.nightlyFee');

            $log.log(ctrl.nightlyFee);
        }

        function reOrderNight() {
            for (var date in ctrl.nightlyFee) {
                ctrl.orderedDate.push(date);
            }
            ctrl.orderedDate.sort(function(left, right) {
                return moment(left, 'DD-MM-YYYY').diff(moment(right, 'DD-MM-YYYY'));
            });

            $log.log(ctrl.orderedDate);

        }
    }

    var gtdHotelBookingSummaryDetailsItem = {
        templateUrl: 'app/components/booking/hotel-booking-summary-details-item.html',
        controller: gtdHotelBookingSummaryDetailsItemController,
        bindings: {
            room: '=',
            index: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelBookingSummaryDetailsItem', gtdHotelBookingSummaryDetailsItem);

})();