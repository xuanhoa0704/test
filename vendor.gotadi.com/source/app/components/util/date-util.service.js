(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('DateUtils', DateUtils);

    DateUtils.$inject = ['$log', '$filter'];

    function DateUtils($log, $filter) {

        var service = {
            convertDateTimeFromServer: convertDateTimeFromServer,
            convertLocalDateFromServer: convertLocalDateFromServer,
            convertLocalDateToServer: convertLocalDateToServer,

            convertZoneDateToServer: convertZoneDateToServer,
            convertZoneDateFromServer: convertZoneDateFromServer,

            dateformat: dateformat,
            getDayAgo: getDayAgo,

            getDayAgoInDefaultFormat: getDayAgoInDefaultFormat,
            getDayAgoFromBaseInDefaultFormat: getDayAgoFromBaseInDefaultFormat,

            getYearAgoFromBasePlusDaysInDefaultFormat: getYearAgoFromBasePlusDaysInDefaultFormat,
            getYearAgoFromBaseMinusDaysInDefaultFormat: getYearAgoFromBaseMinusDaysInDefaultFormat,
            getYearAgoInDefaultFormat: getYearAgoInDefaultFormat,
            getYearAgoFromBaseInDefaultFormat: getYearAgoFromBaseInDefaultFormat,

            getMonthAgoFromBaseInDefaultFormat: getMonthAgoFromBaseInDefaultFormat,
            getMonthAgoFromBasePlusDaysInDefaultFormat: getMonthAgoFromBasePlusDaysInDefaultFormat,

            timeDiff: timeDiff
        };

        return service;

        function convertDateTimeFromServer(date) {
            if (date) {
                return new Date(date);
            } else {
                return null;
            }
        }

        function convertLocalDateFromServer(date) {
            if (date) {
                var dateString = date.split('-');
                return new Date(dateString[0], dateString[1] - 1, dateString[2]);
            }
            return null;
        }

        function convertLocalDateToServer(date) {
            if (date) {
                return $filter('date')(date, 'yyyy-MM-dd');
            } else {
                return null;
            }
        }

        // IN USED
        function convertZoneDateToServer(date) {
            return moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD') + "T00:00:00.000Z";
        }

        function convertZoneDateFromServer(date) {
            return moment(date).format('DD-MM-YYYY');
        }

        function dateformat() {
            return 'yyyy-MM-dd';
        }

        function timeDiff(fromDate, toDate) {
            var fr = new Date(fromDate);
            var to = new Date(toDate);
            return to - fr;
        }

        function getDayAgo(b) {
            var a = new Date();
            a.setDate(a.getDate() - b);
            return a;
        }

        function getDayAgoFromBase(from, b) {
            var fsmoment = moment.utc(from);
            return fsmoment.subtract(b, 'days');
        }

        function getDayAgoInDefaultFormat(b) {
            return moment(getDayAgo(b)).format('YYYY-MM-DD');
        }

        function getDayAgoFromBaseInDefaultFormat(fromDate, b) {
            return getDayAgoFromBase(fromDate, b).format('YYYY-MM-DD');
        }

        function getYearAgoInDefaultFormat(b) {
            var fsmoment = moment.utc(new Date());
            if (b >= 0) {
                return moment(fsmoment.subtract(b, "years")).format('YYYY-MM-DD');
            } else {
                return moment(fsmoment.add(-b, "years")).format('YYYY-MM-DD');
            }

        }

        function getYearAgoFromBaseInDefaultFormat(fromDate, b) {
            var fsmoment = moment.utc(fromDate);
            if (b >= 0) {
                return moment(fsmoment.subtract(b, "years")).format('YYYY-MM-DD');
            } else {
                return moment(fsmoment.add(-b, "years")).format('YYYY-MM-DD');
            }
        }

        function getMonthAgoFromBaseInDefaultFormat(fromDate, b) {
            var fsmoment = moment.utc(fromDate);
            if (b >= 0) {
                return moment(fsmoment.subtract(b, "months")).format('YYYY-MM-DD');
            } else {
                return moment(fsmoment.add(-b, "months")).format('YYYY-MM-DD');
            }
        }

        function getYearAgoFromBasePlusDaysInDefaultFormat(fromDate, b, deltaDays) {
            var fsmoment = moment.utc(fromDate);
            if (b >= 0) {
                return moment(fsmoment.subtract(b, "years").add(deltaDays, 'days')).format('YYYY-MM-DD');
            } else {
                return moment(fsmoment.add(-b, "years").add(deltaDays, 'days')).format('YYYY-MM-DD');
            }
        }

        function getYearAgoFromBaseMinusDaysInDefaultFormat(fromDate, b, deltaDays) {
            var fsmoment = moment.utc(fromDate);
            if (b >= 0) {
                return moment(fsmoment.subtract(b, "years").subtract(deltaDays, 'days')).format('YYYY-MM-DD');
            } else {
                return moment(fsmoment.add(-b, "years").subtract(deltaDays, 'days')).format('YYYY-MM-DD');
            }
        }

        function getMonthAgoFromBasePlusDaysInDefaultFormat(fromDate, b, deltaDays) {
            var fsmoment = moment.utc(fromDate);
            if (b >= 0) {
                return moment(fsmoment.subtract(b, "months").add(deltaDays, 'days')).format('YYYY-MM-DD');
            } else {
                return moment(fsmoment.add(-b, "months").add(deltaDays, 'days')).format('YYYY-MM-DD');
            }
        }

    }

})();