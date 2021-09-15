(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdVnPhone', gtdVnPhone);

    gtdVnPhone.$inject = ['$log', '$timeout'];

    function gtdVnPhone($log, $timeout) {

        // function gtdVnPhone() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ctrl) {

                var MIN_LENGTH = 10;
                var MAX_LENGTH = 14;
                var PHONE_NUMBER_LENGTH = 7;
                var COUNTRY_PREFIXES = ['0084', '084', '84'];
                var MOBILE_THREE_DIGIT_PREFIXES = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
                var MOBILE_FOUR_DIGIT_PREFIXES = ['0120', '0121', '0122', '0123', '0124', '0125', '0126', '0127', '0128', '0129', '0162', '0163', '0164', '0165', '0166', '0167', '0168', '0169', '0186', '0188', '0199'];
                var REDUDANT_CHARS = ['\\(', '\\)', '\\-', '\\.', '\\s', '\+'];
                var REDUDANT_REGEX = new RegExp("[" + (REDUDANT_CHARS.join('')) + "]", 'g');
                var NON_DIGIT_REGEX = /\D/;
                var COUNTRY_CODE_REGEX = new RegExp("^(" + (COUNTRY_PREFIXES.join('|')) + ")");
                var FAILURE_RETURN = false;
                // var FAILURE_RETURN_LENGTH = 'ERR_LENGTH';
                // var FAILURE_RETURN_NON_DIGIT = 'ERR_NON_DIGIT';
                // var FAILURE_RETURN_MOBILE_PREFIX = 'ERR_PROVIDER';
                // var FAILURE_RETURN_NUMBER_LENGTH = 'ERR_NUMBER_LENGTH';

                var FAILURE_RETURN_LENGTH = 'NOT_VN_PHONE';
                var FAILURE_RETURN_NON_DIGIT = 'NOT_VN_PHONE';
                var FAILURE_RETURN_MOBILE_PREFIX = 'NOT_VN_PHONE';
                var FAILURE_RETURN_NUMBER_LENGTH = 'NOT_VN_PHONE';

                function validatePhone(ngModelValue) {

                    var originalPhoneNumber = ngModelValue;
                    if (originalPhoneNumber) {
                        var mobileOnly = true;

                        var length, mobilePrefixLength, phone, ref, ref1;
                        if (mobileOnly == null) {
                            mobileOnly = true;
                        }
                        phone = originalPhoneNumber;
                        phone = phone.replace(REDUDANT_REGEX, '');
                        length = phone.length;
                        if (!((MIN_LENGTH <= length && length <= MAX_LENGTH))) {
                            ctrl.$setValidity('phoneValidator', false);
                            return FAILURE_RETURN_LENGTH;
                        }
                        if (NON_DIGIT_REGEX.test(phone)) {
                            ctrl.$setValidity('phoneValidator', false);
                            return FAILURE_RETURN_NON_DIGIT;
                        }
                        phone = phone.replace(COUNTRY_CODE_REGEX, '');
                        if (phone[0] !== '0') {
                            phone = '0' + phone;
                        }
                        length = phone.length;

                        var refPhone4 = phone.slice(0, 4);
                        var refPhone3 = phone.slice(0, 3);

                        angular.forEach(MOBILE_FOUR_DIGIT_PREFIXES, function(code) {
                            if (code == refPhone4) {
                                mobilePrefixLength = 4;
                            }
                        });

                        if (!mobilePrefixLength) {
                            angular.forEach(MOBILE_THREE_DIGIT_PREFIXES, function(code) {
                                if (code == refPhone3) {
                                    mobilePrefixLength = 3;
                                }
                            });
                        }

                        if (!mobilePrefixLength) {
                            mobilePrefixLength = 0;
                        }

                        if (mobilePrefixLength === 0) {
                            ctrl.$setValidity('phoneValidator', false);
                            return FAILURE_RETURN_MOBILE_PREFIX;
                        }
                        if (length - mobilePrefixLength !== PHONE_NUMBER_LENGTH) {
                            ctrl.$setValidity('phoneValidator', false);
                            return FAILURE_RETURN_NUMBER_LENGTH;
                        }

                        ctrl.$setValidity('phoneValidator', true);
                        return phone;
                    } else {
                        ctrl.$setValidity('phoneValidator', true);
                        return originalPhoneNumber;
                    }


                }

                // we need to add our customValidator function to an array of other(build-in or custom) functions
                // I have not notice any performance issues, but it would be worth investigating how much
                // effect does this have on the performance of the app
                ctrl.$parsers.push(validatePhone);
            }
        };
    }
})();