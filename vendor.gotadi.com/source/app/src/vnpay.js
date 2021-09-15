function cfgWinSizeVNPayQR(cfg) {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth < 900)
        cfg.width = newWidth;
    if (newHeight > 600)
        cfg.width = newHeight;

    return cfg;
}

function vnpay_snippet(settings) {
    var cfg = {
        width: 768,
        height: 490,
        url: "#"
    };
    $("#vnpay_modal").hide();
    cfg = $.extend({}, cfg, settings);
    cfg = cfgWinSizeVNPayQR(cfg);
    var iframe, modal, content, method, overlay;
    content = $('<div id="vnpay_content" class="vnpay_content" allowfullscreen></div>');
    iframe = $('<iframe id="vnpay_frame" />');
    var script = document.createElement('script');
    document.getElementsByTagName('body')[0].appendChild(script);
    script.onload = function() {
        iframe.attr("src", cfg.url);
    }
    script.onerror = function() {
        alert('Hi?n t?i dang c� l?i k?t n?i v?i VNPAY vui l�ng th? l?i sau ho?c g?i h? tr? d? du?c gi�p d?!');
    }
    script.setAttribute('src', cfg.url);


    //set style for iframe
    iframe.css("border", "none");
    iframe.css({
        height: cfg.height - 14 || 'auto',
        position: 'absolute'
    });
    content.empty().append(iframe);
    content.css({
        width: cfg.width - 14 || 'auto'
    });
    content.css("cssText", "height: " + cfg.height + "px !important;");
    overlay = $("#vnpay_modal");
    overlay.after(content);
}

function detectmob() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    } else {
        return false;
    }
}