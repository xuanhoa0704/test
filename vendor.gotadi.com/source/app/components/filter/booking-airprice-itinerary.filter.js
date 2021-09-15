(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('bookingAirPricedItinerary', bookingAirPricedItinerary);

    bookingAirPricedItinerary.$inject = ['$log', 'GlobalSrv'];

    function bookingAirPricedItinerary($log, GlobalSrv) {
        return bookingAirPricedItineraryFilter;

        /**
         *
         * @param input is pricedItinerary object
         * @param type can be: adult | child | infant
         * @param attr can be:  fare | tax | netprice | quantities
         * @returns {number}
         */
        function bookingAirPricedItineraryFilter(input, type, attr) {
            var result = 0;

            var pricedItinerary = input;
            var fareBreakdown = null;

            // $log.log("+++++>>>>> bookingAirPricedItineraryFilter - input:" + input + " - type:" + type + " - attr:" + attr);

            /*
             * The specifies the ADT-Adult | CHD-Child |  INF-Infant passenger fare breakdown
             */
            if (pricedItinerary && pricedItinerary.airItineraryPricingInfo) {
                if (type == 'adult') {
                    fareBreakdown = pricedItinerary.airItineraryPricingInfo.adultFare;
                } else if (type == 'child') {
                    fareBreakdown = pricedItinerary.airItineraryPricingInfo.childFare;
                } else if (type == 'infant') {
                    fareBreakdown = pricedItinerary.airItineraryPricingInfo.infantFare;
                }
            }

            if (fareBreakdown) {
                var objFare = fareBreakdown.passengerFare;
                var objQuantities = fareBreakdown.passengerTypeQuantities;

                if (attr == 'fare') {
                    result = result + calPassengerFare(objFare);

                    return result;

                } else if (attr == 'tax') {
                    result = result + calPassengerTax(type, objFare, pricedItinerary.displayPriceInfo);

                    return result;

                } else if (attr == 'netprice') {
                    result = result + calPassengerFare(objFare);

                    result = result + calPassengerTax(type, objFare, pricedItinerary.displayPriceInfo);

                    var qtt = calPassengerQuantities(objQuantities);

                    return result * (qtt == 0 ? 1 : qtt);

                } else if (attr == 'quantities') {
                    result = result + calPassengerQuantities(objQuantities);


                    return result;
                }
            }

            return result;
        }

        /**
         *
         * @param passengerFare
         * @returns {number}
         */
        function calPassengerFare(passengerFare) {
            var result = 0;
            var objFare = passengerFare;

            if (objFare && objFare.baseFare && objFare.baseFare.amount) {
                result = result + objFare.baseFare.amount;

            } else if (objFare && objFare.baseFair && objFare.baseFair.amount) {
                //+++ back compliant
                result = result + objFare.baseFair.amount;
                //---
            }
            return result;
        }


        /**
         *
         * @param passengerFare
         * @param displayPriceInfo
         * @returns {number}
         */
        function calPassengerTax(audutType, passengerFare, displayPriceInfo) {
            var result = 0;
            var objFare = passengerFare;

            if (objFare && objFare.serviceTax && objFare.serviceTax.amount) {
                result = result + objFare.serviceTax.amount;
            }

            //+++ disable distribute parent_markup value to Tax
            /*
            if(audutType != 'infant' && displayPriceInfo && displayPriceInfo.additionalTaxPerTraveler) {
                result = result + displayPriceInfo.additionalTaxPerTraveler;
            }
            */
            //---

            return result;
        }

        /**
         *
         * @param quantities
         * @returns {number}
         */
        function calPassengerQuantities(quantities) {
            var result = 0;
            if (quantities && quantities.quantity) {
                result = result + quantities.quantity;
            }
            return result;
        }

    }
})();