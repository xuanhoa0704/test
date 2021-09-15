(function() {
    'use strict';

    gtdProfileDocInfoController.$inject = ['$log', '$scope', 'MetaData', 'GlobalSrv', 'DialogService', '$uibModal'];

    function gtdProfileDocInfoController($log, $scope, MetaData, GlobalSrv, DialogService, $uibModal) {
        var ctrl = this;

        ctrl.cardTypeLookups = [];
        ctrl.passportTypeLookups = [];

        ctrl.allCountries = GlobalSrv.getAllCountries();

        MetaData.searchLookups('air_member_card', '').then(function success(result) {
            ctrl.cardTypeLookups = result;
        });

        MetaData.searchLookups('ota_customer', 'passport_type').then(function success(result) {
            ctrl.passportTypeLookups = [];

            angular.forEach(result, function(item) {
                if (item.lookupValue == 'PP') {
                    ctrl.passportTypeLookups.push(item);
                }
            });
        });

        ctrl.edit = function() {
            ctrl.profileModel.mode = 'edit';
        };

        ctrl.addMoreCard = function(item) {

            ctrl.profileModel.editMemberCards.push({
                "cardType": '',
                "cardNumber": ''
            });

            return;

        };

        ctrl.removeCard = function(item) {

            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                backdrop: 'static',
                templateUrl: 'app/account/profile/profile.membercard.delete.html',
                controller: 'ProfileMemberCardDeleteController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    profileModel: function() {
                        return ctrl.profileModel;
                    },
                    item: function() {
                        return item;
                    }
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );

        };

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        ctrl.removeEditMemberCards = function(index) {
            ctrl.profileModel.editMemberCards.splice(index, 1);
        };
    }

    var gtdProfileDocInfo = {
        require: {
            form: '^^form'
        },
        templateUrl: 'app/components/profile/profile-doc-info.html',
        controller: gtdProfileDocInfoController,
        bindings: {
            profileModel: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdProfileDocInfo', gtdProfileDocInfo);

})();