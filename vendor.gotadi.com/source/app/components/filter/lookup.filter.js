(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('lookups', lookups);

    lookups.$inject = ['$log', 'GlobalSrv', 'DataService'];

    function lookups($log, GlobalSrv, DataService) {
        return lookupsFilter;

        function lookupsFilter(input, type) {
            var result = input;

            var data = GlobalSrv.getAllLookups();
            // $log.log(data.length);

            data.forEach(function(item) {
                // $log.log(item.lookupValue + ":" + input + ":" + item.objectName + ":" +  type);
                if (item.lookupValue == input && item.objectName == type) {
                    result = item.lang;
                    // $log.log("result = " + result);
                }
            });

            return result;
        }
    }
})();