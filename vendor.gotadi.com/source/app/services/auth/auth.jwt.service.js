(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('AuthServerProvider', AuthServerProvider);

    AuthServerProvider.$inject = ['$http', '$localStorage', '$sessionStorage', '$q', '$cookies', 'API_URL'];

    function AuthServerProvider($http, $localStorage, $sessionStorage, $q, $cookies, API_URL) {
        var service = {
            getToken: getToken,
            login: login,
            loginWithToken: loginWithToken,
            storeAuthenticationToken: storeAuthenticationToken,
            logout: logout
        };

        return service;

        function getToken() {

            return $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        }

        function login(credentials) {

            var data = {
                username: credentials.username,
                password: credentials.password,
                rememberMe: credentials.rememberMe
            };
            return $http.post(API_URL + '/api/authenticate', data).then(authenticateSuccess);

            function authenticateSuccess(response) {
                var bearerToken = response.data.id_token;
                if (angular.isDefined(bearerToken)) {
                    var jwt = bearerToken;
                    service.storeAuthenticationToken(jwt, credentials.rememberMe);
                    return jwt;
                }
            }
        }

        function loginWithToken(jwt, rememberMe) {
            var deferred = $q.defer();

            if (angular.isDefined(jwt)) {
                this.storeAuthenticationToken(jwt, rememberMe);
                deferred.resolve(jwt);
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }

        function storeAuthenticationToken(jwt, rememberMe) {
            if ($ibe.isB2C() || $ibe.isB2B2C()) {
                $localStorage.authenticationToken = jwt;
            } else {
                if (rememberMe) {
                    $localStorage.authenticationToken = jwt;
                } else {
                    $sessionStorage.authenticationToken = jwt;
                }
            }
        }

        function logout() {
            //clean social token
            $cookies.remove('social-authentication');
            delete $localStorage.authenticationToken;
            delete $sessionStorage.authenticationToken;
        }
    }
})();