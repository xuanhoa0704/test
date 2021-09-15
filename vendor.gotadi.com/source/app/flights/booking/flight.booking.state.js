(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('booking-info/:booking_number/:params', {
                parent: 'flight',
                url: '/booking-info/:booking_number/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/flight.booking.info.html',
                        controller: 'FlightBookingInfoController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })

            .state('booking-confirm/:booking_number/:params', {
                parent: 'flight',
                url: '/booking-confirm/:booking_number/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/flight.booking.confirm.html',
                        controller: 'FlightBookingConfirmController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })

            .state('booking-payment/:booking_number/:params', {
                parent: 'flight',
                url: '/booking-payment/:booking_number/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/flight.booking.payment.html',
                        controller: 'FlightBookingPaymentController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })

            .state('booking-result/:booking_number/:params', {
                parent: 'flight',
                url: '/booking-result/:booking_number/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/flight.booking.result.html',
                        controller: 'FlightBookingResultController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined,
                    "profileBooking": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })

            .state('booking-result/:booking_number/:is_mobile/:params', {
                parent: 'flight',
                url: '/booking-result/:booking_number/:is_mobile/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/flight.booking.result.html',
                        controller: 'FlightBookingResultController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined,
                    "profileBooking": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })
            .state('mobile-booking-result?:booking_status&:payment_status&:issue_status', {
                url: '/mobile-booking-result?:booking_status&:payment_status&:issue_status'
            })
            .state('external-booking-result', {
                url: '/products/external-booking-result?billcode:cust_msisdn:error_code:merchant_code:order_id:payment_status:trans_amount:vt_transaction_id:check_sum',
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/external.booking.result.html',
                        controller: 'ExternalBookingResultController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    authorities: [],
                    pageTitle: 'GOTADI Template'
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }],
                    partnerID: function() {
                        return "VIETTEL";
                    }
                }
            })
            .state('external-booking-detail', {
                url: '/products/external-final-booking-detail?booking_number:partner_id:back_url:error_code',
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/external.booking.result.html',
                        controller: 'ExternalBookingResultController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    authorities: [],
                    pageTitle: 'GOTADI Template'
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }],
                    partnerID: function() {
                        return "VIETTEL";
                    }
                }
            })
            .state('external-booking-detail/:booking_number/:partner_id', {
                url: '/products/external-final-booking-detail/:booking_number/:partner_id',
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/external.booking.result.html',
                        controller: 'ExternalBookingResultController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    authorities: [],
                    pageTitle: 'GOTADI Template'
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }],
                    partnerID: function() {
                        return "VIETTEL";
                    }
                }
            })
            .state('external-booking-payment?:bookingNumber&:partner_id&:backUrl:data:key:agent_site', {
                url: '/external-booking-payment?:bookingNumber&:partner_id&:backUrl:data:key:agent_site',
                views: {
                    'content@': {
                        templateUrl: 'app/flights/booking/external.payment.html',
                        controller: 'BookingPaymentExternalController',
                        controllerAs: 'vm'
                    }
                },
                data: {
                    authorities: [],
                    pageTitle: 'Booking Payment'
                },

            });
    }

})();