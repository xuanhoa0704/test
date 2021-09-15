(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdPassengerQuantity', gtdPassengerQuantity);

    gtdPassengerQuantity.$inject = ['$log', '$timeout'];

    function gtdPassengerQuantity($log, $timeout) {

        // function gtdPassengerQuantity() {
        return {
            restrict: 'A',
            scope: {
                //gtdEmitEvent: '&'
                gtdAdultQtt: '=',
                gtdChildQtt: '=',
                gtdInfantQtt: '=',

                gtdCurAdultQtt: '=',
                gtdCurChildQtt: '=',
                gtdCurInfantQtt: '=',

                searchOptions: '=',

                gtdQtt: '='
            },
            link: function(scope, element, attr) {
                var gtdQtt = scope.gtdQtt;

                var gtdAdultQtt = scope.gtdAdultQtt;
                var gtdChildQtt = scope.gtdChildQtt;
                var gtdInfantQtt = scope.gtdInfantQtt;

                var gtdCurAdultQtt = scope.gtdCurAdultQtt;
                var gtdCurChildQtt = scope.gtdCurChildQtt;
                var gtdCurInfantQtt = scope.gtdCurInfantQtt;
                $('.adultSelect .groupSelect .btn-select').on('click', function(evt) {
                    var __this = $(this);
                    var numberAdult = parseInt(__this.parent().find('.numberItem').text());
                    if (numberAdult >= 1 && numberAdult <= 9) {
                        if (__this.hasClass("increase")) {
                            scope.searchOptions.adultNo = numberAdult == 9 ? numberAdult : numberAdult + 1;
                            __this.parent().find('.numberItem').html(scope.searchOptions.adultNo);
                        } else {
                            scope.searchOptions.adultNo = numberAdult == 1 ? numberAdult : numberAdult - 1;
                            __this.parent().find('.numberItem').html(scope.searchOptions.adultNo);
                        }
                        var dtChd = 9 - scope.searchOptions.adultNo;
                        scope.gtdChildQtt = [];
                        scope.gtdInfantQtt = [];
                        if (scope.searchOptions.adultNo == 1) {
                            dtChd = 4;
                        }
                        for (var i = 0; i <= dtChd; i++) {
                            scope.$apply(function() { //code
                                scope.gtdChildQtt.push(i);
                            });
                        }
                        for (var i = 0; i <= scope.searchOptions.adultNo; i++) {
                            scope.$apply(function() { //code
                                scope.gtdInfantQtt.push(i);
                            });
                        }
                        if (dtChd < scope.gtdCurChildQtt) {
                            scope.gtdCurChildQtt = 0;
                            $('#fChdQttIdx').trigger('change');
                        }

                        if (scope.gtdCurInfantQtt > scope.searchOptions.adultNo) {
                            scope.gtdCurInfantQtt = 0;
                            $('#fInfQttIdx').trigger('change');
                        }

                        $('#fChdQttIdx').trigger('change');
                        $('#fInfQttIdx').trigger('change');
                        var selectChild = $('.childrenSelect select option:selected').attr('value');
                        $('.childrenSelect .numberItem').html(selectChild);
                    }
                });

                $('.childrenSelect .groupSelect .btn-select').on('click', function(evt) {
                    var _thisChild = $(this);
                    var numberChild = parseInt(_thisChild.parent().find('.numberItem').text());

                    var minOption = _thisChild.closest('.selectNumber').find('select option:first').val();
                    var maxOption = _thisChild.closest('.selectNumber').find('select option:last').val();
                    if (numberChild >= minOption && numberChild <= maxOption) {
                        if (_thisChild.hasClass("increase")) {
                            scope.searchOptions.childrenNo = numberChild == maxOption ? numberChild : numberChild + 1;
                        } else {
                            scope.searchOptions.childrenNo = numberChild == minOption ? numberChild : numberChild - 1;
                        }
                        _thisChild.parent().find('.numberItem').html(scope.searchOptions.childrenNo);
                        // _thisChild.closest('.selectNumber').find('select option').removeAttr('selected');
                        // _thisChild.closest('.selectNumber').find('select option[value='+scope.searchOptions.childrenNo+']').attr('selected','selected');

                    }
                });
                $('.infSelect .groupSelect .btn-select').on('click', function(evt) {
                    var _thisInf = $(this);
                    var numberInf = parseInt(_thisInf.parent().find('.numberItem').text());

                    var minOption = _thisInf.closest('.selectNumber').find('select option:first').val();
                    var maxOption = _thisInf.closest('.selectNumber').find('select option:last').val();
                    if (numberInf >= minOption && numberInf <= maxOption) {
                        if (_thisInf.hasClass("increase")) {
                            scope.searchOptions.newBornNo = numberInf == maxOption ? numberInf : numberInf + 1;
                        } else {
                            scope.searchOptions.newBornNo = numberInf == minOption ? numberInf : numberInf - 1;
                        }
                        _thisInf.parent().find('.numberItem').html(scope.searchOptions.newBornNo);
                    } else {
                        _thisInf.parent().find('.numberItem').html(maxOption);
                    }
                });

                $('#fAdtQttIdx').on('change', function(evt) {
                    var dtChd = 9 - parseInt(scope.searchOptions.adultNo);

                    scope.gtdChildQtt = [];
                    scope.gtdInfantQtt = [];

                    if (parseInt(scope.searchOptions.adultNo) == 1) {
                        dtChd = 4;
                    }

                    for (var i = 0; i <= dtChd; i++) {
                        scope.$apply(function() { //code
                            scope.gtdChildQtt.push(i);
                        });
                    }
                    for (var i = 0; i <= scope.searchOptions.adultNo; i++) {
                        scope.$apply(function() { //code
                            scope.gtdInfantQtt.push(i);
                        });
                    }

                    if (dtChd < scope.gtdCurChildQtt) {
                        scope.gtdCurChildQtt = 0;
                        $('#fChdQttIdx').trigger('change');
                    }

                    if (scope.gtdCurInfantQtt > scope.searchOptions.adultNo) {
                        scope.gtdCurInfantQtt = 0;
                        $('#fInfQttIdx').trigger('change');
                    }

                    $('#fChdQttIdx').trigger('change');
                    $('#fInfQttIdx').trigger('change');

                });



                $('#fChdQttIdx').on('change', function(evt) {
                    // var dtChd = 9 - parseInt(scope.searchOptions.childrenNo);
                    //
                    // scope.gtdAdultQtt = [];
                    // scope.gtdInfantQtt = [];
                    // for (var i = 1; i <= dtChd; i++) {
                    //     scope.$apply(function(){ //code
                    //         scope.gtdAdultQtt.push(i);
                    //     });
                    //
                    // }
                    // for (var i = 0; i <= scope.searchOptions.adultNo; i++) {
                    //     scope.$apply(function(){ //code
                    //         scope.gtdInfantQtt.push(i);
                    //     });
                    // }
                });
            }
        };
    }
})();