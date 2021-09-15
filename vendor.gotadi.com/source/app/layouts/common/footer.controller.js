(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FooterController', FooterController);

    FooterController.$inject = ['LINKS'];

    function FooterController(LINKS) {

        // $scope.$on('$includeContentLoaded', function() {
        //     Layout.initHeader(); // init header
        // });

        var vm = this;

        vm.links = LINKS;
    }
})();