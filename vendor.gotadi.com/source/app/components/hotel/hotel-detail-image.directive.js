(function() {
    'use strict';

    gtdHotelDetailImageController.$inject = ['$log', '$scope', '$timeout', '$uibModal', 'MetaData', 'Hotel'];

    function gtdHotelDetailImageController($log, $scope, $timeout, $uibModal, MetaData, Hotel) {
        var ctrl = this;

        var modalInstance = null;
        var resetModal = function() {
            modalInstance = null;
        };

        ctrl.currentImage;

        ctrl.changeImage = changeImage;
        ctrl.toggleShowMoreImage = toggleShowMoreImage;


        $scope.$on('gtd-load-details-completed', function() {

            ctrl.hotelModel.hotelImages.forEach(function(image) {
                ctrl.swiper.appendSlide('<div class="swiper-slide">' +
                    '<img data-src="' + image.orginal + '" class="swiper-lazy">' +
                    '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>' +
                    '</div>');
            });

            ctrl.changeImage(1);


            // MAP
            // console.log(ctrl.hotelModel);

            // if (ctrl.hotelModel && ctrl.hotelModel.hotelMeta && ctrl.hotelModel.hotelMeta.latitude && ctrl.hotelModel.hotelMeta.longitude) {
            //     var mapMarker = function () {
            //         var map = new GMaps({
            //             div: '#gmap_zone',
            //             lat: ctrl.hotelModel.hotelMeta.latitude,
            //             lng: ctrl.hotelModel.hotelMeta.longitude
            //         });

            //         var mouseoverInfoWindow = new google.maps.InfoWindow();
            //         mouseoverInfoWindow.setContent($('#hotel_template_hover').html());

            //         $log.log("+++ Add Marker: Hotel: " + ctrl.hotelModel.hotelMeta.name
            //             + ", latitude: " + ctrl.hotelModel.hotelMeta.latitude
            //             + ", longitude: " + ctrl.hotelModel.hotelMeta.longitude);

            //         var marker = map.addMarker({
            //             lat: ctrl.hotelModel.hotelMeta.latitude,
            //             lng: ctrl.hotelModel.hotelMeta.longitude,
            //             title: ctrl.hotelModel.hotelMeta.name,
            //             icon: {
            //                 url: '/content/images/map-marker.png'
            //             },
            //             // infoWindow: {
            //             //     content: content
            //             //     // content: i
            //             // },
            //             mouseover: function (e) {
            //                 mouseoverInfoWindow.open(this.map, this);
            //             },
            //             mouseout: function () {
            //                 //mouseoverInfoWindow.close();
            //             },
            //             click: function () {
            //                 //mouseoverInfoWindow.close();
            //                 ctrl.openFullMap();
            //             }
            //         });

            //         mouseoverInfoWindow.open(map, marker);

            //         map.setZoom(15);
            //     };
            //     mapMarker();
            // }

        });

        function changeImage(index) {
            ctrl.swiper.slideTo(index);
            ctrl.currentImage = index;
        }

        ctrl.limitImage = 10;
        ctrl.isShowingMoreImage = false;

        function toggleShowMoreImage() {
            ctrl.isShowingMoreImage = !ctrl.isShowingMoreImage;
            if (ctrl.isShowingMoreImage) {
                ctrl.limitImage = ctrl.hotelModel.hotelImages.length;
            } else {
                ctrl.limitImage = 10;
            }
        }



        this.$postLink = function() {

            ctrl.swiper = new Swiper('.swiper-container', {
                // Enable lazy loading
                lazy: true,
                loop: true,
                // autoplay: {
                //     delay: 2500,
                //     disableOnInteraction: false,
                // },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });

            ctrl.swiper.on('transitionEnd', function() {
                $timeout(
                    function() {
                        ctrl.currentImage = ctrl.swiper.activeIndex;

                    }, 0
                );
            });
        };

        ctrl.openFullMap = function() {
            if (modalInstance !== null) return;
            modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/components/hotel/hotel-detail-map-full.html',
                controller: 'HotelDetailMapFullController',
                controllerAs: 'vm',
                windowClass: 'hotel-detail-map-full-window',
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('flight');
                        $translatePartialLoader.addPart('hotel');
                        return $translate.refresh();
                    }],
                    selectedhotel: this.hotelModel
                }
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        };
    }

    var gtdHotelDetailImage = {
        templateUrl: 'app/components/hotel/hotel-detail-image.html',
        controller: gtdHotelDetailImageController,
        bindings: {
            hotelModel: '=',
            searchOptions: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelDetailImage', gtdHotelDetailImage);

})();