(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelDetailController', HotelDetailController);

    HotelDetailController.$inject = [
        '$rootScope', '$scope', '$state', '$stateParams', '$timeout', '$log', '$filter',
        'Hotel', 'DataService', 'DialogService', 'Base64', 'GlobalSrv', 'HotelUtils', 'GtdHotelService',
        'PREFIX_DEFAULT_POLICY_STRING', 'AFTER_DEFAULT_POLICY_STRING', 'HOTEL_STATES'
    ];

    function HotelDetailController(
        $rootScope, $scope, $state, $stateParams, $timeout, $log, $filter,
        Hotel, DataService, DialogService, Base64, GlobalSrv, HotelUtils, GtdHotelService,
        PREFIX_DEFAULT_POLICY_STRING, AFTER_DEFAULT_POLICY_STRING, HOTEL_STATES) {
        var vm = this;

        //++++ initial parameter
        vm.hotelId = $stateParams.hotel_id;
        vm.params = $stateParams.params;

        vm.isLoading = true;


        vm.hotelAvailabilityChanged = hotelAvailabilityChanged;
        vm.initControl = initControl;

        vm.selectedDestination = GtdHotelService.getSelectedDestination();

        vm.hotelStates = GtdHotelService.getStates();
        if (vm.params) {
            try {
                vm.searchOptions = Base64.decodeJson(vm.params);
                GtdHotelService.updateSearchOptions(vm.searchOptions);
            } catch (err) {
                $log.log(err);
            }
        }

        vm.initControl();

        function initControl() {

            var listener = $rootScope.$on(HOTEL_STATES, function(event, newValue) {
                if (!newValue) {
                    return;
                }
                switch (newValue.state) {
                    case vm.hotelStates.SHOW_LOADING:
                        vm.isLoading = true;
                        break;
                    case vm.hotelStates.HIDE_LOADING:
                        vm.isLoading = false;
                        break;
                    case vm.hotelStates.HOTEL_AVAILABILITY_CHANGED:
                        vm.hotelAvailabilityChanged(newValue.payload);
                        break;
                    default:
                        break;
                }
            });
        }

        $scope.changeItinerary = function() {
            $('.hotel-search-header').slideToggle();
        };


        vm.backSearchResult = function() {
            GtdHotelService.backToResult();
        };
        //get supplierSessionId form search result cell
        var retrievedsupplierSessionId = localStorage.getItem('ctrl.item.supplierSessionId');
        GtdHotelService.checkHotelAvailability({
            "id": vm.hotelId,
            "supplierSessionId": retrievedsupplierSessionId
        });
        var cnt = 0;

        function hotelAvailabilityChanged(result) {

            $log.log("Get checkHotelAvailability hotel.service");
            $log.log(result);
            $log.log(result.valid);
            if (result != null &&
                result.hotel.products == null &&
                cnt < 1) {
                cnt++;
                GtdHotelService.checkHotelAvailability({
                    "id": vm.hotelId,
                    "supplierSessionId": result.hotel.supplierSessionId
                });
            }

            if (result.success) {

                DataService.setSelectedHotel(result.hotel);
                DataService.setSelectedHotelAvail(result.hotel);

                GlobalSrv.addRecentViewHotels(result.hotel);

                vm.searchCompleted = true;
                vm.selectedHotel = result.hotel;
                if (vm.selectedHotel && vm.selectedHotel.products) {
                    vm.selectedHotel.products.forEach(function(feature) {
                        var roomDescription = feature.roomLongDescription;
                        if (roomDescription && roomDescription.length > 0) {
                            var arrDesc = roomDescription.split('<br />');
                            feature.arrDesc = [];
                            for (var i = 0; i < arrDesc.length; i++) {
                                if (arrDesc[i].indexOf('Internet') > 0 || i == 2) break;
                                feature.arrDesc[i] = arrDesc[i].replace('<strong>', '').replace('</strong>', '').replace('Phòng', '');
                            }
                            feature.arrDesc.reverse();
                        }

                        if (!feature.nonRefundable && feature.policyString) {
                            var prefixStr = PREFIX_DEFAULT_POLICY_STRING.replace(new RegExp('\\{0\\}', 'gm'), vm.selectedHotel.hotelMeta.name);
                            feature.displayPolicyString = feature.policyString.replace(prefixStr, '');
                            var date = feature.displayPolicyString.match(/(\d{2}):(\d{2}) \(\(\w{3}\+(\d{2}):(\d{2})\)\), (\d{2})([\/.-])(\d{2})([\/.-])(\d{4})/g);
                            if (date) {
                                var policyAfter = feature.displayPolicyString.replace(date, '');
                                $log.log(date);

                                var rawdate = date[0];
                                var res = rawdate.replace(/{.*?}/g, "")
                                    .replace(/\[.*?\]/g, "")
                                    .replace(/<.*?>/g, "")
                                    .replace(/\(.*?\)/g, "");


                                date = moment(res, 'HH:mm, , DD-MM-YYYY').format('HH:mm, dddd, DD-MM-YYYY');
                                $log.log(date);
                                feature.displayPolicyString = date;
                                $log.log(feature.displayPolicyString);
                            }
                        }
                        feature.adultQuantity = 0;
                        feature.childQuantity = 0;
                        if (feature.rooms) {
                            feature.rooms.forEach(function(room) {
                                feature.adultQuantity = feature.adultQuantity + room.pax.adultQuantity;
                                feature.childQuantity = feature.childQuantity + room.pax.childQuantity;
                            });
                        }
                    });
                }
                HotelUtils.getFacilities(vm.selectedHotel);

                // TODO: Remove ignore Expedia
                // if(vm.selectedHotel.supplierCode === 'E'){
                //     vm.selectedHotel.products = [];
                // }
                // End remove ignore Expedia

                // vm.selectedHotel = DataService.getSelectedHotel();

                // vm.selectedHotel.hotelContent = JSON.parse(vm.selectedHotel.hotelMetadata.hotelContent);
                // vm.selectedHotel.hotelContent = vm.selectedHotel.hotelMeta;

                $timeout(function() {
                    $rootScope.$broadcast("gtd-load-details-completed", null);
                }, 1000);
            } else {
                DialogService.openAlertDialog({
                    "title": $filter('translate')('hotel.search.error.title'),
                    "message": $filter('translate')('hotel.search.result.errormess')
                });
                // GtdHotelService.backSearchResult();
            }
        }

    }
})();