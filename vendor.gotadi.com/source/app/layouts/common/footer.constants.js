(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')

        /*
         Languages codes are ISO_639-1 codes, see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
         They are written in English to avoid character encoding issues (not a perfect solution)
         */
        .constant('LINKS', [{
                "url": "",
                "text": "Giới thiệu Gotadi",
                "key": "about"
            },
            {
                "url": "",
                "text": "Các điều khoản sử dụng",
                "key": "terms"
            },
            {
                "url": "",
                "text": "Ý kiến của người dùng",
                "key": "feedback"
            },
            {
                "url": "",
                "text": "Liên hệ",
                "key": "contact"
            },
            {
                "url": "",
                "text": "Tuyển dụng",
                "key": "recruitment"
            },
            {
                "url": "",
                "text": "Khách hàng doanh nghiệp",
                "key": "company"
            },
            {
                "url": "",
                "text": "Dành cho đại lý",
                "key": "agent"
            }
        ]);
})();