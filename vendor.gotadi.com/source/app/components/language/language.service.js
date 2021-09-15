(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('OtaLanguageService', OtaLanguageService);

    OtaLanguageService.$inject = ['$q', '$http', '$translate', 'LANGUAGES'];

    function OtaLanguageService($q, $http, $translate, LANGUAGES) {
        var service = {
            getAll: getAll,
            getCurrent: getCurrent
        };

        return service;

        function getAll() {
            var deferred = $q.defer();
            deferred.resolve(LANGUAGES);
            return deferred.promise;
        }

        function getCurrent() {
            var deferred = $q.defer();
            var language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');

            deferred.resolve(language);

            return deferred.promise;
        }
    }
})();