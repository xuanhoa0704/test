(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdFinishRenderNgRepeat', gtdFinishRenderNgRepeat);

    gtdFinishRenderNgRepeat.$inject = ['$log', '$timeout'];

    function gtdFinishRenderNgRepeat($log, $timeout) {

        // function gtdFinishRenderNgRepeat() {
        return {
            restrict: 'A',
            scope: {
                gtdEmitEvent: '&'
            },
            link: function(scope, element, attr) {
                if (scope.$parent.$last) {
                    // $timeout(function () {
                    //     scope.doFinishRenderCallback();
                    // }, 0);

                    $timeout(function() {
                        //alert("emit:" + attr.gtdEmitEvent + ", " + scope.$parent.$last);
                        scope.$emit(attr.gtdEmitEvent);
                    }, 0);
                }
            }
        };
    }
})();