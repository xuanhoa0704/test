(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdSpinnerPassengerQuantity', gtdSpinnerPassengerQuantity);

    gtdSpinnerPassengerQuantity.$inject = ['$log', '$timeout'];

    function gtdSpinnerPassengerQuantity($log, $timeout) {

        // function gtdSpinnerPassengerQuantity() {
        return {
            restrict: 'A',
            scope: {
                searchOptions: '='
            },
            link: function(scope, element, attr) {

                $('#adultNo').on('change', function() {
                    var dtChd = 9 - parseInt(scope.searchOptions.adultNo);

                    if (parseInt(scope.searchOptions.adultNo) == 1) {
                        dtChd = 4;
                    }

                    // if (dtChd < scope.searchOptions.childrenNo) {
                    //     scope.searchOptions.childrenNo = 0;
                    //     // $('#fChdQttIdx').trigger('change');
                    // }
                    //
                    // if (scope.searchOptions.newBornNo > scope.searchOptions.adultNo) {
                    //     scope.searchOptions.newBornNo = 0;
                    //     // $('#fInfQttIdx').trigger('change');
                    // }

                    $("#childrenNo").trigger("touchspin.updatesettings", {
                        max: dtChd
                    });
                    $("#newBornNo").trigger("touchspin.updatesettings", {
                        max: parseInt(scope.searchOptions.adultNo)
                    });

                });

                $('#childrenNo').on('change', function() {
                    // var dtChd = 9 - parseInt(scope.searchOptions.childrenNo);
                    //
                    // if (parseInt(scope.searchOptions.adultNo) == 1) {
                    //     dtChd = 4;
                    // }
                    //
                    //
                    // $( "#adultNo" ).trigger("touchspin.updatesettings", {max: dtChd});
                    // $( "#newBornNo" ).trigger("touchspin.updatesettings", {max: parseInt(scope.searchOptions.adultNo)});

                });

            }
        };
    }
})();