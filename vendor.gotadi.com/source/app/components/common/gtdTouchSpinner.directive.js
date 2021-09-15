(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdTouchSpinner', gtdTouchSpinner);

    gtdTouchSpinner.$inject = ['$log', '$timeout'];

    function gtdTouchSpinner($log, $timeout) {

        // function gtdTouchSpinner() {
        return {
            restrict: 'A',
            scope: {
                //gtdEmitEvent: '&'
                gtdMin: '=',
                gtdMax: '=?'
            },
            link: function(scope, element, attr) {
                $(element).TouchSpin({
                    verticalbuttons: true,
                    min: attr.gtdMin ? attr.gtdMin : 0,
                    max: attr.gtdMax ? attr.gtdMax : 9
                });
            }
        };
    }
})();