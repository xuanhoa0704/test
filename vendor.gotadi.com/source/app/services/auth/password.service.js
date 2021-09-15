(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('Password', Password);

    Password.$inject = ['$resource', 'API_URL'];

    function Password($resource, API_URL) {
        var service = $resource(API_URL + '/api/account/change-password', {}, {});

        return service;
    }
})();