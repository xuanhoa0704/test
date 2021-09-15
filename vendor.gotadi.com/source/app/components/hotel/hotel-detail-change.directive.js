(function() {
    'use strict';

    gtdHotelDetailChangeController.$inject = [
        '$rootScope', '$state',
        'MetaData', 'GtdHotelService', 'DialogService', 'Base64',
        'HOTEL_STATES'
    ];

    function gtdHotelDetailChangeController(
        $rootScope, $state,
        MetaData, GtdHotelService, DialogService, Base64,
        HOTEL_STATES) {
        var ctrl = this;
        ctrl.initControl = initControl;
        ctrl.openChooseRoomDetail = openChooseRoomDetail;
        ctrl.hotelStates = GtdHotelService.getStates();
        ctrl.initControl();

        function initControl() {
            ctrl.searchOptions = GtdHotelService.getSearchOptions();
            ctrl.paxDetail = GtdHotelService.getPaxSummary();

            var listener = $rootScope.$on(HOTEL_STATES, function(event, newValue) {
                if (!newValue) {
                    return;
                }
                switch (newValue.state) {
                    case ctrl.hotelStates.CHANGE_SEARCH_FILTER:
                        ctrl.searchOptions = newValue.payload;
                        ctrl.paxDetail = GtdHotelService.getPaxSummary();
                        break;
                    default:
                        break;
                }
            });
        }

        function openChooseRoomDetail() {
            GtdHotelService.openModalUpdateRoomDetail();
        }

        ctrl.doSearchImpl = function() {
            // VALIDATION
            if (moment(ctrl.searchOptions.hotelSearchFilter.checkindate, 'DD-MM-YYYY').diff(moment(ctrl.searchOptions.hotelSearchFilter.checkout_date, 'DD-MM-YYYY')) > 0) {
                DialogService.openAlertDialog({
                    "title": "Error",
                    "message": "Ngày Trả Phòng phải sau Ngày Nhận Phòng"
                });
                return;
            }
            GtdHotelService.updateSearchOptions(ctrl.searchOptions);
            var retrievedsupplierSessionId = localStorage.getItem('ctrl.item.supplierSessionId');
            GtdHotelService.checkHotelAvailability({
                "id": ctrl.hotelId,
                "supplierSessionId": retrievedsupplierSessionId
            });
            // GtdHotelService.checkHotelAvailability({"id": ctrl.hotelId});


        };
    }

    var gtdHotelDetailChange = {
        templateUrl: 'app/components/hotel/hotel-detail-change.html',
        controller: gtdHotelDetailChangeController,
        controllerAs: '$ctrl',
        bindings: {
            hotelId: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelDetailChange', gtdHotelDetailChange);

})();