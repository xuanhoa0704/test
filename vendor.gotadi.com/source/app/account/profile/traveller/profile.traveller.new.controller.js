(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileTravellerNewController', ProfileTravellerNewController);

    ProfileTravellerNewController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'CustomerService', 'DialogService', 'Principal'];

    function ProfileTravellerNewController($log, $rootScope, $scope, $state, $stateParams, $timeout, CustomerService, DialogService, Principal) {
        var vm = this;

        $log.log($stateParams);

        vm.profileModel = {};


        CustomerService.getShortProfile().then(function(result) {
            var requester = result;
            CustomerService.getCustomerProfile(requester.requesterId).then(function(spResult) {


                vm.shortProfile = spResult;

                if (vm.shortProfile.defaultTravellerId) {
                    CustomerService.getCustomerTraveller(vm.shortProfile.defaultTravellerId).then(function success(result) {
                        //vm.profileModel = result;
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
                            //vm.profileModel.profileid = vm.shortProfile.id;
                        });
                    });
                }
            });
        });

        var defaultMode = 'edit';
        vm.profileModel.type = 'traveller';
        vm.profileModel.memberCards = [];
        vm.profileModel.editMemberCards = [];
        vm.profileModel.phoneNumbers = [];

        if ($stateParams.traveller_id) {
            CustomerService.getCustomerTraveller($stateParams.traveller_id).then(function(result) {
                vm.profileModel = result;

                //update type
                vm.profileModel.type = 'traveller';

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

                $log.log(vm.profileModel);

                // 'view', 'edit'
                defaultMode = 'edit';

                if ($stateParams.mode) {
                    vm.profileModel.mode = $stateParams.mode;
                } else {
                    vm.profileModel.mode = defaultMode;
                }
            }, function error(result1) {
                vm.profileModel.mode = defaultMode;

                if (vm.profileModel.phoneNumbers.length === 0) {
                    vm.profileModel.phoneNumbers.push({
                        text: ''
                    });
                }
                if (vm.profileModel.editMemberCards.length === 0) {
                    vm.profileModel.editMemberCards.push({
                        text: ''
                    });
                }
            });
        } else {
            vm.profileModel.mode = defaultMode;

            if (vm.profileModel.phoneNumbers.length === 0) {
                vm.profileModel.phoneNumbers.push({
                    text: ''
                });
            }
            if (vm.profileModel.editMemberCards.length === 0) {
                vm.profileModel.editMemberCards.push({
                    text: ''
                });
            }
        }

        vm.saveUserInfo = function(profiletravellerform) {

            if (!profiletravellerform.$valid) {
                angular.element("[name='" + profiletravellerform.$name + "']").find('.ng-invalid:visible:first').focus();
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
                            "title": "Thông Báo",
                            "message": "Bạn phải nhập đầy đủ thông tin của thẻ!"
                        };
                        isValid = false;
                        DialogService.openAlertDialog(error);
                    }
                });
                if (!isValid) return;

                var options = vm.profileModel;

                // Save info
                CustomerService.addCustomerTravellersProfile(options).then(function(result) {
                    $log.log("Save user info");
                    $log.log(result);

                    if (result.success) {
                        $state.go('user-profile-traveller');
                    } else {
                        DialogService.openHttpAlertDilalog(result);
                    }

                }, function error(result) {
                    DialogService.openHttpAlertDilalog(result);
                });
            }



        };

        vm.cancel = function() {
            $state.go('user-profile-traveller');
        };

        vm.save = function() {
            $state.go('user-profile-traveller');
        };

    }
})();