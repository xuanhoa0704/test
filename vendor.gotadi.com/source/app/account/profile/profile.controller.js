(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModal', 'CustomerService', 'Principal', 'DialogService'];

    function ProfileController($log, $rootScope, $scope, $state, $timeout, $uibModal, CustomerService, Principal, DialogService) {
        var vm = this;

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        vm.shortProfile = {};
        vm.profileModel = {};

        Principal.identity().then(function(user) {
            vm.profileModel.socialUser = user.socialUser;
            $log.log(vm.profileModel.socialUser);
            //$log.log("loginuser="+ JSON.stringify(user));
            $log.log("loginuser=" + user);
        });

        CustomerService.getShortProfile().then(function(result) {
            var requester = result;
            CustomerService.getCustomerProfile(requester.requesterId).then(function(spResult) {
                //$log.log("spResult  = " + JSON.stringify(spResult));
                $log.log("spResult  = " + spResult);

                vm.shortProfile = spResult;

                //+++ initial data
                vm.profileModel = {};
                vm.profileModel.phoneNumbers = [];
                if (vm.profileModel.phoneNumbers.length === 0) {
                    vm.profileModel.phoneNumbers.push({
                        text: ''
                    });
                }

                // Init membercards
                if (!vm.profileModel.memberCards) {
                    vm.profileModel.memberCards = [];
                }
                vm.profileModel.editMemberCards = [];
                vm.profileModel.editMemberCards.push({
                    cardType: '',
                    cardNumber: ''
                });

                vm.profileModel.type = 'profile';

                // 'view', 'edit'
                // var defaultMode = 'view';
                vm.profileModel.mode = 'view';
                //---

                if (vm.shortProfile.defaultTravellerId) {
                    CustomerService.getCustomerTraveller(vm.shortProfile.defaultTravellerId).then(function success(result) {
                        vm.profileModel = result;
                        //+++ get avartar
                        CustomerService.getCustomerProfileAvatar(vm.shortProfile.id).then(function success(resultAv) {

                            vm.profileModel.avatar = resultAv;

                            if (resultAv === null || resultAv === "") {
                                vm.profileModel.avatar = {
                                    avatarImage: null,
                                    avatarImageContentType: "",
                                    profileId: 0,
                                    inUsed: true,
                                    createdDate: ""
                                };
                            }
                            vm.profileModel.profileid = vm.shortProfile.id;
                        });

                        // Init Phone
                        vm.profileModel.phoneNumbers = [];
                        if (vm.profileModel.phoneNumber1) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber1
                        });
                        if (vm.profileModel.phoneNumber2) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber2
                        });
                        if (vm.profileModel.phoneNumber3) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber3
                        });
                        if (vm.profileModel.phoneNumber4) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber4
                        });
                        if (vm.profileModel.phoneNumber5) vm.profileModel.phoneNumbers.push({
                            text: vm.profileModel.phoneNumber5
                        });

                        if (vm.profileModel.phoneNumbers.length === 0) {
                            vm.profileModel.phoneNumbers.push({
                                text: ''
                            });
                        }

                        // Init membercards
                        if (!vm.profileModel.memberCards) {
                            vm.profileModel.memberCards = [];
                        }
                        vm.profileModel.editMemberCards = [];
                        vm.profileModel.editMemberCards.push({
                            cardType: '',
                            cardNumber: ''
                        });

                        vm.profileModel.type = 'profile';

                        // 'view', 'edit'
                        // var defaultMode = 'view';
                        vm.profileModel.mode = 'view';

                        Principal.identity().then(function(user) {
                            vm.profileModel.socialUser = user.socialUser;
                            $log.log('++++++++++++++++++++++++++');
                            $log.log('vm.profileModel.socialUser =' + vm.profileModel.socialUser);
                        });

                    }, function error(result) {
                        $log.log('+++++>> getCustomerTraveller Error: ' + result);

                        // vm.profileModel = {};
                        // vm.profileModel.phoneNumbers = [];
                        // if (vm.profileModel.phoneNumbers.length === 0) {
                        //     vm.profileModel.phoneNumbers.push({text: ''});
                        // }
                        //
                        // // Init membercards
                        // if (!vm.profileModel.memberCards) {
                        //     vm.profileModel.memberCards = [];
                        // }
                        // vm.profileModel.editMemberCards = [];
                        // vm.profileModel.editMemberCards.push({cardType: '', cardNumber: ''});
                        //
                        // vm.profileModel.type = 'profile';
                        //
                        // // 'view', 'edit'
                        // // var defaultMode = 'view';
                        // vm.profileModel.mode = 'view';
                    });
                }

                vm.profileModel.type = "profile";
                //$log.log(vm.profileModel);
                // 'view', 'edit'
                // var defaultMode = 'view';
                vm.profileModel.mode = 'view';
            });
        });

        vm.saveUserInfo = function(userprofileform) {

            if (!userprofileform.$valid) {
                angular.element("[name='" + userprofileform.$name + "']").find('.ng-invalid:visible:first').focus();
                return false;
            } else {
                //Validate card
                // Check for input
                var isValid = true;
                angular.forEach(vm.profileModel.editMemberCards, function(item, value) {
                    if (
                        (!item.curCardType && item.curCardNumber) ||
                        (item.curCardType && !item.curCardNumber)
                    ) {
                        var error = {
                            "title": "Error",
                            "message": "Bạn phải nhập đầy đủ thông tin của thẻ!"
                        };
                        isValid = false;
                        DialogService.openAlertDialog(error);
                    }
                });

                if (!isValid) return;

                var options = vm.profileModel;
                options.isDefault = true;

                // Save info
                CustomerService.addCustomerTravellersProfile(options).then(function(result) {
                    $log.log("Save user info");
                    $log.log(result);

                    // if (result.id) {
                    if (result && result[0]) {
                        vm.shortProfile.defaultTravellerId = result[0].id;
                    }
                    var avatar = options.avatar;
                    if (avatar && avatar.profileId === vm.shortProfile.id) {
                        CustomerService.updateAvatarCustomer(avatar);
                    }

                    CustomerService.updateCustomerProfile(vm.shortProfile).then(function() {
                        $state.go('user-profile', {}, {
                            reload: true
                        });
                    }, function(result) {
                        DialogService.openHttpAlertDilalog(result);
                    });
                    // }

                    // update user profile with default travellerid

                }, function error(result) {
                    DialogService.openHttpAlertDilalog(result);
                });

            }


        };

        vm.cancel = function() {
            // vm.profileModel.mode = defaultMode;
            $state.go('user-profile', {}, {
                reload: true
            });
        };

    }
})();