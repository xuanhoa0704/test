(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider', 'TEMPLATE_URL'];

    function templateNameByParams(TEMPLATE_URL) {
        var merchant_code = String(Cookies.get('merchant_code')).toUpperCase();
        if (!TEMPLATE_URL[merchant_code] || !TEMPLATE_URL[merchant_code].hotel_search)
            return TEMPLATE_URL['DEFAULT'].hotel_search;
        return TEMPLATE_URL[merchant_code].hotel_search;
    }

    function stateConfig($stateProvider, TEMPLATE_URL) {
        $stateProvider
            .state('hotel-search-home', {
                parent: 'hotel',
                url: '/hotel',
                data: {
                    //authorities: ['ROLE_USER']
                    merchant_code: null,
                    msisdn: null
                },
                views: {
                    'content@': {
                        templateUrl: function() {
                            return templateNameByParams(TEMPLATE_URL, 'hotel_search');
                        },
                        // 'app/hotels/search/hotel.search.home.html',
                        controller: 'HotelSearchHomeController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {}
            })

            .state('hotel-search', {
                parent: 'hotel',
                url: '/hotel-search?params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/hotels/search/hotel.search.html',
                        controller: 'HotelSearchController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined,
                    "init": undefined,
                    "searchCompleted": undefined,
                    "filterCompleted": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hotel');
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }]
                }
            });

    }

})();