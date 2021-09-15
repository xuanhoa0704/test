(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('password', {
            parent: 'account',
            url: '/password',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'global.menu.account.password'
            },
            views: {
                'content@': {
                    templateUrl: 'app/account/password/password.html',
                    controller: 'PasswordController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                PreviousState: [
                    "$state",
                    function($state) {
                        var currentStateData = {
                            Name: $state.current.name,
                            Params: $state.params,
                            URL: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('password');
                    return $translate.refresh();
                }]
            }
        });
    }
})();