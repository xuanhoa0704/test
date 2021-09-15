(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['$log', '$uibModal', 'AuthServerProvider', 'Principal', '$rootScope'];

    function LoginService($log, $uibModal, AuthServerProvider, Principal, $rootScope) {
        var service = {
            open: open
        };

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        return service;

        function openModal() {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/login/login.html',
                controller: 'LoginController',
                windowClass: 'login-modal-window',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }]
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        }

        function open() {
            var token = AuthServerProvider.getToken();
            $log.log(token);
            if (token) {
                // AuthServerProvider.loginWithToken(token, false).then(function () {
                Principal.identity(true).then(function() {
                    var isAuthenticated = Principal.isAuthenticated();
                    if (isAuthenticated) {
                        $rootScope.$broadcast('authenticationSuccess');
                    } else {
                        openModal();
                    }
                });
                // });
            } else {
                openModal();
            }

        }


    }
})();