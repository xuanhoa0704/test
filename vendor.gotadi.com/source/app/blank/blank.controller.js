(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('BlankController', BlankController);

    BlankController.$inject = ['$scope', 'Principal', 'LoginService', '$state'];
    // HomeController.$inject = ['$scope', '$state'];

    // function HomeController ($scope, $state) {
    function BlankController($scope, Principal, LoginService, $state) {

        // $scope.$on('$viewContentLoaded', function() {
        //     // initialize core components
        //     App.initAjax();
        // });
        //
        // // set sidebar closed and body solid layout mode
        // $rootScope.settings.layout.pageContentWhite = true;
        // $rootScope.settings.layout.pageBodySolid = false;
        // $rootScope.settings.layout.pageSidebarClosed = false;

        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;

        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }

        function register() {
            $state.go('register');
        }
    }
})();