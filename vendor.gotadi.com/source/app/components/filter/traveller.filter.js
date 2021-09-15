(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('traveller', traveller);

    traveller.$inject = [];

    function traveller() {
        return travellerFilter;

        function travellerFilter(input, type) {
            if (input) {
                return input.filter(function(item) {
                    if (item.adultType) {
                        return item.adultType == type;
                    } else {
                        if (type == 'ADT') {
                            return item.gender == 'FEMALE' || item.gender == 'MALE';
                        } else {
                            return item.gender == 'BOY' || item.gender == 'GIRL';
                        }
                    }
                });
            }
            return input;
        }
    }
})();