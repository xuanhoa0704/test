window.onscroll = function() {
    if ((Math.round(window.scrollY) > 10 || Math.round(document.documentElement.scrollTop) > 10)) {
        document.querySelector(".header_scroll").style.display = "block";
        document.querySelector(".header_menu").style.display = "none";
        document.querySelector(".header_slider").style.marginTop = "40px";
        document.querySelector(".header_navbar__list").style.display = "none";
        document.querySelector(".header_menu__list_ipab").style.display = "none";
        const userBtn = document.querySelector('.navbar_form_user').style.display = "none";
    } else {
        document.querySelector(".header_navbar__list").style.display = "flex";
        document.querySelector(".header_menu").style.display = "block";
        document.querySelector(".header_menu__list_ipab").style.display = "flex";
        document.querySelector(".header_slider").style.marginTop = "0";
        const userBtn = document.querySelector('.navbar_form_user').style.display = "flex";
        document.querySelector(".header_scroll").style.display = "none";
    }
}