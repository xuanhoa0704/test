(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('momentdate', momentdate);

    momentdate.$inject = ['$log'];

    function momentdate($log) {

        return momentdateFilter;

        function momentdateFilter(input, type, format) {
            var result = input;

            if (input) {
                moment().locale('vi');

                if (format) {
                    if (type == 'date') {
                        // $log.log('date');
                        result = moment.utc(input, format).locale('vi').format("dddd, DD-MM-YYYY");
                    } else if (type == 'hourdate') {
                        // $log.log('hourdate');
                        result = moment.utc(input, format).locale('vi').format("HH:mm, dddd, DD-MM-YYYY");
                    } else if (type == 'hour') {
                        // $log.log('hour');
                        result = moment.utc(input, format).locale('vi').format("HH:mm");
                    } else if (type == 'datehour0') {
                        // $log.log('datehour0');
                        result = moment.utc(input, format).locale('vi').format("DD-MM-YYYY HH:mm");

                        /* Format with Local time */
                    } else if (type == 'localdate') {
                        result = moment.utc(input, format).locale('vi').format("dddd, DD-MM-YYYY");
                    } else if (type == 'localhourdate') {
                        // console.log('hourdate');
                        result = moment(input, format).locale('vi').format("HH:mm, dddd, DD-MM-YYYY");

                    } else {
                        // default
                        // $log.log('default');
                        result = moment.utc(input, format).locale('vi').format("DD-MM-YYYY");
                    }
                } else {
                    if (type == 'load-date') {
                        result = moment.utc(input, 'DD-MM-YYYY').locale('vi').format("dddd, DD-MM");
                    } else if (type == 'date') {
                        // $log.log('date');
                        result = moment.utc(input).locale('vi').format("dddd, DD-MM-YYYY");
                    } else if (type == 'hourdate') {
                        // $log.log('hourdate');
                        result = moment.utc(input).locale('vi').format("HH:mm, dddd, DD-MM-YYYY");
                    } else if (type == 'hour') {
                        // $log.log('hour');
                        result = moment.utc(input).locale('vi').format("HH:mm");
                    } else if (type == 'datehour0') {
                        // $log.log('datehour0');
                        result = moment.utc(input).locale('vi').format("DD-MM-YYYY HH:mm");

                        /* Format with Local time */
                    } else if (type == 'localdate') {
                        result = moment.utc(input).locale('vi').format("dddd, DD-MM-YYYY");
                    } else if (type == 'localhourdate') {
                        // console.log('hourdate');
                        result = moment(input).locale('vi').format("HH:mm, dddd, DD-MM-YYYY");

                    } else {
                        // default
                        // $log.log('default');
                        result = moment.utc(input).locale('vi').format("DD-MM-YYYY");
                    }
                }

            }

            // $log.log(result);
            return result;
        }
    }
})();