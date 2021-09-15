(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('HotelPlaceAroundController', HotelPlaceAroundController);

    HotelPlaceAroundController.$inject = [
        '$timeout', 'UIService',
        'Auth', '$uibModalInstance', 'DataService', 'Hotel', 'DialogService', 'Base64', 'GtdHotelService', 'selectedHotel'
    ];

    function HotelPlaceAroundController(
        $timeout, UIService,
        Auth, $uibModalInstance, DataService, Hotel, DialogService, Base64, GtdHotelService, selectedHotel) {

        var RESTAURANT_FILTER = 'Quán bar';

        var vm = this;
        vm.map;
        vm.service;
        vm.makerDict = {};
        vm.restaurantsLst = [];
        vm.storesLst = [];
        vm.resultlst = [];
        vm.displayDetail = false;

        vm.filterOptions = {
            restaurant: 'Restaurant',
            coffee: 'Coffee',
            bar: 'Bar',
            groceries: 'Groceries'
        };

        vm.timer;

        vm.selectedPlace = {};
        vm.selectedPlaceImage = "";

        vm.initMap = initMap;
        vm.intMapInforWindow = intMapInforWindow;
        vm.onInit = onInit;
        vm.openMapInfoWindow = openMapInfoWindow;
        vm.closeMapInfoWindow = closeMapInfoWindow;
        vm.startMarkerBounce = startMarkerBounce;
        vm.endMarkerBounce = endMarkerBounce;
        vm.onHoverHotelItem = onHoverHotelItem;
        vm.outHoverHotelItem = outHoverHotelItem;
        vm.calDistance = calDistance;
        vm.closeDetail = closeDetail;
        vm.onClickHotelItem = onClickHotelItem;
        vm.filterNearBy = filterNearBy;
        vm.clearMarkers = clearMarkers;
        vm.markerClick = markerClick;


        // Default show nothing

        vm.cancel = function() {
            UIService.showBodyScroll();
            $uibModalInstance.dismiss('cancel');
        };

        vm.close = function() {
            $('#hotel_template_click').hide();
        };

        $uibModalInstance.opened.then(function() {
            $timeout(function() {
                vm.onInit();
                vm.initMap();
            }, 0);
        });

        function onInit() {
            UIService.hideBodyScroll();
            vm.intMapInforWindow();
        }

        function intMapInforWindow() {
            vm.mouseoverInfoWindow = new google.maps.InfoWindow();
        }

        function initMap() {
            vm.makerDict = {}; //reset
            vm.hotelPosition = new google.maps.LatLng(selectedHotel.hotelMeta.latitude, selectedHotel.hotelMeta.longitude);

            // MAP
            vm.map = new google.maps.Map(
                document.getElementById('gmap-full-zone'), {
                    center: vm.hotelPosition,
                    zoom: 15,
                    gestureHandling: 'greedy',
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: true
                });

            var marker = new google.maps.Marker({
                map: vm.map,
                icon: {
                    url: '/content/images/gtd-marker.svg',
                    scaledSize: new google.maps.Size(32 * 1.5, 45 * 1.5)
                },
                optimized: false,
                title: selectedHotel.hotelMeta.name,
                position: {
                    lat: selectedHotel.hotelMeta.latitude,
                    lng: selectedHotel.hotelMeta.longitude
                }
            });
            marker.setAnimation(google.maps.Animation.BOUNCE);

            vm.directionsService = new google.maps.DirectionsService;
            vm.directionsDisplay = new google.maps.DirectionsRenderer;
            vm.directionsDisplay.setMap(vm.map);

            // var myoverlay = new google.maps.OverlayView();
            // myoverlay.draw = function () {
            //     myoverlay.getPanes().markerLayer.id = 'markerLayer';
            // };
            // myoverlay.setMap(vm.map);

            vm.filterNearBy(vm.filterOptions.restaurant);

        }

        function calculateAndDisplayRoute(start, end) {
            vm.directionsService.route({
                origin: start,
                destination: end,
                travelMode: 'DRIVING'
            }, function(response, status) {
                if (status === 'OK') {
                    vm.directionsDisplay.setDirections(response);
                    vm.selectedItemDistance = response.routes[0].legs[0].distance.text;
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }

        function filterNearBy(keyword) {
            var filterRequest = {
                location: vm.hotelPosition,
                radius: '500',
                query: keyword
            };

            vm.selectedType = keyword;

            vm.service = new google.maps.places.PlacesService(vm.map);
            vm.service.textSearch(filterRequest, callbackFilterResult);
        }

        function callbackFilterResult(results, status) {
            $timeout(function() {
                vm.resultlst = results;
                console.log("RESULT");
                console.log(vm.resultlst);
            }, 0);
            vm.clearMarkers();
            createMarkers(results, vm.selectedType);
        }

        function clearMarkers() {
            Object.keys(vm.makerDict).forEach(function(key) {
                vm.makerDict[key].setMap(null);
                delete vm.makerDict[key];
            });
        }

        function callback(results, status, type) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                switch (type) {
                    case 'store':
                        $timeout(function() {
                            vm.storesLst = results;
                            console.log("STORE");
                            console.log(vm.storesLst);
                        }, 0);

                        break;
                    case RESTAURANT_FILTER:
                        $timeout(function() {
                            vm.restaurantsLst = results;
                            console.log("RESTAURANT");
                            console.log(vm.restaurantsLst);
                        }, 0);

                        break;
                    default:
                        break;
                }
                createMarkers(results);
            }
        }

        function callbackStore(results, status) {
            callback(results, status, 'store');
        }

        function callbackRestaurant(results, status) {
            callback(results, status, RESTAURANT_FILTER);
        }

        function createMarkers(places, type) {
            var bounds = new google.maps.LatLngBounds();
            // var placesList = document.getElementById('places');

            var iconUrl = null;

            switch (type) {
                case vm.filterOptions.bar:
                    iconUrl = '/content/images/marker-maps-gtd-bar.svg';
                    break;
                case vm.filterOptions.restaurant:
                    iconUrl = '/content/images/marker-maps-gtd-restaurant.svg';
                    break;
                case vm.filterOptions.coffee:
                    iconUrl = '/content/images/marker-maps-gtd-coffee.svg';
                    break;
                case vm.filterOptions.groceries:
                    iconUrl = '/content/images/marker-maps-shop.svg';
                    break;
                default:
                    iconUrl = null;
                    break;
            }

            for (var i = 0, place; place = places[i]; i++) {
                var image = {
                    url: iconUrl ? iconUrl : place.icon,
                    scaledSize: new google.maps.Size(40, 40),
                };

                // if (vm.makerDict[place.place_id]) {
                //     continue;
                // }

                var marker = new google.maps.Marker({
                    map: vm.map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location,
                    optimized: false,
                    place_id: place.place_id
                });

                vm.makerDict[place.place_id] = marker;

                // google.maps.event.addListener(vm.makerDict[place.place_id], 'click', function () {

                // });
                google.maps.event.addListener(marker, 'click', handleMarkerClick.bind(undefined, marker, i));


                // marker.addListener('click', function () {

                // });


                bounds.extend(place.geometry.location);
            }
            vm.map.fitBounds(bounds);

        }

        function handleMarkerClick(marker, index) {
            vm.markerClick(marker.place_id);
        }

        function openMapInfoWindow(marker) {
            var template = $('#hotel_template_hover').html();
            vm.mouseoverInfoWindow.setContent(template);
            vm.mouseoverInfoWindow.open(vm.map, marker);
        }

        function closeMapInfoWindow() {
            vm.mouseoverInfoWindow.close();
        }

        function endMarkerBounce(marker) {
            marker.setAnimation(null);
        }

        function startMarkerBounce(marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }

        function onHoverHotelItem(item, type) {
            vm.startMarkerBounce(vm.makerDict[item.place_id]);
        }

        function markerClick(id) {
            $timeout(function() {
                var index = vm.resultlst.findIndex(function(item) {
                    return item.place_id === id;
                });
                onClickHotelItem(vm.resultlst[index], vm.selectedType);
            }, 0);
        }

        function onClickHotelItem(item, type) {
            vm.displayDetail = false;
            $timeout.cancel(vm.timer);
            vm.timer = $timeout(function() {
                vm.selectedPlaceType = type;
                vm.displayDetail = true;
                vm.selectedPlace = item;
                vm.selectedPlaceImage = item.photos[0].getUrl();
                calculateAndDisplayRoute(vm.hotelPosition, vm.selectedPlace.geometry.location);
            }, 500);


        }

        function outHoverHotelItem(item) {
            vm.endMarkerBounce(vm.makerDict[item.place_id]);
        }

        function closeDetail() {
            vm.displayDetail = false;
            vm.selectedPlace = null;
        }


        var rad = function(x) {
            return x * Math.PI / 180;
        };

        var getDistance = function(p1, p2) {
            var R = 6378137; // Earth’s mean radius in meter
            var dLat = rad(p2.lat() - p1.lat());
            var dLong = rad(p2.lng() - p1.lng());
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d / 1000; // returns the distance in kilo-meter
        };

        function calDistance() {
            return getDistance(vm.hotelPosition, vm.selectedPlace.geometry.location);
        }

    }
})();