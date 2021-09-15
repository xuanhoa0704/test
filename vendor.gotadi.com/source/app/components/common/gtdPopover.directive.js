(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdPopover', gtdPopover);

    gtdPopover.$inject = ['$log', '$timeout', '$compile', '$templateCache', '$q', '$http'];

    function gtdPopover($log, $timeout, $compile, $templateCache, $q, $http) {
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
                argument: '=',
                argument2: '=',
                argument3: '@?',
                argument4: '@?',
                ibeKeys: '='
            },
            link: function(scope, element, attrs) {
                getTemplate(attrs.gtdTemplatePath).then(function(popOverContent) {
                    if (!attrs.placement) {
                        attrs.placement = 'bottom';
                    }
                    var options = {
                        content: $compile($(popOverContent))(scope),
                        placement: attrs.placement,
                        html: true,
                        trigger: "focus"
                    };
                    $(element).popover(options);
                });
            }
        };
    }
})();