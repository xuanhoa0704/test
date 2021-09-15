(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('BannerService', BannerService);

    BannerService.$inject = ['$http', '$cookies', '$q', 'MerchantService'];

    function BannerService($http, $cookies, $q, MerchantService) {

        var dataPromise;

        var service = {
            getBanners: getBanners
        };

        return service;

        function getBanners() {

            if (MerchantService.isSimpleView()) {
                return $q.reject();
            }

            // if (angular.isUndefined(dataPromise)) {
            dataPromise = $http.get('https://www2.gotadi.com/Admin/Bannerslider/ListbannerAPI/', {
                noAuth: true
            }).then(function(result) {
                if (!!result && !!result.data) {
                    return result.data;
                }
                return [];
            });
            // }
            return dataPromise;
        }
    }
})();