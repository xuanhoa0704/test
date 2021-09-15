(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('PasswordResetFinish', PasswordResetFinish);

    PasswordResetFinish.$inject = ['$resource', 'API_URL'];

    function PasswordResetFinish($resource, API_URL) {
        var service = $resource(API_URL + '/api/account/reset-password/finish', {}, {});

        return service;
    }
})();