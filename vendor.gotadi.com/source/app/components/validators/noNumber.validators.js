(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdNoNumber', gtdNoNumber);

    gtdNoNumber.$inject = ['$log', '$timeout'];

    function gtdNoNumber($log, $timeout) {

        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$validators.noNumber = function noNumber(modelValue, viewValue) {

                    var orgEmail = modelValue || viewValue;

                    if (orgEmail) {
                        var valid = /^([^0-9]*)$/.test(orgEmail);
                        return valid;

                    } else {
                        return (true);
                    }


                };
            }
        };
    }

})();