(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('gtdFormPayment3D', gtdFormPayment3D);

    gtdFormPayment3D.$inject = ['Base64'];

    function gtdFormPayment3D(Base64) {
        var service = {
            redirectPayment3D: redirectPayment3D
        }

        function redirectPayment3D(url, paReq, md, termUrl) {
            var form = document.createElement('form');
            document.body.appendChild(form);
            form.method = 'post';
            form.action = url;

            var inputPaReq = document.createElement('input');
            inputPaReq.type = 'hidden';
            inputPaReq.name = 'PaReq';
            inputPaReq.value = paReq;
            form.appendChild(inputPaReq);

            var inputTermUrl = document.createElement('input');
            inputTermUrl.type = 'hidden';
            inputTermUrl.name = 'TermUrl';
            inputTermUrl.value = termUrl;
            form.appendChild(inputTermUrl);

            var inputMD = document.createElement('input');
            inputMD.type = 'hidden';
            inputMD.name = 'MD';
            inputMD.value = md;
            form.appendChild(inputMD);

            form.submit();

        }

        return service;
    }
})();