(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('unixtime', unixtime);

    function unixtime() {
        return unixtimeFilter;

        function unixtimeFilter(value, format) {
            // var oneSecond = 1000;
            // var oneMinute = oneSecond * 60;
            var sv = '' + value;
            if (sv) {
                if (sv.indexOf('Z') != -1) {
                    return sv;
                } else {
                    return new Date(value * 1000);
                }
            } else {
                return sv;
            }

        }
    }
})();