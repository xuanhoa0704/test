(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdDatePicker', gtdDatePicker);

    gtdDatePicker.$inject = ['$log', '$timeout', '$parse'];

    function gtdDatePicker($log, $timeout, $parse) {

        // function gtdDatePicker() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                startId: '=',
                endId: '=',
                isStart: '=',
                isEnd: '=',
                minDt: '@',
                maxDt: '@'
            },
            link: function(scope, element, attr) {
                // if (jQuery().datepicker) {
                if (attr.isStart) {
                    $(element).bootstrapDP({
                        // $('.date-picker').bootstrapDP({
                        rtl: App.isRTL(),
                        orientation: "left",
                        autoclose: true,
                        format: 'dd-mm-yyyy',
                        language: 'vi'
                    }).on('changeDate', function(selected) {
                        $log.log('changeDate');

                        if (selected.date) {
                            var minDate = new Date(selected.date.valueOf());
                            var currentEndValue = $('#' + attr.endId).bootstrapDP('getDate');

                            if (minDate > currentEndValue) {
                                $('#' + attr.endId).bootstrapDP('setDate', null);
                            }
                            $('#' + attr.endId).bootstrapDP('setStartDate', minDate);

                            $(element).trigger('change');
                            $('#' + attr.endId).trigger('change');
                        } else {
                            if (!minDate) {
                                $('#' + attr.endId).bootstrapDP('setStartDate', null);
                            }

                            $(element).trigger('change');
                            $('#' + attr.endId).trigger('change');
                        }

                    }).on('clearDate', function() {
                        $log.log('clearDate');

                        var minDate = $(element).bootstrapDP('getDate');
                        var currentEndValue = $('#' + attr.endId).bootstrapDP('getDate');

                        if (!minDate) {
                            $('#' + attr.endId).bootstrapDP('setStartDate', null);
                        }
                    }).on('change', function() {
                        // $log.log('change');
                        // var minDate = $(element).bootstrapDP('getDate');
                        // var currentEndValue = $('#' + attr.endId).bootstrapDP('getDate');
                        //
                        // // alert(minDate);
                        // if (!minDate) {
                        //     $('#' + attr.endId).bootstrapDP('setStartDate', null);
                        // }
                    });

                    if (scope.ngModel) {
                        $(element).bootstrapDP('setDate', scope.ngModel);
                        $(element).bootstrapDP('update');
                    }
                } else if (attr.minDt) {
                    $(element).bootstrapDP({
                        // $('.date-picker').bootstrapDP({
                        rtl: App.isRTL(),
                        orientation: "left",
                        autoclose: true,
                        startDate: new Date(new Date().getTime() + 1 * 86400000),
                        format: 'dd-mm-yyyy',
                        language: 'vi'
                    });

                    if (scope.ngModel) {
                        $(element).bootstrapDP('setDate', scope.ngModel);
                        $(element).bootstrapDP('update');
                    }
                } else if (attr.maxDt) {
                    $(element).bootstrapDP({
                        // $('.date-picker').bootstrapDP({
                        rtl: App.isRTL(),
                        orientation: "left",
                        autoclose: true,
                        endDate: new Date(new Date().getTime() - 1 * 86400000),
                        format: 'dd-mm-yyyy',
                        language: 'vi'
                    });

                    if (scope.ngModel) {
                        $(element).bootstrapDP('setDate', scope.ngModel);
                        $(element).bootstrapDP('update');
                    }
                } else {
                    $(element).bootstrapDP({
                        // $('.date-picker').bootstrapDP({
                        rtl: App.isRTL(),
                        orientation: "left",
                        autoclose: true,
                        format: 'dd-mm-yyyy',
                        language: 'vi'
                    });

                    if (scope.ngModel) {
                        $(element).bootstrapDP('setDate', scope.ngModel);
                        $(element).bootstrapDP('update');
                    }
                }


                // bootstrapDP
                // $(element).val(scope.ngModel);
                // $(element).datepicker('setUTCDate', scope.ngModel);
                // $(element).datepicker("update", new Date()).trigger('change');
                // $('element').parent().data({date: '2012-08-08'});
                //$(element).datepicker('setDate',new Date());


                // $(element).val('');

                // $(element).setDate(new Date());


                //$('body').removeClass("modal-open"); // fix bug when inline picker is used in modal
                // }
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