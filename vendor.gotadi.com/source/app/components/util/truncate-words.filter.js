(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .filter('words', words);

    words.$inject = ['$log'];

    function words($log) {
        return wordsFilter;

        function wordsFilter(input, words) {
            if (isNaN(words)) {
                return input;
            }
            if (words <= 0) {
                return '';
            }
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        }
    }
})();