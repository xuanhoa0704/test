(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('Register', Register);

    Register.$inject = ['$resource', 'API_URL'];

    function Register($resource, API_URL) {
        return $resource(API_URL + '/api/register', {}, {});
    }
})();