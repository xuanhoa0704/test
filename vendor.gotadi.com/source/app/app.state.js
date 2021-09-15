(function() {
    'use strict';

    var B2B2CGatewayApp = angular
        .module('B2B2CGatewayApp');

    B2B2CGatewayApp.config(stateConfig);

    stateConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'TEMPLATE_URL'];

    function templateNameByParams(TEMPLATE_URL, type) {
        var param = String(Cookies.get('merchant_code') || localStorage.getItem("merchant_code")).toUpperCase();
        if (!TEMPLATE_URL[param] || !TEMPLATE_URL[param][type])
            return TEMPLATE_URL['DEFAULT'][type];
        return TEMPLATE_URL[param][type];
    }

    function getParamsUrl(key) {
        var result = 'default';
        var url = window.location.href;
        var p = url.split('?')[1];
        if (!p) return result;
        var p2 = p.split('&');
        for (var i = 0; i < p2.length; i++) {
            var p3 = p2[i].split('=');
            if (key == p3[0]) {
                result = p3[1];
            }
        }
        return result;
    }

    ///GotadiApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    function stateConfig($stateProvider, $urlRouterProvider, TEMPLATE_URL) {

        //$urlRouterProvider.otherwise("/home.html");

        $stateProvider.state('app', {
            abstract: true,
            views: {
                'navbar@': {
                    templateUrl: function() {
                        return templateNameByParams(TEMPLATE_URL, 'navbar');
                    },
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                },

                'pagehead@': {
                    templateUrl: 'app/layouts/common/page-head.html'
                    // ,controller: 'NavbarController',
                    // controllerAs: 'vm'
                },

                'footer@': {
                    templateUrl: function() {
                        return templateNameByParams(TEMPLATE_URL, 'footer');
                    },
                    controller: 'FooterController',
                    controllerAs: 'vm'
                }
            },

            resolve: {
                authorize: ['Auth', '$rootScope',
                    function(Auth, $rootScope) {
                        //+++ populate B2B token
                        try {
                            if ($ibe.hasTokenKey()) {
                                //logout to clean existing session
                                Auth.logout();

                                //login with new authentication
                                Auth.loginWithToken($ibe.getTokenKey(), false).then(function() {
                                    Auth.authorize(true).then(function() {
                                        console.log("App.State: $broadcast('authenticationSuccess')");
                                        $rootScope.$broadcast('authenticationSuccess');
                                    });
                                });
                            }
                        } catch (err) {
                            console.log("uth.loginWithToken() -- Error: " + err);
                        }
                        //---
                        // return Auth.authorize().then(function () {
                        //     console.log("app.state -- load app.state SUCCESS... ");
                        //     $rootScope.$broadcast('loadAppStateSuccess');
                        // });
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                    $translatePartialLoader.addPart('lookup');
                }]
            }
        })

        // // Dashboard
        // .state('dashboard', {
        //     url: "/dashboard",
        //     //templateUrl: "app/layouts/views/dashboard.html",
        //     //templateUrl: "app/home/home.html",
        //     data: {pageTitle: 'GOTADI Template'},
        //     //controller: "DashboardController",
        //     // controller: "HomeController",
        //     views: {
        //         'content@': {
        //             templateUrl: "app/layouts/views/dashboard.html",
        //             controller: "DashboardController",
        //             controllerAs: 'vm'
        //         }
        //     },
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'GotadiApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
        //                 files: [
        //                     '../bower_components/gtd-theme/assets/global/plugins/morris/morris.css',
        //                     '../bower_components/gtd-theme/assets/global/plugins/morris/morris.min.js',
        //                     '../bower_components/gtd-theme/assets/global/plugins/morris/raphael-min.js',
        //                     '../bower_components/gtd-theme/assets/global/plugins/jquery.sparkline.min.js',
        //
        //                     '../bower_components/gtd-theme/assets/pages/scripts/dashboard.min.js'
        //                     // ,'app/js/controllers/DashboardController.js',
        //                 ]
        //             });
        //         }]
        //     }
        // })

        ;
    }

    /* Setup global settings */
    // B2B2CGatewayApp.factory('settings', ['$rootScope', function($rootScope) {
    //     // supported languages
    //     var settings = {
    //         layout: {
    //             pageSidebarClosed: false, // sidebar menu state
    //             pageContentWhite: true, // set page content layout
    //             pageBodySolid: false, // solid body color state
    //             pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
    //         },
    //         assetsPath: '../assets',
    //         globalPath: '../assets/global',
    //         layoutPath: '../assets/layouts/layout3',
    //     };
    //
    //     $rootScope.settings = settings;
    //
    //     return settings;
    // }]);


})();

/** DEMO **/
// angular.module('B2B2CGatewayApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
//     $scope.$on('$viewContentLoaded', function() {
//         // initialize core components
//         App.initAjax();
//     });
//
//     // set sidebar closed and body solid layout mode
//     $rootScope.settings.layout.pageContentWhite = true;
//     $rootScope.settings.layout.pageBodySolid = false;
//     $rootScope.settings.layout.pageSidebarClosed = false;
// });