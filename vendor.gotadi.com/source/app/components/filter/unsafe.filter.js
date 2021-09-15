(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('unsafe', unsafe);

    unsafe.$inject = ['$log', '$sce'];

    function unsafe($log, $sce) {
        return unsafeFilter;

        function unsafeFilter(val, format) {
            $log.log('++++++++++');
            $log.log(val);
            $log.log($sce.trustAsHtml(val));
            $log.log('++++++++++');
            return $sce.trustAsHtml(val);

        }

    }
})();