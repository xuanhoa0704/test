(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('inventory', {
                parent: 'hotel',
                url: '/inventory',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/hotels/Inventory/hotel.inventory.html',
                        controller: 'HotelInventoryController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hotel');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }]
                }
            });
    }

})();