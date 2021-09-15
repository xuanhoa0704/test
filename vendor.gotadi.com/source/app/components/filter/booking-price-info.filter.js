(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('bookingPriceInfo', bookingPriceInfo);

    bookingPriceInfo.$inject = ['$log', 'GlobalSrv'];

    function bookingPriceInfo($log, GlobalSrv) {
        return bookingPriceInfoFilter;

        /**
         *
         * @param input is bookingModel object
         * @param type can be: total_price | total_fare | total_tax | total_netprice | total_service_fee | luggage_price | discount
         * @param route default all | depart | return
         * @returns {number}
         */
        function bookingPriceInfoFilter(input, type, route) {
            var bookingModel = input;

            // $log.log("+++++>>>>> bookingPriceInfoFilter - input:" + input + " - type:" + type + " - route:" + route);
            // $log.log("input = " + JSON.stringify(input));

            if (bookingModel) {
                if (type == 'total_fare') {
                    return calTotalFare(bookingModel);

                } else if (type == 'total_tax') {
                    return calTotalTax(bookingModel);

                } else if (type == 'total_netprice') {
                    return calTotalNetPrice(bookingModel);

                } else if (type == 'total_service_fee') {
                    return calTotalServiceFee(bookingModel);

                } else if (type == 'luggage_price') {
                    return calLuggagePrice(bookingModel, route);

                } else if (type == 'discount') {
                    return calDiscountAmount(bookingModel);

                } else if (type == 'total_price') {
                    return calTotalPrice(bookingModel, route);
                } else if (type == 'meal_price') {
                    return calMealPrice(bookingModel, route);
                }
            }

            return 0;
        }

        /**
         *
         * @param bookingModel
         * @param route all | depart | return
         * @returns {number}
         */
        function calTotalPrice(bookingModel, route) {
            var result = 0;

            result = result + calTotalFare(bookingModel);
            result = result + calTotalTax(bookingModel);
            result = result + calTotalServiceFee(bookingModel);
            result = result + calLuggagePrice(bookingModel, route);
            result = result + calMealPrice(bookingModel, route);
            result = result - calDiscountAmount(bookingModel);

            return result;
        }

        /**
         *
         * @param bookingModel
         * @returns {number}
         */
        function calTotalFare(bookingModel) {
            if (bookingModel && bookingModel.bookingInfo && bookingModel.bookingInfo.displayPriceInfo) {
                return bookingModel.bookingInfo.displayPriceInfo.baseFare;
            }
            return 0;
        }

        /**
         *
         * @param bookingModel
         * @returns {number}
         */
        function calTotalTax(bookingModel) {
            var result = 0;
            if (bookingModel && bookingModel.bookingInfo && bookingModel.bookingInfo.displayPriceInfo) {

                result = result + bookingModel.bookingInfo.displayPriceInfo.serviceTax;

                //+++ disable distribute parent_markup value to Tax
                /*
                result = result + bookingModel.bookingInfo.displayPriceInfo.markupValue;

                result = result - bookingModel.bookingInfo.displayPriceInfo.agencyMarkupValue;
                */
                //---
            }
            return result;
        }

        /**
         *
         * @param bookingModel
         * @returns {number}
         */
        function calTotalNetPrice(bookingModel) {
            var result = 0;

            if (bookingModel && bookingModel.bookingInfo && bookingModel.bookingInfo.displayPriceInfo) {
                result = result + bookingModel.bookingInfo.displayPriceInfo.baseFare;

                result = result + bookingModel.bookingInfo.displayPriceInfo.serviceTax;

                //+++ disable distribute parent_markup value to Tax
                /*
                result = result + bookingModel.bookingInfo.displayPriceInfo.markupValue;

                result = result - bookingModel.bookingInfo.displayPriceInfo.agencyMarkupValue;
                */
                //---
            }

            return result;
        }

        /**
         *
         * @param bookingModel
         * @returns {number}
         */
        function calTotalServiceFee(bookingModel) {
            var result = 0;

            if (bookingModel && bookingModel.bookingInfo && bookingModel.bookingInfo.displayPriceInfo) {
                /*
                result = result + bookingModel.bookingInfo.displayPriceInfo.agencyMarkupValue;
                 */

                result = result + bookingModel.bookingInfo.displayPriceInfo.markupValue;

                result = result + bookingModel.bookingInfo.displayPriceInfo.paymentFee;
            }

            return result;
        }

        /**
         *
         * @param bookingModel
         * @returns {number}
         */
        function calDiscountAmount(bookingModel) {
            var result = 0;
            if (bookingModel) {
                if (bookingModel.voucher && bookingModel.voucher.discountAmount && bookingModel.voucher.discountAmount > 0) {
                    //+++ process for applying voucher
                    result = result + bookingModel.voucher.discountAmount;
                    //---
                } else {
                    if (bookingModel.bookingInfo && bookingModel.bookingInfo.displayPriceInfo) {
                        //+++ process for displaying applied discount info
                        result = result + bookingModel.bookingInfo.displayPriceInfo.discountAmount;
                        //---
                    }
                }
            }

            return result;
        }

        /**
         *
         * @param bookingModel
         * @param route default (all), depart, return
         * @returns {number}
         */
        function calLuggagePrice(bookingModel, route) {
            var result = 0;

            if (bookingModel) {
                if (bookingModel.bookingInfo && bookingModel.bookingInfo.travelerInfos && bookingModel.bookingInfo.travelerInfos.length > 0) {
                    //$log.log("calLuggagePrice -- having travelerInfos....");
                    //++++ process for view detail a booking
                    if ('return' == route || 'depart' == route) {
                        //+++ process traveler_infos
                        var direction = ('return' == route ? 'RETURN' : 'DEPARTURE');

                        angular.forEach(bookingModel.bookingInfo.travelerInfos, function(travelerInfo, key1) {
                            if (travelerInfo.serviceRequests) {
                                //+++ process service_requests
                                angular.forEach(travelerInfo.serviceRequests, function(serviceRequest, key2) {
                                    if (serviceRequest && serviceRequest.ssrAmount && serviceRequest.bookingDirection == direction) {
                                        if (serviceRequest.serviceType == 'BAGGAGE') {
                                            result = result + serviceRequest.ssrAmount;
                                        }
                                    }
                                });
                                //---
                            }
                        });

                        //---
                    } else {
                        //+++ process total_ssr
                        if (bookingModel.bookingInfo && bookingModel.bookingInfo.displayPriceInfo && bookingModel.bookingInfo.displayPriceInfo.totalSsrValue) {
                            angular.forEach(bookingModel.customers, function(customer) {
                                if (customer.departServiceRequests) {
                                    angular.forEach(customer.departServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'BAGGAGE') {
                                            result += ssr.amount;
                                        }
                                    });
                                }
                                if (customer.returnServiceRequests) {
                                    angular.forEach(customer.returnServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'BAGGAGE') {
                                            result += ssr.amount;
                                        }
                                    });
                                }
                            });
                        }
                        //---
                    }
                    //---
                } else {
                    //+++ process for searching and booking process
                    if (bookingModel.customers) {
                        //$log.log("calLuggagePrice -- having customers....");
                        angular.forEach(bookingModel.customers, function(customer) {
                            if ('depart' == route) {
                                if (customer.departServiceRequests) {
                                    angular.forEach(customer.departServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'BAGGAGE') {
                                            result += ssr.amount;
                                        }
                                    });
                                }

                            } else if ('return' == route) {
                                if (customer.returnServiceRequests) {
                                    angular.forEach(customer.returnServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'BAGGAGE') {
                                            result += ssr.amount;
                                        }
                                    });
                                }

                            } else {
                                if (customer.departServiceRequests) {
                                    angular.forEach(customer.departServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'BAGGAGE') {
                                            result += ssr.amount;
                                        }
                                    });
                                }

                                if (customer.returnServiceRequests) {
                                    angular.forEach(customer.returnServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'BAGGAGE') {
                                            result += ssr.amount;
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
            return result;
        }

        function calMealPrice(bookingModel, route) {
            var result = 0;

            if (bookingModel) {
                if (bookingModel.bookingInfo && bookingModel.bookingInfo.travelerInfos && bookingModel.bookingInfo.travelerInfos.length > 0) {
                    //$log.log("calLuggagePrice -- having travelerInfos....");
                    //++++ process for view detail a booking
                    if ('return' == route || 'depart' == route) {
                        //+++ process traveler_infos
                        var direction = ('return' == route ? 'RETURN' : 'DEPARTURE');

                        angular.forEach(bookingModel.bookingInfo.travelerInfos, function(travelerInfo, key1) {
                            if (travelerInfo.serviceRequests) {
                                //+++ process service_requests
                                angular.forEach(travelerInfo.serviceRequests, function(serviceRequest, key2) {

                                    if (serviceRequest && serviceRequest.ssrAmount && serviceRequest.bookingDirection == direction) {
                                        if (serviceRequest.serviceType == 'MEAL') {
                                            result = result + serviceRequest.ssrAmount;
                                        }
                                    }
                                });
                            }
                        });
                    } else {

                        if (bookingModel.bookingInfo && bookingModel.bookingInfo.displayPriceInfo && bookingModel.bookingInfo.displayPriceInfo.totalSsrValue) {
                            angular.forEach(bookingModel.customers, function(customer) {
                                if (customer.departServiceRequests) {
                                    angular.forEach(customer.departServiceRequests, function(ssr) {

                                        if (ssr.serviceType == 'MEAL') {
                                            result += ssr.amount;
                                        }
                                    });
                                }
                                if (customer.returnServiceRequests) {
                                    angular.forEach(customer.returnServiceRequests, function(ssr) {

                                        if (ssr.serviceType == 'MEAL') {
                                            result += ssr.amount;
                                        }
                                    });
                                }
                            });
                        }
                    }
                } else {
                    if (bookingModel.customers) {
                        angular.forEach(bookingModel.customers, function(customer) {
                            if ('depart' == route) {
                                if (customer.departServiceRequests) {
                                    angular.forEach(customer.departServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'MEAL') {
                                            result += ssr.amount;
                                        }
                                    });
                                }

                            } else if ('return' == route) {
                                if (customer.returnServiceRequests) {
                                    angular.forEach(customer.returnServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'MEAL') {
                                            result += ssr.amount;
                                        }
                                    });
                                }

                            } else {
                                if (customer.departServiceRequests) {
                                    angular.forEach(customer.departServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'MEAL') {
                                            result += ssr.amount;
                                        }
                                    });
                                }

                                if (customer.returnServiceRequests) {
                                    angular.forEach(customer.returnServiceRequests, function(ssr) {
                                        if (ssr.serviceType == 'MEAL') {
                                            result += ssr.amount;
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
            return result;
        }
    }
})();