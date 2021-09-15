(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileBookingDeleteController', ProfileBookingDeleteController);

    ProfileBookingDeleteController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModalInstance', 'CustomerService'];

    function ProfileBookingDeleteController($log, $rootScope, $scope, $state, $timeout, $uibModalInstance, CustomerService) {
        var vm = this;

        vm.profileModel = {};
        // 'view', 'edit'
        var defaultMode = 'view';

        vm.profileModel.cardMode = defaultMode;

        vm.bookingNumbers = '';
        vm.pnrs = '';
        angular.forEach($scope.bookings, function(item, value) {
            //if (item.checked) {
            vm.bookingNumbers += item.bookingNumber + ", ";

            vm.pnrs += item.bookingCode + ", ";
            //}
        });
        if (vm.bookingNumbers.endsWith(', ')) {
            vm.bookingNumbers = vm.bookingNumbers.substr(0, vm.bookingNumbers.length - 2);
        }

        if (vm.pnrs.endsWith(', ')) {
            vm.pnrs = vm.pnrs.substr(0, vm.pnrs.length - 2);
        }

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.submit = function() {
            // var ids = [];
            var ids = '';
            // console.log("$scope.creditCards = " + JSON.stringify($scope.creditCards));
            angular.forEach($scope.bookings, function(item, value) {
                if (item.checked) {
                    // ids.push(item.id);
                    ids += item.id + ":";
                }
            });

            CustomerService.deleteBookings(ids).then(function(result) {
                $state.go('user-profile-booking', {
                    'tab': $scope.selectedTab
                }, {
                    reload: true
                });
            });

        };

    }
})();