(function() {
    'use strict';

    gtdFsoftFlightSearchAdvController.$inject = ['$localStorage', '$location', '$cookies', '$log', '$scope', '$timeout', '$rootScope', 'MetaData', 'Flight', 'DataService', 'IBE_KEYS', 'ValidationUtils', 'ThemeCfg', 'TEMPLATE_URL', 'MerchantService'];

    function gtdFsoftFlightSearchAdvController($localStorage, $location, $cookies, $log, $scope, $timeout, $rootScope, MetaData, Flight, DataService, IBE_KEYS, ValidationUtils, ThemeCfg, TEMPLATE_URL, MerchantService) {
        var ctrl = this;
        ctrl.chieuBay = 0;
        $scope.ibeKeys = IBE_KEYS;
        var merchantCode = MerchantService.getMerchant();
        var RoleLevel = +ctrl.searchOptions.RoleLevel;
        var NCRange = +ctrl.searchOptions.NCRange;
        ctrl.filterClass = filterClass;
        ctrl.filterAirline = filterAirline;

        ctrl.loadMore = false;
        ctrl.showAdv = true;

        ctrl.isMobile = ValidationUtils.isMobileDevice();
        ctrl.class_single_web = '';
        if (merchantCode) {
            ctrl.class_single_web += merchantCode;
            if (!ThemeCfg[merchantCode])
                ctrl.enable_template = true;
            else
                ctrl.enable_template = false;

        }


        ctrl.init = function() {
            if (ctrl.searchOptions.class == 'E' || ctrl.searchOptions.class == 'B') {
                if (ctrl.searchOptions.class == 'E')
                    ctrl.searchOptions.className = 'economy';

                if (ctrl.searchOptions.class == 'B')
                    ctrl.searchOptions.className = 'business';

                GetClass(ctrl.searchResult.groupPricedItineraries)

                if (!ctrl.airlineCarouselArrays)
                    ctrl.airlineCarouselArrays = Flight.getAirlineAvailableOptions();

                // filterAirlineFollowFosft();

                angular.forEach(ctrl.classCarouselArrays, function(item) {
                    if (item.id == ctrl.searchOptions.className) {
                        item.checked = true;
                    }
                    item.checked = true;
                });


                // Set Sort conditions
                ctrl.searchOptions.sortField = 'price';
                ctrl.searchOptions.sortDir = 'asc';


                ctrl.doFilter();

                ctrl.needSetupClass = true;
            }
        };


        $scope.$on('gtd-refresh-adv-search-result', function() {
            ctrl.resetFilter();
        });

        //Tan improve 19/02/2019
        function GetClass(items) {
            angular.forEach(items, function(item) {
                if (item.airSupplier == 'MF') {
                    ctrl.classCarouselArrays = Flight.getClassInterAvailableOptions();
                    return true;
                } else {
                    ctrl.classCarouselArrays = Flight.getClassAvailableOptions();
                }
            });
        }

        $scope.$watch(function(scope) {
                return ctrl.searchOptions.selectStep;
            },
            function(newValue, oldValue) {
                if (ctrl.searchOptions.selectStep == 2) {
                    angular.forEach(ctrl.classCarouselArrays, function(item) {
                        item.checked = false;
                    });
                } else {
                    angular.forEach(ctrl.classCarouselArrays, function(item) {
                        if (item.id == ctrl.searchOptions.className) {
                            item.checked = true;
                        }
                    });
                }
            }
        );
        // function filterAirlineFollowFosft() {
        //     var RoleLevel = +ctrl.searchOptions.RoleLevel;
        //     var NCRange = +ctrl.searchOptions.NCRange;
        //     if (RoleLevel == 1 && NCRange > 0) {
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

        $scope.$watch(function(scope) {
                return ctrl.searchOptions.advanceFilterOptions;
            },
            function(newValue, oldValue) {
                ctrl.transitCarouselArrays = Flight.getTransitAvailableOptions();

                ctrl.airlineCarouselArrays = Flight.getAirlineAvailableOptions();

                // filterAirlineFollowFosft();

                angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                    if (ctrl.searchOptions.selectAirlines && ctrl.searchOptions.selectAirlines.indexOf(item.id) != -1) {
                        item.checked = true;
                    }
                });


                ctrl.fromTimeCarouselArrays = Flight.getTimeAvailableOptions();
                ctrl.toTimeCarouselArrays = Flight.getTimeAvailableOptions();

                ctrl.fromTimeReturnCarouselArrays = Flight.getTimeAvailableOptions();
                ctrl.toTimeReturnCarouselArrays = Flight.getTimeAvailableOptions();

                ctrl.policyArrays = Flight.getTicketPolicyOptions();

                ctrl.setupAdvFilter();
            }
        );

        $scope.$on('gtd-select-airline', function(event, data) {
            ctrl.airlineCarouselArrays = Flight.getAirlineAvailableOptions();
            // filterAirlineFollowFosft();

            angular.forEach(ctrl.airlineCarouselArrays, function(item) {

                if (item.id == data.trim()) {
                    item.checked = true;
                }
            });

            // Set Sort conditions
            ctrl.searchOptions.sortField = 'departureDate';
            ctrl.searchOptions.sortDir = 'asc';

            ctrl.doFilter();
        });

        ctrl.resetFilter = function() {
            angular.forEach(ctrl.transitCarouselArrays, function(item) {
                item.checked = false;
            });
            angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                item.checked = false;
            });
            angular.forEach(ctrl.classCarouselArrays, function(item) {
                item.checked = false;
            });
            angular.forEach(ctrl.fromTimeCarouselArrays, function(item) {
                item.checked = false;
            });
            angular.forEach(ctrl.toTimeCarouselArrays, function(item) {
                item.checked = false;
            });
            angular.forEach(ctrl.fromTimeReturnCarouselArrays, function(item) {
                item.checked = false;
            });
            angular.forEach(ctrl.toTimeReturnCarouselArrays, function(item) {
                item.checked = false;
            });
            angular.forEach(ctrl.policyArrays, function(item) {
                item.checked = false;
            });

            ctrl.doFilter();
        };

        ctrl.setupAdvFilter = function() {
            var transitOpts = [];
            var airlineOpts = [];
            var classOpts = [];
            var fromTimeOpts = [];
            var toTimeOpts = [];

            var fromTimeReturnOpts = [];
            var toTimeReturnOpts = [];

            var policyOpts = [];

            angular.forEach(ctrl.transitCarouselArrays, function(item) {
                if (item.checked == true) {
                    transitOpts.push(item.id);
                }
            });

            angular.forEach(ctrl.fromTimeCarouselArrays, function(item) {
                if (item.checked == true) {
                    fromTimeOpts.push(item.val);
                }
            });

            angular.forEach(ctrl.toTimeCarouselArrays, function(item) {
                if (item.checked == true) {
                    toTimeOpts.push(item.val);
                }
            });

            angular.forEach(ctrl.fromTimeReturnCarouselArrays, function(item) {
                if (item.checked == true) {
                    fromTimeReturnOpts.push(item.val);
                }
            });

            angular.forEach(ctrl.toTimeReturnCarouselArrays, function(item) {
                if (item.checked == true) {
                    toTimeReturnOpts.push(item.val);
                }
            });

            angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                if (item.checked == true) {
                    airlineOpts.push(item.id);
                }
            });

            angular.forEach(ctrl.classCarouselArrays, function(item) {
                if (item.checked == true) {
                    classOpts.push(item.id);
                }
            });

            angular.forEach(ctrl.policyArrays, function(item) {
                if (item.checked == true) {
                    policyOpts.push(item.id);
                }
            });

            ctrl.searchOptions.advanceFilters = {
                "stopOptions": transitOpts,
                "airlineOptions": airlineOpts,
                "cabinClassOptions": classOpts,
                "ticketPolicyOptions": policyOpts,
                "departureDateTimeOptions": fromTimeOpts,
                "arrivalDateTimeOptions": toTimeOpts,
                "departureDateTimeReturnOptions": fromTimeReturnOpts,
                "arrivalDateTimeReturnOptions": toTimeReturnOpts,
                "flightType": ctrl.searchOptions.dtype
            };
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
                            if (item.id == "VN" || item.id == "VJ" || item.id == "0V") {
                                if (min == 0 || parseFloat(item.price) < min) {
                                    min = parseFloat(item.price);
                                }
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
                        if (airSupplier == "VN") {
                            filterResult.push(tempTicketsData[i]);
                        }
                    }
                    data.groupPricedItineraries = filterResult;
                }

            }
        }

        ctrl.doFilter = function() {
            $('.formFilter').removeClass('show');
            $('.sm-form-filter').hide();
            ctrl.filterCompleted = false;
            $rootScope.$broadcast('gtd-filter-completed-off', null);

            $rootScope.$broadcast('gtd-adv-do-filter', null);

            if (!ctrl.searchCompleted) {
                return;
            }

            ctrl.setupAdvFilter();


            if (ctrl.searchOptions.dtype == 'international' && ctrl.searchOptions.selectStep == 2) {
                // Reset page
                ctrl.searchOptions.page = 0;


                var myDataPromise = Flight.searchGroupDetail(ctrl.searchOptions);
                myDataPromise.then(function(result) {
                    var returnSearchResult = result;

                    var rsr = DataService.getReturnSearchResult();
                    // TODO implement for FSoft
                    rsr.groupPricedItineraries = [];

                    // check NCRangeFsoft
                    // filterByNCRange1(RoleLevel, NCRange, result);

                    rsr.groupPricedItineraries.push(result.groupPricedItinerary);
                    rsr.page = result.page;

                    ctrl.searchResult = rsr;

                    DataService.setReturnSearchResult(rsr);

                    $timeout(function() {
                        ctrl.filterCompleted = true;
                        $rootScope.$broadcast('gtd-filter-completed-on', null);
                        // alert("BROADCAST");
                        // $rootScope.$broadcast("gtd-refresh-airline-carousel", null);
                    }, 1000);
                });

                return;
            } else {
                // Reset page
                ctrl.searchOptions.page = 0;
                var myDataPromise = Flight.searchFlightInCache(ctrl.searchOptions);
                myDataPromise.then(function(result) {
                    // TODO implement for FSoft

                    // filterByNCRange1(RoleLevel, NCRange, result);

                    ctrl.searchResult = result;
                    ctrl.searchResult.page = result.page;

                    if (result.searchId) {
                        ctrl.searchOptions.searchId = result.searchId;
                    }

                    ctrl.busy = false;

                    $timeout(function() {
                        ctrl.filterCompleted = true;
                        $rootScope.$broadcast('gtd-filter-completed-on', null);
                    }, 1000);
                });
            }

        };

        ctrl.init();

        function filterClass(data) {
            if (RoleLevel == 1 && NCRange > 0) {
                var classCarouse = [];

                angular.forEach(data, function(item) {
                    if (item.id == "economy" || item.id == "promo") {
                        classCarouse.push(item);
                    }

                });
                return classCarouse;
                // ctrl.classCarouselArrays = classCarouse;
            }
            if (RoleLevel == 2) {
                var classCarouse = [];
                angular.forEach(data, function(item) {
                    if (item.id == "economy" || item.id == "promo") {
                        classCarouse.push(item);
                    }

                });
                return classCarouse;
                // ctrl.classCarouselArrays = classCarouse;
            }
            if (RoleLevel == 1 && NCRange == 0) {
                return ctrl.classCarouselArrays;
            }
            return ctrl.classCarouselArrays;
        }

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
    }

    var gtdFsoftFlightSearchAdv = {
        templateUrl: 'app/components/flight/fsoft-flight-search-adv.html',
        controller: gtdFsoftFlightSearchAdvController,
        bindings: {
            searchResult: '=',
            searchOptions: '=',
            filterCompleted: '=',
            searchCompleted: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFsoftFlightSearchAdv', gtdFsoftFlightSearchAdv);
})();