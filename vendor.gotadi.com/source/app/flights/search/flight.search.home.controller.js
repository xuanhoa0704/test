(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('FlightSearchHomeController', FlightSearchHomeController);

    FlightSearchHomeController.$inject = ['$log', '$rootScope', '$scope', '$state', '$stateParams', '$timeout', 'Flight', 'DialogService', 'DataService', 'DEFAULT_PAGE_SIZE', 'Base64', 'BannerService', 'ThemeCfg', '$cookies'];

    function FlightSearchHomeController($log, $rootScope, $scope, $state, $stateParams, $timeout, Flight, DialogService, DataService, DEFAULT_PAGE_SIZE, Base64, BannerService, ThemeCfg, $cookies) {
        $('.page-content').addClass('home');
        var vm = this;
        var merchant_code = $cookies.get("merchant_code") || localStorage.getItem("merchant_code");

        if (!ThemeCfg[merchant_code])
            vm.enable_template = true;
        else
            vm.enable_template = false;

        if (vm.enable_template) {
            $('.flight-search-home').css('max-width', "640px");
            $('.hotel-search-home').css('max-width', "640px");
        }
        vm.searchResult = [];

        // Default init
        vm.searchOptions = {};
        vm.searchOptions.searchType = "oneway"; //oneway
        vm.searchOptions.dtype = "domestic"; //international
        vm.searchOptions.size = DEFAULT_PAGE_SIZE; //15
        vm.searchOptions.page = 0;
        vm.searchOptions.adultNo = 1;
        vm.searchOptions.childrenNo = 0;
        vm.searchOptions.newBornNo = 0;
        vm.searchOptions.class = 'E';
        vm.searchOptions.departureDate = moment(new Date()).format('DD-MM-YYYY');
        vm.searchOptions.returnDate = moment(new Date()).format('DD-MM-YYYY');


        var so = DataService.getSearchOption();
        $log.log('so.searchType=' + so.searchType);
        if (so.searchType) {
            // vm.searchOptions = DataService.getSearchOption();
            vm.searchOptions = {};

            var savedSearchOptions = DataService.getSavedSearchOption();
            vm.searchOptions.fromAirPort = savedSearchOptions.fromAirPort;
            vm.searchOptions.toAirPort = savedSearchOptions.toAirPort;
            vm.searchOptions.departureDate = savedSearchOptions.departureDate;
            vm.searchOptions.returnDate = savedSearchOptions.returnDate;
            vm.searchOptions.searchType = savedSearchOptions.searchType;
            vm.searchOptions.dtype = savedSearchOptions.dtype;
            vm.searchOptions.adultNo = savedSearchOptions.adultNo;
            vm.searchOptions.childrenNo = savedSearchOptions.childrenNo;
            vm.searchOptions.newBornNo = savedSearchOptions.newBornNo;
            if (!vm.searchOptions.class || (vm.searchOptions.class != 'E' && vm.searchOptions.class != 'B')) {
                vm.searchOptions.class = 'E';
            }

            if (moment(vm.searchOptions.departureDate, 'DD-MM-YYYY').isBefore(moment(new Date()))) {
                vm.searchOptions.departureDate = moment(new Date()).format('DD-MM-YYYY');
            }

            if (moment(vm.searchOptions.returnDate, 'DD-MM-YYYY').isBefore(moment(new Date()))) {
                vm.searchOptions.returnDate = moment(new Date()).format('DD-MM-YYYY');
            }

            if (moment(vm.searchOptions.departureDate, 'DD-MM-YYYY').isAfter(moment(vm.searchOptions.returnDate, 'DD-MM-YYYY'))) {
                vm.searchOptions.returnDate = vm.searchOptions.departureDate;
            }
        }

        //+++ TungNQ-18Sept17: reset temp cache of search option
        vm.searchOptions.departureItinerary = {};
        vm.searchOptions.returnSearchId = null;
        vm.searchOptions.searchId = null;
        vm.searchOptions.ssrOfferItemsDepart = [];
        vm.searchOptions.ssrOfferItemsReturn = [];
        //---

        //vm.searchOptions = {};

        vm.topRoundTripIdx = 1;
        vm.topOnewayIdx = 1;

        vm.doSearch = function($searchResult, $searchOptions) {
            vm.searchResult = $searchResult;
            vm.searchOptions = $searchOptions;

            $timeout(function() {
                // alert("BROADCAST");
                // $rootScope.$broadcast("gtd-refresh-airline-carousel", null);
            }, 1000);
            // alert('Redirect');
            // $state.go('flight-search', {"searchOptions": vm.searchOptions, "searchResult": vm.searchResult
            //     , "searchCompleted": true
            //     , "params": Base64.encodeJson(vm.searchOptions)});

            if (vm.searchResult && vm.searchResult.page && vm.searchResult.page.totalElements > 0) {
                $state.go('flight-search', {
                    "searchOptions": vm.searchOptions,
                    "searchResult": vm.searchResult,
                    "searchCompleted": true,
                    "filterCompleted": false,
                    "params": Base64.encodeJson(vm.searchOptions)
                });
            } else {
                $state.go('flight-search', {
                    "searchOptions": vm.searchOptions,
                    "searchResult": vm.searchResult,
                    "searchCompleted": true,
                    "filterCompleted": true,
                    "params": Base64.encodeJson(vm.searchOptions)
                });
            }
        };

        function isEmail(email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
        }
        $scope.subscriceEmail = function() {
            var email = $('.form-subscrice .email input').val();
            var phone = $('.form-subscrice .phone input').val();
            var messageResult = '';
            var classAdd = 'error';
            var classRemove = 'success';
            if (email == '') {
                messageResult = 'Email không được để trống.';
            } else {
                messageResult = 'Email đã tồn tại trên hệ thống.';
                if (isEmail(email) != false) {
                    Subscribed.Subscribed(email, phone).then(function(result) {
                        if (result.id) {
                            $('.form-subscrice .messageResult').html('Đăng ký thành công.');
                            $('.form-subscrice .messageResult').removeClass('Error');
                            $('.form-subscrice .messageResult').addClass('success');
                        } else {
                            $('.form-subscrice .messageResult').html('Email đã tồn tại trên hệ thống.');
                            $('.form-subscrice .messageResult').removeClass('success');
                            $('.form-subscrice .messageResult').addClass('Error');
                        }
                    });
                } else {
                    messageResult = 'Email không hợp lệ.';
                }
            }
            $('.form-subscrice .messageResult').html(messageResult);
            $('.form-subscrice .messageResult').removeClass(classRemove);
            $('.form-subscrice .messageResult').addClass(classAdd);
        };


        vm.initControl = function() {
            // Init tabs
            $('.nav-tabs a').click(function(e) {
                e.preventDefault();
                $(this).tab('show');
            });

            var options = {
                $FillMode: 1, //[Optional] The way to fill image in slide, 0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
                $DragOrientation: 3, //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $Cols is greater than 1, or parking position is not 0)
                $AutoPlay: true, //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
                $Idle: 2500, //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000

                $BulletNavigatorOptions: { //[Optional] Options to specify and enable navigator or not
                    $Class: $JssorBulletNavigator$, //[Required] Class to create navigator instance
                    $ChanceToShow: 2, //[Required] 0 Never, 1 Mouse Over, 2 Always
                    $AutoCenter: 1, //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                    $Steps: 1, //[Optional] Steps to go for each navigation request, default value is 1
                    $Rows: 1, //[Optional] Specify lanes to arrange items, default value is 1
                    $SpacingX: 10, //[Optional] Horizontal space between each item in pixel, default value is 0
                    $SpacingY: 10, //[Optional] Vertical space between each item in pixel, default value is 0
                    $Orientation: 1 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
                }
            };
            // var jssor_slider1 = new $JssorSlider$('slider1_container', options);
        };

        vm.switchTopRoundTrip = function(idx) {
            vm.topRoundTripIdx = idx;
        };

        vm.switchTopOneway = function(idx) {
            vm.topOnewayIdx = idx;
        };

        vm.initControl();

    }
})();