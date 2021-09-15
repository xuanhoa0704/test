(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdPhone', gtdPhone);

    gtdPhone.$inject = ['$log', '$timeout'];

    function gtdPhone($log, $timeout) {

        // function gtdPhone() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ctrl) {

                var FAILURE_NOT_VALID_PHONE = 'NOT_VALID_PHONE';

                function validatePhone(ngModelValue) {

                    var originalPhoneNumber = ngModelValue;

                    var valid = true;
                    var length = 0;
                    if (originalPhoneNumber) {
                        valid = /^[-\s\.0-9]+$/.test(originalPhoneNumber);
                        length = originalPhoneNumber.length;
                    }

                    if (valid && length >= 9 && length <= 11) {
                        ctrl.$setValidity('phoneValidator', true);
                    } else {
                        ctrl.$setValidity('phoneValidator', false);
                    }

                    return originalPhoneNumber;
                }

                // we need to add our customValidator function to an array of other(build-in or custom) functions
                // I have not notice any performance issues, but it would be worth investigating how much
                // effect does this have on the performance of the app
                ctrl.$parsers.push(validatePhone);
            }
        };
    }
})();