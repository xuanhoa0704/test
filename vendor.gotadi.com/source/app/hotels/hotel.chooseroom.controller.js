(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelChooseroomController', HotelChooseroomController);

    HotelChooseroomController.$inject = [
        '$log', '$uibModalInstance',
        'GtdHotelService'
    ];

    function HotelChooseroomController(
        $log, $uibModalInstance,
        GtdHotelService
    ) {
        var vm = this;
        vm.init = init;
        vm.increaseAdult = increaseAdult;
        vm.decreaseAdult = decreaseAdult;
        vm.increaseChild = increaseChild;
        vm.decreaseChild = decreaseChild;
        vm.limitInput = limitInput;

        vm.ageOptions = [];

        for (var i = 1; i <= 17; i++) {
            vm.ageOptions.push(i);
        }

        vm.init();


        // $log.log(vm.chooseRoomSearchOptions);
        // vm.chooseRoomSearchOptions.forEach(function (item) {
        //     for (var i = 0; i < item.childrenNo; i++) {
        //         if (item.paxDetails[i] == "0") {
        //             item.paxDetails[i] = "";
        //         }
        //     }
        // });


        function init() {
            vm.init = init;

            vm.chooseRoomSearchOptions = angular.copy(GtdHotelService.getPaxFilter());
        }

        function increaseAdult(pax) {
            if (pax.adultQuantity && pax.adultQuantity < 8) {
                pax.adultQuantity++;
            } else {
                pax.adultQuantity = 8;
            }
        }

        function decreaseAdult(pax) {
            if (pax.adultQuantity && pax.adultQuantity > 1) {
                pax.adultQuantity--;
            } else {
                pax.adultQuantity = 1;
            }
        }

        function increaseChild(pax) {
            if (pax.childQuantity < 4) {
                pax.childQuantity++;
                pax.childrenAges.push("1");
            } else {
                pax.childQuantity = 4;
            }
        }

        function decreaseChild(pax) {
            if (pax.childQuantity && pax.childQuantity > 0) {
                pax.childQuantity--;
                pax.childrenAges.pop();
            } else {
                pax.childQuantity = 0;
            }
        }

        function limitInput($event, obj, field, maxLength) {
            if (obj !== undefined && obj[field] > maxLength) {
                obj[field] = maxLength;
            }
        }

        vm.addPax = function() {
            if (vm.chooseRoomSearchOptions.length < 8) {
                vm.chooseRoomSearchOptions.push({
                    adultQuantity: "2",
                    childQuantity: "0",
                    childrenAges: []
                });
            }
            //$log.log(JSON.stringify(vm.searchOptions.pax));
        };
        vm.removePax = function(index) {
            if (vm.chooseRoomSearchOptions.length > 1) {
                vm.chooseRoomSearchOptions.splice(index, 1);
            }
        };

        $uibModalInstance.result.finally(function() {

        });

        vm.cancel = function cancel() {
            GtdHotelService.updatePaxInfo(vm.chooseRoomSearchOptions);

            $uibModalInstance.dismiss('cancel');
        };

        // $scope.$on('event-flight-load-completed', function (event, item) {
        //     vm.cancel();
        // });

    }
})();