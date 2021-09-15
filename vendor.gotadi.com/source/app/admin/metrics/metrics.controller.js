(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('OtaMetricsMonitoringController', OtaMetricsMonitoringController);

    OtaMetricsMonitoringController.$inject = ['$scope', 'OtaMetricsService', '$uibModal'];

    function OtaMetricsMonitoringController($scope, OtaMetricsService, $uibModal) {
        var vm = this;

        vm.metrics = {};
        vm.refresh = refresh;
        vm.refreshThreadDumpData = refreshThreadDumpData;
        vm.servicesStats = {};
        vm.updatingMetrics = true;

        vm.refresh();

        $scope.$watch('vm.metrics', function(newValue) {
            vm.servicesStats = {};
            angular.forEach(newValue.timers, function(value, key) {
                if (key.indexOf('web.rest') !== -1 || key.indexOf('service') !== -1) {
                    vm.servicesStats[key] = value;
                }
            });

        });

        function refresh() {
            vm.updatingMetrics = true;
            OtaMetricsService.getMetrics().then(function(promise) {
                vm.metrics = promise;
                vm.updatingMetrics = false;
            }, function(promise) {
                vm.metrics = promise.data;
                vm.updatingMetrics = false;
            });
        }

        function refreshThreadDumpData() {
            OtaMetricsService.threadDump().then(function(data) {
                $uibModal.open({
                    templateUrl: 'app/admin/metrics/metrics.modal.html',
                    controller: 'OtaMetricsMonitoringModalController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        threadDump: function() {
                            return data;
                        }

                    }
                });
            });
        }


    }
})();