(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('OtaHealthCheckController', OtaHealthCheckController);

    OtaHealthCheckController.$inject = ['OtaHealthService', '$uibModal'];

    function OtaHealthCheckController(OtaHealthService, $uibModal) {
        var vm = this;

        vm.updatingHealth = true;
        vm.getLabelClass = getLabelClass;
        vm.refresh = refresh;
        vm.showHealth = showHealth;
        vm.baseName = OtaHealthService.getBaseName;
        vm.subSystemName = OtaHealthService.getSubSystemName;

        vm.refresh();

        function getLabelClass(statusState) {
            if (statusState === 'UP') {
                return 'label-success';
            } else {
                return 'label-danger';
            }
        }

        function refresh() {
            vm.updatingHealth = true;
            OtaHealthService.checkHealth().then(function(response) {
                vm.healthData = OtaHealthService.transformHealthData(response);
                vm.updatingHealth = false;
            }, function(response) {
                vm.healthData = OtaHealthService.transformHealthData(response.data);
                vm.updatingHealth = false;
            });
        }

        function showHealth(health) {
            $uibModal.open({
                templateUrl: 'app/admin/health/health.modal.html',
                controller: 'HealthModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    currentHealth: function() {
                        return health;
                    },
                    baseName: function() {
                        return vm.baseName;
                    },
                    subSystemName: function() {
                        return vm.subSystemName;
                    }

                }
            });
        }

    }
})();