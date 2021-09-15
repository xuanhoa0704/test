(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdEmail', gtdEmail);

    gtdEmail.$inject = ['$log', '$timeout'];

    function gtdEmail($log, $timeout) {

        // function gtdEmail() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ctrl) {

                var FAILURE_NOT_VALID_PHONE = 'NOT_VALID_EMAIL';

                function validateEmail(ngModelValue) {

                    var orgEmail = ngModelValue;

                    if (orgEmail) {
                        // var valid = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/.test(orgEmail);
                        var valid = /^[a-zA-Z0-9][a-zA-Z0-9-_\.]+@([a-zA-Z]|[a-zA-Z0-9]?[a-zA-Z0-9-]+[a-zA-Z0-9])\.[a-zA-Z0-9]{2,10}(?:\.[a-zA-Z]{2,10})?$/.test(orgEmail);
                        if (valid) {
                            ctrl.$setValidity('emailValidator', true);
                        } else {
                            ctrl.$setValidity('emailValidator', false);
                        }
                    } else {
                        ctrl.$setValidity('emailValidator', true);
                    }

                    return orgEmail;
                }

                // we need to add our customValidator function to an array of other(build-in or custom) functions
                // I have not notice any performance issues, but it would be worth investigating how much
                // effect does this have on the performance of the app
                ctrl.$parsers.push(validateEmail);
            }
        };
    }
})();