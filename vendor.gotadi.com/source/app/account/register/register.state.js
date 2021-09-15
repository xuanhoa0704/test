(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        $stateProvider
            .state('register', {
                parent: 'account',
                url: '/register',
                data: {
                    authorities: [],
                    pageTitle: 'register.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/register/register.html',
                        controller: 'RegisterController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('register');
                        return $translate.refresh();
                    }]
                },


                onEnter: ['$stateParams', '$state', '$uibModal',
                    function($stateParams, $state, $uibModal) {
                        alert(modalInstance !== null);
                        if (modalInstance !== null) return;
                        modalInstance = $uibModal.open({
                            animation: true,
                            templateUrl: 'app/account/register/register.html',
                            controller: 'RegisterController',
                            controllerAs: 'vm',
                            windowClass: 'login-modal-window'
                        });
                        modalInstance.result.then(
                            resetModal,
                            resetModal
                        );
                        modalInstance.result['finally'](function() {
                            modalInstance = null;
                            if ($state.$current.name === stateName) {
                                $state.go('^');
                            }
                        });
                    }
                ],
                onExit: function() {
                    if (modalInstance) {
                        modalInstance.close();
                    }
                }
            })

            .state('terms', {
                parent: 'app',
                url: '/terms',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/home/terms.html',
                        controller: 'BlankController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('hotel');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })

        ;
    }
})();