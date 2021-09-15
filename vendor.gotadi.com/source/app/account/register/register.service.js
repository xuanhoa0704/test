(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('RegisterService', RegisterService);

    RegisterService.$inject = ['$uibModal'];

    function RegisterService($uibModal) {
        var service = {
            open: open
        };

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        return service;

        function open() {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/account/register/register.html',
                controller: 'RegisterController',
                windowClass: 'login-modal-window',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('register');
                        return $translate.refresh();
                    }]
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        }
    }
})();