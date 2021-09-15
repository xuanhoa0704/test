(function() {
    'use strict';

    var B2B2CGatewayApp = angular.module("B2B2CGatewayApp", [
            'ngStorage',
            'tmh.dynamicLocale',
            'pascalprecht.translate',
            'ngResource',
            'ngCookies',
            'ngAria',
            'ngCacheBuster',
            'ngFileUpload',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ui.router',
            'infinite-scroll',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            // 'angular-loading-bar',
            //'oc.lazyLoad',
            'ngSanitize', "oc.lazyLoad", "credit-cards", 'slickCarousel', 'blockUI'
        ])
        .config(['$rootScopeProvider', '$locationProvider', appConfig])
        .config(bCfg)
        .run(run);

    function appConfig($rootScopeProvider, $locationProvider) {
        // $locationProvider.html5Mode({ enabled: true, requireBase: true });
        console.log('Change TTL');
        $rootScopeProvider.digestTtl(30);
    }

    function bCfg(blockUIConfig) {

        // Change the default overlay message
        blockUIConfig.message = '';

        // Change the default delay to 100ms before the blocking is visible
        // blockUIConfig.delay = 100;

        // Display the property value in the custom template.
        blockUIConfig.template = '<div class="loader"></div>';

        // Tell the blockUI service to ignore certain requests
        blockUIConfig.requestFilter = function(config) {
            // If the request starts with '/api/quote' ...
            if (config.url.indexOf("metasrv/api") > -1) {
                return false; // ... don't block it.
            } else if (config.url.match(/(?:\/api\/hotel\/meta\-keyword\-search)/)) {
                return false; // ... don't block it.
            } else if (config.url.indexOf('hotel/filter-availability') > -1) {
                return false; // ... don't block it.
            }
        };

        // blockUIConfig.autoBlock = false;


    }

    /** Metronic APP **/
    B2B2CGatewayApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            // global configs go here
        });
    }]);

    B2B2CGatewayApp.config(['$controllerProvider', function($controllerProvider) {
        // this option might be handy for migrating old apps, but please don't use it
        // in new ones!
        $controllerProvider.allowGlobals();
    }]);

    /********************************************
     END: BREAKING CHANGE in AngularJS v1.3.x:
     *********************************************/

    /* Setup global settings */
    B2B2CGatewayApp.factory('settings', ['$rootScope', function($rootScope) {
        // supported languages
        var settings = {
            layout: {
                pageSidebarClosed: false, // sidebar menu state
                pageContentWhite: true, // set page content layout
                pageBodySolid: false, // solid body color state
                pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
            },
            assetsPath: '../bower_components/gtd-theme',
            globalPath: '../bower_components/gtd-theme/global',
            layoutPath: '../bower_components/gtd-theme/layouts/layout3',
        };

        $rootScope.settings = settings;

        return settings;
    }]);

    /* Setup window close event */
    B2B2CGatewayApp.factory('beforeUnload', ['$rootScope', '$window', function($rootScope, $window) {
        $window.onunload = function() {
            $rootScope.$broadcast('onUnload');
        };
        return {};
    }]);

    /* Setup App Main Controller */
    B2B2CGatewayApp.controller('AppController', ['$scope', '$rootScope', '$location', '$cookies', 'ThemeCfg', 'MerchantService', '$state', 'AuthServerProvider', function($scope, $rootScope, $location, $cookies, ThemeCfg, MerchantService, $state, AuthServerProvider) {
        $scope.$on('$viewContentLoaded', function() {
            App.initComponents(); // init core components
            // Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
            Layout.init();
        });

        // embed layout
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30);
        if ($location.search().embed) {
            $cookies.put('liteEmbed', true, {
                'expires': expireDate
            });
            localStorage.setItem('liteEmbed', true);
        } else {
            $cookies.put('liteEmbed', false, {
                'expires': expireDate
            });
            localStorage.setItem('liteEmbed', false);
        }

        if ($location.search().merchant_code || $cookies.get("merchant_code") || localStorage.getItem("merchant_code")) {
            var lc_merchant = $location.search().merchant_code;
            var ck_merchant = $cookies.get("merchant_code") || localStorage.getItem("merchant_code");
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);
            if (lc_merchant && (lc_merchant != ck_merchant)) {
                localStorage.setItem('merchant_code', lc_merchant);
                $cookies.put('merchant_code', lc_merchant, {
                    'expires': expireDate
                });
            }
            // $window.parent.postMessage("Hello", "https://davidwalsh.name");
            switch (lc_merchant) {
                // TODO: VIETTEL also need validate.
                case 'LIENVIETBANK':
                    lienvietLogin();
                    break;
                case 'SEABANK':
                    seaBankLogin();
                    break;
                case 'FSOFT':
                    fSoftLogin();
                    break;
                case 'VIETTEL':
                    loginForSpecial();
                    break;
                case 'TIKI':
                    loginForSpecial();
                    break;
                default:
                    if ($location.search().access_token) {
                        MerchantService.loginWithToken($location.search().access_token);
                    } else {
                        var token = AuthServerProvider.getToken();
                        if (!token) {
                            redirectToUnknownMerchant();
                        }
                    }
                    break;
            }

            function loginForSpecial() {
                ignoreBrowerBack();
                MerchantService.verifyMerchant().then(
                    function(response) {
                        if (response.data && response.data.agencyCode)
                            MerchantService.login();
                        else {
                            redirectToUnknownMerchant();
                        }
                    },
                    function(error) {
                        redirectToUnknownMerchant();
                    }
                );
                MerchantService.login();
            }

            function seaBankLogin() {
                var user = $location.search().user;
                var signature = $location.search().signature;

                if (user && signature) {
                    MerchantService.seaBankValidate(user, signature).then(
                        // Validate success
                        function(response) {
                            if (response.data && response.data.success) {
                                // Update msisdn = userID extracted from encrypted data.
                                MerchantService.updateMsisdn(response.data.result);
                                // Login with new data.
                                MerchantService.login();
                            } else {
                                redirectToUnknownMerchant();
                            }
                        },
                        // on Validate error
                        function(errors) {
                            redirectToUnknownMerchant();
                        }
                    );
                } else {
                    MerchantService.login();
                }

            }

            function lienvietLogin() {
                var data = $location.search().data;
                if (!data) data = $cookies.get('data');
                var key = $location.search().key;
                if (!key) key = $cookies.get('key');
                MerchantService.lienVietValidate(data, key).then(
                    // Validate success
                    function(response) {
                        if (response.data && response.data.success) {
                            // Update msisdn = userID extracted from encrypted data.
                            MerchantService.updateMsisdn(response.data.result);
                            // Login with new data.
                            MerchantService.login();
                        } else {
                            redirectToUnknownMerchant();
                        }
                    },
                    // on Validate error
                    function(errors) {
                        redirectToUnknownMerchant();
                    }
                );
            }

            function ignoreBrowerBack() {
                $scope.$on('$stateChangeSuccess', function() {
                    //view loaded do some stuff.
                    $location.replace(); //clear last history route
                });
            }

            function fSoftLogin() {
                MerchantService.fSoftValidate().then(
                    // Validate success
                    function(response) {
                        if (response.data && response.data.success) {
                            // Update msisdn = userID extracted from encrypted data.
                            MerchantService.updateMsisdn(response.data.result.userId);
                            // Login with new data.
                            MerchantService.login().then(
                                function(abc) {
                                    MerchantService.fSoftSearchFlight(response.data.result);
                                },

                                // on Validate error
                                function(params) {
                                    redirectToUnknownMerchant();
                                }
                            );

                        } else {
                            redirectToUnknownMerchant();
                        }
                    },

                    // on Validate error
                    function(params) {
                        redirectToUnknownMerchant();
                    }
                )
            }

        } else {
            redirectToUnknownMerchant();
        }

        function redirectToUnknownMerchant() {
            // $state.go('error-partner');
            // Exclude URL
            // if(!(window.location.href.indexOf("external-booking-detail" ) > -1
            // || window.location.href.indexOf("external-booking-payment") > -1
            // || window.location.href.indexOf("external-final-booking") > -1)) {
            //     window.location.href = "#/error-partner";
            // }

            window.location.href = "#/error-partner";
        }


        $scope.this_route = function() {
            var merchant_code = $cookies.get("merchant_code") || localStorage.getItem("merchant_code");
            var paramMerchant = $location.search().merchant_code;
            if (paramMerchant) {
                if (paramMerchant !== merchant_code) {
                    location.reload();
                }
                return String($location.search().merchant_code).toUpperCase();
            } else {
                return String(merchant_code).toUpperCase();
            }
        };

        $scope.enable_template = function() {
            var merchant_code = $cookies.get("merchant_code") || localStorage.getItem("merchant_code")

            if (!ThemeCfg[String(merchant_code).toUpperCase()]) {
                return true;
            } else return false;
        }
    }]);

    /***
     Layout Partials.
     By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
     initialization can be disabled and Layout.init() should be called on page load complete as explained above.
     ***/

    /* Setup Layout Part - Sidebar */
    B2B2CGatewayApp.controller('SidebarController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initSidebar($state); // init sidebar
        });
    }]);

    /* Setup Layout Part - Quick Sidebar */
    B2B2CGatewayApp.controller('QuickSidebarController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            setTimeout(function() {
                QuickSidebar.init(); // init quick sidebar
            }, 2000);
        });
    }]);

    /* Setup Layout Part - Sidebar */
    B2B2CGatewayApp.controller('PageHeadController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Demo.init(); // init theme panel
        });
    }]);

    /* Setup Layout Part - Theme Panel */
    B2B2CGatewayApp.controller('ThemePanelController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Demo.init(); // init theme panel
        });
    }]);

    /* Setup Layout Part - Footer */
    B2B2CGatewayApp.controller('FooterController', ['$scope', function($scope) {
        $scope.$on('$includeContentLoaded', function() {
            Layout.initFooter(); // init footer
        });
    }]);

    run.$inject = ['stateHandler', 'translationHandler', '$cookies', "$rootScope", '$window', "settings", "$state", "beforeUnload", 'Auth', "MetaData", "GlobalSrv", 'Principal', 'DialogService', 'ValidationUtils', '$http'];

    function run(stateHandler, translationHandler, $cookies, $rootScope, $window, settings, $state, beforeUnload, Auth, MetaData, GlobalSrv, Principal, DialogService, ValidationUtils, $http) {
        stateHandler.initialize();
        translationHandler.initialize();

        $rootScope.$state = $state; // state to be accessed from view
        $rootScope.$settings = settings; // state to be accessed from view

        console.log("Run - b2bURL: " + $ibe.getB2BAppUrl());
        console.log("Run - saleChannel: " + $ibe.getSaleChannel());
        console.log("Run - tokenKey: " + $ibe.getTokenKey());

        //+++ listen login & logout event - only support B2C and B2B2C
        $window.addEventListener("storage", function(event) {
            var k = event.key;
            var newValue = event.newValue;
            var url = event.url;
            var oldValue = event.oldValue;
            console.log("storage event: key: " + k + ", url: " + url + ", oldValue: " + oldValue + ", newValue: " + newValue + ", window loation: " + $window.location.origin);

            if ($ibe.isB2C()) {
                console.log("process for B2C request for normal-login and social-login...");

                if (k === 'jhi-authenticationToken' && url.indexOf($window.location.origin) !== -1) {
                    if (oldValue && (newValue === null || newValue === '')) {
                        $rootScope.$broadcast('syncLogout');
                    } else if ((!oldValue || oldValue === null || oldValue === '') && newValue) {
                        $rootScope.$broadcast('syncAuthenticationSuccess');
                    }
                } else if (k == 'social-login-success') {
                    if (ValidationUtils.isIE()) {
                        console.log('Receive social message login success for IE');

                        if (newValue != 'social::success') {
                            return;
                        } else {
                            var token = $cookies.get('social-authentication');
                            console.log('token = ' + token);
                            if (token) {
                                Auth.loginWithToken(token, false).then(function() {
                                    $cookies.remove('social-authentication');
                                    Principal.identity(true).then(function() {
                                        $rootScope.$broadcast('authenticationSuccess');
                                    });
                                });
                            }
                            localStorage.setItem("social-login-success", "");
                        }
                    }
                }
            } else if ($ibe.isB2B2C()) {
                console.log("process for B2B2C request for having tokenKeys...");

                if (k === 'jhi-authenticationToken' && url.indexOf($window.location.origin) !== -1) {
                    if (oldValue && (newValue === null || newValue === '')) {
                        $rootScope.$broadcast('syncLogout');
                    } else if (newValue && (oldValue != newValue)) {
                        $rootScope.$broadcast('syncAuthenticationSuccess');
                    }
                }
            }
        });

        function callback(ip) {
            console.log(ip);
        }

        $http.jsonp('https://api.ipify.org/?format=jsonp&callback=JSON_CALLBACK').then(
            function(success) {
                console.log(success);
                localStorage.setItem("client-ip", success.data.ip);
            }
        );



        //---

        Offline.options = {
            // to check the connection status immediatly on page load.
            checkOnLoad: false,

            // to monitor AJAX requests to check connection.
            interceptRequests: true,

            // to automatically retest periodically when the connection is down (set to false to disable).
            reconnect: {
                // delay time in seconds to wait before rechecking.
                initialDelay: 3,

                // wait time in seconds between retries.
                delay: 10
            },

            // to store and attempt to remake requests which failed while the connection was down.
            requests: true
        };


        if (!$.fn.bootstrapDP && $.fn.datepicker && $.fn.datepicker.noConflict) {
            var datepicker = $.fn.datepicker.noConflict();
            $.fn.bootstrapDP = datepicker;
        }

        if (!$.fn.bootstrapDTP && $.fn.datetimepicker) {
            $.fn.bootstrapDTP = $.fn.datetimepicker;

        }

        MetaData.searchAirportsLocal('VN').then(function result(res) {
            var airports = res;
            GlobalSrv.setVnAirports(airports);
        });

        //+++ process B2B2C Request

        $rootScope.$on('B2B2CGatewayApp.http5xxError', function(event, httpResponse) {
            /* https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
            500 Internal Server Error
            501 Not Implemented
            502 Bad Gateway
            503 Service Unavailable
             */
            console.log("--->>> INFO: B2B2CGatewayApp.httpError: " + httpResponse.status);
            var error = {
                title: "Lỗi Kết Nối",
                message: "Hiện nay bạn không kết nối được với dịch vụ của chúng tôi, xin vui lòng thử lại sau!"
            };
            //show dialog
            DialogService.openAlertDialog(error);
        });

        $rootScope.$on('authenticationSuccess', function() {
            console.log("app.module - authenticationSuccess --- Checking.... ");
            processB2B2CMessage();
        });

        /**
         * Process logout for B2B
         */
        $rootScope.$on('logoutSuccess', function() {
            console.log("Run - logoutSuccess - saleChannel: " + $ibe.getSaleChannel());

            if ($ibe.isB2B2C()) {
                if ($window.opener) {
                    console.log("app.module - logoutSuccess --- call - $window.close() .... ");
                    try {
                        $window.close();
                    } catch (err) {
                        console.log("app.module - $window.close() --- err: " + err);
                    }
                } else {
                    console.log("app.module - logoutSuccess --- call - processB2B2CMessage .... ");
                    var isGotoB2B = true;
                    processB2B2CMessage(isGotoB2B);
                }
            }
        });

        /**
         * Process after load application_state_success
         *
         */
        $rootScope.$on('loadAppStateSuccess', function() {
            console.log("Run - loadAppStateSuccess - saleChannel: " + $ibe.getSaleChannel());

            if (!$ibe.hasTokenKey()) {
                console.log("rootScope - app.module - loadAppStateSuccess --- Checking.... ");
                processB2B2CMessage();
            }
        });

        $rootScope.$on('onUnload', function(e) {
            if ($ibe.isB2B2C()) {
                Auth.logout();
                //clean ibe token
                try {
                    $ibe.resetTokenKey();
                } catch (err) {
                    console.log("app.module - onUnload - resetTokenKey - err: " + err);
                }
                console.log('app.module - onBeforeUnload - leaving page'); // Use 'Preserve Log' option in Console
            }
        });

        $rootScope.$watch(function() {
            return window.location.href;
        }, function(value) {
            try {
                window.top.postMessage('gtdIframeHref:' + btoa(value), '*');
            } catch (err) {
                console.log('Error postMessage');
            }
        });

        function processB2B2CMessage(isGotoB2B) {
            //+++ check B2B2C Access
            var processB2B2CMsg = false;

            var isAuth = Principal.isAuthenticated();
            console.log("app.module - processB2B2CMessage --- isB2B2C: " + $ibe.isB2B2C() + ", isAuth: " + isAuth);

            if ($ibe.isB2B2C()) {
                if (!angular.isUndefined(isAuth) && isAuth) {
                    //user already login check B2B roles
                    if (!Principal.hasAuthority("ROLE_B2B")) {
                        console.log("app.module - user already login but doesnt have ROLE_B2B");
                        processB2B2CMsg = true;
                    }
                } else {
                    console.log("app.module - user access B2B2C directly or Logout");

                    //user access B2B2C directly or Logout
                    processB2B2CMsg = true;
                }
            }

            console.log("app.module - processB2B2CMessage --- processB2B2CMsg: " + processB2B2CMsg + " - isGotoB2B: " + isGotoB2B);

            if (processB2B2CMsg) {
                var error = {};
                error.redirectUrl = $ibe.getB2BAppUrl();

                if (isGotoB2B) {
                    $window.location.href = error.redirectUrl;

                } else {
                    //show dialog
                    DialogService.openB2B2CDialog(error);
                }

                //console.log('app.module - Show Dialog - goto Home...');
                //$state.go('home');
            }
            //---
        }
        //---
    }

    // Override Log
    var console = (function(c) {
        return {
            log: function(v) {
                if (true) {
                    c.log(v);
                }
            }
        };
    }(window.console));
    window.console = console;

    /** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith **/
    if (!String.prototype.endsWith)
        String.prototype.endsWith = function(searchStr, Position) {
            // This works much better than >= because
            // it compensates for NaN:
            if (!(Position < this.length))
                Position = this.length;
            else
                Position |= 0; // round position
            return this.substr(Position - searchStr.length,
                searchStr.length) === searchStr;
        };

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position) {
            return this.substr(position || 0, searchString.length) === searchString;
        };
    }

    if (!String.prototype.toTitleCase) {
        String.prototype.toTitleCase = function() {
            return this.toLowerCase().replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
                return p1 + p2.toUpperCase();
            });
        };
    }

    if (!String.prototype.includes) {
        String.prototype.includes = function(str) {
            var returnValue = false;

            if (this.indexOf(str) !== -1) {
                returnValue = true;
            }

            return returnValue;
        };

    }

    // GotadiApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    //     $rootScope.$state = $state; // state to be accessed from view
    //     $rootScope.$settings = settings; // state to be accessed from view
    // }]);

})();

(function() {
    if (jQuery && jQuery.fn && jQuery.fn.select2 && jQuery.fn.select2.amd) var e = jQuery.fn.select2.amd;
    return e.define("select2/i18n/vi", [], function() {
        return {
            inputTooLong: function(e) {
                var t = e.input.length - e.maximum,
                    n = "Vui lòng nhập ít hơn " + t + " ký tự";
                return t != 1 && (n += "s"), n
            },
            inputTooShort: function(e) {
                var t = e.minimum - e.input.length,
                    n = "Vui lòng nhập nhiều hơn " + t + ' ký tự';
                return n
            },
            loadingMore: function() {
                return "Đang lấy thêm kết quả…"
            },
            maximumSelected: function(e) {
                var t = "Chỉ có thể chọn được " + e.maximum + " lựa chọn";
                return t
            },
            noResults: function() {
                return "Không tìm thấy kết quả"
            },
            searching: function() {
                return "Đang tìm…"
            }
        }
    }), {
        define: e.define,
        require: e.require
    }
})();