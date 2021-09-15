(function() {
    'use strict';

    angular
        .module('B2B2CGatewayApp')
        .controller('ExternalBookingResultController', ExternalBookingResultController);

    ExternalBookingResultController.$inject = ['$log', '$state', 'DataService', 'CustomerService', 'FlightUtils', 'Base64', 'partnerID'];

    function ExternalBookingResultController($log, $state, DataService, CustomerService, FlightUtils, Base64, partnerID) {

        var vm = this;

        // Dynamic string will be get from URL
        vm.payMethod = 'ViettelPay';
        vm.payType = '';
        vm.partnerID = null;
        vm.backUrl = null;
        vm.errorCode = null;
        vm.returnBookingModel = {};

        // Define states will be display in UI.
        vm.uiStates = {
            paymentRefund: "[ExternalBookingResult] Payment REFUNDED",
            paymentFailed: "[ExternalBookingResult] Payment FAILED",
            paymentSuccess: "[ExternalBookingResult] Payment SUCESS",
            paymentPending: "[ExternalBookingResult] Payment PENDING",
            paymentExpired: "[ExternalBookingResult] Payment EXPIRED",
            paymentSuccessOnprocess: "[ExternalBookingResult] Payment SUCCESS-ONPROGRESS",
            notfound: "[ExternalBookingResult] NOTFOUND",
            error: "[ExternalBookingResult] ERROR",
            loading: "[ExternalBookingResult] LOADING",
        };

        vm.displayType = {
            hotel: "[ExternalBookingResult] HOTEL",
            flight: "[ExternalBookingResult] FLIGHT",
        };

        vm.errorMessageDict = {};


        vm.currentDisplayType = "";

        vm.updateUIState = updateUIState;
        vm.udpateType = udpateType;
        vm.getBooking = getBooking;
        vm.initController = initController;
        vm.initErrorMessageDict = initErrorMessageDict;

        // Set default UI State
        vm.currentUIState = vm.uiStates.loading;

        $log.log('------- ExternalBookingResultController - $state.params:');
        $log.log($state.params);

        vm.parram = $state.params;

        vm.bookingNumber = null;

        vm.initController();

        function initController() {
            try {
                vm.bookingNumber = vm.parram.order_id || vm.parram.booking_number;

                vm.partnerID = vm.parram.partner_id || partnerID;

                vm.backUrl = vm.parram.back_url || "#";

                vm.errorCode = vm.parram.error_code || null;

                $log.log("vm.partnerID");
                $log.log(vm.partnerID);

                switch (vm.partnerID) {
                    case "VIETTEL":
                        vm.payMethod = "ViettelPay";
                        vm.payType = 'ví điện tử';
                        break;
                    case "LIENVIETBANK":
                        vm.payMethod = "Ví Việt";
                        vm.payType = 'ví điện tử';
                        break;
                    default:
                        vm.payMethod = vm.partnerID;
                        vm.payType = 'tài khoản';
                        break;
                }

                if (vm.bookingNumber !== null) {
                    // vm.bookingNumber = Base64.decodeString(vm.bookingNumber);
                    vm.getBooking(vm.bookingNumber);
                }
            } catch (error) {
                vm.updateUIState(vm.uiStates.notfound);
            }
            vm.initErrorMessageDict();
        }

        function initErrorMessageDict() {
            vm.errorMessageDict = {
                "INVALID_SIGNATURE": "Sai thông tin chữ ký điện tử ",
                "PAY-0001": "Tài khoản nguồn không tồn tại",
                "PAY-0002": "Tài khoản nguồn đã bị đóng",
                "PAY-0003": "Tài khoản nguồn đã bị khóa do khách hàng yêu cầu",
                "PAY-0004": "Tài khoản nguồn đã bị khóa bởi hệ thống",
                "PAY-0005": "Tài khoản nguồn đã bị đóng băng",
                "PAY-0006": "Tài khoản nguồn đang ở trạng thái chờ duyệt",
                "PAY-0007": "Tài khoản nguồn không đủ tiền",
                "PAY-0008": "Tài khoản nguồn không được phép ghi nợ",
                "PAY-0009": "Tài khoản thụ hưởng không hợp lệ",
                "PAY-0010": "Tài khoản nguồn trùng tài khoản thụ hưởng",
                "PAY-0011": "Tài khoản đăng nhập đã bị đóng hoặc không tồn tại. Hệ thống sẽ tự động đăng xuất",
                "PAY-0012": "Tài khoản đăng nhập đang ở trạng thái chờ duyệt. Hệ thống sẽ tự động đăng xuất",
                "PAY-0013": "Tài khoản đăng nhập đã bị khóa. Hệ thống sẽ tự động đăng xuất",
                "PAY-0014": "Khách hàng đang ở trạng thái chờ duyệt. Hệ thống sẽ tự động đăng xuất",
                "PAY-0015": "Khách hàng đã bị khóa. Hệ thống sẽ tự động đăng xuất",
                "PAY-0016": "Hệ thống đang tạm ngừng cung cấp dịch vụ",
                "PAY-0017": "ch vụ đang được nâng cấp, vui lòng thử lại sau",
                "PAY-0018": "Lỗi xử lý giao dịch",
                "PAY-0019": "Số tiền thanh toán vượt quá hạn mức/giao dịch",
                "PAY-0020": "Tài khoản đã thực hiện vượt quá hạn mức/ngày",
                "PAY-0021": "Tài khoản thực hiện quá số lần giao dịch/ngày",
                "PAY-0022": "Số tiền thực hiện nhỏ hơn hạn mức tối thiểu tài khoản",
                "PAY-0023": "Số tiền chuyển vượt quá hạn mức tối đa tài khoản thụ hưởng",
                "PAY-0024": "Thời gian thực hiện giao dịch đã hết",
                "PAY-0025": "Quý khách nhập sai OTP quá 3 lần",
                "PAY-0026": "Giao dịch có mã " + vm.bookingNumber + " đã bị hủy hoặc không tồn tại",
                "PAY-0027": "Quý khách đã nhập sai mật khẩu 5 lần, Tài khoản đăng nhập bị khóa",
            };
        }


        function getBooking(bookingNumber) {
            CustomerService.getFinalBookingByNumber(bookingNumber).then(function(result) {

                switch (result.supplierType) {
                    case 'HOTEL':
                        handleHotel(result);
                        break;

                    default:
                        handleFlight(result);
                        break;
                }

            }, function error(result) {
                $log.log('flight-search');
                vm.updateUIState(vm.uiStates.notfound);
            });
        }

        function udpateType(type) {
            vm.currentDisplayType = type;
            switch (vm.currentDisplayType) {
                case vm.displayType.hotel:
                    vm.typeName = "phòng";
                    break;

                case vm.displayType.flight:
                    vm.typeName = "vé";
                    break;

                default:
                    vm.typeName = "dịch vụ";
                    break;
            }
        }

        function handleHotel(result) {
            vm.udpateType(vm.displayType.hotel);
            vm.bkgroup = result;
            $log.log("+++++ vm.bkgroup = ");
            $log.log(vm.bkgroup);

            vm.selectedHotel = vm.bkgroup.hotelAvailability;
            vm.selectedHotelProduct = vm.bkgroup.hotelAvailability.products[0];
            vm.selectedHotelRoom = vm.bkgroup.hotelAvailability.products[0].rooms[0];

            $log.log("+++ Hotel booking +++");
            //$log.log("selectedHotel=" + JSON.stringify(vm.selectedHotel));
            //$log.log("selectedHotelProduct=" + JSON.stringify(vm.selectedHotelProduct));
            //$log.log("selectedHotelRoom=" + JSON.stringify(vm.selectedHotelRoom));
            $log.log("selectedHotel=" + vm.selectedHotel);
            $log.log(vm.selectedHotel);
            $log.log("selectedHotelProduct=" + vm.selectedHotelProduct);
            $log.log(vm.selectedHotelProduct);
            $log.log("selectedHotelRoom=" + vm.selectedHotelRoom);
            $log.log(vm.selectedHotelRoom);

            var bookingStatus = result.bookingInfo.status;
            var paymentStatus = result.bookingInfo.paymentStatus;
            var issueStatus = result.bookingInfo.issuedStatus;
            var supplierBookingStatus = result.supplierBookingStatus;
            switch (paymentStatus) {
                case "FAILED":
                    vm.updateUIState(vm.uiStates.paymentFailed);
                    break;
                case "SUCCEEDED":
                    if (issueStatus === "SUCCEEDED") {
                        vm.updateUIState(vm.uiStates.paymentSuccess);
                        break;
                    }
                    if (issueStatus === "TICKET_ON_PROCESS") {
                        vm.updateUIState(vm.uiStates.paymentSuccessOnprocess);
                        break;
                    }
                    vm.updateUIState(vm.uiStates.paymentFailed);
                    break;
                case "REFUNDED":
                    vm.updateUIState(vm.uiStates.paymentRefund);
                    break;
                case "PENDING":
                    if (vm.errorCode) {
                        vm.updateUIState(vm.uiStates.paymentFailed);
                    } else {
                        vm.updateUIState(vm.uiStates.paymentPending);
                    }
                    break;

                default:
                    break;
            }
        }

        function handleFlight(result) {
            vm.udpateType(vm.displayType.flight);

            var oldVm = FlightUtils.convertBookingToVM(result);
            if (oldVm && oldVm.orgBookingModel && oldVm.orgBookingModel.bookingInfo) {
                // Check status 
                var bookingStatus = oldVm.orgBookingModel.bookingInfo.status;
                var paymentStatus = oldVm.orgBookingModel.bookingInfo.paymentStatus;
                var issueStatus = oldVm.orgBookingModel.bookingInfo.issuedStatus;
                var supplierBookingStatus = oldVm.orgBookingModel.bookingInfo.supplierBookingStatus;

                //process all status
                $log.log('bookingStatus=' + bookingStatus + ", paymentStatus = " + paymentStatus + ", issuedStatus = " + issueStatus + ", supplierBookingStatus = " + supplierBookingStatus);

                $log.log('VIEW - Booking Result');

                //+++ initial data
                vm.bookingModel = oldVm.orgBookingModel;
                vm.searchOptions = oldVm.searchOptions;

                // BACK 2U
                DataService.setBookingModel(vm.bookingModel);
                DataService.setSearchOption(vm.searchOptions);

                switch (paymentStatus) {
                    case "FAILED":
                        vm.updateUIState(vm.uiStates.paymentFailed);
                        break;
                    case "SUCCEEDED":
                        if (issueStatus === "SUCCEEDED") {
                            vm.updateUIState(vm.uiStates.paymentSuccess);
                            break;
                        }
                        if (issueStatus === "TICKET_ON_PROCESS") {
                            vm.updateUIState(vm.uiStates.paymentSuccessOnprocess);
                            break;
                        }
                        vm.updateUIState(vm.uiStates.paymentFailed);
                        break;
                    case "REFUNDED":
                        vm.updateUIState(vm.uiStates.paymentRefund);
                        break;
                    case "PENDING":
                        if (vm.errorCode) {
                            vm.updateUIState(vm.uiStates.paymentFailed);
                        } else {
                            vm.updateUIState(vm.uiStates.paymentPending);
                        }
                        break;

                    default:
                        break;
                }
            } else {
                $log.log('++++ Booking Not FOUND - GOTO - flight');
                vm.updateUIState(vm.uiStates.notfound);
            }

            /** BEGIN OLD CODE **/
            vm.bkgroup = result;

            if (vm.bkgroup) {

                var obj = vm.bkgroup;

                // Process contacts view
                var contactInfos = [];
                if (obj.travelerInfo) {
                    angular.forEach(obj.travelerInfo.contactInfos, function(value, key) {
                        var c = value;
                        contactInfos.push({
                            "ciEmail": c.email,
                            "ciName": c.firstName + " " + c.lastName,
                            // "ciMobileCode": c.phoneNumber1,
                            "ciMobileCode": "",
                            "ciMobile": c.phoneNumber1
                        });
                    });
                }

                obj.contacts = contactInfos;

                // Process customer view
                var customerInfos = [];
                if (obj.travelerInfo) {
                    angular.forEach(obj.travelerInfo.airTravelers, function(value, key) {
                        var c = value;

                        var cardType;
                        var cardNumber;
                        if (c.memberCards && c.memberCards[0]) {
                            cardType = c.memberCards[0].cardType;
                            cardNumber = c.memberCards[0].cardNumber;
                        }

                        customerInfos.push({
                            "cuDob": c.dateOfBirth,
                            "cuId": c.passport.passportNumber,
                            "cuPp": "Passport",
                            "cuName": c.passengerName.firstName,
                            "cuGender": c.passengerName.title,
                            "cuCardNo": c.frequentFlyerNumber,
                            "cuNationality": c.passport.country,
                            "cuFamilyName": c.passengerName.lastName
                        });

                    });
                }

                obj.customers = customerInfos;

                // Process tax view
                obj.biCompany = vm.taxCompanyName;
                obj.biMst = vm.taxNumber;
                obj.biMobile = vm.taxAddress2;
                obj.biAddress = vm.taxAddress1;

                // process payment view
                obj.departPricedItinerary = obj.groupPricedItineraries[0].pricedItineraries[0];
                obj.departGroupItem = obj.groupPricedItineraries[0];

                vm.searchOptions.searchType = 'oneway';

                if (obj.groupPricedItineraries && obj.groupPricedItineraries[1]) {
                    obj.returnGroupItem = obj.groupPricedItineraries[1];
                    obj.returnPricedItinerary = obj.groupPricedItineraries[1].pricedItineraries[0];

                    vm.searchOptions.searchType = 'roundtrip';
                } else if (obj.groupPricedItineraries[0].pricedItineraries[0].directionInd == 'RETURN') {
                    obj.returnGroupItem = obj.groupPricedItineraries[0];
                    obj.returnPricedItinerary = obj.groupPricedItineraries[0].pricedItineraries[0];

                    vm.searchOptions.searchType = 'roundtrip';
                }
                // Process flight view
                if (obj.departGroupItem.flightType == 'INTERNATIONAL') {
                    vm.searchOptions.dtype = 'international';

                    // Convert for view details -- DEPART
                    vm.flightModel = {};
                    vm.bookingModel.checkIn = obj.departPricedItinerary.originDestinationOptions[0].originDateTime;
                    vm.bookingModel.checkOut = obj.departPricedItinerary.originDestinationOptions[0].destinationDateTime;
                    vm.bookingModel.noOfTransit = obj.departPricedItinerary.originDestinationOptions[0].flightSegments.length;
                    vm.bookingModel.supplierName = obj.departGroupItem.airlineName;
                    vm.bookingModel.airline = obj.departGroupItem.airline;
                    vm.bookingModel.carrierNo = obj.departGroupItem.fightNo;
                    vm.bookingModel.originLocationCode = obj.departGroupItem.originLocationCode;
                    vm.bookingModel.destinationLocationCode = obj.departGroupItem.destinationLocationCode;
                    vm.bookingModel.duration = obj.departPricedItinerary.originDestinationOptions[0].journeyDuration;
                    vm.bookingModel.supplierCode = obj.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                    vm.bookingModel.cabinClassName = obj.departPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
                    vm.bookingModel.flightIdx = 1;
                    vm.bookingModel.searchType = vm.searchOptions.searchType;
                    vm.bookingModel.booking = {};
                    vm.bookingModel.travelerInfo = obj.travelerInfo;
                    vm.bookingModel.pricedItinerary = obj.departPricedItinerary;
                    vm.bookingModel.flightSegments = obj.departPricedItinerary.originDestinationOptions[0].flightSegments;
                    vm.bookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;

                    // Convert for view details -- RETURN
                    // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                    if (obj.returnPricedItinerary && obj.returnGroupItem) {
                        vm.returnBookingModel.bookingNumber = vm.bookingModel.bookingNumber;
                        vm.returnBookingModel.checkIn = obj.returnPricedItinerary.originDestinationOptions[1].originDateTime;
                        vm.returnBookingModel.checkOut = obj.returnPricedItinerary.originDestinationOptions[1].destinationDateTime;
                        vm.returnBookingModel.noOfTransit = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments.length;
                        vm.returnBookingModel.supplierName = obj.returnGroupItem.airlineName;
                        vm.returnBookingModel.airline = obj.returnGroupItem.airline;
                        vm.returnBookingModel.carrierNo = obj.returnGroupItem.fightNo;
                        vm.returnBookingModel.originLocationCode = obj.returnPricedItinerary.originDestinationOptions[1].originLocationCode;
                        vm.returnBookingModel.destinationLocationCode = obj.returnPricedItinerary.originDestinationOptions[1].destinationLocationCode;
                        vm.returnBookingModel.duration = obj.returnPricedItinerary.originDestinationOptions[1].journeyDuration;
                        vm.returnBookingModel.supplierCode = obj.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                        vm.returnBookingModel.cabinClassName = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments[0].cabinClassName;
                        vm.returnBookingModel.flightIdx = 2;
                        vm.returnBookingModel.searchType = vm.searchOptions.searchType;
                        vm.returnBookingModel.booking = {};
                        vm.returnBookingModel.travelerInfo = obj.travelerInfo;
                        vm.returnBookingModel.pricedItinerary = obj.returnPricedItinerary;
                        vm.returnBookingModel.flightSegments = obj.returnPricedItinerary.originDestinationOptions[1].flightSegments;
                        vm.returnBookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;
                    }
                } else {
                    vm.searchOptions.dtype = 'domestic';
                    // Convert for view details -- DEPART
                    // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                    vm.bookingModel.checkIn = obj.departPricedItinerary.originDestinationOptions[0].originDateTime;
                    vm.bookingModel.checkOut = obj.departPricedItinerary.originDestinationOptions[0].destinationDateTime;
                    vm.bookingModel.noOfTransit = 1;
                    vm.bookingModel.supplierName = obj.departGroupItem.airlineName;
                    vm.bookingModel.airline = obj.departGroupItem.airline;
                    vm.bookingModel.carrierNo = obj.departGroupItem.fightNo;
                    vm.bookingModel.originLocationCode = obj.departGroupItem.originLocationCode;
                    vm.bookingModel.destinationLocationCode = obj.departGroupItem.destinationLocationCode;
                    vm.bookingModel.duration = obj.departPricedItinerary.originDestinationOptions[0].journeyDuration;
                    vm.bookingModel.supplierCode = obj.departPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                    vm.bookingModel.cabinClassName = obj.departPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
                    vm.bookingModel.flightIdx = 1;
                    vm.bookingModel.searchType = vm.searchOptions.searchType;
                    vm.bookingModel.booking = {};
                    vm.bookingModel.travelerInfo = obj.travelerInfo;
                    vm.bookingModel.pricedItinerary = obj.departPricedItinerary;
                    vm.bookingModel.flightSegments = obj.departPricedItinerary.originDestinationOptions[0].flightSegments;
                    vm.bookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;

                    // Convert for view details -- RETURN
                    // vm.bookingModel.bookingNumber = vm.bookingModel.code.bookingCode.bookingNumber;
                    if (obj.returnPricedItinerary && obj.returnGroupItem) {
                        vm.returnBookingModel.bookingNumber = vm.bookingModel.bookingNumber;
                        vm.returnBookingModel.checkIn = obj.returnPricedItinerary.originDestinationOptions[0].originDateTime;
                        vm.returnBookingModel.checkOut = obj.returnPricedItinerary.originDestinationOptions[0].destinationDateTime;
                        vm.returnBookingModel.noOfTransit = 1;
                        vm.returnBookingModel.supplierName = obj.returnGroupItem.airlineName;
                        vm.returnBookingModel.airline = obj.returnGroupItem.airline;
                        vm.returnBookingModel.carrierNo = obj.returnGroupItem.fightNo;
                        vm.returnBookingModel.originLocationCode = obj.returnGroupItem.originLocationCode;
                        vm.returnBookingModel.destinationLocationCode = obj.returnGroupItem.destinationLocationCode;
                        vm.returnBookingModel.duration = obj.returnPricedItinerary.originDestinationOptions[0].journeyDuration;
                        vm.returnBookingModel.supplierCode = obj.returnPricedItinerary.airItineraryPricingInfo.fareSourceCode;
                        vm.returnBookingModel.cabinClassName = obj.returnPricedItinerary.originDestinationOptions[0].flightSegments[0].cabinClassName;
                        vm.returnBookingModel.flightIdx = 2;
                        vm.returnBookingModel.searchType = vm.searchOptions.searchType;
                        vm.returnBookingModel.booking = {};
                        vm.returnBookingModel.travelerInfo = obj.travelerInfo;
                        vm.returnBookingModel.pricedItinerary = obj.returnPricedItinerary;
                        vm.returnBookingModel.flightSegments = obj.returnPricedItinerary.originDestinationOptions[0].flightSegments;
                        vm.returnBookingModel.passengerNameRecords = vm.bkgroup.bookingInfo.passengerNameRecords;
                    }
                }
                // bind to view
                vm.orgBookingModel = obj;

            } else {
                $log.log('++++ Booking Not FOUND - GOTO - flight');
                vm.updateUIState(vm.uiStates.notfound);
            }
            /** END OLD CODE **/
        }





        // UI state update Helper.
        function updateUIState(state, payload) {
            $log.log("Previous state: " + vm.currentUIState);
            vm.currentUIState = state;
            $log.log("Current state: " + vm.currentUIState);
        }
    }
})();