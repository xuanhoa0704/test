(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('OtaLanguageController', OtaLanguageController);

    OtaLanguageController.$inject = ['$translate', 'OtaLanguageService', 'tmhDynamicLocale'];

    function OtaLanguageController($translate, OtaLanguageService, tmhDynamicLocale) {
        var vm = this;

        vm.changeLanguage = changeLanguage;
        vm.languages = null;

        OtaLanguageService.getAll().then(function(languages) {
            vm.languages = languages;
        });

        function changeLanguage(languageKey) {
            $translate.use(languageKey);
            tmhDynamicLocale.set(languageKey);
        }
    }
})();