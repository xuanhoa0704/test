(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('B2B2CDialogController', B2B2CDialogController);

    B2B2CDialogController.$inject = ['$log', '$window', '$rootScope', '$scope', '$state', '$timeout', '$uibModalInstance', 'error'];

    function B2B2CDialogController($log, $window, $rootScope, $scope, $state, $timeout, $uibModalInstance, error) {
        var vm = this;

        vm.error = error;

        vm.cancel = function() {
            if (error !== null && error.redirectUrl != null) {
                try {
                    $window.location.href = error.redirectUrl;
                } catch (err) {
                    $log.log("B2B2CDialogController - " + err);
                }
            }

            $uibModalInstance.dismiss('cancel');
        };

    }
})();