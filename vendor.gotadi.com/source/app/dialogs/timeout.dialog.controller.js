(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('TimeoutDialogController', TimeoutDialogController);

    TimeoutDialogController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModalInstance', 'error', 'DataService'];

    function TimeoutDialogController($log, $rootScope, $scope, $state, $timeout, $uibModalInstance, error, DataService) {
        var vm = this;

        vm.error = error;

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
            // $state.go('flight-search-home');

            // $state.go('flight-search', {"searchOptions": vm.searchOptions, "searchResult": vm.searchResult});

            var searchOptions = DataService.getSavedSearchOption();
            // $state.go('flight-search', {'init': true, reload: true, "searchOptions": searchOptions});
            $state.go('flight-search', {
                "searchOptions": searchOptions
            }, {
                reload: true
            });

            $timeout(function() {
                $rootScope.$broadcast("gtd-reinit-search", null);
            }, 1000);

        };

    }
})();