(function() {
    'use strict';
    angular
        .module('B2B2CGatewayApp')
        .factory('MetaData', MetaData);

    MetaData.$inject = ['$resource', '$http', '$log', 'GlobalSrv', 'DataService', 'META_AIRPORT_URL', 'META_SEARCH_AIRPORT_URL', 'META_AIRLINE_URL', 'META_COUNTRY_CODE_URL', 'META_SEARCH_LOOKUP_URL', 'META_DESTINATION_URL', 'PAYMENT_ATM_DEBIT_OPTIONS', 'API_URL'];

    function MetaData($resource, $http, $log, GlobalSrv, DataService, META_AIRPORT_URL, META_SEARCH_AIRPORT_URL, META_AIRLINE_URL, META_COUNTRY_CODE_URL, META_SEARCH_LOOKUP_URL, META_DESTINATION_URL, PAYMENT_ATM_DEBIT_OPTIONS, API_URL) {

        var service = {
            getAirports: getAirports,
            getAirlines: getAirlines,
            getCountries: getCountries

                ,
            searchAirports: searchAirports,
            searchAirportsWithout: searchAirportsWithout,
            searchAirportsLocal: searchAirportsLocal,
            searchLookups: searchLookups

                ,
            searchDestinations: searchDestinations

                ,
            getHotelDestinationsAndPlaces: getHotelDestinationsAndPlaces,
            getPriceOptions: getPriceOptions,
            getStarRatingOptions: getStarRatingOptions,
            getHotelFeatures: getHotelFeatures

                ,
            getAtmDebitOptions: getAtmDebitOptions
        };

        return service;

        function getAirports() {


            var data = [{
                id: 'HAN',
                text: 'Hà Nội'
            }, {
                id: 'SGN',
                text: 'Hồ Chí Minh'
            }, {
                id: 'DAD',
                text: 'Đà Nẵng'
            }, {
                id: 3,
                text: 'Hội An'
            }, {
                id: 4,
                text: 'Vũng Tàu'
            }, {
                id: 5,
                text: 'Singapore'
            }, {
                id: 6,
                text: 'Hongkong'
            }];
            return data;
        }

        function getAirlines() {
            return $http({
                method: 'GET',
                url: API_URL + META_AIRLINE_URL,
                params: {
                    "query": '',
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("Search getAirlines result: ");
                $log.log(response.data);
                DataService.setAllAirlines(response.data);
                return response.data;
            }, function errorCallback(response) {
                return response.data;
            });
        }

        function searchAirports(val) {
            return $http({
                method: 'GET',
                url: API_URL + META_SEARCH_AIRPORT_URL,
                params: {
                    "query": val
                }
            }).then(function successCallback(response) {
                $log.log("Search Airports result: ");
                $log.log(response.data);

                GlobalSrv.addLocalAirports(response.data);

                return response.data;
            }, function errorCallback(response) {
                return response.data;
            });
        }

        function searchAirportsWithout(val, searchOptions, type) {
            return $http({
                method: 'GET',
                url: API_URL + META_SEARCH_AIRPORT_URL,
                params: {
                    "query": val
                }
            }).then(function successCallback(response) {
                $log.log("Search Airports result: ");
                $log.log(response.data);

                GlobalSrv.addLocalAirports(response.data);

                var tmp = response.data;

                var result = [];

                var excluded = '';
                if ('FROM' == type) {
                    excluded = searchOptions.toAirPort;
                } else if ('TO' == type) {
                    excluded = searchOptions.fromAirPort;
                }

                var isVNAirport = false;
                var vnAirports = GlobalSrv.getVnAirports();
                angular.forEach(vnAirports, function(airport) {
                    if (excluded) {
                        // $log.log(airport.code.toLowerCase() + ":" + excluded.toLowerCase() + ":" + airport.countryCode);
                        if (airport.code.toLowerCase() == excluded.toLowerCase() && airport.countryCode == 'VN') {
                            isVNAirport = true;
                        }
                    }
                });


                angular.forEach(tmp, function(item) {
                    if (item.code != excluded) {

                        if (searchOptions.dtype == 'domestic') {
                            if (item.countryCode == 'VN') {
                                result.push(item);
                            }
                        } else {
                            if (isVNAirport) {
                                if (item.countryCode != 'VN') {
                                    result.push(item);
                                }

                            } else {
                                result.push(item);
                            }

                        }

                    }
                });

                return result;
            }, function errorCallback(response) {
                return response.data;
            });
        }

        function searchAirportsLocal(countryCode) {
            return $http({
                method: 'GET',
                url: API_URL + META_SEARCH_AIRPORT_URL,
                params: {
                    "query": '1',
                    "country": "VN",
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("Search searchAirportsLocal result: ");
                $log.log(response.data);

                GlobalSrv.addLocalAirports(response.data);

                return response.data;
            }, function errorCallback(response) {
                return [];
            });
        }

        function searchLookups(domain, objectName, getAllOptional) {

            var query;
            // if (getAllOptional) {
            //     query = "air";
            // } else {
            //     query = "objectName:\"" +  objectName + "\"";
            // }

            if (getAllOptional) {
                domain = "Air";
                objectName = '';
            }

            return $http({
                method: 'GET',
                url: API_URL + META_SEARCH_LOOKUP_URL,
                params: {
                    "query": query,
                    "page": 0,
                    "size": 1000,
                    "domain_name": domain,
                    "object_name": objectName
                }
            }).then(function successCallback(response) {
                // $log.log("Search searchLookups result: " + domain + ":" + objectName);
                // $log.log("response=" + JSON.stringify(response.data));

                if (getAllOptional) {
                    GlobalSrv.setAllLookups(response.data);
                }

                return response.data;
            }, function errorCallback(response) {
                return response.data;
            });
        }

        var count = 0;

        function searchDestinations(val) {
            return $http({
                method: 'GET',
                url: API_URL + META_DESTINATION_URL,
                params: {
                    "query": val
                }
            }).then(function successCallback(response) {
                count++;
                $log.log("Search searchDestinations result: ");
                $log.log(count);

                // GlobalSrv.addLocalDestinations(response.data);

                return response.data;
            }, function errorCallback(response) {
                return [];
            });
        }

        function getCountries() {

            return $http({
                method: 'GET',
                url: API_URL + META_COUNTRY_CODE_URL,
                params: {
                    "page": 0,
                    "size": 1000,
                    "sort": "sortname,asc"
                }
            }).then(function successCallback(response) {
                $log.log("Search getCountries result: ");
                $log.log(response.data);

                GlobalSrv.setAllCountries(response.data);

                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getCountries result: ");
                $log.log(response);
                return [];
            });
        }

        function getAtmDebitOptions() {

            return $http({
                method: 'GET',
                url: API_URL + PAYMENT_ATM_DEBIT_OPTIONS,
                params: {
                    "page": 0,
                    "size": 1000
                }
            }).then(function successCallback(response) {
                $log.log("Search getAtmDebitOptions result: ");
                $log.log(response.data);

                //GlobalSrv.setAllCountries(response.data);

                return response.data;
            }, function errorCallback(response) {
                $log.log("errorCallback getAtmDebitOptions result: ");
                $log.log(response);
                return [];
            });
        }

        /** Hotels **/
        function getHotelDestinationsAndPlaces() {
            var data = [{
                id: 0,
                text: 'Hà Nội'
            }, {
                id: 1,
                text: 'Hồ Chí Minh'
            }, {
                id: 2,
                text: 'Đà Nẵng'
            }, {
                id: 3,
                text: 'Hội An'
            }, {
                id: 4,
                text: 'Vũng Tàu'
            }, {
                id: 5,
                text: 'Singapore'
            }, {
                id: 6,
                text: 'Hongkong'
            }];
            return data;
        }

        function getPriceOptions() {
            var data = [{
                id: 1,
                text: ' ota_hotel.lower',
                from: 0,
                to: 1000000,
                checked: false
            }, {
                id: 2,
                text: 'ota_hotel.from1',
                from: 1500000,
                to: 3500000,
                checked: false
            }, {
                id: 3,
                text: 'ota_hotel.from2',
                from: 3500000,
                to: 5500000,
                checked: false
            }, {
                id: 4,
                text: 'ota_hotel.higher',
                from: 7500000,
                to: -1,
                checked: false
            }];
            return data;
        }

        function getStarRatingOptions() {
            var data = [{
                id: 1,
                text: '1',
                checked: false
            }, {
                id: 2,
                text: '2',
                checked: false
            }, {
                id: 3,
                text: '3',
                checked: false
            }, {
                id: 4,
                text: '4',
                checked: false
            }, {
                id: 5,
                text: '5',
                checked: false
            }].reverse();
            return data;
        }

        function getHotelFeatures() {
            var data = [{
                id: 1,
                text: "Free Wifi",
                cls: 'hotel-free-wifi-icon',
                checked: false
            }, {
                id: 2,
                text: "Có chỗ đậu xe",
                cls: 'hotel-free-car-icon',
                checked: false
            }, {
                id: 3,
                text: "Có phòng gym",
                cls: 'hotel-free-gym-icon',
                checked: false
            }, {
                id: 4,
                text: "Có phục vụ bữa ăn",
                cls: 'hotel-free-meal-icon',
                checked: false
            }];
            return data;
        }

    }
})();