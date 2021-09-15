(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdDigitOnly', gtdDigitOnly);

    gtdDigitOnly.$inject = ['$log', '$timeout'];

    function gtdDigitOnly($log, $timeout) {

        // function gtdDigitOnly() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function(inputValue) {
                    if (inputValue == undefined) return '';
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
    }
})();