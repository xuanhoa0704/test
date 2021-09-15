(function() {
    'use strict';

    gtdProfileInvoiceInfoController.$inject = ['$log', '$scope', 'MetaData'];

    function gtdProfileInvoiceInfoController($log, $scope, MetaData) {
        var ctrl = this;

        ctrl.edit = function() {
            ctrl.profileModel.mode = 'edit';
        };
    }

    var gtdProfileInvoiceInfo = {
        require: {
            form: '^^form'
        },
        templateUrl: 'app/components/profile/profile-invoice-info.html',
        controller: gtdProfileInvoiceInfoController,
        bindings: {
            profileModel: '=',
            shortProfile: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdProfileInvoiceInfo', gtdProfileInvoiceInfo);

})();