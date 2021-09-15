(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('Subscribed', Subscribed);

    Subscribed.$inject = ['$resource', '$http', '$log', 'SUBSCRIBED_URL', '$q', 'API_URL'];

    function Subscribed($resource, $http, $log, SUBSCRIBED_URL, $q, API_URL) {
        var service = {
            Subscribed: Subscribed
        };

        function Subscribed(email, phone) {
            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            var data = {
                email: email,
                phone: phone,
            };
            $log.log(data);
            $log.log(SUBSCRIBED_URL);

            return $http.post(
                    API_URL + SUBSCRIBED_URL, data)
                .then(function successCallback(response) {
                    $log.log('successCallback gPaymentBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    //alert(response);
                    return response.data ? response.data : {};
                }, function error(response) {
                    $log.log('errorCallback gPaymentBooking');
                    // $log.log("response = " + JSON.stringify(response));
                    return $q.reject(response);
                });

        }

        return service;
    }
})();