(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelSearchLoadingController', HotelSearchLoadingController);

    HotelSearchLoadingController.$inject = ['$log', '$rootScope', '$scope', '$interval', '$state', '$timeout', 'Auth', '$uibModalInstance', 'searchOptions'];

    function HotelSearchLoadingController($log, $rootScope, $scope, $interval, $state, $timeout, Auth, $uibModalInstance, searchOptions) {
        var vm = this;

        $log.log('SearchOptions in loading dialog:');
        $log.log(searchOptions);

        vm.searchOptions = searchOptions;
        vm.progress = 0;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        $scope.$on('gtd-hotel-search-completed', function(event, item) {
            // wait(3000);
            //
            cancel();
        });

        function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        }

        //TODO: remove
        // $uibModalInstance.dismiss('cancel');

        // store the interval promise in this variable
        var promise;

        vm.setProgress = function() {
            // $log.log(vm.progress);
            vm.progress = vm.progress + (100 - vm.progress) / 10;
            // $log.log(vm.progress);
        };

        // starts the interval
        $scope.start = function() {
            // stops any running interval to avoid two intervals running at the same time
            $scope.stop();

            // store the interval promise
            promise = $interval(vm.setProgress, 1000);
        };

        // stops the interval
        $scope.stop = function() {
            $interval.cancel(promise);
        };

        // starting the interval by default
        $scope.start();

        // stops the interval when the scope is destroyed,
        // this usually happens when a route is changed and
        // the ItemsController $scope gets destroyed. The
        // destruction of the ItemsController scope does not
        // guarantee the stopping of any intervals, you must
        // be responsible of stopping it when the scope is
        // is destroyed.
        $scope.$on('$destroy', function() {
            $scope.stop();
        });


    }
})();