(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileMemberCardDeleteController', ProfileMemberCardDeleteController);

    ProfileMemberCardDeleteController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModalInstance', 'CustomerService', 'DialogService', 'profileModel', 'item'];

    function ProfileMemberCardDeleteController($log, $rootScope, $scope, $state, $timeout, $uibModalInstance, CustomerService, DialogService, profileModel, item) {
        var vm = this;

        vm.profileModel = profileModel;

        // vm.profileModel = {};
        // // 'view', 'edit'
        // var defaultMode = 'view';
        //
        // vm.profileModel.cardMode = defaultMode;
        //
        // vm.cardNumbers = '';
        //
        // angular.forEach($scope.creditCards, function (item, value) {
        //     if (item.checked) {
        //         vm.cardNumbers += item.cardNumber + ", ";
        //     }
        // });
        //
        // if (vm.cardNumbers.endsWith(', ')) {
        //     vm.cardNumbers = vm.cardNumbers.substr(0, vm.cardNumbers.length - 2)
        // }

        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        vm.submit = function() {
            // var ids = [];
            // var ids = '';
            // // console.log("$scope.creditCards = " + JSON.stringify($scope.creditCards));
            // angular.forEach($scope.creditCards, function (item, value) {
            //     if (item.checked) {
            //         // ids.push(item.id);
            //         ids += item.id + ":";
            //     }
            // });
            //
            // CustomerService.deleteCreditCards(ids).then(function (result) {
            //     //$uibModalInstance.dismiss('cancel');
            //     $state.go('user-profile-card', {}, {reload: true});
            // }, function error(result) {
            //     $uibModalInstance.dismiss('cancel');
            //     DialogService.openHttpAlertDilalog(result);
            // });

            var curItem;
            for (var i = 0; i < vm.profileModel.memberCards.length; i++) {
                curItem = vm.profileModel.memberCards[i];
                if (
                    item.cardType == curItem.cardType &&
                    item.cardNumber == curItem.cardNumber
                ) {
                    vm.profileModel.memberCards.splice(i, 1);
                }
            }

            $uibModalInstance.dismiss('cancel');

        };

    }
})();