(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('authExpiredInterceptor', authExpiredInterceptor);

    authExpiredInterceptor.$inject = ['$rootScope', '$q', '$injector', '$localStorage', '$sessionStorage'];

    function authExpiredInterceptor($rootScope, $q, $injector, $localStorage, $sessionStorage) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            if (response.status === 401 || response.status === 417) {
                delete $localStorage.authenticationToken;
                delete $sessionStorage.authenticationToken;
                var Principal = $injector.get('Principal');
                if (Principal.isAuthenticated()) {
                    var Auth = $injector.get('Auth');
                    Auth.authorize(true);
                }
            }
            return $q.reject(response);
        }
    }
})();