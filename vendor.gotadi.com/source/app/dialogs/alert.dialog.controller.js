(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('AlertDialogController', AlertDialogController);

    AlertDialogController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModalInstance', 'error', 'MerchantService'];

    function AlertDialogController($log, $rootScope, $scope, $state, $timeout, $uibModalInstance, error, MerchantService) {
        var vm = this;

        vm.error = error;

        MerchantService.scrollToTopIframe();

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();