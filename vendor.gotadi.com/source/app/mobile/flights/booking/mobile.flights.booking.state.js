(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function controllerNameByParams($stateParams) {
        // naive example of dynamic controller name mining
        // from incoming state params

        var controller = "MobileVNPayQRController";

        if ($stateParams.payment_method === "VNPAYQR") {
            console.log("Redirect to MobileVNPayQRController controller.")
            return "MobileVNPayQRController";
        }

        if ($stateParams.payment_method === "ATM_DEBIT") {
            if ($stateParams.params === "FLIGHT") {
                console.log("Redirect to FlightBookingPaymentController controller.")
                return "FlightBookingPaymentController";
            }
            if ($stateParams.params === "HOTEL") {
                console.log("Redirect to HotelBookingController controller.")
                return "HotelBookingController";
            }
        }

        return controller;
    }

    function templateNameByParams($stateParams) {
        if ($stateParams.payment_method === "VNPAYQR") {
            console.log("Loading mobile.qr.booking.payment template.")
            return "app/mobile/flights/booking/mobile.qr.booking.payment.html";
        }
        if ($stateParams.payment_method === "ATM_DEBIT") {
            if ($stateParams.params === "FLIGHT") {
                console.log("Loading mobile.flights.booking.payment.html template.")
                return "app/mobile/flights/booking/mobile.flights.booking.payment.html";
            }
            if ($stateParams.params === "HOTEL") {
                console.log("Loading mobile.hotels.booking.payment.html template.")
                return "app/mobile/flights/booking/mobile.hotels.booking.payment.html";
            }
        }
    }

    function stateConfig($stateProvider) {
        $stateProvider
            .state('mobile-booking-payment/:booking_number/:is_mobile/:payment_method/:params', {
                url: '/mobile-booking-payment/:booking_number/:is_mobile/:payment_method/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        // templateUrl: 'app/mobile/flights/booking/mobile.flights.booking.payment.html',
                        // controller: 'MobileVNPayQRController',
                        templateUrl: function($stateParams) {
                            return templateNameByParams($stateParams)
                        },
                        controllerProvider: function($stateParams) {
                            var controllerName = controllerNameByParams($stateParams);
                            return controllerName;
                        },
                        controllerAs: 'vm',

                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })
            .state('mobile-booking-payment/credit-3d/:booking_number/:acs_url/:pa_req/:md/:term_url/:params', {
                url: '/mobile-booking-payment/credit-3d/:booking_number/:acs_url/:pa_req/:md/:term_url/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/mobile/flights/booking/mobile.flights.booking.payment.3d.auth.external.html',
                        controller: 'MobileFlightsBookingPayment3DAuthExternalController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })
            .state('mobile-booking-payment/credit-3d?:pa_res', {
                url: '/mobile-booking-payment/credit-3d?:pa_res'
            })
            .state('payment-vnpay-qr/:booking_number/:params', {
                url: '/payment-vnpay-qr/:booking_number/:params',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/mobile/flights/booking/vnpay.qr.payment.html',
                        controller: 'VNPayQRPaymentController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            })
            .state('vnpay-complete-mobile/:booking_number/:bookingStatus/:paymentStatus/:issuedStatus', {
                url: '/vnpay-complete-mobile/:booking_number/:bookingStatus/:paymentStatus/:issuedStatus',
                data: {
                    //authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/mobile/flights/booking/mobile.booking.result.html',
                        controller: 'MobileVNPayQRSuccessController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    "searchOptions": undefined,
                    "searchResult": undefined
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('home');
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('lookup');
                        return $translate.refresh();
                    }]
                }
            });
    }
})();