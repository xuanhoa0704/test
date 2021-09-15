(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .directive('gtdLightGallery', gtdLightGallery);

    gtdLightGallery.$inject = ['$log', '$timeout'];

    function gtdLightGallery($log, $timeout) {

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if (scope.$last) {

                    // ng-repeat is completed
                    element.parent().lightSlider({
                        gallery: true,
                        item: 1,
                        loop: false,
                        autoWidth: false,
                        slideMargin: 0,
                        thumbItem: 5
                    });
                }
            }
        };
    }
})();