(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider', 'TEMPLATE_URL'];

    function templateNameByParams(TEMPLATE_URL, type) {
        var merchant_code = Cookies.get("merchant_code");
        if (!TEMPLATE_URL[merchant_code] || !TEMPLATE_URL[merchant_code][type]) {
            return TEMPLATE_URL['DEFAULT'][type];
        }
        return TEMPLATE_URL[merchant_code][type];
    }

    function stateConfig($stateProvider, TEMPLATE_URL) {
        $stateProvider
            .state('flight-search-home', {
                parent: 'app',
                url: '/flight',
                data: {
                    //authorities: ['ROLE_USER']
                    merchant_code: null,
                    msisdn: null
                },
                views: {
                    'content@': {
                        templateUrl: function() {
                            return templateNameByParams(TEMPLATE_URL, 'flight_search');
                        },
                        // 'app/flights/search/flight.search.home.html',
                        controller: 'FlightSearchHomeController',
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

            .state('flight-search', {
                parent: 'flight',
                url: '/flight-search?params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/flights/search/flight.search.html',
                        controller: 'FlightSearchController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined,
                    "init": undefined,
                    "searchCompleted": undefined,
                    "filterCompleted": 'Airline'
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