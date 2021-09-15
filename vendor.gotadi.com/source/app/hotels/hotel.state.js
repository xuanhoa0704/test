(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('hotel', {
                abstract: true,
                parent: 'app',

                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('hotel');
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }]
                }
            })

            .state('hotel-booking-terms', {
                parent: 'app',
                url: '/hotel-booking-terms',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/home/hotel-booking-terms.html',
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
            });
    }

})();