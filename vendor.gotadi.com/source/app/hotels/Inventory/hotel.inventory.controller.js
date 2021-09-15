(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelInventoryController', HotelInventoryController);

    HotelInventoryController.$inject = ['$log', '$rootScope', '$scope', '$interval', '$state', '$timeout', '$http', 'DialogService'];

    function HotelInventoryController($log, $rootScope, $scope, $interval, $state, $timeout, $http, DialogService) {
        var vm = this;
        vm.registry = registry;


        function registry() {
            if (!vm.hotelName || !vm.phoneNumber || !vm.email || !vm.address) {
                return false;
            }
            var dto = {};
            dto.hotelName = vm.hotelName;
            dto.phoneNumber = vm.phoneNumber;
            dto.email = vm.email;
            dto.address = vm.address;
            dto.fullName = vm.fullName;

            return $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: '/api/form/hotel-inventory',
                data: angular.toJson(dto)
            }).then(function successCallback(response, result) {
                $state.go('inventory', result, {
                    reload: true
                });
                DialogService.openAlertDialog({
                    "title": "Thông báo",
                    "message": "Cảm ơn bạn đã gửi thông tin liên hệ, chúng tôi sẽ liên lạc với bạn trong thời gian sớm nhất."
                });
                return response.data;
            }, function errorCallback(response) {
                return response.data;
            });
        }
    }
})();