// header navbar 
const navbarItem = document.querySelectorAll('.header_navbar__item');
const spanNabar = document.querySelectorAll('.header_navbar__link');
const navbarUser = document.querySelector('.navbar_form_user');
const menuUser = document.querySelector('.navbar_form_user_menu');


navbarItem.forEach(function(Item, index) {
    Item.onclick = function() {
        document.querySelector('.header_navbar__item.active').classList.remove('active');
        this.classList.add('active');
    }
    Item.onmouseover = function() {
        this.classList.add('onhover');
    }
    Item.onmouseout = function() {
        document.querySelector('.header_navbar__item.onhover').classList.remove('onhover');
    }
});

// navbar user

const userBtn = document.querySelector('.navbar_form_user');
const modal = document.querySelector('.navbar_form_user_menu');
const overflow = document.querySelector('.oveflow');
const userBtnScroll = document.querySelector('.navbar_form_user_scroll');
const modalScroll = document.querySelector('.navbar_form_user_menu_scroll');

// hàm hiện user menu
function showUserMenu() {
    modal.classList.add('open');
    modalScroll.classList.add('open');
    overflow.style.display = "block";
};

// ẩn đi user menuUser
function hineUserMenu() {
    modal.classList.remove('open');
    modalScroll.classList.remove('open');
    overflow.style.display = "none";
}

// lắng nghe hành vi click vào navbarUser
userBtn.addEventListener('click', showUserMenu);
userBtnScroll.addEventListener('click', showUserMenu);

// lắng nghe sự kiện click ra ngoài userBtn
overflow.addEventListener('click', hineUserMenu);