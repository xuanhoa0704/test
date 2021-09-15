(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelSearchConfirmBookingController', HotelSearchConfirmBookingController);

    HotelSearchConfirmBookingController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', 'Auth', '$uibModalInstance', 'searchOptions', 'currentItem'];

    function HotelSearchConfirmBookingController($log, $rootScope, $scope, $state, $timeout, Auth, $uibModalInstance, searchOptions, currentItem) {
        var vm = this;

        $log.log('SearchOptions in loading dialog:');
        $log.log(searchOptions);

        vm.searchOptions = searchOptions;

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.doSubmit = function() {
            $uibModalInstance.dismiss('cancel');

            // Go to
            $state.go('booking-info', {
                "searchOptions": vm.searchOptions,
                "searchResult": vm.searchResult
            });
        };

        $scope.$on('gtd-hotel-search-date-paginator-init', function(event, item) {
            // wait(3000);
            //
            vm.cancel();
        });

        function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        }


    }
})();