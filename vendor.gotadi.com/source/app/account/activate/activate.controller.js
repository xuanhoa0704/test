(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ActivationController', ActivationController);

    ActivationController.$inject = ['$log', '$stateParams', 'Auth', 'LoginService'];

    function ActivationController($log, $stateParams, Auth, LoginService) {
        var vm = this;

        Auth.activateAccount({
            key: $stateParams.key
        }).then(function() {
            vm.error = null;
            vm.success = 'OK';
        }).catch(function() {
            vm.success = null;
            vm.error = 'ERROR';
        });

        vm.login = LoginService.open;
    }
})();