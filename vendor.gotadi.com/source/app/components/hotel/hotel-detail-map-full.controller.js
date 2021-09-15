(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelDetailMapFullController', HotelDetailMapFullController);

    HotelDetailMapFullController.$inject = [
        '$log', '$rootScope', '$scope', '$state', '$timeout', '$compile', 'UIService',
        'Auth', '$uibModalInstance', 'DataService', 'Hotel', 'DialogService', 'Base64', 'GtdHotelService',
        'SEARCH_BY_HOTEL_NAME', 'HOTEL_STATES', 'GlobalSrv', '$window', '$translate'
    ];

    function HotelDetailMapFullController(
        $log, $rootScope, $scope, $state, $timeout, $compile, UIService,
        Auth, $uibModalInstance, DataService, Hotel, DialogService, Base64, GtdHotelService,
        SEARCH_BY_HOTEL_NAME, HOTEL_STATES, GlobalSrv, $window, $translate) {

        var vm = this;

        vm.makerDict = {};

        vm.changeLanguage = changeLanguage;
        vm.initMap = initMap;
        vm.intMapInforWindow = intMapInforWindow;
        vm.onInit = onInit;
        vm.openMapInfoWindow = openMapInfoWindow;
        vm.closeMapInfoWindow = closeMapInfoWindow;
        vm.startMarkerBounce = startMarkerBounce;
        vm.endMarkerBounce = endMarkerBounce;
        vm.onHoverHotelItem = onHoverHotelItem;
        vm.outHoverHotelItem = outHoverHotelItem;

        // Default show nothing
        vm.displayState = null;

        vm.hotelStates = GtdHotelService.getStates();

        vm.onInit();

        function changeLanguage() {
            $translate.use(vm.language);
            tmhDynamicLocale.set(vm.language);
        };
        vm.cancel = function() {
            UIService.showBodyScroll();
            vm.listener();
            $uibModalInstance.dismiss('cancel');
        };

        vm.close = function() {
            $('#hotel_template_click').hide();
        };


        function onInit() {
            UIService.hideBodyScroll();
            vm.intMapInforWindow();

            GtdHotelService.smartSearch();

            vm.listener = $rootScope.$on(HOTEL_STATES, function(event, newValue) {
                if (!newValue) {
                    return;
                }
                switch (newValue.state) {
                    case vm.hotelStates.SHOW_LOADING:
                    case vm.hotelStates.SEARCH_ERROR:
                    case vm.hotelStates.HIDE_LOADING:
                        vm.displayState = newValue.state;
                        break;
                    case vm.hotelStates.FINISH_SEARCH:
                        vm.displayState = newValue.state;
                        vm.hotels = newValue.payload.hotels;
                        vm.initMap();
                        break;
                    case vm.hotelStates.CHANGE_SEARCH_FILTER:
                        vm.searchOptions = newValue.payload;
                        // vm.updatePaxDisplay();
                        break;
                    default:
                        break;
                }
            });
        }

        function intMapInforWindow() {
            vm.mouseoverInfoWindow = new google.maps.InfoWindow();
        }

        function openMapInfoWindow(marker) {
            $scope.hotelModel = marker.meta;
            $scope.$apply();
            var template = $('#hotel_template_hover').html();
            vm.mouseoverInfoWindow.setContent(template);
            vm.mouseoverInfoWindow.open(vm.map, marker);
        }

        function closeMapInfoWindow() {
            vm.mouseoverInfoWindow.close();
        }

        vm.clickedContent = function(hotel) {
            var content = document.createElement('div');
            content.innerHTML = $('#hotel_template_click').html();

            if (hotel.products && hotel.products.length > 0 && hotel.products[0].rooms && hotel.products[0].rooms[0]) {
                var button = content.appendChild(document.createElement('input'));
                button.type = 'button';
                button.value = 'Chọn phòng';
                button.className = 'booking-text gtd-btn-medium pull-right';
                button.style = "float: left !important";
                google.maps.event.addDomListener(button, 'click', function() {
                    vm.bookingClicked(hotel);
                    vm.cancel();
                });
            }
            return content;
        };
        vm.clickIdx = 0;

        function initMap() {

            vm.selectedhotel = vm.hotels[0];
            vm.selectedhoteldetail = vm.hotels[0];
            vm.makerDict = {}; //reset

            // MAP
            vm.map = new google.maps.Map(
                document.getElementById('gmap-full-zone'), {
                    gestureHandling: 'greedy',
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: true
                });

            var bounds = new google.maps.LatLngBounds();

            angular.forEach(vm.hotels, function(hotel) {

                if (hotel.hotelMeta && hotel.hotelMeta.latitude && hotel.hotelMeta.longitude) {

                    var marker = new google.maps.Marker({
                        map: vm.map,
                        position: {
                            lat: hotel.hotelMeta.latitude,
                            lng: hotel.hotelMeta.longitude
                        },
                        title: hotel.hotelMeta.name,
                        meta: hotel,
                        icon: {
                            url: '/content/images/gtd-marker.svg',
                            scaledSize: new google.maps.Size(32, 45)
                        }
                    });

                    marker.addListener('mouseover', function() {
                        vm.openMapInfoWindow(marker);
                    });

                    marker.addListener('mouseout', function() {
                        vm.closeMapInfoWindow();
                    });

                    marker.addListener('click', function() {
                        GtdHotelService.goToDetail(hotel);
                    });

                    bounds.extend(marker.getPosition());
                    vm.makerDict[hotel.id] = marker;
                }

            });

            vm.map.fitBounds(bounds);



            // var pyrmont = new google.maps.LatLng(vm.hotels[0].hotelMeta.latitude, vm.hotels[0].hotelMeta.longitude);
            // map = new google.maps.Map(document.getElementById('gmap-full-zone'), {
            //     center: pyrmont,
            //     zoom: 15
            // });
            // var request = {
            //     location: pyrmont,
            //     radius: '500',
            //     type: ['restaurant']
            // };

            // service = new google.maps.places.PlacesService(map);
            // service.nearbySearch(request, callback);

        }

        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    console.log(results[i]);
                    createMarkers(results[i])
                }

                createMarkers(results);
            }
        }

        function createMarkers(places) {
            var bounds = new google.maps.LatLngBounds();
            // var placesList = document.getElementById('places');

            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };

                var marker = new google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location
                });

                // var li = document.createElement('li');
                // li.textContent = place.name;
                // placesList.appendChild(li);

                bounds.extend(place.geometry.location);
            }
            map.fitBounds(bounds);
        }

        function endMarkerBounce(marker) {
            marker.setAnimation(null);
            var pinIcon = new google.maps.MarkerImage(
                "/content/images/gtd-marker.svg",
                null, /* size is determined at runtime */
                null, /* origin is 0,0 */
                null, /* anchor is bottom center of the scaled image */
                new google.maps.Size(32, 45)
            );
            marker.setIcon(pinIcon);
        }

        function startMarkerBounce(marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            var pinIcon = new google.maps.MarkerImage(
                "/content/images/gtd-marker.svg",
                null, /* size is determined at runtime */
                null, /* origin is 0,0 */
                null, /* anchor is bottom center of the scaled image */
                new google.maps.Size(40, 55)
            );
            marker.setIcon(pinIcon);
        }


        function onHoverHotelItem(item) {
            vm.startMarkerBounce(vm.makerDict[item.id]);

        }

        function outHoverHotelItem(item) {
            vm.endMarkerBounce(vm.makerDict[item.id]);
        }


        vm.bookingClicked = function(item) {
            GtdHotelService.goToDetail(item);
        };

    }
})();