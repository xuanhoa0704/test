(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('RequestResetController', RequestResetController);

    RequestResetController.$inject = ['$log', '$state', '$timeout', 'Auth'];

    function RequestResetController($log, $state, $timeout, Auth) {
        var vm = this;

        vm.error = null;
        vm.errorEmailNotExists = null;
        vm.requestReset = requestReset;
        vm.resetAccount = {};
        vm.success = null;
        vm.refreshPage = refreshPage;

        $timeout(function() {
            angular.element('#email').focus();
        });

        function requestReset() {

            vm.error = null;
            vm.errorEmailNotExists = null;

            Auth.resetPasswordInit(vm.resetAccount.email).then(function() {
                vm.success = 'OK';
            }).catch(function(response) {
                vm.success = null;
                if (response.status === 400 && response.data === 'email address not registered') {
                    vm.errorEmailNotExists = 'ERROR';
                } else {
                    vm.error = 'ERROR';
                }
            });
        }

        function refreshPage() {
            vm.error = null;
            vm.errorEmailNotExists = null;
            // vm.resetAccount = {};
            vm.success = null;
            // $state.go('requestReset', {reload: true});
        }
    }
})();