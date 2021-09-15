(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ResetFinishController', ResetFinishController);

    ResetFinishController.$inject = ['$log', '$stateParams', '$timeout', 'Auth', 'LoginService'];

    function ResetFinishController($log, $stateParams, $timeout, Auth, LoginService) {
        var vm = this;

        //logout to clean existing session
        Auth.logout();

        vm.passwordpattern = /((?=.*\d)(?=.*[a-zA-Z]).{8,})/;

        vm.keyMissing = angular.isUndefined($stateParams.key);
        vm.confirmPassword = null;
        vm.doNotMatch = null;
        vm.error = null;
        vm.finishReset = finishReset;
        vm.login = LoginService.open;
        vm.resetAccount = {};
        vm.success = null;

        $timeout(function() {
            angular.element('#password').focus();
        });

        function finishReset() {
            vm.doNotMatch = null;
            vm.error = null;
            if (vm.resetAccount.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
            } else {
                Auth.resetPasswordFinish({
                    key: $stateParams.key,
                    newPassword: vm.resetAccount.password
                }).then(function() {
                    vm.success = 'OK';
                }).catch(function() {
                    vm.success = null;
                    vm.error = 'ERROR';
                });
            }
        }
    }
})();