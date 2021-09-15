(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ProfileBookingController', ProfileBookingController);

    ProfileBookingController.$inject = ['$location', '$log', '$stateParams', '$scope', '$state', '$timeout', '$uibModal', '$anchorScroll', 'CustomerService', 'DialogService', 'Base64', 'Principal'];

    function ProfileBookingController($location, $log, $stateParams, $scope, $state, $timeout, $uibModal, $anchorScroll, CustomerService, DialogService, Base64, Principal) {
        var vm = this;

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        vm.airBusy = false;
        vm.htlBusy = false;

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

        vm.airBookingOptions = {
            "supplierType": 'AIR',
            page: 0,
            links: {
                last: 0
            }
        };
        vm.hotelBookingOptions = {
            "supplierType": 'HOTEL',
            page: 0,
            links: {
                last: 0
            }
        };


        vm.selectedTab = $stateParams.tab;
        if (!vm.selectedTab) vm.selectedTab = 'tab-a';
        vm.setSelectedTab = function(tab) {
            vm.selectedTab = tab;
        }

        vm.tabClass = function(tab) {
            if (vm.selectedTab == tab) {
                return "active";
            } else {
                return "";
            }
        }

        vm.tabPaneClass = function(tab) {
            if (vm.selectedTab == tab) {
                return "tab-pane active";
            } else {
                return "tab-pane";
            }
        }



        vm.airBookings = [];
        vm.hotelBookings = [];

        vm.profileModel.travellerMode = defaultMode;

        //Click on search button
        vm.doAirSearch = function() {
            vm.airBookingOptions.page = 0;
            if (vm.airBookingOptions.links) {
                vm.airBookingOptions.links.last = 0;
            }

            vm.doSearch();
        };

        //Click on search button on hotel tab
        vm.doHotelButtonSearch = function() {
            vm.hotelBookingOptions.page = 0;
            if (vm.hotelBookingOptions.links) {
                vm.hotelBookingOptions.links.last = 0;
            }
            vm.doHotelSearch();
        };

        // Reset
        vm.doAirReset = function() {
            vm.airBookingOptions = {
                "supplierType": 'AIR',
                page: 0,
                links: {
                    last: 0
                }
            };

            $('#flightstartdate').bootstrapDP('clearDates');

            vm.doSearch();
        };

        vm.doHotelReset = function() {
            vm.hotelBookingOptions = {
                "supplierType": 'HOTEL',
                page: 0,
                links: {
                    last: 0
                }
            };
            vm.doHotelSearch();
        };

        // Collection Actions
        vm.doSearch = function(nextpage) {

            if (vm.airBusy) {
                return;
            } else {
                vm.airBusy = true;
            }

            if (!nextpage) {
                vm.airBookings = [];
            }

            CustomerService.searchBookings(vm.airBookingOptions).then(function(result) {
                $log.log("Search Air Booking Result = ");
                $log.log(result);
                $log.log(vm.airBookingOptions);

                var lastId = null;
                if (vm.airBookings.length > 1) {
                    lastId = 'air' + vm.airBookings[vm.airBookings.length - 1].id;
                }

                vm.airBookingOptions.links = result.links;
                vm.airBookingOptions.totalItems = result.totalItems;

                for (var i = 0; i < result.length; i++) {
                    vm.airBookings.push(result[i]);
                }
                if (nextpage && lastId) {
                    $log.log('searchBookings air---------lastId: ' + lastId);
                    $location.hash(lastId);
                    $anchorScroll();
                    $location.hash(null);

                }
                $timeout(function() {
                    vm.airBusy = false;
                }, 1000);

            });
        };

        vm.nextAirPage = function() {
            if (vm.selectedTab != 'tab-a') return;
            if (vm.airBusy) return;

            vm.airBookingOptions.page += 1;

            // vm.airBookingOptions.page = page;
            vm.doSearch(true);
        };

        vm.doHotelSearch = function(nextpage) {

            if (vm.htlBusy) {
                return;
            } else {
                vm.htlBusy = true;
            }

            if (!nextpage) {
                vm.hotelBookings = [];
            }

            CustomerService.searchBookings(vm.hotelBookingOptions).then(function(result) {
                $log.log("Search Hotel Booking Result = ");
                $log.log(result);
                $log.log(vm.hotelBookingOptions);

                var lastId = null;
                if (vm.hotelBookings.length > 0) {
                    lastId = 'htl' + vm.hotelBookings[vm.hotelBookings.length - 1].id;
                }

                vm.hotelBookingOptions.links = result.links;
                vm.hotelBookingOptions.totalItems = result.totalItems;

                for (var i = 0; i < result.length; i++) {
                    vm.hotelBookings.push(result[i]);
                }
                if (nextpage && lastId) {
                    $log.log('searchBookings hotel---------lastId: ' + lastId);
                    $location.hash(lastId);
                    $anchorScroll();
                    $location.hash(null);

                }
                $timeout(function() {
                    vm.htlBusy = false;
                }, 1000);
                // vm.hotelBookings = result;
            });
        };

        vm.nextHotelPage = function(page) {
            if (vm.selectedTab != 'tab-h') return;
            if (vm.htlBusy) return;

            vm.hotelBookingOptions.page += 1;
            // vm.hotelBookingOptions.page = page;
            vm.doHotelSearch(true);
        };

        // Item actions
        vm.viewAirItem = function(item) {
            var bookingNumber = Base64.encodeString(item.bookingNumber);
            $state.go('user-profile-booking-air/:booking_number/:mode', {
                "booking_number": bookingNumber,
                "mode": 'view'
            });
        };

        vm.openDeleteAirBooking = function(item, deleteAll) {
            $scope.selectedTab = vm.selectedTab;
            if (deleteAll) {
                var chk = false;
                angular.forEach(vm.airBookings, function(item, value) {
                    // if (item.checked) {
                    item.checked = true;
                    chk = true;
                    // }
                });
                if (!chk) {
                    var error = {};
                    error.title = 'Error';
                    error.message = 'Bạn phải chọn bản ghi để xoá!';
                    DialogService.openAlertDialog(error);
                    return;
                }

                $scope.bookings = vm.airBookings;

            } else {
                $scope.bookings = [];
                item.checked = true;
                $scope.bookings.push(item);
            }

            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                backdrop: 'static',
                templateUrl: 'app/account/profile/booking/profile.booking.delete.html',
                controller: 'ProfileBookingDeleteController',
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

        vm.viewHotelItem = function(item) {
            var bookingNumber = Base64.encodeString(item.bookingNumber);
            if (item.supplierBookingStatus == 'BOOKED') {
                $state.go('hotel-booking/:booking_number/:params', {
                    "booking_number": bookingNumber,
                    "params": ''
                });
            } else {
                $state.go('user-profile-booking-htl/:booking_number/:mode', {
                    "booking_number": bookingNumber,
                    "mode": 'view'
                });
            }
        };

        vm.openDeleteHotelBooking = function(item, deleteAll) {
            $scope.selectedTab = vm.selectedTab;
            if (deleteAll) {
                var chk = false;
                angular.forEach(vm.hotelBookings, function(item, value) {
                    // if (item.checked) {
                    item.checked = true;
                    chk = true;
                    // }
                });
                if (!chk) {
                    var error = {};
                    error.title = 'Error';
                    error.message = 'Bạn phải chọn bản ghi để xoá!';
                    DialogService.openAlertDialog(error);
                    return;
                }

                $scope.bookings = vm.hotelBookings;

            } else {
                $scope.bookings = [];
                item.checked = true;
                $scope.bookings.push(item);
            }

            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                backdrop: 'static',
                templateUrl: 'app/account/profile/booking/profile.booking.delete.html',
                controller: 'ProfileBookingDeleteController',
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

        // Init search
        vm.doSearch();
        vm.doHotelSearch();
    }
})();