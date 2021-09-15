(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdAirportSelect', gtdAirportSelect);

    gtdAirportSelect.$inject = ['$log', '$timeout', '$parse', 'META_SEARCH_AIRPORT_URL', 'GlobalSrv', 'MetaData', 'API_URL'];

    function gtdAirportSelect($log, $timeout, $parse, META_SEARCH_AIRPORT_URL, GlobalSrv, MetaData, API_URL) {

        var refreshDataSource = function(scope, id, type, airlineDataSource, value) {
            $log.log('refresh source - refactor');

            var newOpts = airlineDataSource.slice(0);

            $log.log(newOpts);

            // nam.huynhphuong - fix ISSUE IBE2-502
            /*
            for (var i = newOpts.length - 1; i >= 0; i--) {
                if (newOpts[i].code == scope.ngModel) {
                    newOpts.splice(i, 1);
                }
            }
            */
            // end fix

            var data = $("#" + id).val();
            if ($('#' + id).data('select2')) {
                $('#' + id).select2('destroy').empty().select2({
                    language: 'vi',
                    data: newOpts,
                    // containerCssClass: 'home-select2',
                    dropdownCssClass: 'select2-search-width'

                        // trim
                        ,
                    matcher: function(params, data) {
                        // If there are no search terms, return all of the data
                        if (jQuery.trim(params.term) === '') {
                            return data;
                        }
                        var myTerm = jQuery.trim(params.term);
                        // `params.term` should be the term that is used for searching
                        // `data.text` is the text that is displayed for the data object
                        if (data.text.toLowerCase().indexOf(myTerm.toLowerCase()) > -1) {
                            // You can return modified objects from here
                            // This includes matching the `children` how you want in nested data sets
                            return data;
                        }

                        // Return `null` if the term should not be displayed
                        return null;
                    }

                });
            }

            var found = false;
            for (var i = newOpts.length - 1; i >= 0; i--) {
                if (newOpts[i].code == data) {
                    found = true;
                }
            }
            if (found) {
                $("#" + id).val(data).trigger('change.select2');
            } else {
                $("#" + id).val(null).trigger('change.select2');
            }

            scope.$apply();
        };

        // function gtdAirportSelect() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                gtdData: '=',
                gtdValue: '=',
                ngModel: '=',
                gtdMode: '=',

                gtdSearchOptions: '=',
                gtdDirection: '='
            },
            link: function(scope, element, attr, ngModel) {
                $log.log("ngmodel=" + scope.ngModel + ":" + ":" + scope[attr.ngModel] + ":" + ngModel.$viewValue);

                // alert(scope.gtdMode);
                if (scope.gtdMode == 'domestic') {
                    MetaData.searchAirportsLocal('VN').then(function(result) {
                        $log.log("MetaData.searchAirportsLocal from flight.service");


                        GlobalSrv.setVnAirports(result);

                        var airlineDataSource = result;

                        if (airlineDataSource) {
                            for (var i = 0; i < airlineDataSource.length; i++) {
                                airlineDataSource[i].id = airlineDataSource[i].code;
                                airlineDataSource[i].text = airlineDataSource[i].city + ' (' + airlineDataSource[i].code + ')';
                            }
                        }

                        $(element).select2({
                            language: 'vi',
                            data: airlineDataSource,
                            // containerCssClass: 'select2-search-width',
                            dropdownCssClass: 'select2-search-width'
                        }).on('change', function() {
                            $log.log(scope.gtdDirection);
                            // $log.log(airlineDataSource);

                            if (scope.gtdDirection == 'FROM') {
                                refreshDataSource(scope, 'toAirPort', 'FROM', airlineDataSource, scope.ngModel);
                            } else if (scope.gtdDirection == 'TO') {
                                refreshDataSource(scope, 'fromAirPort', 'TO', airlineDataSource, scope.ngModel);
                            }
                        });
                        // $log.log(airlineDataSource);
                    });
                    // $(element).select2({
                    //     data: scope.gtdData,
                    //     dropdownCssClass: 'select2-search-width'
                    // });
                } else {
                    $(element).select2({
                        language: 'vi',
                        minimumInputLength: 1

                            ,
                        templateResult: function(item) {
                            if (!item.id) return item.text;
                            return item.city + ' (' + item.code + ' - ' + item.name + '), ' + item.country;
                        },
                        ajax: {
                            url: API_URL + META_SEARCH_AIRPORT_URL,
                            minimumInputLength: 1,
                            dataType: 'json',
                            delay: 250,
                            data: function(params) {
                                return {
                                    "query": params.term
                                };
                            },

                            processResults: function(data, params) {
                                // parse the results into the format expected by Select2
                                // since we are using custom formatting functions we do not need to
                                // alter the remote JSON data, except to indicate that infinite
                                // scrolling can be used
                                // angular.forEach(data, function(item) {
                                //     item.id = item.code;
                                //     item.text = item.city + " (" + item.code + ")";
                                // });
                                //
                                // GlobalSrv.addLocalAirports(data);
                                // $log.log("data=" + JSON.stringify(data));

                                var tmp = data;

                                var result = [];

                                var excluded = '';
                                if ('FROM' == scope.gtdDirection) {
                                    excluded = scope.gtdSearchOptions.toAirPort;
                                } else if ('TO' == scope.gtdDirection) {
                                    excluded = scope.gtdSearchOptions.fromAirPort;
                                }

                                var isVNAirport = false;
                                var vnAirports = GlobalSrv.getVnAirports();
                                angular.forEach(vnAirports, function(airport) {
                                    if (excluded) {
                                        // $log.log(airport.code.toLowerCase() + ":" + excluded.toLowerCase() + ":" + airport.countryCode);
                                        if (airport.code.toLowerCase() == excluded.toLowerCase() && airport.countryCode == 'VN') {
                                            isVNAirport = true;
                                        }
                                    }
                                });


                                angular.forEach(tmp, function(item) {
                                    if (scope.gtdSearchOptions.dtype == 'domestic') {
                                        if (item.code != excluded) {
                                            result.push(item);
                                        }
                                    } else {
                                        if (isVNAirport) {
                                            if (item.code != excluded && item.countryCode != 'VN') {
                                                result.push(item);
                                            }
                                        } else {
                                            if (item.code != excluded) {
                                                result.push(item);
                                            }
                                        }
                                    }

                                });

                                angular.forEach(result, function(item) {
                                    item.id = item.code;
                                    // item.text = item.city + ' (' + item.code + ' - ' + item.name + '), ' + item.country;
                                    item.text = item.city + ' (' + item.code + ')';
                                });

                                GlobalSrv.addLocalAirports(result);

                                return {
                                    results: result
                                };
                            },
                            cache: true
                        },

                        //data: scope.gtdData,
                        dropdownCssClass: 'select2-search-width'

                            // trim
                            ,
                        matcher: function(params, data) {
                            // If there are no search terms, return all of the data
                            if (jQuery.trim(params.term) === '') {
                                return data;
                            }
                            var myTerm = jQuery.trim(params.term);
                            // `params.term` should be the term that is used for searching
                            // `data.text` is the text that is displayed for the data object
                            if (data.text.toLowerCase().indexOf(myTerm.toLowerCase()) > -1) {
                                // You can return modified objects from here
                                // This includes matching the `children` how you want in nested data sets
                                return data;
                            }

                            // Return `null` if the term should not be displayed
                            return '';
                        }
                    });
                }



                $timeout(function() {
                    var airports = GlobalSrv.getLocalAirports();
                    var text = "";
                    for (var idx in airports) {
                        if (airports[idx].code == scope.ngModel) {
                            // text = airports[idx].city + ' (' + airports[idx].code + ' - ' + airports[idx].name + '), ' + airports[idx].country;
                            text = airports[idx].city + ' (' + airports[idx].code + ')';
                        }
                    }


                    var $option = $('<option selected>' + text + '</option>').val(scope.ngModel);
                    $(element).append($option).trigger('change'); // append the option and update Select2
                });

                // scope.$watch('ngModel', function (newValue, oldValue) {
                //
                //     if ($(element).val() != newValue) {
                //
                //         $timeout(function () {
                //             $log.log("Select 2 Change value:  " + newValue);
                //             $(element).select2("data", {"id":  newValue, "text": newValue});
                //             $(element).select2('val', newValue);
                //             $(element).val(newValue).trigger('change');
                //         }, 0, false);
                //     }
                //
                // });


                // Fix to set existing value
                // alert(scope.gtdValue);
                // if (scope.gtdValue != '' && scope.gtdValue != null) {
                //     $(element).val(scope.gtdValue).trigger('change');
                // }

            }
        };
    }
})();