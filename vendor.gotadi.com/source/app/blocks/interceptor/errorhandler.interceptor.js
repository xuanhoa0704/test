(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('errorHandlerInterceptor', errorHandlerInterceptor);

    errorHandlerInterceptor.$inject = ['$q', '$rootScope', '$log'];

    function errorHandlerInterceptor($q, $rootScope, $log) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            /* https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
            500 Internal Server Error
            501 Not Implemented
            502 Bad Gateway
            503 Service Unavailable
             */
            $log.info("+++>>> errorHandlerInterceptor - response.status: " + response.status);
            if (response.status < 0 || response.status === 500 || response.status === 501 || response.status === 502 || response.status === 503) {
                $rootScope.$emit('B2B2CGatewayApp.http5xxError', response);
            } else {
                if (!(response.status === 401 && (response.data === '' || (response.data.path && response.data.path.indexOf('/api/account') === 0)))) {
                    $rootScope.$emit('B2B2CGatewayApp.httpError', response);
                }
            }

            return $q.reject(response);
        }
    }
})();