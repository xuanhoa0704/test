(function() {
    'use strict';
    angular
        .module('B2B2CGatewayApp')
        .factory('Flight', Flight);

    Flight.$inject = ['$log', '$rootScope', '$q', '$resource', '$http', '$timeout', 'RequestUtils', 'GlobalSrv', 'DataService', 'PricingUtils',
        'TICKET_SRV_BASE_URL',
        'DEFAULT_PAGE_SIZE',
        'TICKET_SEARCH_URL',
        'TICKET_SEARCH_INTERNATIONAL_URL',
        'TICKET_SEARCH_CACHE_URL',
        'TICKET_GET_FILTER_OPTIONS_URL',
        'TICKET_GET_GROUP_DETAIL_URL',
        'TICKET_AIR_REVALIDATE_URL',
        'TICKET_CREATE_DRAFT_BOOKING_URL',
        'TICKET_UPDATE_BOOKING_TAGS_URL',
        'TICKET_CHANGE_DRAFT_BOOKING_OWNER_URL',
        'TICKET_ADD_TRAVELLER_URL',
        'TICKET_PAYMENT_BOOKING_URL',
        'TICKET_ORDER_TICKET_URL',
        'TICKET_GET_FARE_RULES_URL',
        'TICKET_AIR_GET_SSR_URL',
        'PAYMENT_PAYMENT_BOOKING_URL',
        'PAYMENT_FEE_OPTIONS_URL',
        'PAYMENT_PROMO_DISCOUNT_URL',
        'PAYMENT_PROMO_OPTIONS_URL',
        'PRICING_VOUCHER_VALIDATE_URL',
        'PRICING_VOUCHER_REDEEM_URL',
        'PRICING_PROMO_REDEEM_URL',
        'PRICING_PROMO_VOID_URL',
        'TIKI_ORDER_URL',
        'VIETTEL_URL',
        'LIENVIET_URL',
        'SEA_URL',
        '$cookies',
        '$window',
        'DialogService',
        'API_URL',
        'API_URL_CALLBACK'
    ];

    function Flight($log, $rootScope, $q, $resource, $http, $timeout, RequestUtils, GlobalSrv, DataService, PricingUtils,
        TICKET_SRV_BASE_URL,
        DEFAULT_PAGE_SIZE,
        TICKET_SEARCH_URL,
        TICKET_SEARCH_INTERNATIONAL_URL,
        TICKET_SEARCH_CACHE_URL,
        TICKET_GET_FILTER_OPTIONS_URL,
        TICKET_GET_GROUP_DETAIL_URL,
        TICKET_AIR_REVALIDATE_URL,
        TICKET_CREATE_DRAFT_BOOKING_URL,
        TICKET_UPDATE_BOOKING_TAGS_URL,
        TICKET_CHANGE_DRAFT_BOOKING_OWNER_URL,
        TICKET_ADD_TRAVELLER_URL,
        TICKET_PAYMENT_BOOKING_URL,
        TICKET_ORDER_TICKET_URL,
        TICKET_GET_FARE_RULES_URL,
        TICKET_AIR_GET_SSR_URL,
        PAYMENT_PAYMENT_BOOKING_URL,
        PAYMENT_FEE_OPTIONS_URL,
        PAYMENT_PROMO_DISCOUNT_URL,
        PAYMENT_PROMO_OPTIONS_URL,
        PRICING_VOUCHER_VALIDATE_URL,
        PRICING_VOUCHER_REDEEM_URL,
        PRICING_PROMO_REDEEM_URL,
        PRICING_PROMO_VOID_URL,
        TIKI_ORDER_URL,
        VIETTEL_URL,
        LIENVIET_URL,
        SEA_URL,
        $cookies,
        $window,
        DialogService,
        API_URL,
        API_URL_CALLBACK
    ) {

        var service = {
            searchFlight: searchFlight,
            searchFlightInternational: searchFlightInternational

                ,
            searchFlightInCache: searchFlightInCache,
            searchGroupDetail: searchGroupDetail

                ,
            getFareRules: getFareRules

                ,
            getDateAvailableOptions: getDateAvailableOptions,
            getAirlineAvailableOptions: getAirlineAvailableOptions,
            getTransitAvailableOptions: getTransitAvailableOptions,
            getTimeAvailableOptions: getTimeAvailableOptions,
            getClassAvailableOptions: getClassAvailableOptions,
            getClassInterAvailableOptions: getClassInterAvailableOptions,
            getTicketPolicyOptions: getTicketPolicyOptions,
            getTicketSsr: getTicketSsr

                ,
            getAdvanceFilterOptions: getAdvanceFilterOptions

                ,
            revalidateTicket: revalidateTicket,
            createDraftBooking: createDraftBooking,
            updateBookingTags: updateBookingTags,
            changeDraftBookingOwner: changeDraftBookingOwner,
            addTicketTravellers: addTicketTravellers,
            paymentBooking: paymentBooking,
            orderTickets: orderTickets

                ,
            getPopularPlaces: getPopularPlaces,
            getPopularFlights: getPopularFlights,
            getPopularHotels: getPopularHotels

                ,
            gPaymentFeeOpt: gPaymentFeeOpt,
            gPaymentPromoDiscount: gPaymentPromoDiscount,
            validatePromo: validatePromo,
            redeemPromo: redeemPromo,
            voidPromo: voidPromo,
            gPaymentPromotion: gPaymentPromotion,
            gPaymentBooking: gPaymentBooking

                ,
            validateVoucher: validateVoucher,
            redeemVoucher: redeemVoucher,
            flightBookingOTPService: flightBookingOTPService,
            createOrderTiki: createOrderTiki,
            getViettelPaymentURL: getViettelPaymentURL,
            externalPayment: externalPayment,
            lienVietPayment: lienVietPayment
        };

        /**
         *
         * @param options
         */
        function searchFlight(options) {
            var paras = {
                'page': options.page ? options.page : 0,
                'size': options.size ? options.size : DEFAULT_PAGE_SIZE,
                // 'origin_code': options.fromAirPort ? 'HAN' : 'HAN',
                // 'destination_code': options.toAirPort ? 'SGN' : 'SGN',
                'origin_code': options.fromAirPort,
                'destination_code': options.toAirPort,
                // 'departure_date': options.departureDate,
                // 'returnture_date': options.returnDate ? options.returnDate : options.departureDate,
                'departure_date': moment(options.departureDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                //'returnture_date': options.returnDate ? moment(options.returnDate).format('MM-DD-YYYY') : moment(options.departureDate).format('MM-DD-YYYY'),
                'returnture_date': moment(options.returnDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                'cabin_class': 'E',
                'route_type': options.searchType == 'oneway' ? 'ONEWAY' : 'ROUNDTRIP',
                // 'route_type': 'ONEWAY',
                'aduts_qtt': options.adultNo ? options.adultNo : 1,
                'children_qtt': options.childrenNo ? options.childrenNo : 0,
                'infants_qtt': options.newBornNo ? options.newBornNo : 0,
                'suppliers': options.suppliers ? options.suppliers : ['VJ', 'BL', 'VN', 'QH'],
                'time': +new Date(),
                'key': ""
            };

            var strInput = paras.origin_code + paras.destination_code + paras.departure_date + paras.returnture_date + paras.cabin_class + paras.route_type +
                paras.aduts_qtt + paras.children_qtt + paras.infants_qtt + paras.page + paras.size + paras.time;

            var hashMac = CryptoJS.HmacSHA256(strInput, "Gotadi").toString(CryptoJS.enc.Base64);

            paras.key = hashMac;

            // $log.log("++++++++++++++++++++++++++++");
            // $log.log("Search criteria searchFlight:");
            // //$log.log("paras=" + JSON.stringify(paras));
            // $log.log("paras=" + paras);
            // $log.log("++++++++++++++++++++++++++++");

            return $http({
                method: 'GET',
                url: API_URL + TICKET_SEARCH_URL,
                params: paras
            }).then(function successCallback(response) {
                $log.log('successCallback searchFlight');
                $log.log(response);
                $timeout(function() {
                    $rootScope.$broadcast('event-flight-seach-completed');
                });
                //$rootScope.$broadcast('event-flight-seach-completed');
                return response.data;
            }, function errorCallback(response) {
                $log.log('errorCallback searchFlight');
                $log.log(response);
                $timeout(function() {
                    $rootScope.$broadcast('event-flight-seach-completed');
                });
                return $q.reject(response);
                //return response.data;
            });
        }

        /**
         *
         * @param options
         */
        function searchFlightInternational(options) {
            var paras = {
                'page': options.page ? options.page : 0,
                'size': options.size ? options.size : DEFAULT_PAGE_SIZE,
                // 'origin_code': options.fromAirPort ? 'HAN' : 'HAN',
                // 'destination_code': options.toAirPort ? 'SGN' : 'SGN',
                'origin_code': options.fromAirPort ? options.fromAirPort : 'HAN',
                'destination_code': options.toAirPort ? options.toAirPort : 'SGN',
                'departure_date': moment(options.departureDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                'returnture_date': moment(options.returnDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                // 'departure_date': '05-05-2017',
                // 'returnture_date': '06-06-2017',
                'cabin_class': 'E',
                'route_type': options.searchType == 'oneway' ? 'ONEWAY' : 'ROUNDTRIP',
                // 'route_type': 'ONEWAY',
                'aduts_qtt': options.adultNo ? options.adultNo : 1,
                'children_qtt': options.childrenNo ? options.childrenNo : 0,
                'infants_qtt': options.newBornNo ? options.newBornNo : 0,
                // 'suppliers': ['VIETJET', 'JETSTAR', 'VNA', '1B', 'MF']
                'time': +new Date(),
                'key': ""
            };

            var strInput = paras.origin_code + paras.destination_code + paras.departure_date + paras.returnture_date + paras.cabin_class + paras.route_type +
                paras.aduts_qtt + paras.children_qtt + paras.infants_qtt + paras.page + paras.size + paras.time;

            var hashMac = CryptoJS.HmacSHA256(strInput, "Gotadi").toString(CryptoJS.enc.Base64);

            paras.key = hashMac;

            // $log.log("++++++++++++++++++++++++++++");
            // $log.log("Search criteria searchFlightInternational:");
            // //$log.log("paras=" + JSON.stringify(paras));
            // $log.log("paras=" + paras);
            // $log.log("++++++++++++++++++++++++++++");

            return $http({
                method: 'GET',
                url: API_URL + TICKET_SEARCH_INTERNATIONAL_URL,
                params: paras
            }).then(function successCallback(response) {
                $log.log('successCallback searchFlightInternational');
                $log.log(response);
                $timeout(function() {
                    $rootScope.$broadcast('event-flight-seach-completed');
                });
                //$rootScope.$broadcast('event-flight-seach-completed');
                return response.data;
            }, function errorCallback(response) {
                $log.log('errorCallback searchFlightInternational');
                $log.log(response);
                $timeout(function() {
                    $rootScope.$broadcast('event-flight-seach-completed');
                });
                return $q.reject(response);
                //return response.data;
            });
        }

        /**
         *
         * @param options
         */
        function searchFlightInCache(options) {
            var paras = {
                page: options.page ? options.page : 0,
                size: options.size ? options.size : DEFAULT_PAGE_SIZE,
                // sort: options.sortField ? options.sortField + ",asc" : "price,asc"
                sort: options.sortField + "," + options.sortDir
            };

            // Default SORT
            if (!options.sortField) {
                paras.sort = 'price,asc';
            }

            var data = {
                searchId: options.searchId
            };

            // if (options.advanceFilters) {
            //     data.filter = options.advanceFilters;
            //     data.filter.step = options.selectStep;
            // } else {
            //     data.filter = {};
            //     data.filter.step = options.selectStep;
            // }
            data.filter = options.advanceFilters;
            // data.filter.groupId = options.searchId;

            //+++ Tung: 23Sep2017 - fix TypeError: Cannot set property 'step' of undefined
            if (data.filter) {
                data.filter.step = options.selectStep;
            } else {
                data.filter = {};
                data.filter.step = options.selectStep;
            }
            //---

            // alert(options.searchType + ":" + options.selectStep);

            if (options.returnDomestic == true && options.dtype == 'domestic') {
                data.departureItinerary = options.departureItinerary;
            }
            // data.departureItinerary = options.departureItinerary;

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // $log.log("++++++++++++++++++++++++++++");
            // $log.log("Search criteria searchFlightInCache:");
            // //$log.log("data = " + JSON.stringify(data));
            // //$log.log("paras = " + JSON.stringify(paras));
            // $log.log("data = " + data);
            // $log.log("paras = " + paras);
            // $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + RequestUtils.buildUrl(TICKET_SEARCH_CACHE_URL,
                        paras), data, config)
                .then(function successCallback(response) {
                    $log.log('successCallback searchFlightInCache');
                    $log.log(response);
                    return response.data;
                });
        }

        /**
         *
         * @param options
         */
        function searchGroupDetail(options) {
            var paras = {
                page: options.page ? options.page : 0,
                // size: options.size ? options.size : DEFAULT_PAGE_SIZE,
                size: 1000,
                // sort: options.sortField ? options.sortField + ",asc" : "price,asc"
                sort: options.sortField + "," + options.sortDir
            };

            // Default SORT
            if (!options.sortField) {
                paras.sort = 'price,asc';
            }

            var departureItinerary = null;
            if (options.selectStep == 2) {
                departureItinerary = {
                    groupId: options.departureItinerary.groupId,
                    airlineCode: options.departureItinerary.airlineCode,
                    fareSourceCode: options.departureItinerary.fareSourceCode,
                    supplierCode: options.departureItinerary.supplierCode,
                    searchId: options.departureItinerary.searchId
                }
            }

            var data = {
                searchId: options.searchId,
                departureItinerary: departureItinerary
            };
            //Tan fix thay đổi hành trình (GPM-275)
            //if(data.filter) {
            // NAM.HUYNHPHUONG - FIX LOI SORT VNA
            if (options.advanceFilters) {
                data.filter = options.advanceFilters;
                // data.filter.groupId = options.searchId;
                // TODO: check for change from SearchID -> GroupID
                data.filter.groupId = options.groupId;

                data.filter.minPrice = options.minPrice;
                data.filter.loadMore = options.loadMore;
                data.filter.priceItineraryId = options.priceItineraryId;
                data.filter.step = options.selectStep;
            }
            // $log.log("++++++++++++++++++++++++++++");
            // $log.log("Search Options searchGroupDetail:");
            // // $log.log("data=" + JSON.stringify(data));
            // $log.log("data=" + data);
            // $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + RequestUtils.buildUrl(TICKET_GET_GROUP_DETAIL_URL + options.groupId,
                        paras)
                    //TICKET_GET_GROUP_DETAIL_URL + options.groupId
                    , data)
                .then(function successCallback(response) {
                    $log.log('successCallback searchGroupDetail');
                    $log.log("response=");
                    $log.log(response);
                    return response.data;
                });
        }

        /**
         *
         * @param options
         * @param groupItem
         * @param pricedItinerary
         */
        function getFareRules(options, groupItem, pricedItinerary) {
            var data = {
                fareSourceCode: pricedItinerary.airItineraryPricingInfo.fareSourceCode,
                groupId: groupItem.groupId,
                searchId: options.searchId
            };

            // $log.log("++++++++++++++++++++++++++++");
            // $log.log("getFareRules:");
            // $log.log("data=" + data);
            // $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + TICKET_GET_FARE_RULES_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback getFareRules');
                    $log.log("response=");
                    $log.log(response);
                    return response.data;
                });
        }

        /**
         *
         * @param options
         */
        function getAdvanceFilterOptions(options) {
            var data = {
                searchId: options.searchId
            };

            if (options.returnDomestic == true && options.dtype == 'domestic') {
                data.departureItinerary = options.departureItinerary;
            }

            // data.departureItinerary = options.departureItinerary;

            $log.log("++++++++++++++++++++++++++++");
            $log.log("Search Options getAdvanceFilterOptions:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + TICKET_GET_FILTER_OPTIONS_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback getAdvanceFilterOptions');
                    // $log.log("response = " + JSON.stringify(response));
                    $timeout(function() {
                        $rootScope.$broadcast('event-flight-seach-completed');
                    });
                    return response.data ? response.data.itineraryFilter : {};
                });
        }

        /**
         *
         * @returns {Array}
         */
        function getTransitAvailableOptions() {
            var data = [];
            data = [{
                id: 0,
                text: 'Bay thẳng',
                checked: false
            }, {
                id: 1,
                text: '1 Điểm Dừng',
                checked: false
            }, {
                id: 2,
                text: '2+ Điểm Dừng',
                checked: false
            }];

            return data;
        }

        /**
         *
         * @returns {*[]}
         */
        function getTimeAvailableOptions() {
            var data = [{
                id: 0,
                from: '0:00',
                to: '6:00',
                val: '-6',
                checked: false
            }, {
                id: 1,
                from: '6:00',
                to: '12:00',
                val: '+6-12',
                checked: false
            }, {
                id: 2,
                from: '12:00',
                to: '18:00',
                val: '+12-18',
                checked: false
            }, {
                id: 3,
                from: '18:00',
                to: '0:00',
                val: '+18',
                checked: false
            }];

            return data;
        }

        /**
         *
         * @returns {Array}
         */
        function getClassAvailableOptions() {
            var data = [];
            data = [{
                    id: "economy",
                    text: "ota_air.cabin_class.economy",
                    "checked": false
                }, {
                    id: "business",
                    text: "ota_air.cabin_class.business",
                    "checked": false
                }, {
                    id: "promo",
                    text: "ota_air.cabin_class.promo",
                    "checked": false
                }

            ];
            return data;
        }

        function getClassInterAvailableOptions() {
            var data = [];
            data = [{
                id: "economy",
                text: "ota_air.cabin_class.economy",
                "checked": false
            }, {
                id: "premium",
                text: "ota_air.cabin_class.premium",
                "checked": false
            }, {
                id: "business",
                text: "ota_air.cabin_class.business",
                "checked": false
            }, {
                id: "first",
                text: "ota_air.cabin_class.first",
                "checked": false
            }];
            return data;
        }

        /**
         *
         * @returns {*[]}
         */
        function getTicketPolicyOptions() {
            var data = [{
                id: "true",
                text: "Có thể hoàn vé",
                "checked": false
            }, {
                id: "false",
                text: "Không hoàn/ Huỷ",
                "checked": false
            }];
            return data;
        }

        /**
         *
         * @returns {Array}
         */
        function getDateAvailableOptions() {
            var data = [];
            return data;
        }

        /**
         *
         * @returns {Array}
         */
        function getAirlineAvailableOptions() {
            var data = [];
            var filter = DataService.getAdvanceSearchFilterOptions();
            if (filter && filter.airlineOptions) {
                angular.forEach(filter.airlineOptions, function(item) {
                    data.push({
                        id: item.split(":")[0],
                        text: item.split(":")[1],
                        price: item.split(":")[2],
                        unit: "VND",
                        checked: false
                    });
                });
            }
            return data;
        }

        /**
         *
         * @param options
         * @param groupItem
         * @param pricedItinerary
         */
        function revalidateTicket(options, groupItem, pricedItinerary) {

            var data = {
                searchId: options.searchId,
                fareSourceCode: pricedItinerary.airItineraryPricingInfo.fareSourceCode,
                groupId: groupItem.groupId
            };

            $log.log("revalidateTicket criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + TICKET_AIR_REVALIDATE_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback revalidateTicket');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                });
        }

        /**
         * Result from AirTicket DraftBooking
         * {
         *    "bookingType": "DOME",
         *    "isPerBookingType": false,
         *    "isRoundTripType": false,
         *    "markupType": "PER_PAX_PER_BOOKING",
         *    "roundType": "string",
         *    "success": false,
         *    "bookingCode": {
         *      "bookingCode": "string",
         *      "bookingNumber": "string"
         *    },
         *    "departDraftItineraryInfo": {
         *      "searchId": "string",
         *      "bookingDirection": "DEPARTURE",
         *      "fareSourceCode": "string",
         *      "groupId": "string",
         *      "itinTotalFare": {
         *          ...
         *     }
         *    },
         *    "returnDraftItineraryInfo": {
         *      "searchId": "string",
         *      "bookingDirection": "DEPARTURE",
         *      "fareSourceCode": "string",
         *      "groupId": "string",
         *      "itinTotalFare": {
         *         ...
         *     }
         *    }
         *  }
         */
        function createDraftBooking(options, groupItem, pricedItinerary, options2, groupItem2, pricedItinerary2) {

            var data = {
                itineraryInfos: [{
                    searchId: options.searchId,
                    fareSourceCode: pricedItinerary.airItineraryPricingInfo.fareSourceCode,
                    groupId: groupItem.groupId
                }]
                //searchId: options.searchId
            };

            if (options2 != null && options.dtype == 'domestic' && options.searchType == 'roundtrip') {
                // TODO: server check for duplication
                // if (options2 != null) {
                data.itineraryInfos.push({
                    searchId: options2.searchId,
                    fareSourceCode: pricedItinerary2.airItineraryPricingInfo.fareSourceCode,
                    groupId: groupItem2.groupId
                });
            }

            $log.log("createDraftBooking criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + TICKET_CREATE_DRAFT_BOOKING_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback createDraftBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback createDraftBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        // tam can cook
        function updateBookingTags(bookingId, tags) {

            return $http.put(
                    API_URL + TICKET_UPDATE_BOOKING_TAGS_URL + '/' + bookingId + '/tags', tags)
                .then(function successCallback(response) {
                    $log.log('successCallback updateBookingTags');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback updateBookingTags');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        /**
         *
         * @param booking_number
         */
        function changeDraftBookingOwner(booking_number) {

            var data = {
                bookingNumber: booking_number
            };

            $log.log("createDraftBooking criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + TICKET_CHANGE_DRAFT_BOOKING_OWNER_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback changeDraftBookingOwner');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback changeDraftBookingOwner');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        /**
         *
         * @param booking_number
         */
        function getTicketSsr(booking_number) {

            return $http({
                method: 'GET',
                url: API_URL + TICKET_AIR_GET_SSR_URL + '/' + booking_number
            }).then(function successCallback(response) {
                $log.log('successCallback getTicketSsr');
                $log.log(response);
                return response.data;
            }, function errorCallback(response) {
                $log.log('errorCallback getTicketSsr');
                $log.log(response);
                return $q.reject(response);
            });
        }

        /**
         *
         * @param options
         * @param bookingModel
         */
        function addTicketTravellers(options, bookingModel) {
            var data = {
                "bookingNumber": bookingModel.bookingNumber
                    //searchId: options.searchId,
                    ,
                bookingTravelerInfos: [],
                bookingContacts: []
                    /* TODO : traveler_info will be remove later */
                    //travelerInfo: {}
                    ,
                "taxReceiptRequest": {
                    "taxReceiptRequest": bookingModel.showForm,
                    "bookingNumber": bookingModel.bookingNumber,
                    "taxCompanyName": bookingModel.biCompany,
                    "taxAddress1": bookingModel.biAddress,
                    "taxAddress2": bookingModel.biMobile,
                    "taxNumber": bookingModel.biMst,
                    "taxPersonalInfoContact": JSON.stringify({
                        "name": bookingModel.tPCName,
                        "phone": bookingModel.tPCPhone,
                        "email1": bookingModel.tPCemail,
                        "fname": bookingModel.tPCfName,
                        "phoneCode3": bookingModel.tPCPhoneCode,
                        "note": bookingModel.tPCNote
                    })
                }
            };

            //+++ build bookingContacts
            var bookingContacts = [];
            var contacts = bookingModel.contacts;
            if (contacts !== null && contacts !== undefined) {
                angular.forEach(contacts, function(value, key) {
                    var c = value;

                    // var idx = c.ciName.indexOf(" ");
                    // var fname = c.ciName.substr(idx + 1);
                    // var sname = c.ciName.substr(0, idx);

                    bookingContacts.push({
                        "gender": c.ciGender,
                        "firstName": c.ciFName,
                        "surName": c.ciName,
                        "email": c.ciEmail,
                        "postCode": c.postcode,
                        // "phoneCode1": c.ciMobileCode,
                        "phoneCode1": "",
                        "phoneNumber1": c.ciMobile,

                        // "phoneCode2": c.ciMobileCode,
                        "phoneCode2": "",
                        "phoneNumber2": c.ciMobile

                        //"gender": "MALE",
                        //"address1": "string",
                        //"address2": "string",
                        //"ccEmail": "string",
                        //"city": "string",
                        //"contactLevel": "PRIMARY",
                        //"contactType": "CUSTOMER",
                        //"country": "string",
                        //"postalCode": "string"
                    });
                });
            }
            data.bookingContacts = bookingContacts;
            //---

            //+++ build bookingTravelerInfo include service request
            var bookingTravelerInfos = [];
            var customers = bookingModel.customers;

            if (customers !== null && customers !== undefined) {
                angular.forEach(customers, function(value, key) {
                    var c = value;

                    var travelerInfo = {
                        traveler: {},
                        serviceRequests: []
                    };

                    travelerInfo.traveler = {
                        "firstName": c.cuName,
                        "surName": c.cuFamilyName,
                        "gender": c.cuGender,
                        "adultType": c.type,
                        "dob": c.cuDob,

                        "memberCard": true,
                        "memberCardType": c.cuCardType,
                        "memberCardNumber": c.cuCardNo,

                        "country": c.cuNationality,
                        "nationality": c.cuNationality,

                        // "documentType": "string",
                        "documentNumber": c.cuId,
                        "documentIssuingCountry": c.cuNationality,
                        "documentExpiredDate": c.cuExpiredDate
                        // "documentExpiredDate": "2017-08-26T22:16:31.466Z",

                        // "documentIssuedDate": "2017-08-26T22:16:31.466Z",
                        // "address1": "string",
                        // "address2": "string",
                        // "email": "string",
                        // "city": "string",
                        //
                        // "phoneNumber1": "string",
                        // "phoneNumber2": "string",
                        // "phoneNumber3": "string",
                        // "phoneNumber4": "string",
                        // "phoneNumber5": "string",
                        // "postalCode": "string"
                    };

                    //+++ TODO - add additional pacakge
                    // if (options.searchType == 'oneway') {
                    //     var depSsr = options.ssrOfferItemsDepart[0].ssrItems;
                    // } else {
                    //     var depSsr = options.ssrOfferItemsDepart[0].ssrItems;
                    //     var retSsr = options.ssrOfferItemsReturn[0].ssrItems;
                    // }
                    if (c.departServiceRequests && c.departServiceRequests.length > 0) {
                        angular.forEach(c.departServiceRequests, function(value, key) {
                            var ssr = value;

                            $log.log("departServiceRequests add to traveler:");
                            // $log.log("data=" + JSON.stringify(ssr));
                            $log.log("data=" + ssr);
                            $log.log("++++++++++++++++++++++++++++");

                            travelerInfo.serviceRequests.push({
                                /* populate fareCode for each service_request */
                                /* bookingDirection will be DEPARTURE or RETURN */
                                "bookingDirection": "DEPARTURE",
                                "fareCode": ssr.fareSourceCode,
                                "serviceType": ssr.serviceType,
                                "ssrAmount": ssr.amount,
                                "ssrCode": ssr.code,
                                "ssrId": ssr.id,
                                "ssrName": ssr.name
                            });
                        });
                    }


                    if (c.returnServiceRequests && c.returnServiceRequests.length > 0) {
                        angular.forEach(c.returnServiceRequests, function(value, key) {
                            var ssr = value;

                            $log.log("returnServiceRequests add to traveler:");
                            // $log.log("data=" + JSON.stringify(ssr));
                            $log.log("data=" + ssr);
                            $log.log("++++++++++++++++++++++++++++");

                            travelerInfo.serviceRequests.push({
                                /* populate fareCode for each service_request */
                                /* bookingDirection will be DEPARTURE or RETURN */
                                "bookingDirection": "RETURN",
                                "fareCode": ssr.fareSourceCode,
                                "serviceType": ssr.serviceType,
                                "ssrAmount": ssr.amount,
                                "ssrCode": ssr.code,
                                "ssrId": ssr.id,
                                "ssrName": ssr.name
                            });
                        });
                    }
                    //---

                    bookingTravelerInfos.push(travelerInfo);
                });
            }

            data.bookingTravelerInfos = bookingTravelerInfos;
            //---

            // data.travelerInfo.airTravelers = airTravelers;
            // data.travelerInfo.contactInfos = contactInfos;

            $log.log("addTicketTravellers criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + TICKET_ADD_TRAVELLER_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback addTicketTravellers');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback addTicketTravellers');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        /**
         *
         * @param bookingModel
         * @param paymentModel
         * @param bjson
         */
        function paymentBooking(bookingModel, paymentModel, bjson) {

            if (paymentModel.cardModel) {
                paymentModel.cardModel.id = paymentModel.cardModel.cardId;
            }

            var data = {
                "bookingPaymentType": {
                    bookingCode: bookingModel.bookingCode,
                    bookingNumber: bookingModel.bookingNumber,
                    paymentType: paymentModel.paymentOption
                },
                "payByCreditCardReq": {
                    bookingNumber: bookingModel.bookingNumber,
                    bookingCode: bookingModel.bookingCode,
                    amount: PricingUtils.getTotalPricing(bjson),
                    card: paymentModel.cardModel,
                    paToken: paymentModel.paToken
                }
            };

            // $log.log("paymentBooking criteria:");
            // // $log.log("data=" + JSON.stringify(data));
            // $log.log("data=" + data);
            // $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + TICKET_PAYMENT_BOOKING_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback paymentBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback paymentBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });

        }

        function gPaymentPromotion(productType, status, page, size) {
            $log.log('productTypeproductType');
            $log.log(productType);
            var config = {
                params: {
                    status: status,
                    productType: productType,
                    page: page,
                    size: size
                },
            };
            return $http.get(
                    API_URL + PAYMENT_PROMO_OPTIONS_URL, config)
                .then(function successCallback(response) {
                    $log.log('successCallback PAYMENT_PROMO');
                    $log.log(response);
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback PAYMENT_PROMO');
                    $log.log(response);
                    return $q.reject(response);
                });
        }

        /**
         *
         * @param bookingNumber
         * @param paymentType
         */
        function gPaymentPromoDiscount(bookingNumber, bookingCode, promotionId, promotionType) {
            var data = {
                "bookingNumber": bookingNumber,
                "bookingCode": bookingCode,
                "promotionId": promotionId,
                "promotionType": promotionType
            };
            return $http.post(
                    API_URL + PAYMENT_PROMO_DISCOUNT_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback gPaymentFeeOpt');
                    $log.log("response = " + response);

                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback gPaymentFeeOpt');
                    $log.log("response = " + response);

                    return $q.reject(response);
                });
        }

        /**
         *
         * @param bookingNumber
         * @param paymentType
         */
        function gPaymentFeeOpt(bookingNumber, paymentType, tempDiscountAmount) {
            var data = {
                "bookingNumber": bookingNumber,
                "paymentType": paymentType,
                "tempDiscountAmount": tempDiscountAmount
            };

            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + PAYMENT_FEE_OPTIONS_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback gPaymentFeeOpt');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);

                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback gPaymentFeeOpt');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);

                    return $q.reject(response);
                });
        }

        function flightBookingOTPService(bookingModel, otpreq) {
            var data = {
                "bookingNumber": bookingModel.bookingNumber,
                otpServiceReq: otpreq,
                bookingTravelerInfos: [],
                bookingContacts: [],
                taxReceiptRequest: {
                    "taxReceiptRequest": bookingModel.showForm,
                    "bookingNumber": bookingModel.bookingNumber,
                    "taxCompanyName": bookingModel.biCompany,
                    "taxAddress1": bookingModel.biAddress,
                    "taxAddress2": bookingModel.biMobile,
                    "taxNumber": bookingModel.biMst,
                    "taxPersonalInfoContact": JSON.stringify({
                        "name": bookingModel.tPCName,
                        "phone": bookingModel.tPCPhone,
                        "email1": bookingModel.tPCemail,
                        "fname": bookingModel.tPCfName,
                        "phoneCode3": bookingModel.tPCPhoneCode,
                        "note": bookingModel.tPCNote
                    })
                }
            };

            //+++ build bookingContacts
            var bookingContacts = [];
            var contacts = bookingModel.contacts;
            if (contacts !== null && contacts !== undefined) {
                angular.forEach(contacts, function(value, key) {
                    var c = value;
                    bookingContacts.push({
                        "gender": c.ciGender,
                        "firstName": c.ciFName,
                        "surName": c.ciName,
                        "email": c.ciEmail,
                        "postCode": c.postcode,
                        "phoneCode1": "",
                        "phoneNumber1": c.ciMobile,
                        "phoneCode2": "",
                        "phoneNumber2": c.ciMobile
                    });
                });
            }
            data.bookingContacts = bookingContacts;
            //---

            //+++ build bookingTravelerInfo include service request
            var bookingTravelerInfos = [];
            var customers = bookingModel.customers;

            if (customers !== null && customers !== undefined) {
                angular.forEach(customers, function(value, key) {
                    var c = value;

                    var travelerInfo = {
                        traveler: {},
                        serviceRequests: []
                    };

                    travelerInfo.traveler = {
                        "firstName": c.cuName,
                        "surName": c.cuFamilyName,
                        "gender": c.cuGender,
                        "adultType": c.type,
                        "dob": c.cuDob,
                        "memberCard": true,
                        "memberCardType": c.cuCardType,
                        "memberCardNumber": c.cuCardNo,
                        "country": c.cuNationality,
                        "nationality": c.cuNationality,
                        "documentNumber": c.cuId,
                        "documentIssuingCountry": c.cuNationality,
                        "documentExpiredDate": c.cuExpiredDate
                    };

                    //+++ TODO - add additional pacakge
                    if (c.departServiceRequests && c.departServiceRequests.length > 0) {
                        angular.forEach(c.departServiceRequests, function(value, key) {
                            var ssr = value;
                            $log.log("departServiceRequests add to traveler:");
                            // $log.log("data=" + JSON.stringify(ssr));
                            $log.log("data=" + ssr);
                            $log.log("++++++++++++++++++++++++++++");

                            travelerInfo.serviceRequests.push({
                                /* populate fareCode for each service_request */
                                /* bookingDirection will be DEPARTURE or RETURN */
                                "bookingDirection": "DEPARTURE",
                                "fareCode": ssr.fareSourceCode,
                                "serviceType": ssr.serviceType,
                                "ssrAmount": ssr.amount,
                                "ssrCode": ssr.code,
                                "ssrId": ssr.id,
                                "ssrName": ssr.name
                            });
                        });
                    }


                    if (c.returnServiceRequests && c.returnServiceRequests.length > 0) {
                        angular.forEach(c.returnServiceRequests, function(value, key) {
                            var ssr = value;

                            $log.log("returnServiceRequests add to traveler:");
                            // $log.log("data=" + JSON.stringify(ssr));
                            $log.log("data=" + ssr);
                            $log.log("++++++++++++++++++++++++++++");

                            travelerInfo.serviceRequests.push({
                                /* populate fareCode for each service_request */
                                /* bookingDirection will be DEPARTURE or RETURN */
                                "bookingDirection": "RETURN",
                                "fareCode": ssr.fareSourceCode,
                                "serviceType": ssr.serviceType,
                                "ssrAmount": ssr.amount,
                                "ssrCode": ssr.code,
                                "ssrId": ssr.id,
                                "ssrName": ssr.name
                            });
                        });
                    }
                    //---

                    bookingTravelerInfos.push(travelerInfo);
                });
            }

            data.bookingTravelerInfos = bookingTravelerInfos;

            $log.log("addTicketTravellers criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");
            console.log(data);
            return $http.post(
                    API_URL + TICKET_ADD_TRAVELLER_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback addTicketTravellers');
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback addTicketTravellers');
                    return $q.reject(response);
                });
        }


        /**
         *
         * @param bookingModel
         * @param paymentModel
         * @param bjson
         */
        function gPaymentBooking(bookingModel, paymentModel, bjson) {

            var data = null;
            //HuyTT
            if (paymentModel.paymentOption === "VNPAYQR") {
                data = {
                    "bookingPaymentType": {
                        bookingCode: bookingModel.bookingCode,
                        bookingNumber: bookingModel.bookingNumber,
                        paymentType: paymentModel.paymentOption
                    },
                    "payByVnPayReq": {
                        bookingNumber: bookingModel.bookingNumber,
                        bookingCode: bookingModel.bookingCode,
                        amount: PricingUtils.getTotalPricing(bjson),
                        is_mobile: bjson.is_mobile
                    }
                };
            } else if (paymentModel.paymentOption === "MOMO") {
                data = {
                    "bookingPaymentType": {
                        bookingCode: bookingModel.bookingCode,
                        bookingNumber: bookingModel.bookingNumber,
                        paymentType: paymentModel.paymentOption
                    },
                    "payByMoMoRequest": {
                        bookingNumber: bookingModel.bookingNumber,
                        bookingCode: bookingModel.bookingCode,
                        amount: PricingUtils.getTotalPricing(bjson),
                        is_mobile: bjson.is_mobile
                    }
                };
            } else if (paymentModel.paymentOption === "VIETTELPAY") {
                data = {
                    "bookingPaymentType": {
                        bookingCode: bookingModel.bookingCode,
                        bookingNumber: bookingModel.bookingNumber,
                        paymentType: paymentModel.paymentOption
                    },
                    "partnerPaymentReq": {
                        bookingNumber: bookingModel.bookingNumber,
                        bookingCode: bookingModel.bookingCode,
                        amount: PricingUtils.getTotalPricing(bjson),
                        is_mobile: bjson.is_mobile
                    }
                };
            } else if (paymentModel.paymentOption === "PAYOO") {
                data = {
                    "bookingPaymentType": {
                        bookingCode: bookingModel.bookingCode,
                        bookingNumber: bookingModel.bookingNumber,
                        paymentType: paymentModel.paymentOption
                    },
                    "payByPayooReq": {
                        bookingNumber: bookingModel.bookingNumber,
                        bookingCode: bookingModel.bookingCode,
                        amount: PricingUtils.getTotalPricing(bjson),
                        is_mobile: bjson.is_mobile
                    }
                };
            }
            //End HuyTT
            else {
                data = {
                    "bookingPaymentType": {
                        bookingCode: bookingModel.bookingCode,
                        bookingNumber: bookingModel.bookingNumber,
                        paymentType: paymentModel.paymentOption
                    },
                    "payByDebitCardReq": {
                        bookingNumber: bookingModel.bookingNumber,
                        bookingCode: bookingModel.bookingCode,
                        amount: PricingUtils.getTotalPricing(bjson),
                        address: paymentModel.cardModel.address,
                        email: paymentModel.cardModel.email,
                        fullname: paymentModel.cardModel.fullName,
                        mobile: paymentModel.cardModel.mobile,
                        paymentOption: paymentModel.cardModel.bank
                    }
                };
            }

            $log.log("gPaymentBooking criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=");
            $log.log(data);

            return $http.post(
                    API_URL + PAYMENT_PAYMENT_BOOKING_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback gPaymentBooking 2');
                    $log.log(response);
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback gPaymentBooking 2');
                    $log.log(response);
                    return $q.reject(response);
                });

        }

        /**
         *
         * @param bookingModel
         */
        function orderTickets(bookingModel) {

            var data = {
                bookingCode: bookingModel.bookingCode,
                bookingNumber: bookingModel.bookingNumber

            };

            $log.log("orderTickets criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + TICKET_ORDER_TICKET_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback orderTickets');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback orderTickets');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        /**
         *
         * @returns {string[]}
         */
        function getPopularPlaces() {
            var data = [
                "Đà Nẵng", "Nha Trang", "Đà Lạt", "Phú Quốc", "Hà Nội"
            ];
            return data;
        }

        /**
         *
         * @returns {string[]}
         */
        function getPopularFlights() {
            var data = [
                "Hồ Chí Minh đến Nha Trang",
                "Hồ Chí Minh đến Đà Lạt",
                "Hồ Chí Minh đến Huế",
                "Hồ Chí Minh đến Đà Nẵng",
                "Hồ Chí Minh đến Hà Nội",
                "Hồ Chí Minh đến Hải Phòng",
                "Hồ Chí Minh đến Vinh",
                "Hồ Chí Minh đến Phú Quốc"
            ];
            return data;
        }

        /**
         *
         * @returns {string[]}
         */
        function getPopularHotels() {
            var data = [
                "Shanghai hotel", "Beijing hotel", "Guangzhou hotel"
            ];
            return data;
        }

        /**
         *
         * @param bookingModel
         */
        function validatePromo(bookingModel, id) {
            var data = {
                id: id,
                bookingNumber: bookingModel.bookingNumber
            };
            $log.log("validateVoucher criteria:");
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + PRICING_VOUCHER_VALIDATE_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback validateVoucher');
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback validateVoucher');
                    return $q.reject(response);
                });
        }

        function validateVoucher(bookingModel) {

            var voucherObj = bookingModel.voucher;

            var data = {
                voucherCode: voucherObj.voucherCode,
                bookingNumber: bookingModel.bookingNumber
            };

            $log.log("validateVoucher criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + PRICING_VOUCHER_VALIDATE_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback validateVoucher');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback validateVoucher');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        /**
         *
         * @param bookingModel
         */
        function redeemVoucher(bookingModel) {

            var voucherObj = bookingModel.voucher;

            var data = {
                voucherCode: voucherObj.voucherCode,
                trackingCode: voucherObj.trackingCode,
                bookingNumber: bookingModel.bookingNumber
            };

            $log.log("redeemVoucher criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + PRICING_VOUCHER_REDEEM_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback redeemVoucher');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback redeemVoucher');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        function createOrderTiki(bookingNumber, customerID) {
            var url = API_URL_CALLBACK + '/api/tiki/place-order?bookingNumber=' + bookingNumber + '&tikiCustomerId=' + customerID;


            $log.log("Create Tiki order");
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    url, null, {
                        noAuth: true
                    })
                .then(function successCallback(response) {
                    $log.log('successCallback Create Tiki order');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback Create Tiki order');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        function getLienVietPaymentURL(bookingNumber) {

            var data = $cookies.get("lienviet-data");
            var key = $cookies.get("lienviet-key");

            var url = API_URL_CALLBACK + LIENVIET_URL + '/place-order';
            var body = {
                bookingNumber: bookingNumber,
                data: data,
                key: key
            };

            return $http.post(
                    url, body, {
                        noAuth: true
                    })
                .then(function successCallback(response) {
                    $log.log('successCallback Lien Viet order');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback Lien Viet order');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });

        }

        function getViettelPaymentURL(bookingNumber) {

            var reqURL = API_URL_CALLBACK + VIETTEL_URL + '/tmdt/booking/get-request-place-order?bookingNumber=' + bookingNumber;

            return $http({
                    method: 'get',
                    url: reqURL,
                    transformResponse: function(response) {
                        return response;
                    },
                    noAuth: true
                })
                .then(function successCallback(response) {
                    $log.log('successCallback redeemVoucher');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback redeemVoucher');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }


        function externalPayment(bookingNumber) {
            var type = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;
            switch (type) {
                case "TIKI":
                    var customerID = $cookies.get('msisdn') || localStorage.getItem('msisdn');
                    createOrderTiki(bookingNumber, customerID).then(function(response) {
                        $window.top.location.href = response.redirect_url;

                    }, function error(response) {
                        $log.log('errorCallback Create Tiki order');
                        // $log.log("response = " + JSON.stringify(response));
                    });
                    break;
                case "VIETTEL":
                    getViettelPaymentURL(bookingNumber).then(function(response) {
                        $window.location.href = response;

                    }, function error(response) {
                        $log.log('errorCallback Create viettel order');
                        // $log.log("response = " + JSON.stringify(response));
                    });
                    break;
                case "SEABANK":
                    // // alert("Post Iframe message");
                    // var appId = "seabankapp";
                    // var seaData = {
                    //     "OrderId": bookingNumber,
                    //     "RequestId":""
                    // };
                    var data = 'seabankapp://' + encodeURIComponent('{"OrderId":"' + bookingNumber + '","RequestId":""}');

                    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
                        window.location = data;
                    } else if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
                        var androidUrl = "intent://view?data=" + encodeURIComponent('{"OrderId":"' + bookingNumber + '","RequestId":""}') +
                            "/#intent;scheme=" + 'seabankapp;package=' + 'vn.com.seabank.mb1' + ";end";
                        window.location = androidUrl;
                    } else {
                        parent.postMessage(bookingNumber, "*");
                    }

                    break;

                case "LIENVIETBANK":
                    // TODO: Implement get and redirect to LienViet payment site
                    getLienVietPaymentURL(bookingNumber).then(function(response) {
                        if (response.success) {
                            $window.location.href = response.result;
                        } else {
                            DialogService.openAlertDialog({
                                title: "Error",
                                message: response.result
                            });
                        }

                    }, function error(response) {
                        $log.log('errorCallback Create viettel order');
                        // $log.log("response = " + JSON.stringify(response));
                    })
                    break;
                case "FSOFT":
                    break;
                default:
                    if (!!type) {
                        partnerPayment(bookingNumber, type).then(function(response) {
                            if (response.isSuccess) {
                                // $window.location.href = response.result;
                                // var newWindow = $window;
                                // newWindow.location = response.result;
                                // $window.open(response.result).focus();
                                $window.location.href = response.result;
                            } else {
                                DialogService.openAlertDialog({
                                    title: "Error",
                                    message: response.result
                                });
                            }

                        }, function error(response) {
                            $log.log('errorCallback Create viettel order');
                            // $log.log("response = " + JSON.stringify(response));
                        });
                    }
                    break;
            }

        }

        function partnerPayment(bookingNumber, type) {
            var reqURL = API_URL + "/api/partner/place-order?bookingNumber=" + bookingNumber;
            return $http({
                    method: 'GET',
                    url: reqURL,
                    // noAuth : true,
                    // headers:{
                    //     "X-ibe-req-name": type
                    // }
                })
                .then(function successCallback(response) {
                    $log.log('successCallback lienVietPayment');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback lienVietPayment');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        function lienVietPayment(data, key, agent_site) {
            var reqURL = API_URL_CALLBACK + LIENVIET_URL + '/commit?data=' + data + '&key=' + key + '&agent_site=' + agent_site;
            return $http({
                    method: 'GET',
                    url: reqURL,
                    noAuth: true
                })
                .then(function successCallback(response) {
                    $log.log('successCallback lienVietPayment');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback lienVietPayment');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }


        function redeemPromo(paymentModel, bookingModel) {
            var data = {
                bookingCode: bookingModel.bookingCode,
                bookingNumber: bookingModel.bookingNumber,
                promotionId: paymentModel.promotions.id,
                promotionCode: '',
                promotionType: paymentModel.promotions.promotionType,
                price: bookingModel.bookingInfo.totalFare
            };
            if (paymentModel.promotions.promotionType == 'AIRLINES_CODE') {
                data.airlinesCode = bookingModel.bookingInfo.transactionInfos[0].supplierCode;
            }
            if (paymentModel.promotions.promotionType == 'CREDIT_CARD') {
                data.cardNumber = paymentModel.cardModel.cardNumber;
            }
            $log.log('bookingModel.airlinesCode');
            $log.log(bookingModel);
            return $http.post(
                    API_URL + PRICING_PROMO_REDEEM_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback redeemPromo');
                    $log.log(response);
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback redeemPromo');
                    $log.log(response);
                    return $q.reject(response);
                });
        }

        function voidPromo(bookingNumber, promotionID) {
            var data = {
                bookingNumber: bookingNumber,
                "promotionID": promotionID
            }
            return $http.post(
                    API_URL + PRICING_PROMO_VOID_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback VoidPromo');
                    $log.log(response);
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback VoidPromo');
                    $log.log(response);
                    return $q.reject(response);
                });
        }
        return service;
    }
})();