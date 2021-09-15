(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('jhSocial', jhSocial);

    jhSocial.$inject = ['$translatePartialLoader', '$translate', '$filter', 'SocialService', '$cookies', 'Principal', 'Auth', '$rootScope'];

    function jhSocial($translatePartialLoader, $translate, $filter, SocialService, $cookies, Principal, Auth, $rootScope) {
        var directive = {
            restrict: 'E',
            scope: {
                provider: '@ngProvider',
                parent: '=?'
            },
            templateUrl: 'app/account/social/directive/social.html',
            link: linkFunc
        };

        return directive;

        /* private helper methods */

        function linkFunc(scope) {

            $translatePartialLoader.addPart('social');
            $translate.refresh();

            scope.label = $filter('capitalize')(scope.provider);
            scope.providerSetting = SocialService.getProviderSetting(scope.provider);
            scope.providerURL = SocialService.getProviderURL(scope.provider);
            scope.csrf = SocialService.getCSRF();

            $(".connectButton").click(function(event) {
                event.preventDefault();
                if (scope.parent) {
                    scope.parent.close();
                }
                var width = 600,
                    height = 700;
                if (scope.provider === 'google') {
                    //width = 470; height = 580;
                }
                var w = window.outerWidth - width,
                    h = window.outerHeight - height;
                var left = Math.round(window.screenX + (w / 2));
                var top = Math.round(window.screenY + (h / 2.5));
                var popup = window.open("", 'SocialAuth',
                    'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top +
                    ',toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0');
                popup.focus();
                var cTP = $(event.currentTarget).parent();
                cTP[0].setAttribute("target", "SocialAuth");

                window.addEventListener('message', function(e) {
                    if (e.data !== 'social::success') {
                        return;
                    }
                    var token = $cookies.get('social-authentication');
                    if (token) {
                        Auth.loginWithToken(token, false).then(function() {
                            $cookies.remove('social-authentication');
                            Principal.identity(true).then(function() {
                                $rootScope.$broadcast('authenticationSuccess');
                            });
                        });
                    }
                });
                cTP[0].submit();
            });

        }

    }
})();