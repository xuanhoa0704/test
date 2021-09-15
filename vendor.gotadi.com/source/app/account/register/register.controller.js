(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('RegisterController', RegisterController);


    RegisterController.$inject = ['$log', '$translate', '$timeout', 'Auth', 'LoginService', '$uibModalInstance'];

    function RegisterController($log, $translate, $timeout, Auth, LoginService, $uibModalInstance) {
        var vm = this;

        vm.passwordpattern = /((?=.*\d)(?=.*[a-zA-Z]).{8,})/;

        vm.doNotMatch = null;
        vm.error = null;
        vm.errorUserExists = null;
        vm.login = function() {
            $uibModalInstance.dismiss('cancel');
            LoginService.open();
        };
        vm.register = register;
        vm.registerAccount = {};
        vm.success = null;
        vm.parent = $uibModalInstance;

        $timeout(function() {
            angular.element('#login').focus();
        });

        function register() {

            // RESET WHEN CLICK
            vm.doNotMatch = null;
            vm.error = null;
            vm.errorUserExists = null;
            vm.errorEmailExists = null;

            if (vm.registerAccount.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
            } else {
                vm.registerAccount.langKey = $translate.use();
                // vm.doNotMatch = null;
                // vm.error = null;
                // vm.errorUserExists = null;
                // vm.errorEmailExists = null;

                vm.registerAccount.login = vm.registerAccount.email;
                Auth.createAccount(vm.registerAccount).then(function() {
                    vm.success = 'OK';
                }).catch(function(response) {
                    vm.success = null;
                    if (response.status === 400 && response.data === 'login already in use') {
                        vm.errorUserExists = 'ERROR';
                    } else if (response.status === 400 && response.data === 'email address already in use') {
                        vm.errorEmailExists = 'ERROR';
                    } else {
                        vm.error = 'ERROR';
                    }
                });
            }
        }
    }
})();