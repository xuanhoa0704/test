(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('User', User);

    User.$inject = ['$resource', '$http', '$log', 'SUBSCRIBED_URL', 'API_URL'];

    function User($resource, $http, $log, SUBSCRIBED_URL, API_URL) {
        var service = $resource(API_URL + '/api/users/:login', {}, {
            'query': {
                method: 'GET',
                isArray: true
            },
            'get': {
                method: 'GET',
                transformResponse: function(data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'save': {
                method: 'POST'
            },
            'update': {
                method: 'PUT'
            },
            'delete': {
                method: 'DELETE'
            }

        });


        return service;
    }
})();