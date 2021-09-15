(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdFareRulesPopover', gtdFareRulesPopover);

    gtdFareRulesPopover.$inject = ['$log', '$timeout', '$compile', '$templateCache', '$q', '$http', 'Flight'];

    function gtdFareRulesPopover($log, $timeout, $compile, $templateCache, $q, $http, Flight) {

        var getTemplate = function(templatePath) {
            var def = $q.defer();

            var template = '';

            template = $templateCache.get(templatePath);
            if (typeof template === "undefined") {
                $http.get(templatePath)
                    .success(function(data) {
                        $templateCache.put(templatePath, data);
                        def.resolve(data);
                    });
            } else {
                def.resolve(template);
            }

            return def.promise;
        };

        return {
            restrict: "A",
            scope: {
                argument: '=?',
                argument2: '=?',
                argument3: '=?',
                argument4: '@?',
                ibeKeys: '=?'
            },
            link: function(scope, element, attrs) {

                scope.init = false;

                $(element).bind('click', function() {

                    if (!scope.init) {

                        scope.init = true;

                        var myDataPromise = Flight.getFareRules(scope.argument, scope.argument2, scope.argument3);
                        myDataPromise.then(function(result) {

                            // $log.log("Get result from loadFareRules");
                            // $log.log(result);
                            scope.argument4 = "";
                            angular.forEach(result.fareRules, function(fareRule) {
                                angular.forEach(fareRule.fareRuleItems, function(fareRuleItem) {
                                    scope.argument4 += ('<strong>' + fareRuleItem.title + '</strong>');
                                    scope.argument4 += ('<p>' + fareRuleItem.detail + '</p>');
                                });
                            });

                            if (scope.argument4 == '') {
                                scope.argument4 = '<b>Điều kiện vé đang được cập nhật</b>';
                            }

                            // getTemplate(attrs.gtdTemplatePath).then(function(popOverContent) {
                            var options = {
                                content: scope.argument4,
                                placement: "bottom",
                                html: true,
                                trigger: "focus"
                            };
                            $(element).popover(options).popover('show');

                            scope.init = true;
                            // });

                        });
                    } else {
                        // $(element).popover('toggle');
                    }

                });

            }
        };
    }
})();