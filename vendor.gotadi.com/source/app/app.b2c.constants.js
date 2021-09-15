(function() {
    'use strict';
    angular
        .module('B2B2CGatewayApp')
        .constant('TRANS_TIME_OUT', 15)
        .constant('TICKET_SRV_BASE_URL', "/ticketsrv/api")
        .constant('TICKET_SEARCH_URL', "/api/air-tickets/low-fare-search-async")
        .constant('TICKET_SEARCH_INTERNATIONAL_URL', "/api/air-tickets/low-fare-search-international-async")

        .constant('TICKET_SEARCH_CACHE_URL', "/api/air-tickets/filter-availability")

        .constant('TICKET_GET_FARE_RULES_URL', "/api/air-tickets/farerules")

        .constant('TICKET_GET_GROUP_DETAIL_URL', "/api/air-tickets/group-itinerary/")
        .constant('TICKET_GET_FILTER_OPTIONS_URL', "/api/air-tickets/filter-options")

        .constant('TICKET_AIR_REVALIDATE_URL', "/api/air-tickets/revalidate")
        .constant('TICKET_CREATE_DRAFT_BOOKING_URL', "/api/air-tickets/draft-booking")
        // Tam - can cook
        .constant('TICKET_UPDATE_BOOKING_TAGS_URL', "/api/air-tickets/draft-booking")
        .constant('TICKET_CHANGE_DRAFT_BOOKING_OWNER_URL', "/api/air-tickets/change-draft-booking-owner")
        .constant('TICKET_ADD_TRAVELLER_URL', "/api/air-tickets/add-booking-traveller")
        .constant('TICKET_PAYMENT_BOOKING_URL', "/api/air-tickets/payment-booking")
        .constant('TICKET_ORDER_TICKET_URL', "/api/air-tickets/order-tickets")
        .constant('TICKET_AIR_GET_SSR_URL', "/api/air-tickets/ssr-offer/")


        .constant('PROFILE_SHORT_URL', "/api/profile/short")
        // .constant('TICKET_SEARCH_CACHE_URL',    "/ticketsrv/api/air/flight/filter-availability")


        .constant('META_AIRPORT_URL', "/metasrv/api/_search/airports")
        .constant('META_SEARCH_AIRPORT_URL', "/metasrv/api/_search/airports")
        .constant('META_SEARCH_LOOKUP_URL', "/api/_search/lookups")
        .constant('META_AIRLINE_URL', "/metasrv/api/airlines")

        .constant('META_COUNTRY_CODE_URL', "/metasrv/api/country-codes")
        .constant('META_DESTINATION_URL', "/metasrv/api/_search/destinations")

        .constant('CUSTOMER_PROFILE_URL', "/customersrv/api/customer-profiles")
        .constant('B2B_AGENT_PROFILE_URL', "/agentsrv/api/agent-profiles/login-name")
        .constant('CUSTOMER_PROFILE_AVATAR_URL', "/customersrv/api/customer-avatars/profile")
        .constant('CUSTOMER_PROFILE_AVATAR_COMMON_URL', "/customersrv/api/customer-avatars")

        .constant('CUSTOMER_TRAVELLERS_URL', "/customersrv/api/customer-travellers")
        .constant('CUSTOMER_TRAVELLERS_FOR_BOTH_URL', "/api/customers/travellers")

        .constant('CUSTOMER_TRAVELLERS_DETAIL_URL', "/customersrv/api/customer-travellers")
        .constant('CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL', "/customersrv/api/customer-travellers-collection")
        .constant('AIR_CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL', "/api/customers/air-customer-travellers-collection")
        // .constant('AIR_CUSTOMER_TRAVELLERS_COLLECTION_CREATE_URL',    "/customersrv/api/air-customer-travellers-collection")

        .constant('PRICING_CREDIT_CARDS_URL', "/pricingsrv/api/credit-cards")
        .constant('PRICING_CREDIT_CARDS_DELETE_ALL_URL', "/pricingsrv/api/credit-cards/delete-all")

        .constant('PRICING_VOUCHER_VALIDATE_URL', "/api/payments/voucher/validate")
        .constant('PRICING_VOUCHER_REDEEM_URL', "/api/payments/voucher/redeem")

        .constant('PAYMENT_SUB_CARD_URL', "/api/payment/card-subscription")
        .constant('PAYMENT_UNSUB_CARD_URL', "/pricingsrv/api/payment/card-unsubscription")

        .constant('PAYMENT_ATM_DEBIT_OPTIONS', "/api/air-tickets/payment-debit-options")

        .constant('BOOKING_SEARCH_URL', "/bookingsrv/api/bookings/search")
        .constant('BOOKING_DETAILS_URL', "/bookingsrv/api/bookings")

        .constant('PRODUCT_BOOKING_DETAILS_URL', "/api/products/booking-detail")
        .constant('PRODUCT_FINAL_BOOKING_DETAILS_URL', "/api/products/final-booking-detail")

        // HOTEL URL
        .constant('HOTEL_SEARCH_METADATA_URL', "/api/hotel/meta-keyword-search")
        .constant('HOTEL_SEARCH_URL', "/api/hotel/low-fare-search-async")
        .constant('HOTEL_SEARCH_CACHE_URL', "/api/hotel/filter-availability")
        .constant('HOTEL_CHECK_AVAILABILITY_URL', "/api/hotel/check-hotel-availability")
        .constant('HOTEL_FILTER_OPTIONS_URL', "/api/hotel/filter-options")
        .constant('HOTEL_DRAFT_BOOKING_URL', "/api/hotel/draft-booking")
        .constant('HOTEL_ADD_BOOKING_TRAVELLER_URL', "/api/hotel/add-booking-traveller")
        .constant('HOTEL_PAYMENT_BOOKING_URL', "/api/hotel/payment-booking")
        .constant('HOTEL_ORDER_HOTEL_URL', "/api/hotel/order-hotel")
        .constant('HOTEL_STATES', "hotelStates")

        .constant('PAYMENT_PAYMENT_BOOKING_URL', "/api/payments/payment-booking")
        .constant('PAYMENT_FEE_OPTIONS_URL', "/api/payments/payment-fee-options")
        //HuyTT
        .constant('SUBSCRIBED_URL', "/api/users/subscribed")
        .constant('PAYMENT_PROMO_OPTIONS_URL', "/api/_search/promotion-credit-card")
        .constant('PAYMENT_PROMO_DISCOUNT_URL', "/api/payments/promotion/discount")
        .constant('PRICING_PROMO_REDEEM_URL', "/api/payments/promotion/redeem")
        .constant('PRICING_PROMO_VOID_URL', "/api/payments/promotion/void")
        // Tiki
        .constant('TIKI_ORDER_URL', "/tiki-ipn/api")
        .constant('VIETTEL_URL', "/api/viettel")
        .constant('LIENVIET_URL', "/api/lienviet")
        .constant('SEA_URL', "/api/sea/")
        .constant('FSOFT_URL', "/api/fsoft")
        .constant('GET_AVAILABLE_PAYMENT_TYPE', "/api/payment/get-available-payment-type")
        .constant('DEFAULT_DATE_FORMAT', "mm-dd-yyyy")
        .constant('DEFAULT_MOMENT_DATE_FORMAT', "MM-DD-YYYY")
        .constant('DATE_DDMMYYYY_FORMAT', "dd/mm/yyyy")
        .constant('DEFAULT_PAGE_SIZE', 15)
        .constant('IBE_KEYS', {
            "cdn": {
                "airlines": {
                    //"logoUrl" : "/content/images/airlines/gif"
                    "logoUrl": "https://booking.gotadi.com/Booking/AirBooking/images/AirLogos"
                }
            },
            "booking": {
                "directionType": {
                    "departure": "DEPARTURE",
                    "return": "RETURN",
                    "trip": "TRIP"
                },
                "issuedStatus": {
                    "pending": "PENDING",
                    "ticketOnProcess": "TICKET_ON_PROCESS",
                    "succeeded": "SUCCEEDED",
                    "failed": "FAILED",
                    "partlyConfirmed": "PARTLY_CONFIRMED",
                    "partlyFailed": "PARTLY_FAILED"
                },
                "paymentStatus": {
                    "pending": "PENDING",
                    "succeeded": "SUCCEEDED",
                    "failed": "FAILED",
                    "refunded": "REFUNDED"
                },
                "bookStatus": {
                    "pending": "PENDING",
                    "bookingOnProcess": "BOOKING_ON_PROCESS",
                    "booked": "BOOKED",
                    "failed": "FAILED",
                    "cancelled": "CANCELLED",
                    "expired": "EXPIRED",
                    "tentative": "TENTATIVE",
                    "partlyBooked": "PARTLY_BOOKED",
                    "partlyFailed": "PARTLY_FAILED"
                },
                "supplierStatus": {
                    "pending": "PENDING",
                    "bookingOnProcess": "BOOKING_ON_PROCESS",
                    "ticketOnProcess": "TICKET_ON_PROCESS",
                    "booked": "BOOKED",
                    "failed": "FAILED",
                    "cancelled": "CANCELLED",
                    "expired": "EXPIRED",
                    "tentative": "TENTATIVE",
                    "partlyBooked": "PARTLY_BOOKED",
                    "partlyFailed": "PARTLY_FAILED"
                }
            },
            "airTicket": {
                "flightType": {
                    "domestic": "DOMESTIC",
                    "international": "INTERNATIONAL"
                },
                "flightDirection": {
                    "departure": "DEPARTURE",
                    "return": "RETURN"
                }
            }
        })

        .constant('DEFAULT_SETTING', {
            "SCREEN_XS": 768
        })
        .constant('FREE_WIFI_IDS', [2390, 2392, 2403, 2405, 2407,
            1073743392, 1073743393, 1073743394, 1073743396, 1073743397, 1073743398
        ])
        .constant('FREE_PARKING_IDS', [3861, 3863, 4452, 4450, 2554, 3761])
        .constant('HAS_SWIMMING_POOL_IDS', [14, 24, 2014, 2138, 2859, 2860, 4174, 1073743549])
        .constant('FREE_BREAKFAST', [2001])
        .constant('FREE_GYM', [2048])
        .constant('FREE_DRINK_TEXT', ['Đồ uống miễn phí chào đón khách'])
        .constant('FREE_BREAKFAST_TEXT', ['Bữa sáng miễn phí', 'Bữa sáng buffet'])
        .constant('FREE_PARKING_TEXT', ['Đậu xe miễn phí'])
        .constant('FREE_WIFI_TEXT', ['Wifi miễn phí', 'Internet tốc độ cao miễn phí'])
        .constant('FREE_DRINK_TEXT_KEY', ['Đồ uống', 'Minibar'])
        .constant('FREE_BREAKFAST_TEXT_KEY', ['Bữa sáng', 'breakfast'])
        .constant('FREE_PARKING_TEXT_KEY', ['Đậu xe', 'Parking'])
        .constant('FREE_WIFI_TEXT_KEY', ['Wifi', 'Internet'])
        .constant('PREFIX_DEFAULT_POLICY_STRING',
            'Chúng tôi hiểu rằng đôi khi có những thay đổi trong kế hoạch của quý vị. Chúng tôi không tính phí thay đổi hoặc hủy bỏ. Tuy nhiên, khách sạn này ({0}) áp dụng khoản phạt với khách hàng như sau và chúng tôi được yêu cầu thông báo cùng quý vị: Hủy hoặc thay đổi thực hiện sau ')
        .constant('AFTER_DEFAULT_POLICY_STRING',
            ', hoặc không nhận phòng sẽ chịu phí phạt tương đương \\d+% chi phí thời gian lưu trú.  ')
        .constant('SEARCH_BY_HOTEL_NAME',
            '::H::')
        .constant('LIMIT_WIDTH', 114)
        .constant('LIMIT_HEIGHT', 114)
        .constant('VOUCHER_EVENT', 'VOUCHER_EVENT')
        .constant('PROMO_EVENT', 'PROMO_EVENT')

    ;
})();