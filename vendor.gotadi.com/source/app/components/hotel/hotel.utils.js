(function() {
    /*jshint bitwise: false*/
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('HotelUtils', HotelUtils);

    HotelUtils.$inject = ['$log', '$uibModal', '$translate', '$state', 'DataService', 'TRANS_TIME_OUT', 'DialogService', 'GlobalSrv', 'FREE_WIFI_IDS', 'FREE_PARKING_IDS', 'HAS_SWIMMING_POOL_IDS', 'FREE_GYM', 'FREE_BREAKFAST', 'FREE_BREAKFAST_TEXT', 'FREE_PARKING_TEXT', 'FREE_WIFI_TEXT', 'FREE_DRINK_TEXT', 'FREE_BREAKFAST_TEXT_KEY', 'FREE_PARKING_TEXT_KEY', 'FREE_WIFI_TEXT_KEY', 'FREE_DRINK_TEXT_KEY'];

    function HotelUtils($log, $uibModal, $translate, $state, DataService, TRANS_TIME_OUT, DialogService, GlobalSrv, FREE_WIFI_IDS, FREE_PARKING_IDS, HAS_SWIMMING_POOL_IDS, FREE_GYM, FREE_BREAKFAST, FREE_BREAKFAST_TEXT, FREE_PARKING_TEXT, FREE_WIFI_TEXT, FREE_DRINK_TEXT, FREE_BREAKFAST_TEXT_KEY, FREE_PARKING_TEXT_KEY, FREE_WIFI_TEXT_KEY, FREE_DRINK_TEXT_KEY) {

        var service = {
            getFacilityClass: getFacilityClass,
            getFacilityText: getFacilityText,
            getFacilities: getFacilities,

            getAdultNumberFromSo: getAdultNumberFromSo,
            getChildrenNumberFromSo: getChildrenNumberFromSo
        };

        return service;

        function getFacilityClass(facility) {
            if (facility == 'wifi') {
                return "fa-wifi";
            } else if (facility == 'bar') {
                return "fa-glass";
            } else if (facility == 'breakfast') {
                return "fa-coffee";
            } else if (facility == 'car') {
                return "fa-car";
            } else if (facility == 'pool') {
                return "fa-swimming-pool";
            }
            return facility;
        }

        function getFacilities(item) {
            if (!item) return;
            item.displayAmentities = [];
            item.selectedAmentities = [];
            if (item.hotelMeta.amentities) {
                var i = 0;
                item.hotelMeta.amentities.forEach(function(aItem) {
                    if (FREE_WIFI_IDS.indexOf(aItem.id) !== -1 && item.displayAmentities.indexOf('wifi') == -1) {
                        item.displayAmentities[i] = 'wifi';
                        item.selectedAmentities[i] = aItem.name;
                        i++;
                    }
                    if (FREE_PARKING_IDS.indexOf(aItem.id) !== -1 && item.displayAmentities.indexOf('car') == -1) {
                        item.displayAmentities[i] = 'car';
                        item.selectedAmentities[i] = aItem.name;
                        i++;
                    }
                    if (HAS_SWIMMING_POOL_IDS.indexOf(aItem.id) !== -1 && item.displayAmentities.indexOf('pool') == -1) {
                        item.displayAmentities[i] = 'pool';
                        item.selectedAmentities[i] = aItem.name;
                        i++;
                    }
                    if (FREE_GYM.indexOf(aItem.id) !== -1 && item.displayAmentities.indexOf('gym') == -1) {
                        item.displayAmentities[i] = 'gym';
                        item.selectedAmentities[i] = aItem.name;
                        i++;
                    }
                    if (FREE_BREAKFAST.indexOf(aItem.id) !== -1 && item.displayAmentities.indexOf('breakfast') == -1) {
                        item.displayAmentities[i] = 'breakfast';
                        item.selectedAmentities[i] = aItem.name;
                        i++;
                        item.hasBreakfast = true;
                    }
                });
            }
        }

        function getFacilityText(text) {
            if (!text) return;
            if (FREE_DRINK_TEXT.indexOf(text) !== -1) {
                return 'bar';
            }
            if (FREE_BREAKFAST_TEXT.indexOf(text) !== -1) {
                return 'breakfast';
            }
            if (FREE_PARKING_TEXT.indexOf(text) !== -1) {
                return 'car-black';
            }
            if (FREE_WIFI_TEXT.indexOf(text) !== -1) {
                return 'wifi'
            }
            var rs = null;
            FREE_BREAKFAST_TEXT_KEY.forEach(function(item) {
                if (text.toUpperCase().indexOf(item.toUpperCase()) !== -1) {
                    return rs = 'breakfast';
                }
            });

            FREE_DRINK_TEXT_KEY.forEach(function(item) {
                if (text.toUpperCase().indexOf(item.toUpperCase()) !== -1) {
                    return rs = 'bar';
                }
            });
            FREE_PARKING_TEXT_KEY.forEach(function(item) {
                if (text.toUpperCase().indexOf(item.toUpperCase()) !== -1) {
                    return rs = 'car-black';
                }
            });
            FREE_WIFI_TEXT_KEY.forEach(function(item) {
                if (text.toUpperCase().indexOf(item.toUpperCase()) !== -1) {
                    return rs = 'wifi';
                }
            });
            return rs;
        }

        function getAdultNumberFromSo(options) {

            var result = 0;

            angular.forEach(options.pax, function(item) {
                result += parseInt(item.adultNo);
                // result = item.adultNo;
            });

            return result;
        }

        function getChildrenNumberFromSo(options) {
            var result = 0;

            angular.forEach(options.pax, function(item) {
                result += parseInt(item.childrenNo);
                // result = item.childrenNo;
            });

            return result;
        }
    }
})();