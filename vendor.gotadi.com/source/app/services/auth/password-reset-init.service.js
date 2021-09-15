(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('PasswordResetInit', PasswordResetInit);

    PasswordResetInit.$inject = ['$resource', 'API_URL'];

    function PasswordResetInit($resource, API_URL) {
        var service = $resource(API_URL + '/api/account/reset-password/init', {}, {});

        return service;
    }
})();