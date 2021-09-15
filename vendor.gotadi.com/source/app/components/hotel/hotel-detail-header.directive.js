(function() {
    'use strict';

    gtdHotelDetailHeaderController.$inject = [
        '$log', '$scope', '$state', '$uibModal',
        'MetaData', 'HotelUtils', 'Hotel', 'DataService', 'DialogService', 'Base64'
    ];

    function gtdHotelDetailHeaderController(
        $log, $scope, $state, $uibModal,
        MetaData, HotelUtils, Hotel, DataService, DialogService, Base64) {
        var ctrl = this;

        ctrl.modalInstance = null;
        ctrl.resetModal = resetModal;
        ctrl.openMapPlaceAround = openMapPlaceAround;
        ctrl.openShareModal = openShareModal;
        ctrl.copyStringToClipboard = copyStringToClipboard;

        // ctrl.bookingClicked = function(feature, room) {

        //$state.go('hotel-booking');
        // };

        ctrl.getFacility = function(fac) {
            return HotelUtils.getFacilityClass(fac);
        };

        ctrl.goToReserve = function() {
            // $('html, body').animate({
            //     scrollTop: $(".hotel-detail-change-wrapper").offset().top
            // }, 1000);

            var buffer = 0;

            if ($(window).width() >= 991) {
                buffer = 200;
            }

            $('html, body').animate({
                scrollTop: $("#hotel-detail-zone").offset().top - buffer
            }, 1000);
        };

        ctrl.bookingClicked = function(feature, room) {
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
                        $state.go('hotel-booking/:booking_number/:params', {
                            "booking_number": Base64.encodeString(result.bookingCode.bookingNumber),
                            "params": ''
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

        function resetModal() {
            ctrl.modalInstance = null;
        }

        function openMapPlaceAround() {
            if (ctrl.modalInstance !== null) return;
            DataService.setHotelSearchOptions(ctrl.searchOptions);
            ctrl.modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/components/hotel/hotel-place-around.html',
                controller: 'HotelPlaceAroundController',
                controllerAs: 'vm',
                windowClass: 'hotel-detail-map-full-window',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('hotel');
                        return $translate.refresh();
                    }],
                    selectedHotel: function() {
                        return ctrl.hotelModel;
                    }
                }
            });
            ctrl.modalInstance.result.then(
                ctrl.resetModal,
                ctrl.resetModal
            );
        }

        function copyStringToClipboard() {
            // Create new element
            var el = document.createElement('textarea');
            // Set value (string to be copied)
            $(el).val(ctrl.shareUrl);
            // Set non-editable to avoid focus and move outside of view
            el.setAttribute('readonly', '');
            el.style = {
                position: 'absolute',
                left: '-9999px'
            };
            document.body.appendChild(el);
            // Select text inside element
            el.select();
            // Copy text to clipboard
            document.execCommand('copy');
            // Remove temporary element
            document.body.removeChild(el);
        }

        function openShareModal() {
            ctrl.shareUrl = window.location.href,
                $('#modal-share').modal();
        }

    }

    var gtdHotelDetailHeader = {
        templateUrl: 'app/components/hotel/hotel-detail-header.html',
        controller: gtdHotelDetailHeaderController,
        bindings: {
            hotelModel: '=',
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelDetailHeader', gtdHotelDetailHeader);

})();