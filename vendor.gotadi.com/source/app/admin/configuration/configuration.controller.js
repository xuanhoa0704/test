(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('OtaConfigurationController', OtaConfigurationController);

    OtaConfigurationController.$inject = ['$filter', 'OtaConfigurationService'];

    function OtaConfigurationController(filter, OtaConfigurationService) {
        var vm = this;

        vm.allConfiguration = null;
        vm.configuration = null;

        OtaConfigurationService.get().then(function(configuration) {
            vm.configuration = configuration;
        });
        OtaConfigurationService.getEnv().then(function(configuration) {
            vm.allConfiguration = configuration;
        });
    }
})();