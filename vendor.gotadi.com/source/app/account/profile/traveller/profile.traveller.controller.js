(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileTravellerController', ProfileTravellerController);

    ProfileTravellerController.$inject = ['$log', '$rootScope', '$scope', '$state', '$timeout', '$uibModal', 'CustomerService', 'DialogService', 'Base64', 'Principal'];

    function ProfileTravellerController($log, $rootScope, $scope, $state, $timeout, $uibModal, CustomerService, DialogService, Base64, Principal) {
        var vm = this;

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

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

        // 'view', 'edit'
        var defaultMode = 'view';

        vm.page = 1;

        vm.profileModel.travellerMode = defaultMode;

        // Get list of travellers
        vm.customerTravellers = [];
        CustomerService.getCustomerTravellersPagination(vm.page).then(function(result) {
            if (result && result.length > 0) {
                angular.forEach(result, function(traveller, index) {
                    if (index != 0) {
                        vm.customerTravellers.push(traveller);
                    }
                });
            }

            vm.totalPages = result.totalPages;
            vm.totalItems = result.totalItems;

            angular.forEach(vm.customerTravellers, function(item, value) {
                item.checked = false;
            });
        });


        // Check default traveller profile
        CustomerService.getShortProfile().then(function(result) {
            var requester = result;
            CustomerService.getCustomerProfile(requester.requesterId).then(function(spResult) {
                //$log.log("spResult  = " + JSON.stringify(spResult));
                $log.log("spResult  = " + spResult);

                vm.shortProfile = spResult;
                vm.profileModel.defaultTravellerId = spResult.defaultTravellerId;

            });
        });

        vm.pageChanged = function() {
            CustomerService.getCustomerTravellersPagination(vm.page).then(function(result) {
                if (result && result.length > 0) {
                    angular.forEach(result, function(traveller, index) {
                        // $log.log(item.lookupValue);
                        if (index != 0) {
                            vm.customerTravellers.push(traveller);
                        }
                    });
                }

                vm.totalPages = result.totalPages;
                vm.totalItems = result.totalItems;

                angular.forEach(vm.customerTravellers, function(item, value) {
                    item.checked = false;
                });
            });
        };

        // Collection Actions
        vm.openAddNewTraveller = function() {
            $state.go('user-profile-traveller.new');
        };

        vm.openDeleteTraveller = function(item, deleteAll) {
            if (deleteAll) {
                var chk = false;
                angular.forEach(vm.customerTravellers, function(item, value) {
                    if (item.checked) {
                        chk = true;
                    }
                });
                if (!chk) {
                    var error = {};
                    error.title = 'Error';
                    error.message = 'Bạn phải chọn bản ghi để xoá!';
                    DialogService.openAlertDialog(error);
                    return;
                }

                $scope.customerTravellers = vm.customerTravellers;

            } else {
                $scope.customerTravellers = [];
                item.checked = true;
                $scope.customerTravellers.push(item);
            }

            // $log.log($scope.customerTravellers);

            // $scope.cardItem = item;
            // $scope.customerTravellers = vm.customerTravellers;

            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                backdrop: 'static',
                templateUrl: 'app/account/profile/traveller/profile.traveller.delete.html',
                controller: 'ProfileTravellerDeleteController',
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

        // Item actions
        vm.viewItem = function(item) {
            $state.go('user-profile-traveller/:traveller_id/:mode', {
                "traveller_id": item.id,
                "mode": 'view'
            });
        };

        vm.editItem = function(item) {
            $state.go('user-profile-traveller/:traveller_id/:mode', {
                "traveller_id": item.id,
                "mode": 'edit'
            });
        };

        vm.deleteItem = function(item) {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/account/profile/traveller/profile.traveller.delete.html',
                controller: 'ProfileCardDeleteController',
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
})();