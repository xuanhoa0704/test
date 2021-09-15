(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdPopoverClick', gtdPopoverClick);

    gtdPopoverClick.$inject = ['$log', '$timeout', '$compile', '$templateCache', '$q', '$http'];

    function gtdPopoverClick($log, $timeout, $compile, $templateCache, $q, $http) {

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
                ibeKeys: '=?'
            },
            link: function(scope, element, attrs) {
                getTemplate(attrs.gtdTemplatePath).then(function(popOverContent) {
                    var options = {
                        content: $compile($(popOverContent))(scope),
                        placement: "bottom",
                        html: true,
                        trigger: "click"
                    };
                    $(element).popover(options);
                });
            }
        };
    }
})();