(function() {
    'use strict';
    angular
        .module('B2B2CGatewayApp')
        .factory('Hotel', Hotel);

    Hotel.$inject = ['$log', '$rootScope', '$q', '$resource', '$http', '$timeout', 'RequestUtils', 'GlobalSrv', 'DataService', 'PricingUtils', 'HOTEL_SEARCH_METADATA_URL', 'HOTEL_SEARCH_URL', 'HOTEL_SEARCH_CACHE_URL', 'HOTEL_FILTER_OPTIONS_URL', 'HOTEL_CHECK_AVAILABILITY_URL', 'HOTEL_DRAFT_BOOKING_URL', 'HOTEL_ADD_BOOKING_TRAVELLER_URL', 'HOTEL_PAYMENT_BOOKING_URL', 'HOTEL_ORDER_HOTEL_URL', 'PAYMENT_PAYMENT_BOOKING_URL', 'DEFAULT_PAGE_SIZE', 'PRICING_VOUCHER_VALIDATE_URL', 'PRICING_VOUCHER_REDEEM_URL', 'API_URL', 'PAYMENT_PROMO_OPTIONS_URL'];

    function Hotel($log, $rootScope, $q, $resource, $http, $timeout, RequestUtils, GlobalSrv, DataService, PricingUtils, HOTEL_SEARCH_METADATA_URL, HOTEL_SEARCH_URL, HOTEL_SEARCH_CACHE_URL, HOTEL_FILTER_OPTIONS_URL, HOTEL_CHECK_AVAILABILITY_URL, HOTEL_DRAFT_BOOKING_URL, HOTEL_ADD_BOOKING_TRAVELLER_URL, HOTEL_PAYMENT_BOOKING_URL, HOTEL_ORDER_HOTEL_URL, PAYMENT_PAYMENT_BOOKING_URL, DEFAULT_PAGE_SIZE, PRICING_VOUCHER_VALIDATE_URL, PRICING_VOUCHER_REDEEM_URL, API_URL, PAYMENT_PROMO_OPTIONS_URL) {

        var service = {
            searchHotelMetaData: searchHotelMetaData,
            searchHotel: searchHotel,
            searchHotelInCache: searchHotelInCache,
            getAdvanceFilterOptions: getAdvanceFilterOptions

                ,
            checkHotelAvailability: checkHotelAvailability,
            createDraftBooking: createDraftBooking,
            addHotelTravellers: addHotelTravellers,
            paymentBooking: paymentBooking,
            gPaymentBooking: gPaymentBooking,
            orderTickets: orderTickets,
            validateVoucher: validateVoucher,
            redeemVoucher: redeemVoucher,
            gPaymentPromotion: gPaymentPromotion
        };

        function searchHotelMetaData(val) {

            if (!val) {
                return;
            }

            var data = {};

            $log.log("++++++++++++++++++++++++++++");
            $log.log("searchHotelMetaData:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("val=" + val);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + HOTEL_SEARCH_METADATA_URL + '?keyword=' + val, data)
                .then(function successCallback(response) {
                    $log.log("Search searchHotelMetaData result: ");
                    $log.log(response.data.result);
                    // angular.forEach(response.data.result, function (item) {
                    //     item.id = item.code;
                    // });

                    GlobalSrv.addLocalDestinations(response.data.result);

                    return response.data.result;
                }, function errorCallback(response) {
                    return [];
                });
        }

        function searchHotel(options) {

            // alert(moment(options.checkindate).format('MM-DD-YYYY') + ":" + moment(options.checkoutdate).format('MM-DD-YYYY'));

            var paras = {
                'page': options.page ? options.page : 0,
                'size': options.size ? options.size : DEFAULT_PAGE_SIZE,
                'hotel_code': options.destinationCode,
                'checkin_date': moment(options.checkindate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                'checkout_date': moment(options.checkoutdate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
                'aduts_qtt': options.adultNo ? options.adultNo : 1,
                'children_qtt': options.childrenNo ? options.childrenNo : 0
            };

            $log.log("++++++++++++++++++++++++++++");
            $log.log("Search criteria searchHotel:");
            // $log.log("paras=" + JSON.stringify(paras));
            $log.log("paras=");
            $log.log(paras);
            $log.log("++++++++++++++++++++++++++++");

            var pax = [];
            if (options.pax) {
                for (var i = 0; i < options.pax.length; i++) {
                    var paxItem = {};
                    paxItem.adultQuantity = options.pax[i].adultNo;
                    paxItem.childrenAges = options.pax[i].paxDetails;
                    pax.push(paxItem);
                }
            }

            $log.log("Search criteria :");
            // $log.log("pax=" + JSON.stringify(pax));
            $log.log("pax=");
            $log.log(pax);

            return $http.post(
                    API_URL + RequestUtils.buildUrl(HOTEL_SEARCH_URL, paras), pax)
                // , [
                //     {
                //         "adultQuantity": "1",
                //         "childrenAges": [
                //             "1"
                //         ]
                //     }
                // ])

                // $http({
                //     method: 'POST',
                //     url: RequestUtils.buildUrl(HOTEL_SEARCH_URL, paras),
                //     data: [
                //         {"AdultQuantity": 1, "ChildrenAges": [4,4,4]}
                //     ]
                // })
                .then(function successCallback(response) {
                    $log.log('successCallback searchHotel');
                    $log.log(response);
                    $timeout(function() {
                        $rootScope.$broadcast('gtd-hotel-search-completed');
                    });
                    //$rootScope.$broadcast('event-flight-seach-completed');
                    return response.data;
                }, function errorCallback(response) {
                    $log.log('errorCallback searchHotel');
                    $log.log(response);
                    $timeout(function() {
                        $rootScope.$broadcast('gtd-hotel-search-completed');
                    });
                    return $q.reject(response);
                    //return response.data;
                });
        }

        function searchHotelInCache(options) {
            var paras = {
                page: options.page ? options.page : 0,
                // size: 1,
                size: options.size ? options.size : DEFAULT_PAGE_SIZE,
                sort: options.sortField ? options.sortField + "," + options.sortDir : "price,asc"
            };

            var data = {
                searchId: options.searchId
            };



            data.filter = {};

            if (options.advanceFilters) {
                data.filter = options.advanceFilters;
            }

            if (options.sameLoc) {
                data.filter.sameLoc = options.sameLoc;
                data.filter.lat = options.lat;
                data.filter.lng = options.lng;
            }

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            $log.log("++++++++++++++++++++++++++++");
            $log.log("Search criteria searchHotelInCache:");
            // $log.log("data = " + JSON.stringify(data));
            $log.log("data = " + data);
            // $log.log("paras = " + JSON.stringify(paras));
            $log.log("paras = " + paras);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + RequestUtils.buildUrl(HOTEL_SEARCH_CACHE_URL,
                        paras), data, config)
                .then(function successCallback(response) {
                    $log.log('successCallback searchHotelInCache');
                    $log.log(response);
                    return response.data;
                });
        }

        function getAdvanceFilterOptions(options) {
            var data = {
                searchId: options.searchId
            };

            $log.log("++++++++++++++++++++++++++++");
            $log.log("Search Options getAdvanceFilterOptions:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + HOTEL_FILTER_OPTIONS_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback getAdvanceFilterOptions');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    $timeout(function() {
                        // $rootScope.$broadcast('event-flight-seach-completed');
                    });
                    return response.data ? response.data.filter : {};
                });
        }

        function checkHotelAvailability(options, selectedHotel) {

            // $log.log("selectedHotel = " + JSON.stringify(selectedHotel));
            $log.log("selectedHotel = " + selectedHotel);
            var data = {
                searchId: options.searchId,
                hotelId: selectedHotel.id
            };

            if (selectedHotel.hotelAvailabilityId) {
                data.hotelAvailabilityId = selectedHotel.hotelAvailabilityId;
            }

            var pax = [];
            if (options.pax) {
                for (var i = 0; i < options.pax.length; i++) {
                    var paxItem = {};
                    paxItem.adultQuantity = options.pax[i].adultNo;
                    paxItem.childrenAges = options.pax[i].paxDetails;
                    pax.push(paxItem);
                }
                data.pax = pax;
            }

            var checkindate = null;
            if (options.checkindate) {
                checkindate = moment(options.checkindate, 'DD-MM-YYYY').format('MM-DD-YYYY');
                data.checkIn = checkindate;
            }

            var checkoutdate = null;
            if (options.checkoutdate) {
                checkoutdate = moment(options.checkoutdate, 'DD-MM-YYYY').format('MM-DD-YYYY');
                data.checkOut = checkoutdate;
            }

            $log.log("checkHotelAvailability criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=");
            $log.log(data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + HOTEL_CHECK_AVAILABILITY_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback checkHotelAvailability');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    return response.data ? response.data : {};
                });
        }

        function createDraftBooking(options, hotel, product, room) {

            // $log.log('hotel = ' + JSON.stringify(hotel));
            // $log.log('product = ' + JSON.stringify(product));
            // $log.log('room = ' + JSON.stringify(room));

            $log.log('hotel = ' + hotel);
            $log.log('product = ' + product);
            $log.log('room = ' + room);

            // var data = {
            //     hotelCode: hotel.hotelCode,
            //     hotelLookedAvailabilityId: hotel.id,
            //     productId: product.id,
            //     productCode: product.code,
            //     supplierCode: hotel.supplierCode
            // };

            /**
             * {
             *  "hotelAvailabilityId": "string",
             *  "productId": "string"
             * }
             */
            var data = {
                hotelAvailabilityId: hotel.id,
                productId: product.id
            };
            /*
            data.hotelInfo = {
                hotelCode: hotel.hotelCode,
                hotelLookedAvailabilityId: hotel.id,
                productId: product.id,
                productCode: product.code,
                supplierCode: hotel.supplierCode
            };
            */

            $log.log("createDraftBooking criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + HOTEL_DRAFT_BOOKING_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback createDraftBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback createDraftBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    return $q.reject(response);
                });
        }

        function addHotelTravellers(options, bookingModel) {
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

                        "phoneCode1": c.ciMobileCode,
                        "phoneNumber1": c.ciMobile,

                        "phoneCode2": c.ciMobileCode,
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
                        "productCode": c.productCode


                        // "country": c.cuNationality,
                        // "nationality": c.cuNationality,

                        // "documentType": "string",
                        // "documentNumber": c.cuId,
                        // "documentIssuingCountry":  c.cuNationality,
                        // "documentExpiredDate": c.cuExpiredDate
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
            $log.log("data=");
            $log.log(data);
            $log.log("++++++++++++++++++++++++++++");



            return $http.post(
                    API_URL + HOTEL_ADD_BOOKING_TRAVELLER_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback addHotelTravellers');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback addHotelTravellers');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    return $q.reject(response);
                });
        }

        function paymentBooking(bookingModel, paymentModel, bjson) {

            if (paymentModel.cardModel) {
                paymentModel.cardModel.id = paymentModel.cardModel.cardId;
            }

            var data = {
                "bookingPaymentType": {
                    bookingCode: bjson.bookingInfo.bookingCode,
                    bookingNumber: bookingModel.bookingNumber,
                    paymentType: paymentModel.paymentOption
                },
                "payByCreditCardReq": {
                    bookingNumber: bookingModel.bookingNumber,
                    bookingCode: bjson.bookingInfo.bookingCode,
                    amount: PricingUtils.getHotelTotalPricing(bjson),
                    card: paymentModel.cardModel,
                    paToken: paymentModel.paToken
                }
            };

            // $log.log("paymentBooking criteria:");
            $log.log("Hotel.paymentBooking:: data=");
            $log.log(data);
            // $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + HOTEL_PAYMENT_BOOKING_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback paymentBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback paymentBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
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

        function gPaymentBooking(bookingModel, paymentModel, bjson) {

            var data = {
                "bookingPaymentType": {
                    bookingCode: bjson.bookingInfo.bookingCode,
                    bookingNumber: bookingModel.bookingNumber,
                    paymentType: paymentModel.paymentOption
                }
            };
            if (paymentModel.paymentOption === "VNPAYQR") {
                data.payByVnPayReq = {
                    bookingNumber: bookingModel.bookingNumber,
                    bookingCode: bjson.bookingInfo.bookingCode,
                    amount: PricingUtils.getHotelTotalPricing(bjson),
                    is_mobile: bjson.is_mobile
                };
            } else {
                data.payByDebitCardReq = {
                    bookingNumber: bookingModel.bookingNumber,
                    bookingCode: bjson.bookingInfo.bookingCode,
                    amount: PricingUtils.getHotelTotalPricing(bjson),
                    address: paymentModel.cardModel.address,
                    email: paymentModel.cardModel.email,
                    fullname: paymentModel.cardModel.fullName,
                    mobile: paymentModel.cardModel.mobile,
                    paymentOption: paymentModel.cardModel.bank
                };
            }

            $log.log(data.payByVnPayReq);
            $log.log("gPaymentBooking criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("Hotel.gPaymentBooking:: data=");
            $log.log(data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + PAYMENT_PAYMENT_BOOKING_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback gPaymentBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    //alert(response);
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback gPaymentBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    return $q.reject(response);
                });

        }

        function orderTickets(bookingModel, bjson) {

            var data = {
                bookingCode: bjson.bookingInfo.bookingCode,
                bookingNumber: bookingModel.bookingNumber

            };

            $log.log("orderTickets criteria:");
            // $log.log("data=" + JSON.stringify(data));
            $log.log("Hotel.orderTickets:: data=");
            $log.log(data);
            $log.log("++++++++++++++++++++++++++++");




            return $http.post(
                    API_URL + HOTEL_ORDER_HOTEL_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback orderTickets');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback orderTickets');
                    // $log.log("response = " + JSON.stringify(response));
                    $log.log("response = " + response);
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

        return service;
    }
})();