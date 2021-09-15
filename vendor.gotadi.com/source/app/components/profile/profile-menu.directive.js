(function() {
    'use strict';

    gtdProfileMenuController.$inject = ['$log', '$scope', '$state', 'Principal', 'MetaData'];

    function gtdProfileMenuController($log, $scope, $state, Principal, MetaData) {
        var ctrl = this;

        ctrl.$state = $state;

        $log.log("++++++ gtdProfileMenuController - profileModel");
        //$log.log("data=" + JSON.stringify(ctrl.profileModel));
        $log.log("data=" + ctrl.profileModel);

        Principal.identity().then(function(user) {
            ctrl.identity = user;
            // do something with data only inside this inner function
            //$log.log("+++++ gtdProfileMenuController - vm.identity = " + JSON.stringify(user));
            $log.log("+++++ gtdProfileMenuController - vm.identity = " + user);
        });

        ctrl.initControl = function() {
            // Init tabs
            $('.nav-tabs a').click(function(e) {
                e.preventDefault();
                $(this).tab('show');
            });
        };

        ctrl.initControl();

    }

    var gtdProfileMenu = {
        templateUrl: 'app/components/profile/profile-menu.html',
        controller: gtdProfileMenuController,
        bindings: {
            profileModel: '='
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                $translatePartialLoader.addPart('global');
                return $translate.refresh();
            }]
        }
    };



    angular
        .module('B2B2CGatewayApp')
        .component('gtdProfileMenu', gtdProfileMenu);

})();