(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('ota-tracker', {
            parent: 'admin',
            url: '/tracker',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'tracker.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/admin/tracker/tracker.html',
                    controller: 'OtaTrackerController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('tracker');
                    return $translate.refresh();
                }]
            },
            onEnter: ['OtaTrackerService', function(OtaTrackerService) {
                /* OtaTrackerService.subscribe(); */
            }],
            onExit: ['OtaTrackerService', function(OtaTrackerService) {
                /* OtaTrackerService.unsubscribe(); */
            }]
        });
    }
})();