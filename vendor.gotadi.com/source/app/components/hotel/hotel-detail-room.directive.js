(function() {
    'use strict';

    gtdHotelDetailRoomController.$inject = [
        '$log', '$scope', '$uibModal', '$state', '$stateParams', '$filter', '$compile',
        'Hotel', 'DataService', 'DialogService', 'Base64', 'HotelUtils'
    ];

    function gtdHotelDetailRoomController(
        $log, $scope, $uibModal, $state, $stateParams, $filter, $compile,
        Hotel, DataService, DialogService, Base64, HotelUtils) {
        var ctrl = this;
        ctrl.showTooltipAllowHold = showTooltipAllowHold;
        ctrl.showSurchargesTooltip = showSurchargesTooltip;

        ctrl.tooltipSurcharge;
        ctrl.tooltipInstanceAllowHold;


        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        ctrl.searchResult = DataService.getHotelSearchResult();
        ctrl.searchOptions = DataService.getHotelSearchOptions();

        ctrl.getFacility = function(add) {
            var fac = HotelUtils.getFacilityText(add);
            return HotelUtils.getFacilityClass(fac);
        };

        function showTooltipAllowHold(feature, index) {
            if (!ctrl.tooltipInstanceAllowHold) {
                ctrl.tooltipInstanceAllowHold = tippy(".hotel-tippy-allow-hold", {
                    animation: 'scale',
                    theme: 'hotel',
                    arrow: true
                });
            }

            var message = "";
            if (!feature.allowHold) {
                message = $filter('translate')('hotel.search.result.non-refundable');
            } else {
                message = $filter('translate')('hotel.search.result.refundable');
                message = message.replace('{rate}', feature.listDeadline ? feature.listDeadline[0].ratio * 100 : "100");
            }

            ctrl.tooltipInstanceAllowHold[index].setContent(message);
        }

        function showSurchargesTooltip(surcharges, index) {
            ctrl.surcharges = surcharges;
            var template = '<div>';
            var firstDate = surcharges[0].date;
            surcharges.forEach(function(item) {
                if (item.id === 'base_rate' || item.date !== firstDate) {
                    return;
                }
                template += '<div class="row" style="margin:7px; width:300px">' +
                    '<div class="col-xs-7 text-left"><strong>' + $filter('translate')('hotel.search.surcharges.' + item.id) + '</strong></div>' +
                    '<div class="col-xs-5">' + $filter('number')(item.amount) + ' VNĐ</div>' +
                    '</div>';
                var span = document.createElement('span');
                span.innerHTML = item.description + ' ' + item.amount;
            });
            var compiled = $compile(template)(ctrl);
            // console.log(compiled[0].innerHTML);

            if (!ctrl.tooltipSurcharge) {
                ctrl.tooltipSurcharge = tippy(".hotel-surcharge-tippy", {
                    animation: 'scale',
                    theme: 'hotel',
                    arrow: true,
                    interactive: true,
                    placement: 'left'
                });
            }
            ctrl.tooltipSurcharge[index].setContent(compiled[0].innerHTML);

        }

        ctrl.bookingClicked = function(feature, room) {
            if (!feature.quantityAvaliable || feature.quantityAvaliable <= 0) return;
            var hotelSearchOptions = DataService.getHotelSearchOptions();
            DataService.setSelectedHotelProduct(feature);
            DataService.setSelectedHotelRoom(room);

            Hotel.createDraftBooking(hotelSearchOptions, ctrl.hotelModel, feature, room)
                .then(function(result) {
                    $log.log("Get createDraftBooking from hotel.service");
                    $log.log(result);

                    if (DialogService.isResponseSuccess(result)) {
                        DataService.setHotelBookingModel(result.bookingCode);
                        // Go to
                        // $state.go('hotel-booking');
                        $state.go('hotel-booking/:booking_number/:params', {
                            "booking_number": Base64.encodeString(result.bookingCode.bookingNumber),
                            "params": "",
                            'hotelId': $stateParams.hotel_id
                        });
                        //$state.go('hotel-booking', {"searchOptions": vm.searchOptions, "searchResult": vm.searchResult});
                    } else {
                        DialogService.openHttpAlertDilalog(result);
                    }
                }, function error(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
            // $state.go('hotel-booking');
        };

        ctrl.openFullHotelImages = function(feature) {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/components/hotel/hotel-detail-image-full.html',
                controller: 'HotelDetailImageFullController',
                controllerAs: 'vm',
                windowClass: 'hotel-detail-image-full-window',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('hotel');
                        return $translate.refresh();
                    }],
                    hotelModel: function() {
                        return ctrl.hotelModel;
                    },
                    productModel: function() {
                        return feature;
                    }
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };

    }

    var gtdHotelDetailRoom = {
        templateUrl: 'app/components/hotel/hotel-detail-room.html',
        controller: gtdHotelDetailRoomController,
        bindings: {
            hotelModel: '=',
            searchOptions: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelDetailRoom', gtdHotelDetailRoom);

})();