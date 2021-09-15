(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdSwapSelect2', gtdSwapSelect2);

    gtdSwapSelect2.$inject = ['$log', '$timeout'];

    function gtdSwapSelect2($log, $timeout) {

        // function gtdSwapSelect2() {
        return {
            restrict: 'A',
            scope: {
                gtdFrom: '=',
                gtdTo: '='
            },
            link: function(scope, element, attr) {

                var toggleProcessing = false;

                $(element).click(function() {
                    $log.log(toggleProcessing);
                    if (toggleProcessing) {
                        $log.log('wait');
                        return;
                    } else {
                        toggleProcessing = true;
                        var fromVal = $("#" + attr.gtdFrom).val();
                        var toVal = $("#" + attr.gtdTo).val();

                        $timeout(function() {

                            $("#" + attr.gtdFrom).val(null).trigger('change');

                            $timeout(function() {
                                $("#" + attr.gtdTo).val(fromVal).trigger('change');

                                $timeout(function() {
                                    $("#" + attr.gtdFrom).val(toVal).trigger('change');

                                    $timeout(function() {
                                        toggleProcessing = false;
                                    }, 100);
                                }, 1);

                            }, 1);


                        }, 1);
                    }



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