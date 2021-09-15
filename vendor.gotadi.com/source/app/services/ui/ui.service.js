(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('UIService', UIService);

    UIService.$inject = [];

    function UIService() {
        var service = {
            hideBodyScroll: hideBodyScroll,
            showBodyScroll: showBodyScroll
        };

        return service;

        function hideBodyScroll() {
            // $("body").addClass("hotel-hide-scroll");
        }

        function showBodyScroll() {
            // $("body").removeClass("hotel-hide-scroll");
        }
    }
})();