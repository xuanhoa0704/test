(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdSwapSelect2Inter', gtdSwapSelect2Inter);

    gtdSwapSelect2Inter.$inject = ['$log', '$timeout', 'GlobalSrv'];

    function gtdSwapSelect2Inter($log, $timeout, GlobalSrv) {

        // function gtdSwapSelect2Inter() {
        return {
            restrict: 'A',
            scope: {
                gtdFrom: '=',
                gtdTo: '='
            },
            link: function(scope, element, attr) {

                // CHANGE FOR INTERNATIONAL FLIGHT
                $(element).click(function() {
                    var fromVal = $("#" + attr.gtdFrom).val();
                    var toVal = $("#" + attr.gtdTo).val();
                    // alert(fromVal + ":" + toVal);

                    var airports = GlobalSrv.getLocalAirports();
                    var text = "";

                    for (var idx in airports) {
                        if (airports[idx].code == fromVal) {
                            text = airports[idx].city + ' (' + airports[idx].code + ')';
                        }
                    }

                    var $option = $('<option selected>' + text + '</option>').val(fromVal);
                    $("#" + attr.gtdTo).append($option).trigger('change'); // append the option and update Select2

                    for (var idx in airports) {
                        if (airports[idx].code == toVal) {
                            text = airports[idx].city + ' (' + airports[idx].code + ')';
                        }
                    }

                    var $option = $('<option selected>' + text + '</option>').val(toVal);
                    $("#" + attr.gtdFrom).append($option).trigger('change'); // append the option and update Select2

                });

            }
        };
    }
})();