(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('hotel-detail/:hotel_id/:params', {
                parent: 'hotel',
                url: '/hotel-detail/:hotel_id/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/hotels/details/hotel.detail.html',
                        controller: 'HotelDetailController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {}
            });

    }

})();