(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider', 'TEMPLATE_URL'];

    function templateNameByParams(TEMPLATE_URL) {
        var merchant_code = String(Cookies.get('merchant_code')).toUpperCase();

        if (!TEMPLATE_URL[merchant_code] || !TEMPLATE_URL[merchant_code].home)
            return TEMPLATE_URL['DEFAULT'].home;
        return TEMPLATE_URL[merchant_code].home;
    }

    function stateConfig($stateProvider, TEMPLATE_URL) {
        $stateProvider.state('home', {
                parent: 'app',
                url: '/',
                data: {
                    authorities: [],
                    pageTitle: 'GOTADI Template'
                },
                params: {
                    merchant_code: null,
                    msisdn: null
                },
                views: {
                    'content@': {
                        templateUrl: function() {
                            return templateNameByParams(TEMPLATE_URL);
                        },
                        // templateUrl: 'app/home/home.html',
                        controller: 'B2B2CHomeController',
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
            .state('error-partner', {
                url: '/error-partner',
                data: {
                    authorities: [],
                    pageTitle: 'Opps...! Something went wrong.'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/home/error-partner.html',
                    }
                }
            });
    }
})();