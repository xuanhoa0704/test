(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileTravellerDeleteController', ProfileTravellerDeleteController);

    ProfileTravellerDeleteController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModalInstance', 'CustomerService'];

    function ProfileTravellerDeleteController($log, $rootScope, $scope, $state, $timeout, $uibModalInstance, CustomerService) {
        var vm = this;

        vm.profileModel = {};
        // 'view', 'edit'
        var defaultMode = 'view';

        vm.profileModel.cardMode = defaultMode;

        vm.travellerNames = '';
        angular.forEach($scope.customerTravellers, function(item, value) {
            if (item.checked) {
                vm.travellerNames += item.surName + ' ' + item.firstName + ", ";
            }
        });
        if (vm.travellerNames.endsWith(', ')) {
            vm.travellerNames = vm.travellerNames.substr(0, vm.travellerNames.length - 2);
        }

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.submit = function() {
            // var ids = [];
            var ids = '';
            // console.log("$scope.creditCards = " + JSON.stringify($scope.creditCards));
            angular.forEach($scope.customerTravellers, function(item, value) {
                if (item.checked) {
                    // ids.push(item.id);
                    ids += item.id + ":";
                }
            });

            CustomerService.deleteCustomerTravellers(ids).then(function(result) {
                $state.go('user-profile-traveller', {}, {
                    reload: true
                });
            });

        };

    }
})();