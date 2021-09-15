(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$rootScope', '$q', '$location', '$localStorage', '$sessionStorage'];

    function authInterceptor($rootScope, $q, $location, $localStorage, $sessionStorage) {
        var service = {
            request: request
        };

        return service;

        function request(config) {
            //<>
            // Implement ignore intercept option.
            // GTD-269 [NewIBE_Mobile] Thông báo "Lỗi kết nối" sau khi đăng nhập và refresh lại trang
            if (config.noAuth) {
                return config;
            }
            //</>

            config.headers["x-gtd-agency"] = "GOTADI";
            config.headers["x-hotel-client-ip"] = localStorage.getItem("client-ip");

            /*jshint camelcase: false */
            config.headers = config.headers || {};
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        }
    }
})();