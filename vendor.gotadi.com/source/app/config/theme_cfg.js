(function() {
    'use strict';
    angular
        .module('B2B2CGatewayApp')
        .factory('ThemeCfg', ThemeCfg);

    ThemeCfg.$inject = [];

    function ThemeCfg() {
        return {
            TIKI: false,
            SENDO: false,
            LIENVIETBANK: false,
            SEABANK: false,
            FSOFT: false,
            LOOPBACK: false,
            TRUEMONEY: false,
            VTCPAY: false,
            SMARTPAY: false,
            APEX: false
        };
    }

})();