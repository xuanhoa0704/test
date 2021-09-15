(function() {
    'use strict';

    gtdProfileUserInfoController.$inject = ['$log', '$scope', '$cookies', '$uibModal', 'MetaData', 'GlobalSrv', 'DialogService', 'LIMIT_WIDTH', 'LIMIT_HEIGHT'];

    function gtdProfileUserInfoController($log, $scope, $cookies, $uibModal, MetaData, GlobalSrv, DialogService, LIMIT_WIDTH, LIMIT_HEIGHT) {
        var ctrl = this;

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        $log.log("$ctrl.profileModel.mode=" + ctrl.profileModel.mode);
        $log.log("$ctrl.profileModel.socialUser=" + ctrl.profileModel.socialUser);

        ctrl.allCountries = GlobalSrv.getAllCountries();
        ctrl.allLookups = GlobalSrv.getAllLookups();

        ctrl.titleLookups = [];

        if (ctrl.allCountries == [] || ctrl.allCountries.length == 0) {
            MetaData.getCountries().then(function success(result) {
                ctrl.allCountries = result;
            });
        }

        if (ctrl.allLookups == [] || ctrl.allLookups.length == 0) {
            MetaData.searchLookups('', '', true).then(function success(result) {
                ctrl.allLookups = result;
            });
        }

        // 219-VY scroll
        $("#button").click(function() {
            $('html, body').animate({
                scrollTop: $("#action-bar-mobile").offset().top
            }, 1000);
        });

        MetaData.searchLookups('ota_customer', 'passenger_gender').then(function success(result) {
            ctrl.titleLookups = [];

            angular.forEach(result, function(item) {
                // $log.log(item.lookupValue);
                if (!(ctrl.profileModel.type == 'traveller')) {
                    if (item.lookupValue == 'MALE' || item.lookupValue == 'FEMALE') {
                        ctrl.titleLookups.push(item);
                    }
                } else {
                    ctrl.titleLookups.push(item);
                }

            });

        });

        ctrl.edit = function() {
            ctrl.profileModel.mode = 'edit';
        };
        ctrl.validAvatar = 0;

        ctrl.selectImage = function() {
            var select = document.getElementById('fileAvatar');
            select.click();
        };

        ctrl.setAvatar = function($file) {
            var reader = new FileReader();
            reader.onload = ctrl.imageIsLoaded;
            reader.readAsDataURL($file);

        };
        ctrl.imageIsLoaded = function(e) {
            $scope.$apply(function() {
                var img = new Image();
                img.src = (e.target.result);
                if (!ctrl.profileModel.avatar) {
                    ctrl.profileModel.avatar = {
                        avatarImage: "",
                        avatarImageContentType: "",
                        profileId: ctrl.shortProfile.id,
                        inUsed: true
                    };
                }
                img.onload = function() {
                    if (this.width > LIMIT_WIDTH) {
                        var imgNew = imageToDataUri(this, LIMIT_WIDTH, LIMIT_HEIGHT).split("data:image/png;base64,")[1];
                        $scope.$apply(function() {
                            ctrl.profileModel.avatar.avatarImage = imgNew;
                            ctrl.profileModel.avatar.avatarImageContentType = "image/png";
                            ctrl.profileModel.avatar.profileId = ctrl.shortProfile.id;
                            ctrl.profileModel.avatar.inUsed = true;

                        });
                    }
                };
            });
        };

        function imageToDataUri(img, width, height) {

            // create an off-screen canvas
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');

            // set its dimension to target size
            canvas.width = width;
            canvas.height = height;

            // draw source image into the off-screen canvas:
            ctx.drawImage(img, 0, 0, width, height);

            // encode image to data-uri with base64 version of compressed image
            return canvas.toDataURL();
        }

        ctrl.addPhoneNumber = function() {
            if (ctrl.profileModel.phoneNumbers.length >= 5) {
                var error = {
                    "title": "Error",
                    "message": "Bạn không được nhập quá 5 số điện thoại!"
                };
                DialogService.openAlertDialog(error);
                return;
            } else {
                ctrl.profileModel.phoneNumbers.push({
                    text: ''
                });
            }
        };

        ctrl.removePhoneNumber = function(index) {
            ctrl.profileModel.phoneNumbers.splice(index, 1);
        };

        ctrl.changePass = function() {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/account/password/password.dialog.html',
                controller: 'PasswordDialogController',
                controllerAs: 'vm',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };

    }

    var gtdProfileUserInfo = {
        require: {
            form: '^^form'
        },
        templateUrl: 'app/components/profile/profile-user-info.html',
        controller: gtdProfileUserInfoController,
        bindings: {
            profileModel: '=',
            shortProfile: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdProfileUserInfo', gtdProfileUserInfo);

})();