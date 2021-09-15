(function() {
    'use strict';

    /* It's not gender filter any more, it used to display I18N of lookup */
    /* Still keeping gender name -> to refactored LATER */

    angular
        .module('B2B2CGatewayApp')
        .filter('gender', gender);

    gender.$inject = ['$log', 'GlobalSrv', 'DataService', 'MetaData', '$translate', '$filter'];

    function gender($log, GlobalSrv, DataService, MetaData, $translate, $filter) {
        return genderFilter;

        function genderFilter(input, type) {
            var result = input;

            var PREFIX = '';

            if (type == 'cabinclass') {
                PREFIX = 'ota_air.cabin_class';
            }

            result = $translate.instant($filter('lowercase')(PREFIX + '.' + input));

            // if (input == 'MALE') result = "Nam";
            // else if (input == 'FEMALE') result = "Nữ";
            // else if (input == 'BOY') result = "Con trai";
            // else if (input == 'GIRL') result = "Con gái";

            return result;
        }
    }
})();