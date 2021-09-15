(function() {
    'use strict';

    gtdFlightSearchAdvController.$inject = ['$localStorage', '$location', '$cookies', '$log', '$scope', '$timeout', '$rootScope', 'MetaData', 'Flight', 'DataService', 'IBE_KEYS', 'ValidationUtils', 'ThemeCfg', 'TEMPLATE_URL'];

    function gtdFlightSearchAdvController($localStorage, $location, $cookies, $log, $scope, $timeout, $rootScope, MetaData, Flight, DataService, IBE_KEYS, ValidationUtils, ThemeCfg, TEMPLATE_URL) {
        var ctrl = this;
        $scope.ibeKeys = IBE_KEYS;
        var merchantCode = $location.search().merchant_code;
        if (!merchantCode) merchantCode = $cookies.get('merchant_code') || localStorage.getItem("merchant_code");

        ctrl.loadMore = false;
        ctrl.showAdv = true;

        ctrl.isMobile = ValidationUtils.isMobileDevice();
        ctrl.class_single_web = '';
        var merchant_code = $cookies.get("merchant_code") || localStorage.getItem("merchant_code");
        if (merchant_code) {
            ctrl.class_single_web += merchant_code;
            if (!ThemeCfg[merchant_code])
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

                if (ctrl.searchResult.groupPricedItineraries[0].airSupplier == 'MF') {
                    ctrl.classCarouselArrays = Flight.getClassInterAvailableOptions();
                } else {
                    ctrl.classCarouselArrays = Flight.getClassAvailableOptions();
                }
                ctrl.airlineCarouselArrays = Flight.getAirlineAvailableOptions();
                if (merchantCode && merchantCode == 'FSOFT') {
                    filterAirlineFollowFosft();
                }

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

        function filterAirlineFollowFosft() {
            var RoleLevel = ctrl.searchOptions.RoleLevel;
            var NCRange = ctrl.searchOptions.NCRange;
            if (RoleLevel == 1 && NCRange > 0) {
                var airSupplier = [];
                var classCarouse = [];
                angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                    if (item.id == "VN" || item.id == "VJ" || item.id == "0V") {
                        airSupplier.push(item);
                    }

                });
                angular.forEach(ctrl.classCarouselArrays, function(item) {
                    if (item.id == "economy" || item.id == "promo") {
                        classCarouse.push(item);
                    }

                });
                ctrl.airlineCarouselArrays = airSupplier;
                ctrl.classCarouselArrays = classCarouse;
            }
            if (RoleLevel == 2) {
                var airSupplier = [];
                var classCarouse = [];
                angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                    if (item.id == "VN" || item.id == "VJ" || item.id == "0V") {
                        airSupplier.push(item);
                    }

                });
                angular.forEach(ctrl.classCarouselArrays, function(item) {
                    if (item.id == "economy" || item.id == "promo") {
                        classCarouse.push(item);
                    }

                });
                ctrl.airlineCarouselArrays = airSupplier;
                ctrl.classCarouselArrays = classCarouse;
            }
            if (RoleLevel == 1 && NCRange == 0) {
                var airSupplier = [];
                angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                    if (item.id == "VN" || item.id == "0V") {
                        airSupplier.push(item);
                    }

                });
                ctrl.airlineCarouselArrays = airSupplier;

            }
        }

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
                return ctrl.searchOptions.advanceFilterOptions;
            },
            function(newValue, oldValue) {
                ctrl.transitCarouselArrays = Flight.getTransitAvailableOptions();
                ctrl.airlineCarouselArrays = Flight.getAirlineAvailableOptions();
                if (ctrl.needSetupClass) {
                    ctrl.needSetupClass = false;
                } else {
                    GetClass(ctrl.searchResult.groupPricedItineraries);
                }
                if (merchantCode && merchantCode == 'FSOFT') {
                    filterAirlineFollowFosft();
                }
                angular.forEach(ctrl.airlineCarouselArrays, function(item) {
                    if (ctrl.searchOptions.selectAirlines && ctrl.searchOptions.selectAirlines.indexOf(item.id) != -1) {
                        item.checked = true;
                    }
                    // else{
                    //     item.checked = false;
                    //     ctrl.doSearchImpl();
                    // }
                });


                ctrl.fromTimeCarouselArrays = Flight.getTimeAvailableOptions();
                ctrl.toTimeCarouselArrays = Flight.getTimeAvailableOptions();

                ctrl.fromTimeReturnCarouselArrays = Flight.getTimeAvailableOptions();
                ctrl.toTimeReturnCarouselArrays = Flight.getTimeAvailableOptions();

                ctrl.policyArrays = Flight.getTicketPolicyOptions();
                $log.log("ctrl.fromTimeCarouselArrays");
                $log.log(ctrl.fromTimeCarouselArrays);

                ctrl.setupAdvFilter();
            }
        );

        $scope.$on('gtd-select-airline', function(event, data) {

            ctrl.airlineCarouselArrays = Flight.getAirlineAvailableOptions();
            if (merchantCode && merchantCode == 'FSOFT') {
                filterAirlineFollowFosft();
            }
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
                            if (item.id == "VJ") {
                                min = parseFloat(item.price);
                            }
                        });
                    }
                    var max = min + (min * range) / 100;
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
                    if (tempTicketsData[i].airSupplier == "VJ" || tempTicketsData[i].airSupplier == "VN" || tempTicketsData[i].airSupplier == "0V") {
                        filterResult.push(tempTicketsData[i]);
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
                    if (merchantCode && merchantCode == 'FSOFT') {
                        var RoleLevel = ctrl.searchOptions.RoleLevel;
                        var NCRange = ctrl.searchOptions.NCRange;
                        filterByNCRange(RoleLevel, NCRange, result);
                    }


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

                    if (merchantCode && merchantCode == 'FSOFT') {
                        var RoleLevel = ctrl.searchOptions.RoleLevel;
                        var NCRange = ctrl.searchOptions.NCRange;
                        filterByNCRange(RoleLevel, NCRange, result);
                    }

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
    }

    function templateNameByParams(merchant_code, TEMPLATE_URL, type) {
        console.log("TEMPLATE_URL");
        console.log(TEMPLATE_URL[merchant_code]);
        if (!TEMPLATE_URL[merchant_code] || !TEMPLATE_URL[merchant_code][type])
            return TEMPLATE_URL['DEFAULT'][type];
        return TEMPLATE_URL[merchant_code][type];
    }

    var gtdFlightSearchAdv = {
        templateUrl: ['TEMPLATE_URL', function(TEMPLATE_URL) {
            var merchant_code = String(Cookies.get('merchant_code') || localStorage.getItem("merchant_code")).toUpperCase();
            return templateNameByParams(merchant_code, TEMPLATE_URL, 'flight_search_adv');
        }],
        //  'app/components/flight/flight-search-adv.html',
        controller: gtdFlightSearchAdvController,
        bindings: {
            searchResult: '=',
            searchOptions: '=',
            filterCompleted: '=',
            searchCompleted: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdFlightSearchAdv', gtdFlightSearchAdv);

})();