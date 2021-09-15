(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdSelect2', gtdSelect2);

    gtdSelect2.$inject = ['$log', '$timeout', '$parse', 'META_SEARCH_AIRPORT_URL', 'GlobalSrv', 'MetaData'];

    function gtdSelect2($log, $timeout, $parse, META_SEARCH_AIRPORT_URL, GlobalSrv, MetaData) {

        var refreshDataSource = function(scope, id, type, airlineDataSource, value) {

            try {
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

                // Check null for IE
                // https://bitbucket.org/kkvsoft/gtd-b2c-gateway/issues/452/tr-n-ie-l-i-kh-ng-t-i-c-s-l-ng-tr-em-s
                if ($('#' + id).data('select2')) {
                    $('#' + id).select2('destroy').empty().select2({
                        data: newOpts,
                        containerCssClass: 'home-select2'

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
            } catch (e) {
                $log.log('Handle expected exception');
                $log.log(e);
            }
            // }

        };

        // function gtdSelect2() {
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

                        var airlineDataSource = result;

                        if (airlineDataSource) {
                            for (var i = 0; i < airlineDataSource.length; i++) {
                                airlineDataSource[i].id = airlineDataSource[i].code;
                                airlineDataSource[i].text = airlineDataSource[i].city + " (" + airlineDataSource[i].code + ")";
                            }
                        }

                        $(element).select2({
                            data: airlineDataSource,
                            containerCssClass: 'home-select2',
                            placeholder: function() {
                                    $(this).data('placeholder');
                                }

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


                            //dropdownCssClass: 'select2-search-width'
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

                }

                $timeout(function() {
                    var airports = GlobalSrv.getLocalAirports();
                    var text = "";
                    for (var idx in airports) {
                        if (airports[idx].code == scope.ngModel) {
                            text = airports[idx].city + ' (' + airports[idx].code + ')';
                        }
                    }


                    var $option = $('<option selected>' + text + '</option>').val(scope.ngModel);
                    $(element).append($option).trigger('change'); // append the option and update Select2
                });



            }
        };
    }
})();