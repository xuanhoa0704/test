(function() {
    'use strict';

    gtdHotelSearchDatePaginatorController.$inject = ['$log', '$scope', 'MetaData', 'Hotel'];

    function gtdHotelSearchDatePaginatorController($log, $scope, MetaData, Hotel) {
        var ctrl = this;

        var slideOpts = {
            "slidesToShow": 5,
            "slidesToScroll": 2,
            infinite: false,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
                // You can unslick at a given breakpoint now by adding:
                // settings: "unslick"
                // instead of a settings object
            ]
        };

        $scope.$on('ngRepeatDateOptionsFinished', function() {
            // alert('on ngRepeatDateOptionsFinished');
            ctrl.initControl();
        });

        $scope.$on('gtd-hotel-search-date-paginator-init', function() {
            // alert('on gtd-hotel-search-date-paginator-init');
            ctrl.dateCarouselArrays = Hotel.getDateAvailableOptions();
            //ctrl.initControl();
        });

        ctrl.initControl = function() {
            // alert('reinit');
            $('.hotel-search-paginator').slick('unslick'); /* ONLY remove the classes and handlers added on initialize */
            $('.my-slide').remove(); /* Remove current slides elements, in case that you want to show   new slides. */
            $('.hotel-search-paginator').slick(slideOpts); /* Initialize the slick again */
        };

        $('.hotel-search-paginator').slick(slideOpts);

    }

    var gtdHotelSearchDatePaginator = {
        templateUrl: 'app/components/hotel/hotel-search-date-paginator.html',
        controller: gtdHotelSearchDatePaginatorController,
        bindings: {
            searchResult: '='
        }
    };

    angular
        .module('B2B2CGatewayApp')
        .component('gtdHotelSearchDatePaginator', gtdHotelSearchDatePaginator);

})();