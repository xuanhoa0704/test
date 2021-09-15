(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .factory('DataService', DataService);

    DataService.$inject = ['$resource', '$localStorage'];

    function DataService($resource, $localStorage) {

        var _startTransactionTime;

        var _searchOptions;
        var _searchResult;
        var _advanceSearchFilterOptions;
        var _departSearchOptions;
        var _departSearchResult;
        var _returnSearchOptions;
        var _returnSearchResult;
        var _departFlight;
        var _returnFlight;
        var _savedSearchOptions;

        var _departGroupItem;
        var _departPricedItinerary;

        var _orgDepartGroupItem;
        var _orgDepartPricedItinerary;

        var _returnGroupItem;
        var _returnPricedItinerary;

        var _bookingModel;
        var _paymentModel;

        var _hotelSearchOptions;
        var _hotelAdvanceSearchFilterOptions;
        var _hotelSearchResult;
        var _selectedHotel;
        var _selectedHotelAvail;
        var _selectedHotelProduct;
        var _selectedHotelRoom;
        var _hotelBookingModel;
        var _hotelPaymentModel;
        var _hotelSavedSearchOptions;

        return {
            // SAVED Search options
            getSavedSearchOption: function() {
                var model = $localStorage.savedSearchOptions;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setSavedSearchOption: function(value) {
                    // _searchOptions = value;
                    $localStorage.savedSearchOptions = value;
                }

                // HOTEL SAVED Search options
                ,
            getHotelSavedSearchOption: function() {
                var model = $localStorage.hotelSavedSearchOptions;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setHotelSavedSearchOption: function(value) {
                    // _searchOptions = value;
                    $localStorage.hotelSavedSearchOptions = value;
                }

                // FLIGHT
                ,
            getSearchOption: function() {
                // var model = _searchOptions;
                // if (model == undefined || model == null) {
                //     model = {}
                // }
                // return model;

                var model = $localStorage.searchOptions;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setSearchOption: function(value) {
                    // _searchOptions = value;
                    $localStorage.searchOptions = value;
                }

                ,
            getSearchResult: function() {
                var model = _searchResult;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            setSearchResult: function(value) {
                    _searchResult = value;
                }

                // Advance search filter options
                ,
            getAdvanceSearchFilterOptions: function() {
                var model = _advanceSearchFilterOptions;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            setAdvanceSearchFilterOptions: function(values) {
                    _advanceSearchFilterOptions = values;
                }

                // Depart search
                ,
            getDepartSearchOption: function() {
                // var model = _departSearchOptions;
                // if (model == undefined || model == null) {
                //     model = {}
                // }
                // return model;

                var model = $localStorage.departSearchOptions;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setDepartSearchOption: function(value) {
                    $localStorage.departSearchOptions = value;
                }

                ,
            getDepartSearchResult: function() {
                var model = _departSearchResult;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setDepartSearchResult: function(value) {
                    _departSearchResult = value;
                }

                // Return search
                ,
            getReturnSearchOption: function() {
                // var model = _returnSearchOptions;
                // if (model == undefined || model == null) {
                //     model = {}
                // }
                // return model;
                var model = $localStorage.returnSearchOptions;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setReturnSearchOption: function(value) {
                    // _returnSearchOptions = value;
                    $localStorage.returnSearchOptions = value;
                }

                ,
            getReturnSearchResult: function() {
                var model = _returnSearchResult;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setReturnSearchResult: function(value) {
                    _returnSearchResult = value;
                }

                ,
            getDepartFlight: function() {
                var model = _departFlight;
                if (model == undefined || model == null) {
                    model = {};
                }

                return model;
            },
            setDepartFlight: function(value) {
                    _departFlight = value;
                }

                ,
            getReturnFlight: function() {
                var model = _returnFlight;
                if (model == undefined || model == null) {
                    model = {};
                }

                return model;
            },
            setReturnFlight: function(value) {
                    _returnFlight = value;
                }

                ,
            getDepartGroupItem: function() {
                var model = _departGroupItem;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setDepartGroupItem: function(value) {
                    _departGroupItem = value;
                }

                ,
            getDepartPricedItinerary: function() {
                var model = _departPricedItinerary;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setDepartPricedItinerary: function(value) {
                    _departPricedItinerary = value;
                }

                ,
            getOrgDepartGroupItem: function() {
                var model = _orgDepartGroupItem;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setOrgDepartGroupItem: function(value) {
                    _orgDepartGroupItem = value;
                }

                ,
            getOrgDepartPricedItinerary: function() {
                var model = _orgDepartPricedItinerary;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setOrgDepartPricedItinerary: function(value) {
                    _orgDepartPricedItinerary = value;
                }

                ,
            getReturnGroupItem: function() {
                var model = _returnGroupItem;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setReturnGroupItem: function(value) {
                    _returnGroupItem = value;
                }

                ,
            getReturnPricedItinerary: function() {
                var model = _returnPricedItinerary;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setReturnPricedItinerary: function(value) {
                    _returnPricedItinerary = value;
                }

                ,
            getBookingModel: function() {
                var model = _bookingModel;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setBookingModel: function(value) {
                    _bookingModel = value;
                }

                ,
            getPaymentModel: function() {
                var model = _paymentModel;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setPaymentModel: function(value) {
                    _paymentModel = value;
                }

                // HOTELS
                ,
            getHotelSearchOptions: function() {
                // var model = _hotelSearchOptions;
                // if (model == undefined || model == null) {
                //     model = {}
                // }
                // return model;
                var model = $localStorage.hotelSearchOptions;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setHotelSearchOptions: function(value) {
                    $localStorage.hotelSearchOptions = value;
                }

                ,
            getHotelSearchResult: function() {
                var model = _hotelSearchResult;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setHotelSearchResult: function(value) {
                    _hotelSearchResult = value;
                }

                // Advance search filter options
                ,
            getHotelAdvanceSearchFilterOptions: function() {
                var model = _hotelAdvanceSearchFilterOptions;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            setHotelAdvanceSearchFilterOptions: function(values) {
                    _hotelAdvanceSearchFilterOptions = values;
                }

                ,
            getSelectedHotel: function() {
                var model = _selectedHotel;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setSelectedHotel: function(value) {
                    _selectedHotel = value;
                }

                ,
            getSelectedHotelAvail: function() {
                var model = _selectedHotelAvail;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setSelectedHotelAvail: function(value) {
                    _selectedHotelAvail = value;
                }

                ,
            getSelectedHotelProduct: function() {
                var model = _selectedHotelProduct;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setSelectedHotelProduct: function(value) {
                    _selectedHotelProduct = value;
                }

                ,
            getSelectedHotelRoom: function() {
                var model = _selectedHotelRoom;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setSelectedHotelRoom: function(value) {
                    _selectedHotelRoom = value;
                }

                ,
            getHotelBookingModel: function() {
                var model = _hotelBookingModel;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setHotelBookingModel: function(value) {
                    _hotelBookingModel = value;
                }

                ,
            getHotelPaymentModel: function() {
                var model = _hotelPaymentModel;
                if (model == undefined || model == null) {
                    model = {};
                }
                return model;
            },
            setHotelPaymentModel: function(value) {
                    _hotelPaymentModel = value;
                }

                // PROFILE
                ,
            getAllAirlines: function() {
                var model = $localStorage.allAirlines;
                if (model == undefined || model == null) {
                    model = [];
                }
                return model;
            },
            setAllAirlines: function(value) {
                    $localStorage.allAirlines = value;
                }

                ,
            getStartTransactionTime: function() {
                var model = _startTransactionTime;
                if (model == undefined || model == null) {
                    _startTransactionTime = new Date();
                }
                return _startTransactionTime;
            },
            setStartTransactionTime: function(value) {
                _startTransactionTime = value;
            },
            setNewStartTransactionTime: function() {
                _startTransactionTime = new Date();
            }

        };
    }
})();