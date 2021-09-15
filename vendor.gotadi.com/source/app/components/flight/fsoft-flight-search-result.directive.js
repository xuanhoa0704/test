(function() {
    'use strict';

    gtdFsoftFlightSearchResultController.$inject = ['$location', '$cookies', '$log', '$rootScope', '$scope', '$uibModal', '$timeout', '$anchorScroll', 'MetaData', 'DataService', 'Flight', 'PaginationUtil', 'DialogService', 'IBE_KEYS', '$window', 'MerchantService'];

    function gtdFsoftFlightSearchResultController($location, $cookies, $log, $rootScope, $scope, $uibModal, $timeout, $anchorScroll, MetaData, DataService, Flight, PaginationUtil, DialogService, IBE_KEYS, $window, MerchantService) {
        var ctrl = this;
        ctrl.merchantCode = MerchantService.getMerchant();
        $scope.ibeKeys = IBE_KEYS;
        ctrl.chieuBay = 0;
        ctrl.filterAirline = filterAirline;
        ctrl.filterFlight = filterFlight;
        ctrl.filterpricedItineraries = filterpricedItineraries;

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        ctrl.airlineIdx = 1;
        ctrl.busy = false;

        ctrl.showCarousel = true;

        ctrl.searchOptions.departureDateDir = 'desc';
        ctrl.searchOptions.arrivalDateDir = 'desc';
        ctrl.searchOptions.durationDir = 'desc';
        ctrl.searchOptions.priceDir = 'asc';

        var RoleLevel = +ctrl.searchOptions.RoleLevel;
        var NCRange = +ctrl.searchOptions.NCRange;

        // INIT BACK
        ctrl.returnSearchOptions = DataService.getReturnSearchOption();
        ctrl.returnSearchResult = DataService.getReturnSearchResult();
        ctrl.departSearchOptions = DataService.getDepartSearchOption();
        ctrl.departSearchResult = DataService.getDepartSearchResult();
        ctrl.departPricedItinerary = DataService.getDepartPricedItinerary();
        ctrl.departGroupItem = DataService.getDepartGroupItem();
        ctrl.orgDepartPricedItinerary = DataService.getOrgDepartPricedItinerary();
        ctrl.orgDepartGroupItem = DataService.getOrgDepartGroupItem();

        ctrl.slickConfig = {
            enabled: true,
            //initialSlide: 1,
            slidesToShow: 4,
            slidesToScroll: 1,
            prevArrow: "<button type='button' class='slick-prev pull-left'><i class='fa fa-angle-left' aria-hidden='true'></i></button>",
            nextArrow: "<button type='button' class='slick-next pull-right'><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
            infinite: false,
            method: {},
            event: {
                init: function(event, slick) {
                    //slick.slickGoTo(0); // slide to correct index when init
                }
            }
        };

        if (!ctrl.searchOptions.selectStep) {
            ctrl.searchOptions.selectStep = 1;
        }

        // function filterAirlineFollowFosft() {
        //     if (RoleLevel == 1 && NCRange > 0) {
        //         var airSupplier = [];
        //         var classCarouse = [];
        //         var min = 0;
        //         angular.forEach(ctrl.airlineCarouselArrays, function (item) {
        //             if (item.id == "VN" || item.id == "VJ" || item.id == "0V" ) {
        //                 if(min == 0 || parseFloat(item.price) < min) {
        //                     min = parseFloat(item.price);
        //                 }                        
        //             }

        //         });
        //         angular.forEach(ctrl.airlineCarouselArrays, function (item) {
        //             if (item.id == "VN" || item.id == "VJ" || item.id == "0V" ) {
        //                 if(min == 0 || parseFloat(item.price) <= (min + min * NCRange /100 )) {
        //                     airSupplier.push(item);
        //                 }                        
        //             }

        //         });
        //         angular.forEach(ctrl.classCarouselArrays, function (item) {
        //             if (item.id == "economy" || item.id == "promo") {
        //                 classCarouse.push(item);
        //             }

        //         });
        //         ctrl.airlineCarouselArrays = airSupplier;
        //         ctrl.classCarouselArrays = classCarouse;
        //     }
        //     if (RoleLevel == 2) {
        //         var airSupplier = [];
        //         var classCarouse = [];
        //         angular.forEach(ctrl.airlineCarouselArrays, function (item) {
        //             if (item.id == "VN" || item.id == "VJ" || item.id == "0V" ) {
        //                 airSupplier.push(item);
        //             }

        //         });
        //         angular.forEach(ctrl.classCarouselArrays, function (item) {
        //             if (item.id == "economy" || item.id == "promo") {
        //                 classCarouse.push(item);
        //             }

        //         });
        //         ctrl.airlineCarouselArrays = airSupplier;
        //         ctrl.classCarouselArrays = classCarouse;
        //     }
        //     if (RoleLevel == 1 && NCRange == 0) {
        //         var airSupplier = [];
        //         angular.forEach(ctrl.airlineCarouselArrays, function (item) {
        //             if (item.id == "VN"||item.id == "0V") {
        //                 airSupplier.push(item);
        //             }

        //         });
        //         ctrl.airlineCarouselArrays = airSupplier;

        //     }
        // }

        $scope.$watch(
            function(scope) {
                return ctrl.searchOptions.advanceFilterOptions;
            },
            function(newValue, oldValue) {
                ctrl.airlineCarouselArrays = Flight.getAirlineAvailableOptions();
                // filterAirlineFollowFosft();
                angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                    //Tan fix thay đổi hành trình (GPM-275)
                    if (ctrl.searchOptions.selectAirlines && ctrl.searchOptions.selectAirlines.indexOf(item.id) != -1) {
                        item.checked = true;
                    }
                });
                $timeout(
                    ctrl.initControl(),
                    1000
                );
            }
        );

        $scope.$watch(
            function(scope) {
                return ctrl.searchResult;
            },
            function(newValue, oldValue) {

                /** tricky here: oldValue === newValue is when object is init again **/
                if (oldValue === newValue || oldValue.searchId != newValue.searchId) {
                    $timeout(function() {
                        // alert("BROADCAST");
                        $rootScope.$broadcast("gtd-refresh-airline-carousel", null);
                    }, 1000);
                }
            }
        );

        ctrl.initControl = function() {
            $log.log('3');
        };

        function checkSearchReturnDomesticCompleted(item, pricedItinerary) {

            var returnSearchResult = {};
            var returnSearchOptions = DataService.getReturnSearchOption();
            var departSearchOptions = DataService.getDepartSearchOption();



            returnSearchOptions.departureItinerary = {
                "airlineCode": item.airline,
                "fareSourceCode": pricedItinerary.airItineraryPricingInfo.fareSourceCode,
                "groupId": item.groupId,
                "searchId": departSearchOptions.searchId,
                "supplierCode": item.airSupplier
            };

            //TODO: check behaviour, if not as expected may need a new variable for this case
            //returnSearchOptions.selectStep = 2;
            returnSearchOptions.returnDomestic = true;

            ctrl.searchOptions.departureItinerary = returnSearchOptions.departureItinerary;
            ctrl.searchOptions.returnDomestic = returnSearchOptions.returnDomestic;
            Flight.searchFlightInCache(returnSearchOptions).then(function(result) {
                returnSearchResult = result;
                returnSearchOptions.searchId = result.searchId;

                Flight.getAdvanceFilterOptions(returnSearchOptions).then(function(result) {
                    DataService.setAdvanceSearchFilterOptions(result);
                    returnSearchOptions.advanceFilterOptions = result;
                    returnSearchOptions.returnSearchCompleted = true;

                    DataService.setReturnSearchResult(returnSearchResult);
                    DataService.setReturnSearchOption(returnSearchOptions);

                    ctrl.searchOptions.advanceFilterOptions = returnSearchOptions.advanceFilterOptions;
                    ctrl.searchOptions.returnSearchCompleted = returnSearchOptions.returnSearchCompleted;

                    /* do something*/
                    ctrl.moveToStep2(item, pricedItinerary);
                }, function error(res) {
                    returnSearchOptions.returnSearchCompleted = true;

                    DataService.setReturnSearchOption(returnSearchOptions);

                    // ctrl.searchOptions = returnSearchOptions;

                    DialogService.openHttpAlertDilalog(result);
                });

            });

        }

        $scope.$on('gtd-refresh-airline-carousel', function() {
            ctrl.refreshCarousel();
        });

        $scope.$on('gtd-search-domestic-return-completed', function() {
            $log.log('On event: gtd-search-domestic-return-completed');
            // if (ctrl.searchOptions.searchSpecialType == 'international' && )
        });


        ctrl.refreshCarousel = function() {
            ctrl.showCarousel = false;

            $timeout(
                function() {
                    // ctrl.searchOptions.advanceFilterOptions = v;
                    $timeout(
                        function() {
                            ctrl.showCarousel = true;

                            $timeout(function() {

                                $('.slick-slider').on('click', '.slick-slide', function(slide, index) {

                                    // $(slide.currentTarget).find('div.airline-code-hid').parent().addClass('active-airline');

                                    var airline = $(slide.currentTarget).find('div.airline-code-hid').html();
                                    $rootScope.$broadcast('gtd-select-airline', airline);
                                });

                            }, 1000);
                        },
                        100
                    );
                },
                100
            );
        };

        ctrl.moveToStep2 = function(item, pricedItinerary) {
            $rootScope.$broadcast('gtd-filter-completed-off', null);

            // move to step 2
            ctrl.currentGroupItem = item;
            ctrl.currentPricedItinerary = pricedItinerary;

            ctrl.searchOptions.searchId = DataService.getReturnSearchOption().searchId;
            ctrl.searchOptions.advanceFilterOptions = DataService.getReturnSearchOption().advanceFilterOptions;
            ctrl.searchResult = DataService.getReturnSearchResult();

            // Set cabin class to null -> Reset all filter
            if (ctrl.searchOptions.advanceFilters) {
                // ctrl.searchOptions.advanceFilters = {};
                ctrl.searchOptions.advanceFilters.stopOptions = [];
                ctrl.searchOptions.advanceFilters.airlineOptions = [];
                ctrl.searchOptions.advanceFilters.cabinClassOptions = [];
                ctrl.searchOptions.advanceFilters.ticketPolicyOptions = [];
                ctrl.searchOptions.advanceFilters.departureDateTimeOptions = [];
                ctrl.searchOptions.advanceFilters.arrivalDateTimeOptions = [];
                ctrl.searchOptions.advanceFilters.departureDateTimeReturnOptions = [];
                ctrl.searchOptions.advanceFilters.arrivalDateTimeReturnOptions = [];
            }

            // SET TO GLOBAL SERVICE
            DataService.setDepartGroupItem(item);
            DataService.setDepartPricedItinerary(pricedItinerary);

            DataService.setOrgDepartGroupItem(item);
            DataService.setOrgDepartPricedItinerary(pricedItinerary);

            ctrl.departGroupItem = item;
            ctrl.departPricedItinerary = pricedItinerary;

            ctrl.orgDepartGroupItem = item;
            ctrl.orgDepartPricedItinerary = pricedItinerary;

            ctrl.returnSearchOptions = DataService.getReturnSearchOption();


            if (ctrl.searchOptions.searchSpecialType == 'international') {
                ctrl.searchOptions.groupId = item.groupId;
                ctrl.searchOptions.minPrice = pricedItinerary.airItineraryPricingInfo.itinTotalFare.totalFare.amount;
                ctrl.searchOptions.priceItineraryId = pricedItinerary.sequenceNumber;

                // FIX for temporary display
                if (ctrl.searchResult) {
                    ctrl.searchResult.groupPricedItineraries = [];
                }

                var myDataPromise = Flight.searchGroupDetail(ctrl.searchOptions);
                myDataPromise.then(function(result) {
                    // filterByNCRanges(RoleLevel, NCRange, result);

                    var returnSearchResult = result;

                    var rsr = DataService.getReturnSearchResult();
                    rsr.groupPricedItineraries = [];
                    rsr.groupPricedItineraries.push(result.groupPricedItinerary);

                    ctrl.searchResult = rsr;

                    DataService.setReturnSearchResult(rsr);

                });
            }

            ctrl.searchOptions.selectStep = 2;

            $timeout(function() {
                $rootScope.$broadcast('gtd-refresh-adv-search-result', null);
            }, 1000);

            ctrl.refreshCarousel();
            $anchorScroll();
        };

        ctrl.bookingClicked = function(item, pricedItinerary) {
            ctrl.chieuBay = 1;
            // ctrl.filterSearchResult()
            ctrl.currentGroupItem = item;
            ctrl.currentPricedItinerary = pricedItinerary;

            if (ctrl.searchOptions.searchSpecialType == 'oneway'
                // || ctrl.searchOptions.searchSpecialType == 'international'
            ) {
                // SET TO GLOBAL SERVICE
                DataService.setDepartGroupItem(item);
                DataService.setDepartPricedItinerary(pricedItinerary);


                // confirm
                ctrl.confirmBooking();

            } else {
                if (ctrl.searchOptions.searchSpecialType == 'international-fake') {
                    // International Roundtrip
                    // SET TO GLOBAL SERVICE
                    DataService.setDepartGroupItem(item);
                    DataService.setDepartPricedItinerary(pricedItinerary);

                    DataService.setReturnGroupItem(item);
                    DataService.setReturnPricedItinerary(pricedItinerary);

                    // confirm
                    ctrl.confirmBooking();
                } else {
                    // Domestic Roundtrip
                    // alert(ctrl.searchOptions.selectStep);
                    if (ctrl.searchOptions.selectStep == 1) {
                        if (ctrl.searchOptions.searchSpecialType == 'domestic') {
                            // check for completed search
                            checkSearchReturnDomesticCompleted(item, pricedItinerary);
                        } else {
                            ctrl.moveToStep2(item, pricedItinerary);
                        }

                    } else {
                        var returnGroupItem = item;
                        var returnPricedItinerary = pricedItinerary;

                        if (ctrl.searchOptions.searchSpecialType == 'international') {
                            returnGroupItem = jQuery.extend({}, item);
                            returnPricedItinerary = jQuery.extend({}, pricedItinerary);

                            // swap
                            returnGroupItem.originLocationCode = item.destinationLocationCode;
                            returnGroupItem.originLocationName = item.destinationLocationName;
                            returnGroupItem.originCity = item.destinationCity;
                            returnGroupItem.departureDateTime = item.arrivalDateTime;

                            returnGroupItem.destinationLocationCode = item.originLocationCode;
                            returnGroupItem.destinationLocationName = item.originLocationName;
                            returnGroupItem.destinationCity = item.originCity;
                            returnGroupItem.arrivalDateTime = item.departureDateTime;

                        }

                        // SET TO GLOBAL SERVICE
                        DataService.setReturnGroupItem(returnGroupItem);
                        DataService.setReturnPricedItinerary(returnPricedItinerary);

                        if (ctrl.searchOptions.searchSpecialType == 'international') {
                            DataService.setDepartPricedItinerary(returnPricedItinerary);
                        }

                        ctrl.returnGroupItem = returnGroupItem;
                        ctrl.returnPricedItinerary = returnPricedItinerary;

                        // confimm
                        ctrl.confirmBooking();
                    }
                }


            }
        };

        var changeFlightInProgress = false;
        ctrl.changeFlight = function() {
            if (changeFlightInProgress) {
                return;
            } else {
                changeFlightInProgress = true;
                $timeout(function() {

                    $rootScope.$broadcast('gtd-filter-completed-off', null);

                    // Move back to page search depart
                    ctrl.searchOptions.selectStep = 1;
                    ctrl.searchOptions.returnDomestic = false;
                    ctrl.searchOptions.advanceFilterOptions = DataService.getDepartSearchOption().advanceFilterOptions;

                    ctrl.searchOptions.searchId = DataService.getDepartSearchOption().searchId;
                    ctrl.searchResult = DataService.getDepartSearchResult();

                    DataService.setAdvanceSearchFilterOptions(ctrl.searchOptions.advanceFilterOptions);

                    ctrl.refreshCarousel();

                    $timeout(function() {
                        ctrl.filterCompleted = false;
                        // $rootScope.$broadcast('gtd-filter-completed-off', null);
                        $rootScope.$broadcast('gtd-search-completed-on', null);

                        $timeout(function() {
                            $rootScope.$broadcast('gtd-refresh-adv-search-result', null);

                            changeFlightInProgress = false;
                        }, 100);

                    }, 1000);

                    $anchorScroll();
                }, 1000);
            }

        };

        ctrl.confirmBooking = function() {
            if (modalInstance !== null) return;

            var templateUrl = 'app/flights/search/flight.search.confirmbooking.html';
            if (ctrl.searchOptions.dtype == 'international') {
                templateUrl = 'app/flights/search/flight.search.confirmbooking.international.html';
            }

            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: templateUrl,
                controller: 'FlightSearchConfirmBookingController',
                controllerAs: 'vm',
                windowClass: "tiki-hidden-modal",
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        return $translate.refresh();
                    }],
                    searchOptions: function() {
                        return ctrl.searchOptions;
                    },
                    currentGroupItem: function() {
                        return ctrl.currentGroupItem;
                    },
                    currentPricedItinerary: function() {
                        return ctrl.currentPricedItinerary;
                    }
                }
            });


            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };

        ctrl.nextPage = function() {

            if (ctrl.busy || (ctrl.searchOptions.dtype == 'international' && ctrl.searchOptions.selectStep == 2)) {
                return;
            }

            if (PaginationUtil.isLastPage(ctrl.searchResult.page)) {
                return;
            }

            ctrl.busy = true;

            // Increase page
            ctrl.searchOptions.page++;

            var myDataPromise = Flight.searchFlightInCache(ctrl.searchOptions);
            myDataPromise.then(function(result) {

                // filterByNCRange(RoleLevel, NCRange, result);

                angular.forEach(result.groupPricedItineraries, function(item) {
                    ctrl.searchResult.groupPricedItineraries.push(item);
                });

                ctrl.searchResult.page = result.page;

                ctrl.busy = false;
            });
        };

        ctrl.setSort = function(property, direction) {
            ctrl.searchOptions.sortField = property;
            if (property == 'departureDate') {
                if (ctrl.searchOptions.departureDateDir == 'asc') {
                    ctrl.searchOptions.departureDateDir = 'desc';
                } else {
                    ctrl.searchOptions.departureDateDir = 'asc';
                }
                ctrl.searchOptions.sortDir = ctrl.searchOptions.departureDateDir;
            } else if (property == 'arrivalDate') {
                if (ctrl.searchOptions.arrivalDateDir == 'asc') {
                    ctrl.searchOptions.arrivalDateDir = 'desc';
                } else {
                    ctrl.searchOptions.arrivalDateDir = 'asc';
                }
                ctrl.searchOptions.sortDir = ctrl.searchOptions.arrivalDateDir;
            } else if (property == 'duration') {
                if (ctrl.searchOptions.durationDir == 'asc') {
                    ctrl.searchOptions.durationDir = 'desc';
                } else {
                    ctrl.searchOptions.durationDir = 'asc';
                }
                ctrl.searchOptions.sortDir = ctrl.searchOptions.durationDir;
            } else if (property == 'price') {
                if (ctrl.searchOptions.priceDir == 'asc') {
                    ctrl.searchOptions.priceDir = 'desc';
                } else {
                    ctrl.searchOptions.priceDir = 'asc';
                }
                ctrl.searchOptions.sortDir = ctrl.searchOptions.priceDir;
            }
        };
        ctrl.showSFlight = function(event) {
            $(event.target).toggleClass('clicked');
            $(event.target).parent().find('.list-search-item').slideToggle(0);
        };

        ctrl.sort = function() {

            if (ctrl.searchOptions.dtype == 'international' && ctrl.searchOptions.selectStep == 2) {
                // Reset page
                ctrl.searchOptions.page = 0;

                var myDataPromise = Flight.searchGroupDetail(ctrl.searchOptions);
                myDataPromise.then(function(result) {
                    // filterByNCRange(RoleLevel, NCRange, result);
                    var returnSearchResult = result;

                    var rsr = DataService.getReturnSearchResult();
                    rsr.groupPricedItineraries = [];
                    rsr.groupPricedItineraries.push(result.groupPricedItinerary);

                    ctrl.searchResult = rsr;

                    DataService.setReturnSearchResult(rsr);
                });

                return;
            } else {
                // Reset page
                ctrl.searchOptions.page = 0;
                var myDataPromise = Flight.searchFlightInCache(ctrl.searchOptions);
                myDataPromise.then(function(result) {

                    // filterByNCRange(RoleLevel, NCRange, result);

                    ctrl.searchResult = result;
                    ctrl.searchResult.page = result.page;
                    ctrl.searchOptions.searchId = result.searchId;

                    ctrl.busy = false;
                });
            }

        };


        function filterByNCRange(role, range, data) {
            if (data && data.page && data.page.totalElements > 0) {
                var tempTicketsData = data.groupPricedItineraries;
                var filterResult = [];
                if (role == 1 && range > 0) {
                    var min = 0;
                    if (ctrl.airlineCarouselArrays.length == 1) {
                        min = parseFloat(ctrl.airlineCarouselArrays[0].price);
                    } else {
                        angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                            if (item.id == "VJ" || item.id == "VN" || item.id == "0V") {
                                if (parseFloat(item.price) != 0 && parseFloat(item.price) < min)
                                    min = parseFloat(item.price);
                            }
                        });
                    }

                    var max = min + (min * range / 100);
                    angular.forEach(ctrl.airlineCarouselArrays, function(item, index) {
                        if (parseFloat(item.price) > max) {
                            ctrl.airlineCarouselArrays.splice(index, 1);
                        }
                    });
                    for (var i = 0; i < tempTicketsData.length; i++) {
                        var price = tempTicketsData[i].pricedItineraries[0].airItineraryPricingInfo.itinTotalFare.totalFare.amount;
                        if (price <= max) {
                            if (tempTicketsData[i].airSupplier == "VJ" || tempTicketsData[i].airSupplier == "VN" || tempTicketsData[i].airSupplier == "0V") {
                                filterResult.push(tempTicketsData[i]);
                            }
                        }
                    }
                    data.groupPricedItineraries = filterResult;
                }
                if (role == 2) {
                    for (var i = 0; i < tempTicketsData.length; i++) {
                        if (tempTicketsData[i].airSupplier == "VJ" || tempTicketsData[i].airSupplier == "VN" || tempTicketsData[i].airSupplier == "0V") {
                            filterResult.push(tempTicketsData[i]);
                        }
                    }
                    data.groupPricedItineraries = filterResult;
                }
                if (role == 1 && range == 0) {
                    for (var i = 0; i < tempTicketsData.length; i++) {
                        var airSupplier = tempTicketsData[i].airSupplier;
                        if (airSupplier == "VN" || airSupplier == "0V") {
                            filterResult.push(tempTicketsData[i]);
                        }
                    }
                    data.groupPricedItineraries = filterResult;
                }
            }
        }

        ctrl.loadMore = function($event, groupItem) {
            if (ctrl.busy) {
                return;
            }
            ctrl.busy = true;
            ctrl.searchOptions.groupId = groupItem.groupId;
            ctrl.searchOptions.loadMore = true;


            var myDataPromise = Flight.searchGroupDetail(ctrl.searchOptions);
            myDataPromise.then(function(result) {

                // reset
                ctrl.searchOptions.loadMore = false;

                angular.element($event.target).closest('.search-result-item').find('.list-search-item.multiple').addClass('showed');
                ctrl.busy = false;
            }, function(result) {
                ctrl.searchOptions.loadMore = false;
            });

        };

        ctrl.loadLess = function($event, groupItem) {
            ctrl.searchOptions.groupId = groupItem.groupId;
            groupItem.pricedItineraries = [groupItem.pricedItineraries[0]];
            angular.element($event.target).closest('.search-result-item').find('.list-search-item.multiple').removeClass('showed');
        };

        $(document).ready(function() {
            $timeout(
                ctrl.initControl(),
                1000
            );
        });

        function filterAirline(data) {
            if (RoleLevel == 1 && NCRange > 0) {
                var minPrice = 0;
                if (data && data.length > 0) {
                    minPrice = parseFloat(ctrl.airlineCarouselArrays[0].price);
                }
                var airSupplier = [];
                angular.forEach(data, function(item) {
                    if (item.id == "VN" || item.id == "VJ" || item.id == "0V") {
                        if (minPrice == 0 || item.price <= (minPrice + minPrice * NCRange / 100)) {
                            airSupplier.push(item)
                        }
                    }
                });
                return airSupplier;
                // ctrl.airlineCarouselArrays = airSupplier;
            }
            if (RoleLevel == 2) {
                var airSupplier = [];
                angular.forEach(data, function(item) {
                    if (item.id == "VN" || item.id == "VJ" || item.id == "0V") {
                        airSupplier.push(item);
                    }

                });
                return airSupplier;
                // ctrl.airlineCarouselArrays = airSupplier;
            }
            if (RoleLevel == 1 && NCRange == 0) {
                var airSupplier = [];
                angular.forEach(data, function(item) {
                    if (item.id == "VN" || item.id == "0V") {
                        airSupplier.push(item);
                    }

                });
                return airSupplier;
                // ctrl.airlineCarouselArrays = airSupplier;

            }
            return data;
        }

        function filterFlight(data) {
            var filterResult = [];
            if (data && data.length > 0) {
                var tempTicketsData = data;
                if (RoleLevel == 1 && NCRange > 0) {
                    var min = 0;
                    if (ctrl.airlineCarouselArrays.length > 0) {
                        min = parseFloat(ctrl.airlineCarouselArrays[0].price);
                    }
                    angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                        if (item.id == "VJ" || item.id == "VN" || item.id == "0V") {
                            if (min == 0 || (parseFloat(item.price) != 0 && parseFloat(item.price) < min))
                                min = parseFloat(item.price);
                        }
                    });

                    var max = min + (min * NCRange / 100);
                    for (var i = 0; i < tempTicketsData.length; i++) {
                        var price = tempTicketsData[i].pricedItineraries[0].airItineraryPricingInfo.itinTotalFare.totalFare.amount;
                        if (price <= max) {
                            if (tempTicketsData[i].airSupplier == "VJ" || tempTicketsData[i].airSupplier == "VN" || tempTicketsData[i].airSupplier == "0V") {
                                filterResult.push(tempTicketsData[i]);
                            }
                        }
                    }

                    return filterResult;
                    // data.groupPricedItineraries = filterResult;
                }
                if (RoleLevel == 2) {
                    for (var i = 0; i < tempTicketsData.length; i++) {
                        if (tempTicketsData[i].airSupplier == "VJ" || tempTicketsData[i].airSupplier == "VN" || tempTicketsData[i].airSupplier == "0V") {
                            filterResult.push(tempTicketsData[i]);
                        }
                    }
                    return filterResult;
                    // data.groupPricedItineraries = filterResult;
                }
                if (RoleLevel == 1 && NCRange == 0) {
                    for (var i = 0; i < tempTicketsData.length; i++) {
                        var airSupplier = tempTicketsData[i].airSupplier;
                        if (airSupplier == "VN" || airSupplier == "0V") {
                            filterResult.push(tempTicketsData[i]);
                        }
                    }
                    return filterResult;
                    // data.groupPricedItineraries = filterResult;
                }
            }
            return filterResult;
        }

        function filterpricedItineraries(data) {
            return data;
        }

    }

    var gtdFsoftFlightSearchResult = {
        templateUrl: 'app/components/flight/fsoft-flight-search-result.html',
        controller: gtdFsoftFlightSearchResultController,
        bindings: {
            searchResult: '=',
            searchOptions: '=',
            filterCompleted: '=',
            searchCompleted: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFsoftFlightSearchResult', gtdFsoftFlightSearchResult);

})();