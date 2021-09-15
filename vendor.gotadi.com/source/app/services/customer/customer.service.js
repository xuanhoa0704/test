(function() {
    'use strict';
    angular
        .module('B2B2CGatewayApp')
        .factory('CustomerService', CustomerService);

    CustomerService.$inject = ['$window', '$log', '$resource', '$http', '$q', 'ParseLinks', 'GlobalSrv', 'DataService', 'DateUtils', 'CUSTOMER_PROFILE_URL', 'B2B_AGENT_PROFILE_URL', 'CUSTOMER_PROFILE_AVATAR_URL', 'CUSTOMER_PROFILE_AVATAR_COMMON_URL', 'PROFILE_SHORT_URL', 'CUSTOMER_TRAVELLERS_URL', 'CUSTOMER_TRAVELLERS_FOR_BOTH_URL', 'CUSTOMER_TRAVELLERS_DETAIL_URL', 'CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL', 'AIR_CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL', 'PRICING_CREDIT_CARDS_URL', 'PRICING_CREDIT_CARDS_DELETE_ALL_URL', 'PAYMENT_SUB_CARD_URL', 'PAYMENT_UNSUB_CARD_URL', 'BOOKING_SEARCH_URL', 'BOOKING_DETAILS_URL', 'PRODUCT_BOOKING_DETAILS_URL', 'PRODUCT_FINAL_BOOKING_DETAILS_URL', 'GET_AVAILABLE_PAYMENT_TYPE', '$cookies', 'MerchantService', 'API_URL'];

    function CustomerService($window, $log, $resource, $http, $q, ParseLinks, GlobalSrv, DataService, DateUtils, CUSTOMER_PROFILE_URL, B2B_AGENT_PROFILE_URL, CUSTOMER_PROFILE_AVATAR_URL, CUSTOMER_PROFILE_AVATAR_COMMON_URL, PROFILE_SHORT_URL, CUSTOMER_TRAVELLERS_URL, CUSTOMER_TRAVELLERS_FOR_BOTH_URL, CUSTOMER_TRAVELLERS_DETAIL_URL, CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL, AIR_CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL, PRICING_CREDIT_CARDS_URL, PRICING_CREDIT_CARDS_DELETE_ALL_URL, PAYMENT_SUB_CARD_URL, PAYMENT_UNSUB_CARD_URL, BOOKING_SEARCH_URL, BOOKING_DETAILS_URL, PRODUCT_BOOKING_DETAILS_URL, PRODUCT_FINAL_BOOKING_DETAILS_URL, GET_AVAILABLE_PAYMENT_TYPE, $cookies, MerchantService, API_URL) {

        var service = {
            getCustomerTravellers: getCustomerTravellers,
            getCustomerTravellersPagination: getCustomerTravellersPagination,
            getCustomerTravellersForBoth: getCustomerTravellersForBoth,
            getCustomerTraveller: getCustomerTraveller,
            addCustomerTravellers: addCustomerTravellers,
            deleteCustomerTravellers: deleteCustomerTravellers,
            addCustomerTravellersProfile: addCustomerTravellersProfile,

            getCustomerProfile: getCustomerProfile,
            getShortProfile: getShortProfile,
            getCustomerProfileAvatar: getCustomerProfileAvatar,
            updateCustomerProfile: updateCustomerProfile,
            updateAvatarCustomer: updateAvatarCustomer,

            getCreditCards: getCreditCards,
            createCreditCards: createCreditCards,
            deleteCreditCards: deleteCreditCards,

            searchBookings: searchBookings,
            getBooking: getBooking,
            getBookingByNumber: getBookingByNumber,
            getFinalBookingByNumber: getFinalBookingByNumber,
            deleteBookings: deleteBookings

                ,
            getB2BProfile: getB2BProfile,
            getAvailablePaymentType: getAvailablePaymentType
        };

        return service;

        function getCustomerProfile(id) {
            return $http({
                method: 'GET',
                url: API_URL + CUSTOMER_PROFILE_URL + "/" + id,
                params: {
                    "query": '',
                    "page": 0,
                    "size": 1000,
                }
            }).then(function successCallback(response) {
                $log.log("successCallback getCustomerProfile result: ");
                $log.log(response);
                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getCustomerProfile result: ");
                $log.log(response);
                return response.data;
            });
        }

        //Huy update avatar begin
        function getCustomerProfileAvatar(id) {
            return $http({
                method: 'GET',
                url: API_URL + CUSTOMER_PROFILE_AVATAR_URL + "/" + id
            }).then(function successCallback(response) {
                $log.log("successCallback getCustomerProfileAvatar result: ");
                $log.log(response);
                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getCustomerProfileAvatar result: ");
                $log.log(response);
                return response.data;
            });
        }

        //End

        function getB2BProfile(loginname) {
            if (MerchantService.isSimpleView()) {
                return $q.reject();
            }

            return $http.post(
                    API_URL + B2B_AGENT_PROFILE_URL, loginname)
                .then(function successCallback(response) {
                    $log.log("successCallback getB2BProfile result: ");
                    $log.log(response);
                    return response.data;
                }, function errorCallback(response) {
                    $log.log("errorCallback getB2BProfile result: ");
                    $log.log(response);
                    return response.data;
                });
        }

        function getShortProfile() {

            if (MerchantService.isSimpleView()) {
                return $q.reject();
            }

            return $http({
                method: 'GET',
                url: API_URL + PROFILE_SHORT_URL,
                params: {
                    "query": '',
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("successCallback getShortProfile result: ");
                $log.log(response);
                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getShortProfile result: ");
                $log.log(response);
                return response.data;
            });
        }

        function getCustomerTravellers() {
            return $http({
                method: 'GET',

                url: API_URL + CUSTOMER_TRAVELLERS_URL,
                params: {
                    "query": '',
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("successCallback getCustomerTravellers result: ");
                $log.log(response);

                // var d = response.data;
                //
                // d.links = ParseLinks.parse(response.headers('link'));
                // d.totalItems = response.headers('X-Total-Count');
                // d.totalPages = response.headers('X-Total-Page');
                //
                // $log.log('links = ' + d.links);
                // $log.log(d.links);
                // $log.log('totalItems = ' + d.totalItems);
                // $log.log('totalPages = ' + d.totalPages);
                //
                // // $log.log(headers(), 'headers');
                //
                // return d;

                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getCustomerTravellers result: ");
                $log.log(response);
                return [];
            });
        }

        function getCustomerTravellersPagination(page) {
            return $http({
                method: 'GET',
                url: API_URL + CUSTOMER_TRAVELLERS_URL,
                params: {
                    "query": '',
                    "page": page - 1,
                    "size": 10
                }
            }).then(function successCallback(response) {
                $log.log("successCallback getCustomerTravellers result: ");
                $log.log(response);

                var d = response.data;

                d.links = ParseLinks.parse(response.headers('link'));
                d.totalItems = response.headers('X-Total-Count');
                d.totalPages = response.headers('X-Total-Page');

                $log.log('links = ' + d.links);
                $log.log(d.links);
                $log.log('totalItems = ' + d.totalItems);
                $log.log('totalPages = ' + d.totalPages);

                // $log.log(headers(), 'headers');

                return d;

                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getCustomerTravellers result: ");
                $log.log(response);
                return [];
            });
        }

        function getCustomerTravellersForBoth() {
            return $http({
                method: 'GET',
                url: API_URL + CUSTOMER_TRAVELLERS_FOR_BOTH_URL,
                params: {
                    "query": '',
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("successCallback getCustomerTravellersForBoth result: ");
                $log.log(response);

                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getCustomerTravellersForBoth result: ");
                $log.log(response);
                return [];
            });
        }

        function getCustomerTraveller(id) {
            return $http({
                method: 'GET',
                url: API_URL + CUSTOMER_TRAVELLERS_DETAIL_URL + "/" + id,
                params: {
                    "query": '',
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("successCallback getCustomerTraveller result: ");
                $log.log(response);

                // response.data.dob = DateUtils.convertZoneDateFromServer(response.data.dob);
                if (response.data.dob) response.data.dob = DateUtils.convertZoneDateFromServer(response.data.dob);
                if (response.data.expiredDate) response.data.expiredDate = DateUtils.convertZoneDateFromServer(response.data.expiredDate);
                if (response.data.issuedDate) response.data.issuedDate = DateUtils.convertZoneDateFromServer(response.data.issuedDate);

                // $log.log('response.data.dob' + response.data.dob + ', response.data.expiredDate=' + response.data.expiredDate
                //     + ',response.data.issuedDate=)' + response.data.issuedDate);

                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getCustomerTraveller result: ");
                $log.log(response);

                return response;
            });
        }

        // used in booking
        function addCustomerTravellers(bookingOptions) {
            var data = [];

            var customers = bookingOptions.customers;
            var customerInfos = [];

            if (customers != null && customers != undefined) {
                angular.forEach(customers, function(value, key) {
                    var item = value;
                    if (item.checked == 1) {

                        var tmp = {
                            "id": item.id,
                            "adultType": item.type,
                            "country": item.cuNationality,
                            "dob": item.cuDob,
                            "expiredDate": item.cuExpiredDate,
                            "documentNumber": item.cuId,
                            "documentType": item.cuPp,
                            "firstName": item.cuName,
                            "gender": item.cuGender,
                            "nationality": item.cuNationality,
                            "surName": item.cuFamilyName
                        };

                        if (item.cuCardType && item.cuCardNo) {
                            tmp.memberCards = [{
                                "cardType": item.cuCardType,
                                "cardNumber": item.cuCardNo,
                                "id": item.cuCardId
                            }];
                        }

                        customerInfos.push(tmp);
                    }

                });
            }

            var contacts = bookingOptions.contacts;
            //$log.log("contacts = " + JSON.stringify(contacts));
            $log.log("contacts = " + contacts);

            if (contacts != null && contacts != undefined) {
                angular.forEach(contacts, function(value, key) {
                    var item = value;
                    if (item.checked == 1) {
                        // var idx = item.ciName.indexOf(" ");
                        // var fname = item.ciName.substr(idx + 1);
                        // var sname = item.ciName.substr(0, idx);

                        customerInfos.push({
                            "id": item.id,
                            "gender": item.ciGender,
                            "firstName": item.ciName,
                            "surName": item.ciFName,
                            "email": item.ciEmail,
                            "phoneNumber1": item.ciMobile,
                            "postalCode": item.ciMobileCode
                        });
                    }

                });
            }

            data = customerInfos;


            //if (customerInfos.length > 0) {
            $log.log("addCustomerTravellers criteria:");
            //$log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.put(
                    API_URL + AIR_CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback addCustomerTravellers');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback addCustomerTravellers');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
            //}


        }

        // used in profile
        function addCustomerTravellersProfile(options) {
            var data = options;

            var dataCollection = [];
            dataCollection.push(data);

            // PROCESS DATE
            if (data.dob) data.dob = DateUtils.convertZoneDateToServer(data.dob);
            if (data.expiredDate) data.expiredDate = DateUtils.convertZoneDateToServer(data.expiredDate);
            if (data.issuedDate) data.issuedDate = DateUtils.convertZoneDateToServer(data.issuedDate);

            // PROCESS PHONE
            if (data.phoneNumbers) {
                var length = data.phoneNumbers.length;
                if (length >= 1) {
                    data.phoneNumber1 = data.phoneNumbers[0].text;
                }
                if (length >= 2) {
                    data.phoneNumber2 = data.phoneNumbers[1].text;
                }
                if (length >= 3) {
                    data.phoneNumber3 = data.phoneNumbers[2].text;
                }
                if (length >= 4) {
                    data.phoneNumber4 = data.phoneNumbers[3].text;
                }
                if (length >= 5) {
                    data.phoneNumber5 = data.phoneNumbers[4].text;
                }

                if (length == 1) {
                    data.phoneNumber2 = '';
                    data.phoneNumber3 = '';
                    data.phoneNumber4 = '';
                    data.phoneNumber5 = '';

                } else if (length == 2) {
                    data.phoneNumber3 = '';
                    data.phoneNumber4 = '';
                    data.phoneNumber5 = '';

                } else if (length == 3) {
                    data.phoneNumber4 = '';
                    data.phoneNumber5 = '';

                } else if (length == 4) {
                    data.phoneNumber5 = '';
                }
            } else {
                data.phoneNumber1 = '';
                data.phoneNumber2 = '';
                data.phoneNumber3 = '';
                data.phoneNumber4 = '';
                data.phoneNumber5 = '';
            }

            // PROCESS MEMBER CARDS
            angular.forEach(data.editMemberCards, function(item, value) {
                item.cardNumber = item.curCardNumber;
                item.cardType = item.curCardType;
            });
            data.memberCards = data.memberCards.concat(data.editMemberCards);

            data.memberCardsTemp = [];
            for (var i = 0; i < data.memberCards.length; i++) {
                if (data.memberCards[i].cardType && data.memberCards[i].cardNumber) {
                    data.memberCardsTemp.push(data.memberCards[i]);
                }
            }
            data.memberCards = data.memberCardsTemp;

            $log.log("addCustomerTravellersProfile criteria:");
            //$log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.put(
                    API_URL + CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL, dataCollection)
                .then(function successCallback(response) {
                    $log.log('successCallback addCustomerTravellersProfile');
                    // $log.log("response = " + JSON.stringify(response));

                    if (response.data) {
                        response.data.success = true;
                    }

                    return response.data ? response.data : {};
                }, function errorCallBack(response) {
                    $log.log('errorCallBack addCustomerTravellersProfile');
                    // $log.log("response = " + JSON.stringify(response));
                    // return response.data ? response.data : {};
                    return $q.reject(response);
                });
            //}


        }

        function updateCustomerProfile(options) {
            var data = options;

            $log.log("updateCustomerProfile criteria:");
            //$log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.put(
                    API_URL + CUSTOMER_PROFILE_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback updateCustomerProfile');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallBack(response) {
                    $log.log('errorCallBack updateCustomerProfile');
                    // $log.log("response = " + JSON.stringify(response));
                    // return response.data ? response.data : {};
                    return $q.reject(response);
                });
            //}
        }

        // Update avatar for user
        function updateAvatarCustomer(options) {
            var data = options;

            $log.log("updateCustomerAvatar criteria:");
            //console.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.put(
                    API_URL + CUSTOMER_PROFILE_AVATAR_COMMON_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback updateCustomerAvatar');
                    return response.data ? response.data : {};
                }, function errorCallBack(response) {
                    $log.log('errorCallBack updateCustomerAvatar');

                    return $q.reject(response);
                });
            //}
        }

        function getCreditCards() {
            return $http({
                method: 'GET',
                url: API_URL + PRICING_CREDIT_CARDS_URL,
                params: {
                    "query": '',
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("successCallback getCreditCards result: ");
                $log.log(response);
                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getCreditCards result: ");
                $log.log(response);
                return [];
            });
        }

        function getAvailablePaymentType() {
            return $http({
                method: 'GET',
                url: API_URL + GET_AVAILABLE_PAYMENT_TYPE
            }).then(function successCallback(response) {
                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getAvailablePaymentType result: ");
                $log.log(response);
                return [];
            });
        }

        function createCreditCards(cardModel, paToken) {
            var data = {
                "card": cardModel,
                "paToken": paToken
            };
            //data.orgCode = 'C';
            // data.card.firstName = 'Thang';
            // data.card.lastName = 'Pham';
            // data.card.address = 'Address1';
            // data.card.country = 'VN';
            // data.card.city = 'HN';
            // data.card.state = 'HN';
            // data.card.postalCode = '084';
            // data.card.email = 'thangpv@fsoft.com.vn';
            // data.card.phoneNumber = '0988669696';
            data.card.cardId = null;

            // Change to match Enum
            if (data.type === 'MASTERCARD') {
                data.type = 'MASTER';
            }

            $log.log("createCreditCards criteria:");
            //$log.log("data=" + JSON.stringify(data));
            $log.log("data=" + data);
            $log.log("++++++++++++++++++++++++++++");

            return $http.post(
                    API_URL + PAYMENT_SUB_CARD_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback createCreditCards');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback createCreditCards');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                    // return response.data ? response.data : {};
                });
        }

        function deleteCreditCards(ids) {
            var data = ids;

            var data = ids.split(':');
            // data = data.filter(v => v != '');
            data = data.filter(function(entry) {
                return entry.trim() != '';
            });

            data = {
                "cardIds": data
            };

            //$log.log("deleteCreditCards ids = " + JSON.stringify(data));
            $log.log("deleteCreditCards ids = " + data);

            return $http.post(
                    API_URL + PAYMENT_UNSUB_CARD_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback deleteCreditCards');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback deleteCreditCards');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });
        }

        function deleteCustomerTravellers(ids) {
            var data = ids;
            //$log.log("deleteCustomerTravellers ids = " + JSON.stringify(ids));
            $log.log("deleteCustomerTravellers ids = " + ids);

            // data.orgCode = 'C';
            //
            // if (data.type == 'MASTERCARD') {
            //     data.type = 'MASTER';
            // }

            return $http.delete(
                    API_URL + CUSTOMER_TRAVELLERS_URL + "?ids=" + data, data)
                .then(function successCallback(response) {
                    $log.log('successCallback deleteCustomerTravellers');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback deleteCustomerTravellers');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                });
        }

        function searchBookings(options) {

            var paras = {
                "query": '',
                "page": options.page,
                "size": 15,
                "bookingCode": options.bookingCode,
                "bookingStatus": options.bookingStatus,
                "fromDate": options.fromDate,
                "toDate": options.toDate,
                "fromLocationName": options.fromLocationName,
                "toLocationName": options.toLocationName,
                "supplierType": options.supplierType
            };

            //$log.log('searchBookings:paras = ' + JSON.stringify(paras));
            $log.log('searchBookings:paras = ' + paras);

            return $http({
                method: 'GET',
                url: API_URL + BOOKING_SEARCH_URL,
                params: paras
            }).then(function successCallback(response, status, headers, config) {
                $log.log("successCallback searchBookings result: ");
                $log.log(response);

                var d = response.data;

                //d.links = ParseLinks.parse(response.headers('link'));
                d.links = "/api/bookings";
                d.totalItems = response.headers('X-Total-Count');

                // $log.log(headers(), 'headers');

                return d;
            }, function errorCallback(response) {
                $log.log("errorCallback searchBookings result: ");
                $log.log(response);
                return [];
            });
        }

        function getBooking(id) {
            $log.log("getBooking(id):" + BOOKING_DETAILS_URL + "/" + id);
            return $http({
                method: 'GET',
                url: API_URL + BOOKING_DETAILS_URL + "/" + id,
                params: {
                    "query": '',
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("successCallback getBooking result: ");
                $log.log(response);
                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getBooking result: ");
                $log.log(response);
                return response.data;
            });
        }

        function getBookingByNumber(bookingNumber) {
            $log.log("getBookingByNumber(bookingNumber): " + PRODUCT_BOOKING_DETAILS_URL + ", bookingNumber:" + bookingNumber);
            var paras = {
                "booking_number": bookingNumber
            };
            return $http({
                method: 'GET',
                url: API_URL + PRODUCT_BOOKING_DETAILS_URL,
                params: paras
            }).then(function successCallback(response) {
                $log.log('successCallback getBookingByNumber');
                $log.log(response);

                // $window.parent.postMessage(response.data,'*');

                return response.data;
            }, function errorCallback(response) {
                $log.log('errorCallback getBookingByNumber');
                $log.log(response);
                return $q.reject(response);
            });
        }

        function getFinalBookingByNumber(bookingNumber, waitCallBack) {
            $log.log("getBookingByNumber(bookingNumber): " + PRODUCT_FINAL_BOOKING_DETAILS_URL + ", bookingNumber:" + bookingNumber);
            var paras = {
                "booking_number": bookingNumber
            };
            return $http({
                method: 'GET',
                url: API_URL + PRODUCT_FINAL_BOOKING_DETAILS_URL,
                params: paras
            }).then(function successCallback(response) {
                $log.log('successCallback getBookingByNumber');
                $log.log(response);
                return response.data;
            }, function errorCallback(response) {
                $log.log('errorCallback getBookingByNumber');
                $log.log(response);
                return $q.reject(response);
            });
        }

        function deleteBookings(ids) {
            var data = ids;
            //$log.log("deleteBookings ids = " + JSON.stringify(ids));
            $log.log("deleteBookings ids = " + ids);

            // data.orgCode = 'C';
            //
            // if (data.type == 'MASTERCARD') {
            //     data.type = 'MASTER';
            // }

            return $http.delete(
                    API_URL + BOOKING_DETAILS_URL + "?ids=" + data, data)
                .then(function successCallback(response) {
                    $log.log('successCallback deleteBookings');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                }, function errorCallback(response) {
                    $log.log('errorCallback deleteBookings');
                    // $log.log("response = " + JSON.stringify(response));
                    return response.data ? response.data : {};
                });
        }
    }
})();