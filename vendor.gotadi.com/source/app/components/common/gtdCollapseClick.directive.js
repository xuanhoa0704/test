(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdCollapseClick', gtdCollapseClick);

    gtdCollapseClick.$inject = ['$log', '$timeout', '$compile', '$templateCache', '$q', '$http'];

    function gtdCollapseClick($log, $timeout, $compile, $templateCache, $q, $http) {

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
                getTemplate(attrs.gtdTemplatePath).then(function(collapseContent) {
                    var content = $compile($(collapseContent))(scope);
                    $(element).append(content);
                });
            }
        };
    }
})();