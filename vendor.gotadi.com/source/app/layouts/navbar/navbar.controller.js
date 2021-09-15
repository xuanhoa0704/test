(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$log', '$state', 'Auth', 'Principal', 'ProfileService', 'LoginService', '$scope', '$uibModal', 'RegisterService', '$cookies', '$rootScope', 'CustomerService', '$translate', 'tmhDynamicLocale', '$location', 'MerchantService'];

    function NavbarController($log, $state, Auth, Principal, ProfileService, LoginService, $scope, $uibModal, RegisterService, $cookies, $rootScope, CustomerService, $translate, tmhDynamicLocale, $location, MerchantService) {

        // $scope.$on('$includeContentLoaded', function() {
        //     Layout.initHeader(); // init header 
        // });

        var vm = this;
        vm.currentMerchant = $cookies.get('merchant_code') || localStorage.getItem("merchant_code") || null;

        vm.isNavbarCollapsed = true;
        vm.isAuthenticated = Principal.isAuthenticated;

        vm.authenticationError = false;
        vm.inactivateError = false;
        vm.credentials = {};
        vm.login = login;
        vm.password = null;
        vm.rememberMe = true;
        vm.username = null;
        vm.language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
        if (!vm.language) {
            vm.language = "vi";
        }
        vm.language = "vi";
        vm.changeLanguage = changeLanguage;
        vm.getProfileInfo = getProfileInfo;

        // var lc_msisdn = $location.search().msisdn;
        // var ck_msisdn = $cookies.get('msisdn');
        // if((lc_msisdn && ck_msisdn) && (lc_msisdn != ck_msisdn ||  (!lc_msisdn &&ck_msisdn))) {
        //     window.location.reload();
        // }

        // $scope.$watch($rootScope.msisdn , function(newVal, oldVal) {
        //     console.log('akdgfsgasdfga=======================asfasdf')
        //     Principal.identity(true).then(function(acc) {
        //         vm.identity = acc;
        //         if(acc != null) {
        //             $translate.use(acc.langKey).then(function () {
        //                 $translate.refresh();
        //             });
        //         }
        //     })
        // });



        //keep sale_channel
        vm.isB2B2C = $ibe.isB2B2C();

        Principal.identity().then(function(user) {
            vm.identity = user;
            console.log("InfoUser: ");
            console.log(vm.identity);
            // nam.huynhphuong - fix ISSUE IBE2-499
            if (vm.identity == null) {
                vm.identity = {};
            }
            var isB2B = Principal.hasAnyAuthority(['ROLE_B2B']);
            if (isB2B) {
                CustomerService.getB2BProfile(vm.identity.login).then(function success(result) {
                    vm.identity.displayName = result.agentName;
                    vm.identity.email = vm.identity.login;
                });
            } else {
                var isB2C = Principal.hasAnyAuthority(['ROLE_B2C']);
                if (isB2C) {
                    CustomerService.getShortProfile(vm.identity.id).then(function success(result) {
                        CustomerService.getCustomerProfile(result.requesterId).then(function success(spResult) {
                            CustomerService.getCustomerTraveller(spResult.defaultTravellerId).then(function success(result) {
                                vm.identity.displayName = "";
                                if (typeof result.firstName != "undefined") {
                                    vm.identity.displayName = result.firstName;
                                }
                                if (typeof result.surName != "undefined") {
                                    vm.identity.displayName = vm.identity.displayName + " " + result.surName;
                                }
                            });
                        });
                    });
                }
            }

            if ((!vm.identity.displayName || vm.identity.displayName.length === 0 || vm.identity.displayName === " ")) {
                vm.identity.displayName = vm.identity.login;
            }
            // end fix

            // do something with data only inside this inner function
            //$log.log("vm.identity = " + JSON.stringify(user));

        });


        if (!MerchantService.isSimpleView()) {
            vm.getProfileInfo();
        }

        function getProfileInfo() {
            ProfileService.getProfileInfo().then(function(response) {
                vm.inProduction = response.inProduction;
                vm.swaggerEnabled = response.swaggerEnabled;
            });
        };


        function changeLanguage() {
            $translate.use(vm.language);
            tmhDynamicLocale.set(vm.language);
        };
        $scope.$on('$viewContentLoaded', function() {

            Layout.initHeader(); // init header

            var resBreakpointMd = App.getResponsiveBreakpoint('sm');
            //alert(resBreakpointMd + ":" + App.getViewPort().width);

            $('.nav a:not(.nolink)').on('click', function() {
                //$('.btn-navbar').click(); //bootstrap 2.x
                if (App.getViewPort().width < resBreakpointMd) {
                    $('.navbar-toggle').click(); //bootstrap 3.x by Richard
                }
            });
        });

        $scope.$on('authenticationSuccess', function() {
            $log.log("NavbarController --> authenticationSuccess event...");
            Principal.identity().then(function(account) {
                vm.identity = account;
                // nam.huynhphuong - fix ISSUE IBE2-499
                if (vm.identity == null) {
                    vm.identity = {};
                }
                var isB2B = Principal.hasAnyAuthority(['ROLE_B2B']);
                if (isB2B) {
                    CustomerService.getB2BProfile(vm.identity.login).then(function success(result) {
                        vm.identity.displayName = result.agentName;
                        vm.identity.email = vm.identity.login;
                    });
                } else {
                    var isB2C = Principal.hasAnyAuthority(['ROLE_B2C']);
                    if (isB2C) {
                        CustomerService.getShortProfile(vm.identity.id).then(function success(result) {
                            CustomerService.getCustomerProfile(result.requesterId).then(function success(spResult) {
                                CustomerService.getCustomerTraveller(spResult.defaultTravellerId).then(function success(result) {
                                    vm.identity.displayName = "";
                                    if (typeof result.firstName != "undefined") {
                                        vm.identity.displayName = result.firstName;
                                    }
                                    if (typeof result.surName != "undefined") {
                                        vm.identity.displayName = vm.identity.displayName + " " + result.surName;;
                                    }
                                });
                            });
                        });
                    }
                }

                if ((!vm.identity.displayName || vm.identity.displayName.length === 0 || vm.identity.displayName === " ")) {
                    vm.identity.displayName = vm.identity.login;
                }
                // end fix
            });
        });

        $scope.$on('syncAuthenticationSuccess', function() {
            $log.log("NavbarController --> syncAuthenticationSuccess event...");
            Principal.identity(true).then(function(account) {
                $rootScope.$broadcast('authenticationSuccess');
            });
        });

        $scope.$on('syncLogout', function() {
            $log.log("NavbarController --> syncLogout event...");
            syncLogout();
        });

        vm.login = login;
        vm.logout = logout;
        vm.register = register;
        vm.toggleNavbar = toggleNavbar;
        vm.collapseNavbar = collapseNavbar;
        vm.$state = $state;

        function login() {
            collapseNavbar();
            LoginService.open();
        }

        function logout() {
            collapseNavbar();
            Auth.logout();
            $state.go('home');

            //clean ibe token
            try {
                $ibe.resetTokenKey();
            } catch (err) {
                $log.log("AuthServerProvider.logout - err: " + err);
            }
            vm.identity = {};
            $rootScope.$broadcast('logoutSuccess');
        }

        function syncLogout() {
            collapseNavbar();
            Principal.authenticate(null);
            $log.log("$state.current.name" + $state.current.name);
            if ($state.current.name === 'home') {
                $state.reload();
            } else {
                $state.go('home');
            }

            //clean ibe token
            try {
                $ibe.resetTokenKey();
            } catch (err) {
                $log.log("AuthServerProvider.logout - err: " + err);
            }
            $rootScope.$broadcast('logoutSuccess');
        }

        function toggleNavbar() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        function collapseNavbar() {
            vm.isNavbarCollapsed = true;
        }

        /** Register dialog **/
        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        function register() {
            collapseNavbar();
            RegisterService.open();
        }
    }
})();