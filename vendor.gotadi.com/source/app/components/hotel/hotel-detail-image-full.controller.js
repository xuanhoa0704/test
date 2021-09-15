(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelDetailImageFullController', HotelDetailImageFullController);

    HotelDetailImageFullController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', 'Auth', '$uibModalInstance', 'hotelModel', 'productModel', 'UIService'];

    function HotelDetailImageFullController($log, $rootScope, $scope, $state, $timeout, Auth, $uibModalInstance, hotelModel, productModel, UIService) {
        var vm = this;

        $log.log('hotel=');
        $log.log(hotelModel);
        $log.log('product=');
        $log.log(productModel);

        vm.hotelModel = hotelModel;
        vm.productModel = productModel;

        // foreach vm.productModel.images as img 
        angular.forEach(vm.productModel.images, function(item, index) {
            if (vm.productModel.supplierType == "E") {
                var dot = item.lastIndexOf('.');
                var dotNext = item.substring(dot);
                var strImages = item.substring(0, dot - 1);
                vm.productModel.images[index] = strImages + 'z' + dotNext;
            }
        });

        vm.cancel = function() {
            UIService.showBodyScroll();
            $uibModalInstance.dismiss('cancel');
        };

        vm.initMap = function() {

            // Image Viewer
            // $('#lightSlider').lightSlider({
            //     gallery: true,
            //     item: 1,
            //     loop: true,
            //     autoWidth: false,
            //     slideMargin: 0,
            //     thumbItem: 5
            // });
        };

        $uibModalInstance.opened.then(function() {
            $timeout(function() {
                vm.initMap();
            }, 0);
            UIService.hideBodyScroll();
        });

    }
})();