(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];


    function stateConfig($stateProvider) {

        $stateProvider.state('default', {
            parent: 'app',
            url: '/',
            data: {
                authorities: [],
                pageTitle: 'GOTADI Template'
            },
            // templateUrl: 'app/home/home.html',
            // controller: 'HomeController',
            // controllerAs: 'vm'
            views: {
                'content@': {
                    templateUrl: 'app/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm'
                }
            },
            // templateUrl: 'app/home/home.html',
            // controller: 'HomeController',
            // controllerAs: 'vm',
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    $translatePartialLoader.addPart('flight');
                    $translatePartialLoader.addPart('hotel');
                    return $translate.refresh();
                }]
            }
        });

        // $stateProvider.state('blank', {
        //     parent: 'app',
        //     url: '/',
        //     data: {
        //         authorities: [],
        //         pageTitle: 'BLANK PAGE TITLE'
        //     },
        //     // templateUrl: 'app/home/home.html',
        //     // controller: 'HomeController',
        //     // controllerAs: 'vm'
        //     views: {
        //         'content@': {
        //             templateUrl: 'app/blank/blank.html',
        //             controller: 'BlankController',
        //             controllerAs: 'vm'
        //         }
        //     },
        //     // templateUrl: 'app/home/home.html',
        //     // controller: 'HomeController',
        //     // controllerAs: 'vm',
        //     resolve: {
        //         mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
        //             $translatePartialLoader.addPart('home');
        //             return $translate.refresh();
        //         }]
        //     }
        // });
    }
})();