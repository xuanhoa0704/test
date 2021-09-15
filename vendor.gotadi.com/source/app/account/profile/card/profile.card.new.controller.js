(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileCardNewController', ProfileCardNewController);

    ProfileCardNewController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModal', 'CustomerService', 'DialogService', 'GlobalSrv', 'DataService', 'MetaData'];

    function ProfileCardNewController($log, $rootScope, $scope, $state, $timeout, $uibModal, CustomerService, DialogService, GlobalSrv, DataService, MetaData) {
        var vm = this;

        vm.profileModel = {};
        // 'view', 'edit'
        var defaultMode = 'view';

        var currentTime = new Date();

        vm.currentMonth = currentTime.getMonth() + 1;
        vm.currentYear = currentTime.getFullYear();
        vm.maxYear = vm.currentYear + 20;

        vm.allCountries = GlobalSrv.getAllCountries();
        if (vm.allCountries == [] || vm.allCountries.length == 0) {
            MetaData.getCountries().then(function success(result) {
                vm.allCountries = result;
            });
        }

        vm.cardModel = {};

        vm.profileModel.cardMode = defaultMode;
        vm.profileModel.paToken = null;

        $scope.$on('DoPaymentWith3DAuthConfirmation', function(event, item) {
            $log.log("DoPaymentWith3DAuth - " + item);
            vm.profileModel.paToken = item;

            vm.doCreateCreditCards();
        });

        /**
         *
         */
        vm.doCreateCreditCards = function() {
            vm.cardModel.type = $scope.cardForm.cardNumber.$ccType ? $scope.cardForm.cardNumber.$ccType.toUpperCase() : "OTHER";
            CustomerService.createCreditCards(vm.cardModel, vm.profileModel.paToken)
                .then(function success(result) {
                    if (result.authReq && result.authReq.acsUrl) {
                        $log.log(result.authReq.acsUrl);
                        vm.open3DAuth(
                            result.authReq.acsUrl, result.authReq.paReq, result.authReq.mdxId, result.authReq.termUrl
                        );

                    } else {
                        //reset payment_auth token
                        vm.profileModel.paToken = null;

                        if (result.success) {
                            $state.go('user-profile-card');
                        } else {
                            DialogService.openHttpAlertDilalog(result);
                        }
                    }

                }, function error(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
        };

        /**
         *
         */
        vm.cancel = function() {
            $state.go('user-profile-card');
        };


        /**
         *
         * @param cardForm
         * @returns {boolean}
         */
        vm.save = function(cardForm) {

            if (!cardForm.$valid) {
                angular.element("[name='" + cardForm.$name + "']").find('.ng-invalid:visible:first').focus();
                return false;
            } else {
                vm.doCreateCreditCards();
            }

        };

        /**
         * Define dialog instances
         */
        var modal3DAuthInstance = null;
        var reset3DAuthModal = function() {
            modal3DAuthInstance = null;
        };

        /**
         * Open 3D Authentication for CREDIT payment option
         *
         * @param url
         * @param paReq
         * @param md
         * @param termUrl
         */
        vm.open3DAuth = function(url, paReq, md, termUrl) {
            if (modal3DAuthInstance !== null) return;
            modal3DAuthInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/flights/payment/flight.payment.3d.auth.external.html',
                controller: 'FlightPayment3DAuthExternalController',
                controllerAs: 'vm',
                windowClass: 'modal-window-extension',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    paymentUrl: function() {
                        return url;
                    },
                    paReq: function() {
                        return paReq;
                    },
                    md: function() {
                        return md;
                    },
                    termUrl: function() {
                        return termUrl;
                    }
                }
            });
            modal3DAuthInstance.result.then(
                reset3DAuthModal,
                reset3DAuthModal
            );
        };
    }
})();