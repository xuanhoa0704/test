(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('DataUtils', DataUtils);

    DataUtils.$inject = ['$log', '$window', 'AuthServerProvider'];

    function DataUtils($log, $window, AuthServerProvider) {

        var service = {
            abbreviate: abbreviate,
            byteSize: byteSize,
            openFile: openFile,
            toBase64: toBase64,
            ibeOpenWindow: ibeOpenWindow
        };

        return service;

        function abbreviate(text) {
            if (!angular.isString(text)) {
                return '';
            }
            if (text.length < 30) {
                return text;
            }
            return text ? (text.substring(0, 15) + '...' + text.slice(-10)) : '';
        }

        function byteSize(base64String) {
            if (!angular.isString(base64String)) {
                return '';
            }

            function endsWith(suffix, str) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            }

            function paddingSize(base64String) {
                if (endsWith('==', base64String)) {
                    return 2;
                }
                if (endsWith('=', base64String)) {
                    return 1;
                }
                return 0;
            }

            function size(base64String) {
                return base64String.length / 4 * 3 - paddingSize(base64String);
            }

            function formatAsBytes(size) {
                return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes';
            }

            return formatAsBytes(size(base64String));
        }

        /**
         *
         * @param type
         * @param data
         */
        function openFile(type, data) {
            $window.open('data:' + type + ';base64,' + data, '_blank', 'height=300,width=400');
        }

        /**
         *
         * @param url
         * @param token
         */
        function ibeOpenWindow(url) {
            try {
                var tokenKey = angular.element('#token_key');
                tokenKey[0].value = AuthServerProvider.getToken();;

                var form = angular.element('#newibe_open_window_form');
                form[0].action = url;

                form[0].submit();
            } catch (e) {
                $log.log("-----ibeOpenWindow=" + e);
            }
        }

        /**
         *
         * @param file
         * @param cb
         */
        function toBase64(file, cb) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                var base64Data = e.target.result.substr(e.target.result.indexOf('base64,') + 'base64,'.length);
                cb(base64Data);
            };
        }
    }
})();