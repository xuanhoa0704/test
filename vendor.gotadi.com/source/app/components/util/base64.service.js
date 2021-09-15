(function() {
    /*jshint bitwise: false*/
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('Base64', Base64);

    Base64.$inject = ['$log'];

    function Base64($log) {
        var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';

        var service = {
            decode: decode,
            decodeJson: decodeJson,
            decodeString: decodeString,
            encode: encode,
            encodeJson: encodeJson,
            encodeString: encodeString
        };

        return service;

        /**
         *
         * @param str
         * @returns {string}
         */
        function encode(str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));
        }

        /**
         *
         * @param objJson
         * @returns {string}
         */
        function encodeJson(objJson) {
            try {
                return encode(JSON.stringify(objJson));
            } catch (err) {
                $log.log("encodeJson - err: " + err);
            }
            return "";
        }

        /**
         *
         * @param str
         * @returns {string}
         */
        function encodeString(str) {
            try {
                return encode(str);
            } catch (err) {
                $log.log("encodeString - err: " + err);
            }
            return "";
        }

        /**
         *
         * @param str
         * @returns {string}
         */
        function decode(str) {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }

        /**
         *
         * @param base64Json
         * @returns {*}
         */
        function decodeJson(base64Json) {
            try {
                return JSON.parse(decode(base64Json));
            } catch (err) {
                $log.log("decodeJson - err: " + err);
            }
            return {};
        }

        /**
         *
         * @param base64String
         * @returns {string}
         */
        function decodeString(base64String) {
            try {
                return decode(base64String);
            } catch (err) {
                $log.log("decodeString - err: " + err);
            }
            return "";
        }
    }
})();