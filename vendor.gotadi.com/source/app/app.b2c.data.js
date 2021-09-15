var $ibe = {};

/**
 *
 * @type {string}
 * @private
 */
$ibe._$token_key = null;

/**
 * keep sale_channel information
 * B2C or B2B2C
 * @type {string}
 * @private
 */
$ibe._$sale_channel = "B2C";

/**
 * Keep b2b link
 * @type {string}
 */
$ibe._$b2b_app_url = null;

/**
 *
 * @param tokenKey
 * @returns {boolean}
 */
$ibe.setTokenKey = function(tokenKey) {
    if (!angular.isUndefined(tokenKey) && tokenKey !== null) {
        this._$token_key = tokenKey;
        return true;
    }
    return false;
};

/**
 *
 * @returns {*|string}
 */
$ibe.getTokenKey = function() {
    return this._$token_key;
};

/**
 *
 * @returns {boolean}
 */
$ibe.hasTokenKey = function() {
    return (!angular.isUndefined(this._$token_key) && this._$token_key !== null);
};

/**
 *
 */
$ibe.resetTokenKey = function() {
    this._$token_key = null;
};

/**
 *
 * @param saleChannel
 * @returns {boolean}
 */
$ibe.setSaleChannel = function(saleChannel) {
    if (!angular.isUndefined(saleChannel) && saleChannel !== null) {
        this._$sale_channel = saleChannel;
        return true;
    }
    return false;
};


$ibe.getSaleChannel = function() {
    return this._$sale_channel;
}

/**
 *
 * @returns {boolean}
 */
$ibe.isB2B2C = function() {
    return (!angular.isUndefined(this._$sale_channel) && this._$sale_channel === "B2B2C");
};

$ibe.isB2C = function() {
    return (!angular.isUndefined(this._$sale_channel) && this._$sale_channel === "B2C");
};


/**
 *
 * @param tokenKey
 * @returns {boolean}
 */
$ibe.setB2BAppUrl = function(b2bAppUrl) {
    if (!angular.isUndefined(b2bAppUrl) && b2bAppUrl !== null) {
        this._$b2b_app_url = b2bAppUrl;
        return true;
    }
    return false;
};

/**
 *
 * @returns {*|string}
 */
$ibe.getB2BAppUrl = function() {
    return this._$b2b_app_url;
};