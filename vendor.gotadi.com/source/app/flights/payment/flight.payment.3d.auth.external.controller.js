(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightPayment3DAuthExternalController', FlightPayment3DAuthExternalController);

    FlightPayment3DAuthExternalController.$inject = ['$log', '$rootScope', '$scope', '$window', '$interval', '$state', '$timeout', '$sce', 'Auth', '$uibModalInstance', 'paymentUrl', 'paReq', 'md', 'termUrl'];

    function FlightPayment3DAuthExternalController($log, $rootScope, $scope, $window, $interval, $state, $timeout, $sce, Auth, $uibModalInstance, paymentUrl, paReq, md, termUrl) {
        var vm = this;

        vm.progress = 0;
        vm.givenUrl = $sce.trustAsResourceUrl(paymentUrl);
        vm.paReq = paReq;
        vm.md = md;
        vm.termUrl = termUrl;

        vm.cancel = cancel;

        function cancel() {
            $uibModalInstance.dismiss('cancel');

            // $window.removeEventListener('message', listener);
        }


        // $scope.$on('message', function (event, item) {
        //     cancel();
        // });

        var listener = function(e) {
            // $log.log("FlightPayment3DAuthExternalController - listener: " + e.data);
            //console.log("FlightPaymentExternalController - listener - %j", e.data);
            //$rootScope.$broadcast('message', e.data);
            cancel();

            $window.removeEventListener('message', listener);

            // if (e.data && angular.isString(e.data) && e.data.indexOf("true") !== -1) {
            //     $rootScope.$broadcast('DoPaymentWith3DAuth', e.data);
            // }

            $rootScope.$broadcast('DoPaymentWith3DAuthConfirmation', e.data);
        };

        $window.addEventListener('message', listener);

        // $window.postMessage("hello", "http://localhost:8080");

        function wait(ms) {
            var start = new Date().getTime();
            var end = start;
            while (end < start + ms) {
                end = new Date().getTime();
            }
        }

        //TODO: remove
        //$uibModalInstance.dismiss('cancel');

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

        $timeout(function() {
            var form = angular.element('#newibe_PAEnrollForm_form');
            form[0].submit();
        }, 100);
    }
})();