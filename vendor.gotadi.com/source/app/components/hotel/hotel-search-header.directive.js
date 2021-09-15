(function() {
    'use strict';

    gtdHotelSearchHeaderController.$inject = ['$log', '$scope', '$uibModal', '$attrs', 'MetaData', 'Hotel', 'DialogService', 'DataService', 'GlobalSrv', '$timeout', 'DEFAULT_PAGE_SIZE', 'HotelUtils'];

    function gtdHotelSearchHeaderController($log, $scope, $uibModal, $attrs, MetaData, Hotel, DialogService, DataService, GlobalSrv, $timeout, DEFAULT_PAGE_SIZE, HotelUtils) {
        var ctrl = this;

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        if (!ctrl.searchOptions) {
            ctrl.searchOptions = {};
            // Default init
            ctrl.searchOptions.size = DEFAULT_PAGE_SIZE; //15
            ctrl.searchOptions.page = 0;
            ctrl.searchOptions.adultNo = 1;
            // ctrl.searchOptions.checkindate = moment(new Date()).format('MM/DD/YYYY');
            // ctrl.searchOptions.checkoutdate = moment(new Date()).format('MM/DD/YYYY');
            ctrl.searchOptions.pax = [{
                adultNo: 2,
                childrenNo: 0,
                paxDetails: []
            }];
        }

        ctrl.getAdultNumberFromSo = function getAdultNumberFromSo() {
            return HotelUtils.getAdultNumberFromSo(ctrl.searchOptions);
        };

        ctrl.getChildrenNumberFromSo = function getAdultNumberFromSo() {
            return HotelUtils.getChildrenNumberFromSo(ctrl.searchOptions);
        };


        var modalChooseRoomInstance = null;
        var resetModalChooseRoom = function() {
            modalChooseRoomInstance = null;
        };
        ctrl.openChooseRoomDetail = function() {
            if (modalChooseRoomInstance !== null) return;
            modalChooseRoomInstance = $uibModal.open({
                animation: true,
                backdrop: true,
                templateUrl: 'app/hotels/hotel.chooseroom.html',
                controller: 'HotelChooseroomController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hotel');
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    searchOptions: function() {
                        return ctrl.searchOptions;
                    }
                }
            });
            modalChooseRoomInstance.result.then(
                resetModalChooseRoom,
                resetModalChooseRoom
            );
        };

        ctrl.searchDestinations = function(val) {
            return Hotel.searchHotelMetaData(val);
            // return MetaData.searchDestinations(val);
        };

        ctrl.formatLabel = function(model) {
            // Hotel.searchHotelMetaData(model).then(function () {
            //     var airports = GlobalSrv.getLocalDestinations();
            //
            //     for (var idx in airports) {
            //
            //         if (airports[idx].code == model) {
            //             // $log.log(airports[idx].code + ":" + model + ":" + (airports[idx].code == model));
            //             return airports[idx].name;
            //         }
            //     }
            //
            //     return model;
            // });

            // $log.log("formatLabel:" + model);

            var destinations = GlobalSrv.getLocalDestinations();

            for (var idx in destinations) {

                if (destinations[idx].code == model) {
                    // $log.log(airports[idx].code + ":" + model + ":" + (airports[idx].code == model));
                    $log.log('destination = ');
                    $log.log(destinations[idx]);
                    ctrl.searchOptions.destinationType = destinations[idx].type;
                    ctrl.searchOptions.destinationName = destinations[idx].name.split(",")[0];
                    return destinations[idx].name;
                }
            }

            return model;
        };

        ctrl.doSearchImpl = function() {
            // VALIDATION
            if (moment(ctrl.searchOptions.checkindate, 'DD-MM-YYYY').diff(moment(ctrl.searchOptions.checkoutdate, 'DD-MM-YYYY')) > 0) {
                DialogService.openAlertDialog({
                    "title": "Error",
                    "message": "Ngày Trả Phòng phải sau Ngày Nhận Phòng"
                });
                return;
            }

            ctrl.searchOptions.page = 0;
            ctrl.searchOptions.size = DEFAULT_PAGE_SIZE; //15

            // Show Dialogs:
            this.open();

            $log.log("HotelHeaderDirectiveDoSearch: Search Options");
            $log.log(ctrl.searchOptions);

            DataService.setHotelSavedSearchOption(jQuery.extend({}, ctrl.searchOptions));

            var myDataPromise = Hotel.searchHotel(ctrl.searchOptions);
            myDataPromise.then(function(result) {
                ctrl.searchResult = result;

                ctrl.searchOptions.searchId = result.searchId;

                $log.log("Get result from hotel.search.service");
                // $log.log("ctrl.searchResult = " + JSON.stringify(ctrl.searchResult));

                // Do get advance filter options
                Hotel.getAdvanceFilterOptions(ctrl.searchOptions).then(function(result) {
                    ctrl.searchOptions.advanceFilterOptions = result;

                    DataService.setHotelSearchResult(ctrl.searchResult);
                    DataService.setHotelSearchOptions(ctrl.searchOptions);

                    ctrl.doSearch({
                        $searchResult: ctrl.searchResult,
                        $searchOptions: ctrl.searchOptions
                    });
                });

            }, function error(result) {
                DialogService.openHttpAlertDilalog(result);
            });

        };

        ctrl.initControl = function() {};

        ctrl.open = function() {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/hotels/search/hotel.search.loading.html',
                controller: 'HotelSearchLoadingController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hotel');
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    searchOptions: function() {
                        return ctrl.searchOptions;
                    }
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };

        ctrl.$postLink = function() {
            $timeout(function() {
                ctrl.initControl();
            }, 0);

            if (ctrl.init && !ctrl.searchCompleted) {
                $log.log('+++++++++++++++ SEARCH AGAIN ++++++++++++++++');
                $log.log('ctrl.init:' + ctrl.init + ", ctrl.searchCompleted:" + ctrl.searchCompleted);

                ctrl.doSearchImpl();

                $timeout(function() {
                    ctrl.searchCompleted = true;
                    // $rootScope.$broadcast("gtd-flight-search-header-serch-completed", null);
                }, 100);


            }
        };

        $scope.$on('gtd-hotel-reinit-search', function() {
            $log.log('gtd-hotel-reinit-search');
            ctrl.doSearchImpl();
        });

    }

    var gtdHotelSearchHeader = {
        templateUrl: 'app/components/hotel/hotel-search-header.html',
        controller: gtdHotelSearchHeaderController,
        bindings: {
            init: '=',
            searchCompleted: '=',
            doSearch: '&',
            searchResult: '=?searchResult',
            searchOptions: '=?searchOptions'
        }
    };

    // angular
    //     .module('B2B2CGatewayApp')
    //     .component('gtdHotelSearchHeader', gtdHotelSearchHeader);

})();