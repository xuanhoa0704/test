(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('SocialAuthController', SocialAuthController);

    SocialAuthController.$inject = ['$log', '$rootScope', '$state', '$cookies', 'Auth'];

    function SocialAuthController($log, $rootScope, $state, $cookies, Auth) {
        var token = $cookies.get('social-authentication');
        if (token) {
            Auth.loginWithToken(token, false).then(function() {
                // $cookies.remove('social-authentication');
                window.postMessage("auth::true", window.location.origin);
                // window.close();
                window.location.href = 'app/account/social/social-register.html';
            }, function() {
                $state.go('social-register', {
                    'success': 'false'
                });
            });
        } else {
            $state.go('social-register', {
                'success': 'false'
            });
        }
    }
})();