(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdNoSpecialChar', gtdNoSpecialChar);

    gtdNoSpecialChar.$inject = ['$log', '$timeout'];

    function gtdNoSpecialChar($log, $timeout) {

        // function gtdNoSpecialChar() {
        return {
            require: 'ngModel',
            scope: {
                gtdCapitalize: '=?'
            },
            restrict: 'A',
            link: function(scope, element, attrs, modelCtrl) {

                // alert(scope.gtdCapitalize);

                modelCtrl.$parsers.push(function(inputValue) {
                    if (inputValue == null)
                        return '';
                    // var cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
                    var cleanInputValue = latinize(inputValue);
                    cleanInputValue = cleanInputValue.replace(/[^\w\s]/gi, '');

                    if (scope.gtdCapitalize) {
                        cleanInputValue = cleanInputValue.toUpperCase();
                    }

                    if (cleanInputValue != inputValue) {
                        modelCtrl.$setViewValue(cleanInputValue);
                        modelCtrl.$render();
                    }
                    return cleanInputValue;
                });
            }
        };
    }
})();