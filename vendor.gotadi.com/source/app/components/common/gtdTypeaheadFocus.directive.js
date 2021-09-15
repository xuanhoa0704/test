(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdTypeaheadFocus', gtdTypeaheadFocus);

    gtdTypeaheadFocus.$inject = ['$log', '$timeout'];

    function gtdTypeaheadFocus($log, $timeout) {

        // function gtdTouchSpinner() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, ctrl) {
                element.bind('click', function() {
                    var vv = ctrl.$viewValue;
                    ctrl.$setViewValue(vv ? vv + ' ' : ' ');
                    $timeout(function() {
                        ctrl.$setViewValue(vv ? vv : '');
                    }, 10);
                });
            }
        };

    }
})();