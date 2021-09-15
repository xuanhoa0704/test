(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider

            .state('hotel-booking/:booking_number/:params', {
                parent: 'hotel',
                url: '/hotel-booking/:booking_number/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/hotels/booking/hotel.booking.html',
                        controller: 'HotelBookingController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined,
                    "hotelId": undefined
                },
                resolve: {}
            })

            .state('hotel-booking-result/:booking_number/:params', {
                parent: 'flight',
                url: '/hotel-booking-result/:booking_number/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/hotels/booking/hotel.booking.result.html',
                        controller: 'HotelBookingResultController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {}
            })

            .state('hotel-booking-result/:booking_number/:is_mobile/:params', {
                parent: 'flight',
                url: '/hotel-booking-result/:booking_number/:is_mobile/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/hotels/booking/hotel.booking.result.html',
                        controller: 'HotelBookingResultController',
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