(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdSwapTypeAhead', gtdSwapTypeAhead);

    gtdSwapTypeAhead.$inject = ['$log', '$timeout'];

    function gtdSwapTypeAhead($log, $timeout) {

        // function gtdSwapTypeAhead() {
        return {
            restrict: 'A',
            scope: {
                gtdFrom: '=',
                gtdTo: '='
            },
            link: function(scope, element, attr) {
                // $log.log(attr.gtdData);
                // $log.log(scope.gtdData);
                alert(1);
                $(element).click(function() {
                    var fromVal = $("#" + attr.gtdFrom).val();
                    var toVal = $("#" + attr.gtdTo).val();

                    $timeout(function() {
                        $("#" + attr.gtdFrom).val(toVal).trigger('change');
                        $("#" + attr.gtdTo).val(fromVal).trigger('change');

                        alert($("#" + attr.gtdFrom).val() + ":" + $("#" + attr.gtdTo).val());
                    });

                });
                // if (scope.$parent.$last) {
                //     // $timeout(function () {
                //     //     scope.doFinishRenderCallback();
                //     // }, 0);
                //
                //     $timeout(function () {
                //         //alert("emit:" + attr.gtdEmitEvent + ", " + scope.$parent.$last);
                //         scope.$emit(attr.gtdEmitEvent);
                //     }, 0);
                // }
            }
        };
    }
})();