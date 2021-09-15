(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('PasswordController', PasswordController);

    PasswordController.$inject = ['$log', '$state', 'Auth', 'Principal', 'LoginService', 'PreviousState'];

    function PasswordController($log, $state, Auth, Principal, LoginService, PreviousState) {
        var vm = this;

        vm.passwordpattern = /((?=.*\d)(?=.*[a-zA-Z]).{8,})/;

        vm.changePassword = changePassword;
        vm.doNotMatch = null;
        vm.samePassword = null;

        vm.error = null;
        vm.success = null;
        vm.login = LoginService.open;
        vm.cancel = cancel;

        Principal.identity().then(function(account) {
            vm.account = account;
        });

        function changePassword() {
            if (vm.password == vm.oldPassword) {
                vm.error = null;
                vm.success = null;
                vm.doNotMatch = null;
                vm.samePassword = 'ERROR';
            } else if (vm.password !== vm.confirmPassword) {
                vm.error = null;
                vm.success = null;
                vm.samePassword = null;
                vm.doNotMatch = 'ERROR';
            } else {
                vm.doNotMatch = null;
                vm.samePassword = null;
                Auth.changePassword(vm.oldPassword, vm.password).then(function() {
                    vm.error = null;
                    vm.success = 'OK';
                    //$uibModalInstance.dismiss('cancel');
                }).catch(function() {
                    vm.success = null;
                    vm.error = 'ERROR';
                });

            }
        }

        function cancel() {
            $state.go(PreviousState.Name, PreviousState.params);
        }
    }
})();