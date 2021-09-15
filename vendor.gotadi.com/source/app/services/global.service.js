(function() {
    'use strict';
    angular
        .module('B2B2CGatewayApp')
        .factory('GlobalSrv', GlobalSrv);

    GlobalSrv.$inject = ['$resource', '$localStorage', '$sessionStorage'];

    function GlobalSrv($resource, $localStorage, $sessionStorage) {

        return {
            // Local Airporst
            getLocalAirports: function() {
                var model = $localStorage.localAirports;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            addLocalAirports: function(values) {
                    var v = this.getLocalAirports();

                    for (var i in values) {
                        // if (v.indexOf(values[i]) == -1) {
                        //     console.log(values[i]);
                        //     v.push(values[i]);
                        // }

                        if (v.filter(function(e) {
                                return e.id == values[i].id && e.code == values[i].code;
                            }).length <= 0) {
                            /* vendors contains the element we're looking for */
                            // console.log(values[i]);
                            v.push(values[i]);
                        }
                    }

                    $localStorage.localAirports = v;

                }

                // VN Airports
                ,
            getVnAirports: function() {
                var model = $localStorage.vnAirports;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            setVnAirports: function(value) {
                    $localStorage.vnAirports = value;
                }

                // lookups
                ,
            getAllLookups: function() {
                var model = $localStorage.allLookups;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            setAllLookups: function(value) {
                    $localStorage.allLookups = value;
                }

                // countries
                ,
            getAllCountries: function() {
                var model = $localStorage.allCountries;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            setAllCountries: function(value) {
                    $localStorage.allCountries = value;
                }

                // destinations
                ,
            getLocalDestinations: function() {
                var model = $localStorage.localDestinations;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            addLocalDestinations: function(values) {
                    // var v = this.getLocalDestinations();

                    // for (var i in values) {
                    //     if (v.indexOf(values[i]) == -1) {
                    //         v.push(values[i]);
                    //     }
                    // }

                    $localStorage.localDestinations = values;
                }

                ,
            addRecentViewHotels: function(value) {
                if (!$localStorage.recentHotels) {
                    $localStorage.recentHotels = [];
                }

                var index = $localStorage.recentHotels.indexOf(value);

                if (index > -1) {
                    $localStorage.recentHotels.splice(index, 1);
                }

                $localStorage.recentHotels.push(value);

                if ($localStorage.recentHotels.length > 5) {
                    $localStorage.recentHotels = $localStorage.recentHotels.splice(0, $localStorage.recentHotels.length - 5);
                }

            },
            getRecentViewHotels: function() {
                var hotels = $localStorage.recentHotels ? $localStorage.recentHotels : [];
                if (hotels.length > 3) {
                    return hotels.slice(-3).reverse();
                } else {
                    return hotels.reverse();
                }
            }
        };
    }
})();