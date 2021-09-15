(function() {
    'use strict';

    gtdBookingImportantInfoController.$inject = ['$translate'];

    function gtdBookingImportantInfoController($translate) {
        var ctrl = this;
        ctrl.redirectToTerm = redirectToTerm;
        ctrl.termCheckedChanged = termCheckedChanged;
        ctrl.checkedTerm = false;

        ctrl.changeHook(ctrl.checkedTerm);

        function redirectToTerm() {
            var lang = $translate.use();
            var win = window.open('/#/terms', '_blank');
            win.focus();
        }

        function termCheckedChanged() {
            ctrl.changeHook(ctrl.checkedTerm);
        }
    }


    var gtdBookingImportantInfo = {
        templateUrl: 'app/components/booking/booking-important-info.html',
        controller: gtdBookingImportantInfoController,
        bindings: {
            selectedHotelProduct: '=',
            changeHook: '=',
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdBookingImportantInfo', gtdBookingImportantInfo);

})();