(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('SocialRegisterController', SocialRegisterController);

    SocialRegisterController.$inject = ['$log', '$filter', '$stateParams'];

    function SocialRegisterController($log, $filter, $stateParams) {
        var vm = this;

        vm.success = $stateParams.success;
        vm.error = !vm.success;
        vm.provider = $stateParams.provider;
        vm.providerLabel = $filter('capitalize')(vm.provider);
        vm.success = $stateParams.success;
    }
})();