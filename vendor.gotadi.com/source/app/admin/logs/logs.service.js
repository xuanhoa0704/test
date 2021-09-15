(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('LogsService', LogsService);

    LogsService.$inject = ['$resource', 'API_URL'];

    function LogsService($resource, API_URL) {
        var service = $resource(API_URL + '/management/logs', {}, {
            'findAll': {
                method: 'GET',
                isArray: true
            },
            'changeLevel': {
                method: 'PUT'
            }
        });

        return service;
    }
})();