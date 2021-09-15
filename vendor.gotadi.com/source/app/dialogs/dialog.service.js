(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('DialogService', DialogService);

    DialogService.$inject = ['$log', '$uibModal', '$translate'];

    function DialogService($log, $uibModal, $translate) {
        var service = {
            openAlertDialog: openAlertDialog,
            openHttpAlertDilalog: openHttpAlertDilalog,
            openB2B2CDialog: openB2B2CDialog,
            isResponseSuccess: isResponseSuccess,
            openNoActionDialog: openNoActionDialog
        };

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        return service;

        /**
         *
         * @param error format
         * {
         *  title : "Title"
         *  message : "Message"
         * }
         */
        function openAlertDialog(error) {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/dialogs/alert.dialog.html',
                controller: 'AlertDialogController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }],
                    error: function() {
                        return error;
                    }
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        }

        function openHttpAlertDilalog(httpResponse, backToSearch) {
            var message = 'Hệ thống chưa xử lý được yêu cầu của Quý khách. Mời quý khách gửi lại yêu cầu.';

            //alert(httpResponse.status + ":" + httpResponse.success);

            if (httpResponse.success) {
                return false;
            } else {
                //TODO: process HTTP response
                if (httpResponse.status) {
                    switch (httpResponse.status) {
                        // connection refused, server not reachable
                        case 0:
                            message = 'Server not reachable';
                            break;

                        case 400:
                            message = 'Bad request';
                            break;

                        case 404:
                            message = 'Not found';
                        case 200:
                            message = httpResponse.textMessage;
                        default:
                            if (httpResponse.data && httpResponse.data.message) {
                                message = httpResponse.data.message;
                            } else {
                                // message = '';
                            }
                    }
                }

                message = 'Hệ thống chưa xử lý được yêu cầu của Quý khách. Mời quý khách gửi lại yêu cầu.';

                if (httpResponse && httpResponse.errors) {
                    angular.forEach(httpResponse.errors, function(item) {
                        if (item.code == '24' && item.message == 'SENDER_MOBILE_INCORRECT') {
                            message = 'Bạn phải nhập số điện thoại nội địa để thanh toán.';
                        } else if (item.code == '6_PAYER_CHECK_ENROLLMENT_ERROR') {
                            message = 'Không thực hiện tạo thẻ được, mời bạn kiểm tra lại thông tin thẻ.';
                        }
                    });
                }

                var error = {
                    "title": "Thông Báo",
                    "message": message
                };

                if (backToSearch) {
                    error = {
                        "title": "Thông Báo",
                        "message": 'Hệ thống chưa xử lý được yêu cầu của Quý khách. Quý khách vui lòng tiến hành tìm kiếm lại chuyến bay và đặt lại vé.'
                    };
                }

                if (modalInstance !== null) return;

                if (backToSearch) {
                    modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/dialogs/timeout.dialog.html',
                        controller: 'TimeoutDialogController',
                        controllerAs: 'vm',
                        resolve: {
                            translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('login');
                                return $translate.refresh();
                            }],
                            error: function() {
                                return error;
                            }
                        }
                    });
                } else {
                    modalInstance = $uibModal.open({
                        animation: true,
                        // templateUrl: 'app/dialogs/alert.dialog.html',
                        // controller: 'TimeoutDialogController',
                        templateUrl: 'app/dialogs/alert.dialog.html',
                        controller: 'AlertDialogController',
                        controllerAs: 'vm',
                        resolve: {
                            translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('login');
                                return $translate.refresh();
                            }],
                            error: function() {
                                return error;
                            }
                        }
                    });
                }

                modalInstance.result.then(
                    resetModal,
                    resetModal
                );

                return true;
            }
        }

        function openNoActionDialog(error) {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/dialogs/merchant.alert.dialog.html',
                controller: 'AlertDialogController',
                controllerAs: 'vm',
                backdrop: 'static',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('login');
                        return $translate.refresh();
                    }],
                    error: function() {
                        return error;
                    }
                }
            });

            modalInstance.result.then(
                resetModal,
                resetModal
            );
        }

        /**
         *
         * @param error format
         * {
         *  title : "Title"
         *  message : "Message"
         *  redirectUrl : "URL"
         * }
         */
        function openB2B2CDialog(error) {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/dialogs/b2b2c.dialog.html',
                controller: 'B2B2CDialogController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }],
                    error: function() {
                        return error;
                    }
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );

            return true;
        }

        function isResponseSuccess(httpResponse) {
            if (httpResponse.success) {
                return true;
            } else {
                return false;
            }
        }
    }
})();