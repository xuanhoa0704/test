(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider', 'TEMPLATE_URL'];

    function stateConfig($stateProvider, TEMPLATE_URL) {
        $stateProvider

            .state('user-profile-card-abstract', {
                abstract: true,
                data: {
                    authorities: ['ROLE_USER', 'ROLE_B2C']
                },
                parent: 'account'
            })
            .state('user-profile-traveller-abstract', {
                abstract: true,
                data: {
                    authorities: ['ROLE_USER', 'ROLE_B2C']
                },
                parent: 'account'
            })
            .state('user-profile-booking-abstract', {
                abstract: true,
                parent: 'account',
                data: {
                    authorities: ['ROLE_USER', 'ROLE_B2C']
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('password');
                        return $translate.refresh();
                    }]
                }
            })

            .state('user-profile', {
                parent: 'account',
                url: '/user-profile',
                data: {
                    authorities: ['ROLE_USER', 'ROLE_B2C']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/profile/profile.html',
                        controller: 'ProfileController',
                        controllerAs: 'vm'
                    }
                },
                params: {},
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('password');
                        return $translate.refresh();
                    }]
                }
            })

            // USER PROFILE CARDS
            .state('user-profile-card', {
                parent: 'user-profile-card-abstract',
                url: '/user-profile-card',
                data: {},
                views: {
                    'content@': {
                        templateUrl: 'app/account/profile/card/profile.card.html',
                        controller: 'ProfileCardController',
                        controllerAs: 'vm'
                    }
                },
                params: {},
                resolve: {}
            })

            .state('user-profile-card.new', {
                parent: 'user-profile-card-abstract',
                url: '/user-profile-card.new',
                data: {},
                views: {
                    'content@': {
                        templateUrl: 'app/account/profile/card/profile.card.new.html',
                        controller: 'ProfileCardNewController',
                        controllerAs: 'vm'
                    }
                },
                params: {},
                resolve: {}
            })

            // USER - PROFILE - TRAVELLER
            .state('user-profile-traveller', {
                parent: 'user-profile-traveller-abstract',
                url: '/user-profile-traveller',
                data: {},
                views: {
                    'content@': {
                        templateUrl: 'app/account/profile/traveller/profile.traveller.html',
                        controller: 'ProfileTravellerController',
                        controllerAs: 'vm'
                    }
                },
                params: {},
                resolve: {}
            })

            .state('user-profile-traveller.new', {
                parent: 'user-profile-traveller-abstract',
                url: '/user-profile-traveller.new',
                data: {},
                views: {
                    'content@': {
                        templateUrl: 'app/account/profile/traveller/profile.traveller.new.html',
                        controller: 'ProfileTravellerNewController',
                        controllerAs: 'vm'
                    }
                },
                params: {},
                resolve: {}
            })

            .state('user-profile-traveller/:traveller_id/:mode', {
                parent: 'user-profile-traveller-abstract',
                url: '/user-profile-traveller/:traveller_id/:mode',
                data: {},
                views: {
                    'content@': {
                        templateUrl: 'app/account/profile/traveller/profile.traveller.new.html',
                        controller: 'ProfileTravellerNewController',
                        controllerAs: 'vm'
                    }
                },
                params: {},
                resolve: {}
            })

            // USER- BOOKING
            .state('user-profile-booking', {
                parent: 'user-profile-booking-abstract',
                url: '/user-profile-booking',
                data: {},
                views: {
                    'content@': {
                        templateUrl: function() {
                            return templateNameByParams(TEMPLATE_URL, 'profile_booking');
                        },
                        // 'app/account/profile/booking/profile.booking.html',
                        controller: 'ProfileBookingController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    'tab': 'tab-a'
                },
                resolve: {}
            })

            .state('user-profile-booking-air/:booking_number/:mode', {
                parent: 'user-profile-booking-abstract',
                url: '/user-profile-booking-air/:booking_number/:mode',
                data: {},
                views: {
                    'content@': {
                        templateUrl: 'app/account/profile/booking/profile.booking.air.view.html',
                        controller: 'ProfileBookingAirViewController',
                        controllerAs: 'vm'
                    }
                },
                params: {},
                resolve: {}
            })

            .state('user-profile-booking-htl/:booking_number/:mode', {
                parent: 'user-profile-booking-abstract',
                url: '/user-profile-booking-htl/:booking_number/:mode',
                data: {},
                views: {
                    'content@': {
                        templateUrl: 'app/account/profile/booking/profile.booking.hotel.view.html',
                        controller: 'ProfileBookingHotelViewController',
                        controllerAs: 'vm'
                    }
                },
                params: {},
                resolve: {}
            });

    }

    function templateNameByParams(TEMPLATE_URL, type) {
        var param = String(Cookies.get('merchant_code')).toUpperCase();
        if (!TEMPLATE_URL[param] || !TEMPLATE_URL[param][type])
            return TEMPLATE_URL['DEFAULT'][type];
        return TEMPLATE_URL[param][type];
    }
})();