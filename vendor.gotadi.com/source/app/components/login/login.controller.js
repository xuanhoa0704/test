(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$log', '$rootScope', '$state', '$timeout', 'Auth', '$uibModalInstance', 'RegisterService'];

    function LoginController($log, $rootScope, $state, $timeout, Auth, $uibModalInstance, RegisterService) {
        var vm = this;

        vm.authenticationError = false;
        vm.cancel = cancel;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.register = register;
        vm.rememberMe = true;
        vm.requestResetPassword = requestResetPassword;
        vm.username = null;
        vm.language = "vi";
        vm.parent = $uibModalInstance;
        $timeout(function() {
            angular.element('#username').focus();
        });

        function cancel() {
            vm.credentials = {
                username: null,
                password: null,
                rememberMe: true
            };
            vm.authenticationError = false;
            $uibModalInstance.dismiss('cancel');
        }

        function login(event) {
            event.preventDefault();
            Auth.login({
                username: vm.username,
                password: vm.password,
                rememberMe: vm.rememberMe
            }).then(function() {
                vm.authenticationError = false;
                $uibModalInstance.close();
                if ($state.current.name === 'register' || $state.current.name === 'activate' ||
                    $state.current.name === 'finishReset' || $state.current.name === 'requestReset') {
                    $state.go('home');
                }

                $rootScope.$broadcast('authenticationSuccess');

                // previousState was set in the authExpiredInterceptor before being redirected to login modal.
                // since login is successful, go to stored previousState and clear previousState
                if (Auth.getPreviousState()) {
                    var previousState = Auth.getPreviousState();
                    Auth.resetPreviousState();
                    $state.go(previousState.name, previousState.params);
                }
            }).catch(function() {
                vm.authenticationError = true;
            });
        }

        function register() {
            $uibModalInstance.dismiss('cancel');
            // $state.go('register');
            RegisterService.open();
        }

        function requestResetPassword() {
            $uibModalInstance.dismiss('cancel');
            $state.go('requestReset');
        }
    }
})();