(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdMaskInput', gtdMaskInput);

    gtdMaskInput.$inject = ['$log', '$timeout'];

    function gtdMaskInput($log, $timeout) {

        // function gtdMaskInput() {
        return {
            require: "ngModel",
            restrict: "AE",
            scope: {
                ngModel: '='
            },
            link: function(scope, elem, attrs) {
                var orig = scope.ngModel;
                var edited = orig;
                scope.ngModel = edited.slice(4).replace(/\d/g, 'x') + edited.slice(-4);

                elem.bind("blur", function() {
                    var temp;
                    orig = elem.val();
                    temp = elem.val();
                    elem.val(temp.slice(4).replace(/\d/g, 'x') + temp.slice(-4));
                });

                elem.bind("focus", function() {
                    elem.val(orig);
                });
            }
        };
    }
})();