(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('ota-health', {
            parent: 'admin',
            url: '/health',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'health.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/health/health.html',
                    controller: 'OtaHealthCheckController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('health');
                    return $translate.refresh();
                }]
            }
        });
    }
})();