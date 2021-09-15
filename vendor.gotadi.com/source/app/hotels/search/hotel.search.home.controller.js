(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelSearchHomeController', HotelSearchHomeController);

    HotelSearchHomeController.$inject = ['$rootScope', '$scope', '$state', '$timeout', 'Hotel', 'DataService', 'DEFAULT_PAGE_SIZE', 'Base64', 'BannerService', 'ThemeCfg', '$cookies'];

    function HotelSearchHomeController($rootScope, $scope, $state, $timeout, Hotel, DataService, DEFAULT_PAGE_SIZE, Base64, BannerService, ThemeCfg, $cookies) {
        $('.page-content').addClass('home');
        var vm = this;

        var merchant_code = $cookies.get("merchant_code") || localStorage.getItem("merchant_code");


        if (!ThemeCfg[merchant_code] == false)
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
        vm.searchOptions.size = DEFAULT_PAGE_SIZE; //15
        vm.searchOptions.page = 0;
        vm.searchOptions.adultNo = 1;
        vm.searchOptions.childrenNo = 0;
        vm.searchOptions.checkindate = moment(new Date(new Date().getTime() + 1 * 86400000)).format('DD-MM-YYYY');
        vm.searchOptions.checkoutdate = moment(new Date(new Date().getTime() + 2 * 86400000)).format('DD-MM-YYYY');

        vm.hotelTempSearchOptions = DataService.getHotelSearchOptions();
        if (vm.hotelTempSearchOptions.checkin) {
            vm.hotelSearchOptions = vm.hotelTempSearchOptions;
        }

        //TODO: remove
        vm.searchResult = {};
        vm.searchResult.result = [1, 2, 3];

        vm.topHotelIdx = 1;

        vm.setupControl = function() {
            var options = {
                $FillMode: 1, //[Optional] The way to fill image in slide, 0 stretch, 1 contain (keep aspect ratio and put all inside slide), 2 cover (keep aspect ratio and cover whole slide), 4 actual size, 5 contain for large image, actual size for small image, default value is 0
                $DragOrientation: 3, //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $Cols is greater than 1, or parking position is not 0)
                $AutoPlay: true, //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
                $Idle: 2500, //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
                // $SlideshowOptions: {                                //[Optional] Options to specify and enable slideshow or not
                //     $Class: $JssorSlideshowRunner$,                 //[Required] Class to create instance of slideshow
                //     $Transitions: _SlideshowTransitions,            //[Required] An array of slideshow transitions to play slideshow
                //     $TransitionsOrder: 1,                           //[Optional] The way to choose transition to play slide, 1 Sequence, 0 Random
                //     $ShowLink: true                                    //[Optional] Whether to bring slide link on top of the slider when slideshow is running, default value is false
                // },

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

            //responsive code begin
            //you can remove responsive code if you don't want the slider scales
            //while window resizing
            // function ScaleSlider() {
            //     var parentWidth = $('#slider1_container').parent().width();
            //     var parentHeight = $('#slider1_container').parent().height();
            //     if (parentWidth) {
            //         jssor_slider1.$ScaleWidth(parentWidth);
            //     }
            //     // if (parentHeight)  {
            //     //     jssor_slider1.$ScaleHeight(parentHeight);
            //     // }
            //     else
            //         window.setTimeout(ScaleSlider, 30);
            // }
            // //Scale slider after document ready
            // ScaleSlider();
            //
            // //Scale slider while window load/resize/orientationchange.
            // $(window).bind("load", ScaleSlider);
            // $(window).bind("resize", ScaleSlider);
            // $(window).bind("orientationchange", ScaleSlider);
            //responsive code end

            $(".owl-carousel").owlCarousel({
                autoPlay: 3000, //Set AutoPlay to 3 seconds
                dots: true,
                items: 1,
                // itemsDesktop: [1199, 3],
                // itemsDesktopSmall: [979, 3]
                responsive: {
                    480: {
                        items: 1,
                        dots: true
                    }, // from zero to 480 screen width 4 items
                    768: {
                        items: 2,
                        dots: true
                    }, // from 480 screen widthto 768 6 items
                    1024: {
                        items: 3
                    } // from 768 screen width to 1024 8 items
                }
            });
        };

        vm.doSearch = function($searchResult, $searchOptions) {
            vm.searchResult = $searchResult;
            vm.searchOptions = $searchOptions;

            DataService.setHotelSearchResult($searchResult);
            DataService.setHotelSearchOptions($searchOptions);

            $timeout(function() {
                $rootScope.$broadcast("gtd-hotel-search-completed", null);

            }, 0);

            if (vm.searchResult && vm.searchResult.page && vm.searchResult.page.totalElements > 0) {
                $state.go('hotel-search', {
                    "searchOptions": vm.searchOptions,
                    "searchResult": vm.searchResult,
                    "searchCompleted": true,
                    "filterCompleted": false,
                    "params": Base64.encodeJson(vm.searchOptions)
                });
            } else {
                $state.go('hotel-search', {
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
                messageResult = 'Email kh�ng du?c d? tr?ng.';
            } else {
                messageResult = 'Email d� t?n t?i tr�n h? th?ng.';
                if (isEmail(email) != false) {
                    Subscribed.Subscribed(email, phone).then(function(result) {
                        if (result.id) {
                            $('.form-subscrice .messageResult').html('�ang k� th�nh c�ng.');
                            $('.form-subscrice .messageResult').removeClass('Error');
                            $('.form-subscrice .messageResult').addClass('success');
                        } else {
                            $('.form-subscrice .messageResult').html('Email d� t?n t?i tr�n h? th?ng.');
                            $('.form-subscrice .messageResult').removeClass('success');
                            $('.form-subscrice .messageResult').addClass('Error');
                        }
                    });
                } else {
                    messageResult = 'Email kh�ng h?p l?.';
                }
            }
            $('.form-subscrice .messageResult').html(messageResult);
            $('.form-subscrice .messageResult').removeClass(classRemove);
            $('.form-subscrice .messageResult').addClass(classAdd);
        };

        vm.switchHotel = function(id) {
            vm.topHotelIdx = id;
        };

        vm.setupControl();

    }
})();