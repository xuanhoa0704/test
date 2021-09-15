(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileCardDeleteController', ProfileCardDeleteController);

    ProfileCardDeleteController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModalInstance', 'CustomerService', 'DialogService'];

    function ProfileCardDeleteController($log, $rootScope, $scope, $state, $timeout, $uibModalInstance, CustomerService, DialogService) {
        var vm = this;

        vm.profileModel = {};
        // 'view', 'edit'
        var defaultMode = 'view';

        vm.profileModel.cardMode = defaultMode;

        vm.cardNumbers = '';

        angular.forEach($scope.creditCards, function(item, value) {
            if (item.checked) {
                vm.cardNumbers += item.cardNumber + ", ";
            }
        });

        if (vm.cardNumbers.endsWith(', ')) {
            vm.cardNumbers = vm.cardNumbers.substr(0, vm.cardNumbers.length - 2);
        }

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.submit = function() {
            // var ids = [];
            var ids = '';
            // console.log("$scope.creditCards = " + JSON.stringify($scope.creditCards));
            angular.forEach($scope.creditCards, function(item, value) {
                if (item.checked) {
                    // ids.push(item.id);
                    ids += item.id + ":";
                }
            });

            CustomerService.deleteCreditCards(ids).then(function(result) {
                //$uibModalInstance.dismiss('cancel');
                $state.go('user-profile-card', {}, {
                    reload: true
                });
            }, function error(result) {
                $uibModalInstance.dismiss('cancel');
                DialogService.openHttpAlertDilalog(result);
            });

        };

    }
})();