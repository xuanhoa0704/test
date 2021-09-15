(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('luggageprice', luggageprice);

    luggageprice.$inject = ['$log', 'GlobalSrv'];

    function luggageprice($log, GlobalSrv) {
        return luggagepriceFilter;

        function luggagepriceFilter(input, type) {

            // type: default (all), depart, return

            var result = 0;
            var bookingModel = input;


            if (bookingModel && bookingModel.customers) {

                angular.forEach(bookingModel.customers, function(customer) {
                    if ('depart' == type) {
                        if (customer.departServiceRequests) {
                            angular.forEach(customer.departServiceRequests, function(ssr) {
                                result += ssr.amount;
                            });
                        }

                    } else if ('return' == type) {
                        if (customer.returnServiceRequests) {
                            angular.forEach(customer.returnServiceRequests, function(ssr) {
                                result += ssr.amount;
                            });
                        }

                    } else {
                        if (customer.departServiceRequests) {
                            angular.forEach(customer.departServiceRequests, function(ssr) {
                                result += ssr.amount;
                            });
                        }

                        if (customer.returnServiceRequests) {
                            angular.forEach(customer.returnServiceRequests, function(ssr) {
                                result += ssr.amount;
                            });
                        }

                        // if (customer.serviceRequests) {
                        //     angular.forEach(customer.serviceRequests, function (ssr) {
                        //         result += ssr.amount;
                        //     });
                        // }

                    }
                });

            }

            return result;
        }
    }
})();