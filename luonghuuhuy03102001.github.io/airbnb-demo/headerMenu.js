const menuLocation = document.querySelector('.header_menu_location');
const menuSearch = document.querySelector('.header_menu_search');
const btnIconSearch = document.querySelector('.menu_guest_search_form');

// hàm hiện headerMenusearch
function showHeaderMenu() {
    menuSearch.classList.add('open');
    overflow.style.display = "block";
}

// ẩn headerMenusearch
function hineHeaderMenu() {
    menuSearch.classList.remove('open');
    overflow.style.display = "none";
}

// ấn để ẩn headerMenusearch
overflow.addEventListener('click', hineHeaderMenu);

// ấn qua các headerMenusearch
menuLocation.addEventListener('click', showHeaderMenu);

// click vao icon search button
btnIconSearch.addEventListener('click', showHeaderMenu);

// -----------------------------------------------------------------------------

const btnClose = document.querySelector('.header_menu_input_close');
const menuInput = document.querySelector('.header_menu_location_input');

// hiện btn close
function showBtnClose() {
    btnClose.classList.add('open');
}
// ẩn btn close
function hineBtnClose() {
    btnClose.classList.remove('open');
}

// input
menuInput.addEventListener('input', showBtnClose)

// click vaof overflow
overflow.addEventListener('click', hineBtnClose);
// click vào btnClose

// ------------------------------------------------------------------------------

const checkin = document.querySelector('.header_menu_checkin');
const checkinDate = document.querySelector('.menu_checkin_date');

// show checkin date 
function showcheckinDate() {
    checkinDate.classList.add('open');
    overflow.style.display = "block";
}

// hine checkin date 
function hinecheckinDate() {
    checkinDate.classList.remove('open');
    overflow.style.display = "none";
}

// on click vao the checkin
checkin.addEventListener('click', showcheckinDate);

// onclick vafo the overflow
overflow.addEventListener('click', hinecheckinDate);


// ------------------------------------------------------------------------------

const check = document.querySelector('.header_menu_check');
const checkDate = document.querySelector('.menu_check_date');

// show checkin date 
function showcheckDate() {
    checkDate.classList.add('open');
    overflow.style.display = "block";
}

// hine checkin date 
function hinecheckDate() {
    checkDate.classList.remove('open');
    overflow.style.display = "none";
}

// on click vao the checkin
check.addEventListener('click', showcheckDate);

// onclick vafo the overflow
overflow.addEventListener('click', hinecheckDate);

//-------------------------------------------------------------------------------

const menuGuestSearch = document.querySelector('.header_menu_guest-with_search')
const selectedMenu = document.querySelector('.header_menu_guest_Selection');

function showselectedMenu() {
    selectedMenu.classList.add('open');
    overflow.style.display = "block";
}

function hineselectedMenu() {
    selectedMenu.classList.remove('open');
    overflow.style.display = "none";
}

// onclick vao the menuGuest
menuGuestSearch.addEventListener('click', showselectedMenu);

// onclick vafo the overflow
overflow.addEventListener('click', hineselectedMenu);

// -------------------------------------------------------------------------------------

const menuItems = document.querySelectorAll('.header_menu__item');
const menuList = document.querySelector('.header_menu__list');
const menuGuest = document.querySelector('.header_menu_guest');
const iconBtnSearch = document.querySelector('.guest_search-icon_btn');

// click vào thẻ menu Item
for (const menuItem of menuItems) {
    menuItem.addEventListener('click', function() {
        menuItem.classList.add('header_menu_boxshadow');
        menuList.style.backgroundColor = '#f3f3f3';
        menuLocation.style.width = 'auto'
        btnIconSearch.style.width = '128px';
        menuGuest.style.width = 'auto';
        iconBtnSearch.classList.add('open');
    })

    function hineselectedMenu() {
        menuItem.classList.remove('header_menu_boxshadow');
        menuList.style.backgroundColor = '#fff';
        menuLocation.style.width = '269px'
        menuGuest.style.width = '220px';
        iconBtnSearch.classList.remove('open');
        btnIconSearch.style.width = '48px';

    }

    overflow.addEventListener('click', hineselectedMenu);
}


// ----------------------------------------------------------------------------------------------