var url = new URL(window.location.href);

$(document).ready(function() {
    $('#btn').on('click', function() {
        var fromId = $('input[name=from]').val() || url.searchParams.get('from');
        var toId = $('input[name=to]').val() || url.searchParams.get('to');
        var f = document.getElementById('from').value;
        var t = document.getElementById('to').value;
        fromId.value = f == url.searchParams.get('from') ? t : f;
        toId.value = t == url.searchParams.get('to') ? f : t;
        // console.log(fromId, toId);
        $('#to').val(fromId);
        $('#from').val(toId);
    });
});

var dateToday = new Date();
$(function() {
    $('#datepicker')
        .datepicker({
            dateFormat: 'dd-mm-yy',
            showOtherMonths: true,
            selectOtherMonths: true,
            minDate: dateToday
        })
        .datepicker(
            'setDate', !url.searchParams.get('departDate') ?
            1 :
            url.searchParams.get('departDate')
        );
});

function changeValue() {
    var url = new URL(window.location.href);
    var from = document.getElementById('inputFrom');
    var to = document.getElementById('inputTo');
    var froms = document.getElementById('inputFrom').value;
    var tos = document.getElementById('inputTo').value;
    from.value = froms === froms ? tos : froms;
    to.value = tos === tos ? froms : tos;
}

function removeVietnameseSign(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str;
}

function autocompleteFrom(inp, arr, cities) {
    let currentFocus;
    let valueInputFrom;
    let valueInputFromId;
    let valueInputTo;
    let valueInputToId;

    if (!url.searchParams.get('from') && !url.searchParams.get('to')) {
        document.getElementById('Info').style.display = 'none';
    } else {
        document.getElementById('Info').style.display = 'block';
    }
    if (url.searchParams.get('from')) {
        arr
            .filter(item => item.id == url.searchParams.get('from'))
            .map(item => (valueInputFrom = item.name));
        document.getElementById('inputFrom').value = valueInputFrom;
        document.getElementById('fromName').innerHTML = valueInputFrom;
        document.getElementById('date').innerHTML = url.searchParams.get(
            'departDate'
        );
    }
    if (url.searchParams.get('to')) {
        arr
            .filter(item => item.id == url.searchParams.get('to'))
            .map(item => (valueInputTo = item.name));
        document.getElementById('inputTo').value = valueInputTo;
        document.getElementById('toName').innerHTML = valueInputTo;
    }

    // Show list items when focus
    inp.addEventListener('focus', function(e) {
        let i, b, city;

        currentFocus = 0;
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items-from');
        a.style.width = '100%';
        a.style.overflowY = 'auto';
        a.style.maxHeight = '60vh';
        this.parentNode.appendChild(a);
        for (i = 0; i < data.length; i++) {
            b = document.createElement('DIV');
            //if (i == 0) b.classList.add('autocomplete-active');
            //b.innerHTML = data[i].name;
            if (data[i].type == 5) {
                cities
                    .filter(item => item.url_id == data[i].base_id)
                    .map(item => {
                        switch (item.id) {
                            case data[i].base_id:
                                city = item.name;
                                break;
                            default:
                                city = data[i].name;
                                break;
                        }
                    });
                b.innerHTML +=
                    data[i].name + `${city == undefined ? '' : ' - ' + city}`;
            } else b.innerHTML += data[i].name;
            b.innerHTML +=
                "<input type='hidden' value='" +
                data[i].name +
                `${city == undefined ? '' : ' - ' + city}` +
                "' id='" +
                data[i].id +
                "'  >";

            b.addEventListener('click', function(e) {
                inp.value = this.getElementsByTagName('input')[0].value;
                document.getElementById('from').value = this.getElementsByTagName(
                    'input'
                )[0].id;
                document.getElementById('nameFrom').value = this.getElementsByTagName(
                    'input'
                )[0].value;
                if (document.getElementById('from').value) {
                    document.getElementById('inputTo').focus();
                }
            });
            a.appendChild(b);
        }

        if (inp.value) {
            let x = document.getElementById(a.id);
            if (x) {
                x = x.getElementsByTagName('div');
                for (let i = 0; i < x.length; i++) {
                    if (x[i].innerText == inp.value) {
                        x[i].classList.add('autocomplete-active');
                        a.scrollTop = x[i].offsetTop;
                        currentFocus = i;
                    }
                }
            }
        }
    });

    //Suggest when typing
    inp.addEventListener('input', function(e) {
        var a,
            b,
            city,
            i,
            val = this.value;

        closeAllLists();
        currentFocus = 0;
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items-from');
        a.style.width = '100%';
        a.style.overflowY = 'auto';
        a.style.maxHeight = '60vh';
        this.parentNode.appendChild(a);
        let state = true;
        for (i = 0; i < arr.length; i++) {
            if (
                removeVietnameseSign(arr[i].name.trim())
                .substr(0, val.length)
                .toUpperCase() == val.toUpperCase() ||
                removeVietnameseSign(
                    arr[i].name
                    .split(' ')
                    .join('')
                    .trim()
                )
                .substr(0, val.length)
                .toUpperCase() == val.toUpperCase() ||
                arr[i].name
                .split(' ')
                .join('')
                .trim()
                .substr(0, val.length)
                .toUpperCase() == val.toUpperCase() ||
                arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase() ||
                arr[i].code.substr(0, val.length).toUpperCase() == val.toUpperCase()
            ) {
                b = document.createElement('DIV');
                // Set background for first item
                if (state) {
                    b.classList.add('autocomplete-active');
                    state = false;
                }

                b.innerHTML =
                    '<strong>' + arr[i].name.substr(0, val.length) + '</strong>';
                if (arr[i].type == 5) {
                    cities
                        .filter(item => item.url_id == arr[i].base_id)
                        .map(item => {
                            switch (item.id) {
                                case arr[i].base_id:
                                    city = item.name;
                                    break;
                                default:
                                    city = arr[i].name;
                                    break;
                            }
                        });
                    b.innerHTML +=
                        arr[i].name.substr(val.length) +
                        `${city == undefined ? '' : ' - ' + city}`;
                } else b.innerHTML += arr[i].name.substr(val.length);
                b.innerHTML +=
                    "<input type='hidden' value='" +
                    arr[i].name +
                    `${city == undefined ? '' : ' - ' + city}` +
                    "' id='" +
                    arr[i].id +
                    "'  >";
                b.addEventListener('click', function(e) {
                    inp.value = this.getElementsByTagName('input')[0].value;
                    document.getElementById('from').value = this.getElementsByTagName(
                        'input'
                    )[0].id;
                    document.getElementById('nameFrom').value = this.getElementsByTagName(
                        'input'
                    )[0].value;
                    if (document.getElementById('from').value) {
                        document.getElementById('inputTo').focus();
                    }
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener('keydown', function(e) {
        var x = document.getElementById(this.id + 'autocomplete-list');
        if (x) x = x.getElementsByTagName('div');
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
              increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) {
            //up
            /*If the arrow UP key is pressed,
              decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        } else if (e.keyCode == 9) {
            /*If the TAB key is pressed*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add('autocomplete-active');
        x[currentFocus].scrollIntoView(false);
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove('autocomplete-active');
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName('autocomplete-items-from');
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener('click', function(e) {
        closeAllLists(e.target);
    });
}

function autocompleteTo(inp, arr, cities) {
    let currentFocus;

    // Show list items when focus
    inp.addEventListener('focus', function(e) {
        let i, b, city;

        currentFocus = 0;
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items-to');
        a.style.width = '100%';
        a.style.overflowY = 'auto';
        a.style.maxHeight = '60vh';
        this.parentNode.appendChild(a);
        for (i = 0; i < data.length; i++) {
            b = document.createElement('DIV');
            if (data[i].type == 5) {
                cities
                    .filter(item => item.url_id == data[i].base_id)
                    .map(item => {
                        switch (item.id) {
                            case data[i].base_id:
                                city = item.name;
                                break;
                            default:
                                city = data[i].name;
                                break;
                        }
                    });
                b.innerHTML +=
                    data[i].name + `${city == undefined ? '' : ' - ' + city}`;
            } else b.innerHTML += data[i].name;
            b.innerHTML +=
                "<input type='hidden' value='" +
                data[i].name +
                `${city == undefined ? '' : ' - ' + city}` +
                "' id='" +
                data[i].id +
                "'  >";

            b.addEventListener('click', function(e) {
                inp.value = this.getElementsByTagName('input')[0].value;
                document.getElementById('to').value = this.getElementsByTagName(
                    'input'
                )[0].id;
                document.getElementById('nameTo').value = this.getElementsByTagName(
                    'input'
                )[0].value;
                if (document.getElementById('to').value) {
                    document.getElementById('datepicker').focus();
                }
                closeAllLists();
            });
            a.appendChild(b);
        }

        if (inp.value) {
            let x = document.getElementById(a.id);
            if (x) {
                x = x.getElementsByTagName('div');
                for (let i = 0; i < x.length; i++) {
                    if (x[i].innerText == inp.value) {
                        x[i].classList.add('autocomplete-active');
                        a.scrollTop = x[i].offsetTop;
                        currentFocus = i;
                    }
                }
            }
        }
    });

    //Suggest when typing
    inp.addEventListener('input', function(e) {
        var a,
            b,
            city,
            i,
            val = this.value;
        closeAllLists();

        currentFocus = 0;
        a = document.createElement('DIV');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items-to');
        a.style.width = '100%';
        a.style.overflowY = 'auto';
        a.style.maxHeight = '60vh';
        this.parentNode.appendChild(a);
        let state = true;
        for (i = 0; i < arr.length; i++) {
            if (
                removeVietnameseSign(arr[i].name.trim())
                .substr(0, val.length)
                .toUpperCase() == val.toUpperCase() ||
                removeVietnameseSign(
                    arr[i].name
                    .split(' ')
                    .join('')
                    .trim()
                )
                .substr(0, val.length)
                .toUpperCase() == val.toUpperCase() ||
                arr[i].name
                .split(' ')
                .join('')
                .trim()
                .substr(0, val.length)
                .toUpperCase() == val.toUpperCase() ||
                arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase() ||
                arr[i].code.substr(0, val.length).toUpperCase() == val.toUpperCase()
            ) {
                b = document.createElement('DIV');
                if (state) {
                    b.classList.add('autocomplete-active');
                    state = false;
                }
                b.innerHTML =
                    '<strong>' + arr[i].name.substr(0, val.length) + '</strong>';

                if (arr[i].type == 5) {
                    cities
                        .filter(item => item.url_id == arr[i].base_id)
                        .map(item => {
                            switch (item.id) {
                                case arr[i].base_id:
                                    city = item.name;
                                    break;
                                default:
                                    city = arr[i].name;
                                    break;
                            }
                        });
                    b.innerHTML +=
                        arr[i].name.substr(val.length) +
                        `${city == undefined ? '' : ' - ' + city}`;
                } else b.innerHTML += arr[i].name.substr(val.length);
                b.innerHTML +=
                    "<input type='hidden' value='" +
                    arr[i].name +
                    `${city == undefined ? '' : ' - ' + city}` +
                    "' id='" +
                    arr[i].id +
                    "'  >";
                b.addEventListener('click', function(e) {
                    inp.value = this.getElementsByTagName('input')[0].value;
                    document.getElementById('to').value = this.getElementsByTagName(
                        'input'
                    )[0].id;
                    document.getElementById('nameTo').value = this.getElementsByTagName(
                        'input'
                    )[0].value;
                    if (document.getElementById('to').value) {
                        document.getElementById('datepicker').focus();
                    }
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener('keydown', function(e) {
        var x = document.getElementById(this.id + 'autocomplete-list');
        if (x) x = x.getElementsByTagName('div');
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) {
            //up
            /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        } else if (e.keyCode == 9) {
            /*If the TAB key is pressed*/
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add('autocomplete-active');
        x[currentFocus].scrollIntoView(false);
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove('autocomplete-active');
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName('autocomplete-items-to');
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener('click', function(e) {
        closeAllLists(e.target);
    });
}

document.getElementById('inputTo').value = url.searchParams.get('tn');
document.getElementById('inputFrom').value = url.searchParams.get('fn');
document.getElementById('to').value = url.searchParams.get('to');
document.getElementById('from').value = url.searchParams.get('from');

var data = [{
        id: '27',
        name: 'Hải Phòng',
        code: 'HPG',
        type: 3,
        url_id: '27',
        base_id: '1926'
    },
    {
        id: '28',
        name: 'Hậu Giang',
        code: 'HGG',
        type: 3,
        url_id: '28',
        base_id: '1926'
    },
    {
        id: '29',
        name: 'Hồ Chí Minh',
        code: 'HCM',
        type: 3,
        url_id: '29',
        base_id: '1926'
    },
    {
        id: '29',
        name: 'Sài Gòn',
        code: 'sg',
        type: 3,
        url_id: '29',
        base_id: '1926'
    },
    {
        id: '30',
        name: 'Hòa Bình',
        code: 'HBH',
        type: 3,
        url_id: '30',
        base_id: '1926'
    },
    {
        id: '31',
        name: 'Hưng Yên',
        code: 'HYN',
        type: 3,
        url_id: '31',
        base_id: '1926'
    },
    {
        id: '32',
        name: 'Khánh Hòa',
        code: 'KHA',
        type: 3,
        url_id: '32',
        base_id: '1926'
    },
    {
        id: '33',
        name: 'Kiên Giang',
        code: 'KGG',
        type: 3,
        url_id: '33',
        base_id: '1926'
    },
    {
        id: '34',
        name: 'Kon Tum',
        code: 'KTM',
        type: 3,
        url_id: '34',
        base_id: '1926'
    },
    {
        id: '35',
        name: 'Lai Châu',
        code: 'LCU',
        type: 3,
        url_id: '35',
        base_id: '1926'
    },
    {
        id: '36',
        name: 'Lâm Đồng',
        code: 'LDG',
        type: 3,
        url_id: '36',
        base_id: '1926'
    },
    {
        id: '37',
        name: 'Lạng Sơn',
        code: 'LSN',
        type: 3,
        url_id: '37',
        base_id: '1926'
    },
    {
        id: '38',
        name: 'Lào Cai',
        code: 'LCI',
        type: 3,
        url_id: '38',
        base_id: '1926'
    },
    {
        id: '39',
        name: 'Long An',
        code: 'LAN',
        type: 3,
        url_id: '39',
        base_id: '1926'
    },
    {
        id: '40',
        name: 'Nam Định',
        code: 'NDH',
        type: 3,
        url_id: '40',
        base_id: '1926'
    },
    {
        id: '41',
        name: 'Nghệ An',
        code: 'NAN',
        type: 3,
        url_id: '41',
        base_id: '1926'
    },
    {
        id: '42',
        name: 'Ninh Bình',
        code: 'NBH',
        type: 3,
        url_id: '42',
        base_id: '1926'
    },
    {
        id: '43',
        name: 'Ninh Thuận',
        code: 'NTN',
        type: 3,
        url_id: '43',
        base_id: '1926'
    },
    {
        id: '44',
        name: 'Phú Thọ',
        code: 'PTO',
        type: 3,
        url_id: '44',
        base_id: '1926'
    },
    {
        id: '45',
        name: 'Phú Yên',
        code: 'PYN',
        type: 3,
        url_id: '45',
        base_id: '1926'
    },
    {
        id: '46',
        name: 'Quảng Bình',
        code: 'QBH',
        type: 3,
        url_id: '46',
        base_id: '1926'
    },
    {
        id: '47',
        name: 'Quảng Nam',
        code: 'QNM',
        type: 3,
        url_id: '47',
        base_id: '1926'
    },
    {
        id: '48',
        name: 'Quảng Ngãi',
        code: 'QNI',
        type: 3,
        url_id: '48',
        base_id: '1926'
    },
    {
        id: '49',
        name: 'Quảng Ninh',
        code: 'QNH',
        type: 3,
        url_id: '49',
        base_id: '1926'
    },
    {
        id: '50',
        name: 'Quảng Trị',
        code: 'QTI',
        type: 3,
        url_id: '50',
        base_id: '1926'
    },
    {
        id: '51',
        name: 'Sóc Trăng',
        code: 'STG',
        type: 3,
        url_id: '51',
        base_id: '1926'
    },
    {
        id: '52',
        name: 'Sơn La',
        code: 'SLA',
        type: 3,
        url_id: '52',
        base_id: '1926'
    },
    {
        id: '53',
        name: 'Tây Ninh',
        code: 'TNH',
        type: 3,
        url_id: '53',
        base_id: '1926'
    },
    {
        id: '54',
        name: 'Thái Bình',
        code: 'TBH',
        type: 3,
        url_id: '54',
        base_id: '1926'
    },
    {
        id: '82',
        name: 'Long Điền',
        code: '',
        type: 5,
        url_id: '19',
        base_id: '2'
    },
    {
        id: '83',
        name: 'Bắc Giang',
        code: '',
        type: 5,
        url_id: '20',
        base_id: '3'
    },
    {
        id: '84',
        name: 'Hiệp Hòa',
        code: '',
        type: 5,
        url_id: '21',
        base_id: '3'
    },
    {
        id: '85',
        name: 'Lạng Giang',
        code: '',
        type: 5,
        url_id: '22',
        base_id: '3'
    },
    {
        id: '86',
        name: 'Lục Nam',
        code: '',
        type: 5,
        url_id: '23',
        base_id: '3'
    },
    {
        id: '87',
        name: 'Lục Ngạn',
        code: '',
        type: 5,
        url_id: '24',
        base_id: '3'
    },
    {
        id: '88',
        name: 'Sơn Động',
        code: '',
        type: 5,
        url_id: '25',
        base_id: '3'
    },
    {
        id: '89',
        name: 'Tân Yên',
        code: '',
        type: 5,
        url_id: '26',
        base_id: '3'
    },
    {
        id: '90',
        name: 'Việt Yên',
        code: '',
        type: 5,
        url_id: '27',
        base_id: '3'
    },
    {
        id: '91',
        name: 'Yên Dũng',
        code: '',
        type: 5,
        url_id: '28',
        base_id: '3'
    },
    {
        id: '92',
        name: 'Yên Thế',
        code: '',
        type: 5,
        url_id: '29',
        base_id: '3'
    },
    {
        id: '93',
        name: 'Ba Bể',
        code: '',
        type: 5,
        url_id: '30',
        base_id: '4'
    },
    {
        id: '94',
        name: 'Bạch Thông',
        code: '',
        type: 5,
        url_id: '31',
        base_id: '4'
    },
    {
        id: '95',
        name: 'Bắc Kạn',
        code: '',
        type: 5,
        url_id: '32',
        base_id: '4'
    },
    {
        id: '96',
        name: 'Chợ Đồn',
        code: '',
        type: 5,
        url_id: '33',
        base_id: '4'
    },
    {
        id: '97',
        name: 'Chợ Mới',
        code: '',
        type: 5,
        url_id: '34',
        base_id: '4'
    },
    {
        id: '98',
        name: 'Na Rì',
        code: '',
        type: 5,
        url_id: '35',
        base_id: '4'
    },
    {
        id: '99',
        name: 'Ngân Sơn',
        code: '',
        type: 5,
        url_id: '36',
        base_id: '4'
    },
    {
        id: '100',
        name: 'Pác Nặm',
        code: '',
        type: 5,
        url_id: '37',
        base_id: '4'
    },
    {
        id: '101',
        name: 'Bạc Liêu',
        code: '',
        type: 5,
        url_id: '38',
        base_id: '5'
    },
    {
        id: '102',
        name: 'Đông Hải',
        code: '',
        type: 5,
        url_id: '39',
        base_id: '5'
    },
    {
        id: '103',
        name: 'Giá Rai',
        code: '',
        type: 5,
        url_id: '40',
        base_id: '5'
    },
    {
        id: '104',
        name: 'Hoà Bình',
        code: '',
        type: 5,
        url_id: '41',
        base_id: '5'
    },
    {
        id: '105',
        name: 'Hồng Dân',
        code: '',
        type: 5,
        url_id: '42',
        base_id: '5'
    },
    {
        id: '106',
        name: 'Phước Long',
        code: '',
        type: 5,
        url_id: '43',
        base_id: '5'
    },
    {
        id: '107',
        name: 'Vĩnh Lợi',
        code: '',
        type: 5,
        url_id: '44',
        base_id: '5'
    },
    {
        id: '108',
        name: 'Bắc Ninh',
        code: '',
        type: 5,
        url_id: '45',
        base_id: '6'
    },
    {
        id: '109',
        name: 'Gia Bình',
        code: '',
        type: 5,
        url_id: '46',
        base_id: '6'
    },
    {
        id: '110',
        name: 'Lương Tài',
        code: '',
        type: 5,
        url_id: '47',
        base_id: '6'
    },
    {
        id: '431',
        name: 'Phú Quốc',
        code: '',
        type: 5,
        url_id: '373',
        base_id: '33'
    },
    {
        id: '432',
        name: 'Rạch Giá',
        code: '',
        type: 5,
        url_id: '374',
        base_id: '33'
    },
    {
        id: '433',
        name: 'Tân Hiệp',
        code: '',
        type: 5,
        url_id: '375',
        base_id: '33'
    },
    {
        id: '434',
        name: 'U Minh Thượng',
        code: '',
        type: 5,
        url_id: '376',
        base_id: '33'
    },
    {
        id: '435',
        name: 'Vĩnh Thuận',
        code: '',
        type: 5,
        url_id: '377',
        base_id: '33'
    },
    {
        id: '436',
        name: 'Đắk Glei',
        code: '',
        type: 5,
        url_id: '378',
        base_id: '34'
    },
    {
        id: '437',
        name: 'Đắk Hà',
        code: '',
        type: 5,
        url_id: '379',
        base_id: '34'
    },
    {
        id: '438',
        name: 'Đăk Tô',
        code: '',
        type: 5,
        url_id: '380',
        base_id: '34'
    },
    {
        id: '439',
        name: 'Kon Plông',
        code: '',
        type: 5,
        url_id: '381',
        base_id: '34'
    },
    {
        id: '440',
        name: 'Kon Rẫy',
        code: '',
        type: 5,
        url_id: '382',
        base_id: '34'
    },
    {
        id: '441',
        name: 'Kon Tum',
        code: '',
        type: 5,
        url_id: '383',
        base_id: '34'
    },
    {
        id: '442',
        name: 'Ngọc Hồi',
        code: '',
        type: 5,
        url_id: '384',
        base_id: '34'
    },
    {
        id: '443',
        name: 'Sa Thầy',
        code: '',
        type: 5,
        url_id: '385',
        base_id: '34'
    },
    {
        id: '444',
        name: 'Tu Mơ Rông',
        code: '',
        type: 5,
        url_id: '386',
        base_id: '34'
    },
    {
        id: '445',
        name: 'Lai Châu',
        code: '',
        type: 5,
        url_id: '387',
        base_id: '35'
    },
    {
        id: '446',
        name: 'Mường Tè',
        code: '',
        type: 5,
        url_id: '388',
        base_id: '35'
    },
    {
        id: '447',
        name: 'Nậm Nhùn',
        code: '',
        type: 5,
        url_id: '389',
        base_id: '35'
    },
    {
        id: '448',
        name: 'Phong Thổ',
        code: '',
        type: 5,
        url_id: '390',
        base_id: '35'
    },
    {
        id: '449',
        name: 'Sìn Hồ',
        code: '',
        type: 5,
        url_id: '391',
        base_id: '35'
    },
    {
        id: '450',
        name: 'Tam Đường',
        code: '',
        type: 5,
        url_id: '392',
        base_id: '35'
    },
    {
        id: '451',
        name: 'Tân Uyên',
        code: '',
        type: 5,
        url_id: '393',
        base_id: '35'
    },
    {
        id: '452',
        name: 'Than Uyên',
        code: '',
        type: 5,
        url_id: '394',
        base_id: '35'
    },
    {
        id: '453',
        name: 'Bảo Lâm',
        code: '',
        type: 5,
        url_id: '395',
        base_id: '36'
    },
    {
        id: '454',
        name: 'Bảo Lộc',
        code: '',
        type: 5,
        url_id: '396',
        base_id: '36'
    },
    {
        id: '455',
        name: 'Cát Tiên',
        code: '',
        type: 5,
        url_id: '397',
        base_id: '36'
    },
    {
        id: '456',
        name: 'Di Linh',
        code: '',
        type: 5,
        url_id: '398',
        base_id: '36'
    },
    {
        id: '457',
        name: 'Đà Lạt',
        code: '',
        type: 5,
        url_id: '399',
        base_id: '36'
    },
    {
        id: '487',
        name: 'Cần Giuộc',
        code: '',
        type: 5,
        url_id: '429',
        base_id: '39'
    },
    {
        id: '488',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '430',
        base_id: '39'
    },
    {
        id: '489',
        name: 'Đức Hòa',
        code: '',
        type: 5,
        url_id: '431',
        base_id: '39'
    },
    {
        id: '490',
        name: 'Đức Huệ',
        code: '',
        type: 5,
        url_id: '432',
        base_id: '39'
    },
    {
        id: '491',
        name: 'Kiến Tường',
        code: '',
        type: 5,
        url_id: '433',
        base_id: '39'
    },
    {
        id: '492',
        name: 'Mộc Hóa',
        code: '',
        type: 5,
        url_id: '434',
        base_id: '39'
    },
    {
        id: '493',
        name: 'Tân An',
        code: '',
        type: 5,
        url_id: '435',
        base_id: '39'
    },
    {
        id: '494',
        name: 'Tân Hưng',
        code: '',
        type: 5,
        url_id: '436',
        base_id: '39'
    },
    {
        id: '495',
        name: 'Tân Thạnh',
        code: '',
        type: 5,
        url_id: '437',
        base_id: '39'
    },
    {
        id: '496',
        name: 'Tân Trụ',
        code: '',
        type: 5,
        url_id: '438',
        base_id: '39'
    },
    {
        id: '497',
        name: 'Thạnh Hóa',
        code: '',
        type: 5,
        url_id: '439',
        base_id: '39'
    },
    {
        id: '498',
        name: 'Thủ Thừa',
        code: '',
        type: 5,
        url_id: '440',
        base_id: '39'
    },
    {
        id: '499',
        name: 'Vĩnh Hưng',
        code: '',
        type: 5,
        url_id: '441',
        base_id: '39'
    },
    {
        id: '500',
        name: 'Giao Thủy',
        code: '',
        type: 5,
        url_id: '442',
        base_id: '40'
    },
    {
        id: '501',
        name: 'Hải Hậu',
        code: '',
        type: 5,
        url_id: '443',
        base_id: '40'
    },
    {
        id: '502',
        name: 'Mỹ Lộc',
        code: '',
        type: 5,
        url_id: '444',
        base_id: '40'
    },
    {
        id: '503',
        name: 'Nam Định',
        code: '',
        type: 5,
        url_id: '445',
        base_id: '40'
    },
    {
        id: '504',
        name: 'Nam Trực',
        code: '',
        type: 5,
        url_id: '446',
        base_id: '40'
    },
    {
        id: '505',
        name: 'Nghĩa Hưng',
        code: '',
        type: 5,
        url_id: '447',
        base_id: '40'
    },
    {
        id: '506',
        name: 'Trực Ninh',
        code: '',
        type: 5,
        url_id: '448',
        base_id: '40'
    },
    {
        id: '507',
        name: 'Vụ Bản',
        code: '',
        type: 5,
        url_id: '449',
        base_id: '40'
    },
    {
        id: '508',
        name: 'Xuân Trường',
        code: '',
        type: 5,
        url_id: '450',
        base_id: '40'
    },
    {
        id: '509',
        name: 'Ý Yên',
        code: '',
        type: 5,
        url_id: '451',
        base_id: '40'
    },
    {
        id: '510',
        name: 'Anh Sơn',
        code: '',
        type: 5,
        url_id: '452',
        base_id: '41'
    },
    {
        id: '511',
        name: 'Con Cuông',
        code: '',
        type: 5,
        url_id: '453',
        base_id: '41'
    },
    {
        id: '512',
        name: 'Cửa Lò',
        code: '',
        type: 5,
        url_id: '454',
        base_id: '41'
    },
    {
        id: '513',
        name: 'Diễn Châu',
        code: '',
        type: 5,
        url_id: '455',
        base_id: '41'
    },
    {
        id: '543',
        name: 'Thuận Bắc',
        code: '',
        type: 5,
        url_id: '485',
        base_id: '43'
    },
    {
        id: '544',
        name: 'Thuận Nam',
        code: '',
        type: 5,
        url_id: '486',
        base_id: '43'
    },
    {
        id: '545',
        name: 'Cẩm Khê',
        code: '',
        type: 5,
        url_id: '487',
        base_id: '44'
    },
    {
        id: '546',
        name: 'Đoan Hùng',
        code: '',
        type: 5,
        url_id: '488',
        base_id: '44'
    },
    {
        id: '547',
        name: 'Hạ Hòa',
        code: '',
        type: 5,
        url_id: '489',
        base_id: '44'
    },
    {
        id: '548',
        name: 'Lâm Thao',
        code: '',
        type: 5,
        url_id: '490',
        base_id: '44'
    },
    {
        id: '549',
        name: 'Phú Thọ',
        code: '',
        type: 5,
        url_id: '491',
        base_id: '44'
    },
    {
        id: '550',
        name: 'Phù Ninh',
        code: '',
        type: 5,
        url_id: '492',
        base_id: '44'
    },
    {
        id: '551',
        name: 'Tam Nông',
        code: '',
        type: 5,
        url_id: '493',
        base_id: '44'
    },
    {
        id: '552',
        name: 'Tân Sơn',
        code: '',
        type: 5,
        url_id: '494',
        base_id: '44'
    },
    {
        id: '553',
        name: 'Thanh Ba',
        code: '',
        type: 5,
        url_id: '495',
        base_id: '44'
    },
    {
        id: '554',
        name: 'Thanh Sơn',
        code: '',
        type: 5,
        url_id: '496',
        base_id: '44'
    },
    {
        id: '555',
        name: 'Thanh Thủy',
        code: '',
        type: 5,
        url_id: '497',
        base_id: '44'
    },
    {
        id: '556',
        name: 'Việt Trì',
        code: '',
        type: 5,
        url_id: '498',
        base_id: '44'
    },
    {
        id: '557',
        name: 'Yên Lập',
        code: '',
        type: 5,
        url_id: '499',
        base_id: '44'
    },
    {
        id: '558',
        name: 'Đông Hòa',
        code: '',
        type: 5,
        url_id: '500',
        base_id: '45'
    },
    {
        id: '559',
        name: 'Đồng Xuân',
        code: '',
        type: 5,
        url_id: '501',
        base_id: '45'
    },
    {
        id: '560',
        name: 'Phú Hòa',
        code: '',
        type: 5,
        url_id: '502',
        base_id: '45'
    },
    {
        id: '561',
        name: 'Sông Cầu',
        code: '',
        type: 5,
        url_id: '503',
        base_id: '45'
    },
    {
        id: '562',
        name: 'Sông Hinh',
        code: '',
        type: 5,
        url_id: '504',
        base_id: '45'
    },
    {
        id: '563',
        name: 'Sơn Hòa',
        code: '',
        type: 5,
        url_id: '505',
        base_id: '45'
    },
    {
        id: '564',
        name: 'Tây Hòa',
        code: '',
        type: 5,
        url_id: '506',
        base_id: '45'
    },
    {
        id: '565',
        name: 'Tuy An',
        code: '',
        type: 5,
        url_id: '507',
        base_id: '45'
    },
    {
        id: '566',
        name: 'Tuy Hòa',
        code: '',
        type: 5,
        url_id: '508',
        base_id: '45'
    },
    {
        id: '567',
        name: 'Bố Trạch',
        code: '',
        type: 5,
        url_id: '509',
        base_id: '46'
    },
    {
        id: '568',
        name: 'Đồng Hới',
        code: '',
        type: 5,
        url_id: '510',
        base_id: '46'
    },
    {
        id: '569',
        name: 'Lệ Thủy',
        code: '',
        type: 5,
        url_id: '511',
        base_id: '46'
    },
    {
        id: '599',
        name: 'Quảng Ngãi',
        code: '',
        type: 5,
        url_id: '541',
        base_id: '48'
    },
    {
        id: '600',
        name: 'Sơn Hà',
        code: '',
        type: 5,
        url_id: '542',
        base_id: '48'
    },
    {
        id: '601',
        name: 'Sơn Tây',
        code: '',
        type: 5,
        url_id: '543',
        base_id: '48'
    },
    {
        id: '602',
        name: 'Sơn Tịnh',
        code: '',
        type: 5,
        url_id: '544',
        base_id: '48'
    },
    {
        id: '603',
        name: 'Tây Trà',
        code: '',
        type: 5,
        url_id: '545',
        base_id: '48'
    },
    {
        id: '604',
        name: 'Trà Bồng',
        code: '',
        type: 5,
        url_id: '546',
        base_id: '48'
    },
    {
        id: '605',
        name: 'Tư Nghĩa',
        code: '',
        type: 5,
        url_id: '547',
        base_id: '48'
    },
    {
        id: '606',
        name: 'Ba Chẽ',
        code: '',
        type: 5,
        url_id: '548',
        base_id: '49'
    },
    {
        id: '607',
        name: 'Bình Liêu',
        code: '',
        type: 5,
        url_id: '549',
        base_id: '49'
    },
    {
        id: '608',
        name: 'Cẩm Phả',
        code: '',
        type: 5,
        url_id: '550',
        base_id: '49'
    },
    {
        id: '609',
        name: 'Cô Tô',
        code: '',
        type: 5,
        url_id: '551',
        base_id: '49'
    },
    {
        id: '610',
        name: 'Đầm Hà',
        code: '',
        type: 5,
        url_id: '552',
        base_id: '49'
    },
    {
        id: '611',
        name: 'Đông Triều',
        code: '',
        type: 5,
        url_id: '553',
        base_id: '49'
    },
    {
        id: '612',
        name: 'Hạ Long',
        code: '',
        type: 5,
        url_id: '554',
        base_id: '49'
    },
    {
        id: '613',
        name: 'Hải Hà',
        code: '',
        type: 5,
        url_id: '555',
        base_id: '49'
    },
    {
        id: '614',
        name: 'Hoành Bồ',
        code: '',
        type: 5,
        url_id: '556',
        base_id: '49'
    },
    {
        id: '615',
        name: 'Móng Cái',
        code: '',
        type: 5,
        url_id: '557',
        base_id: '49'
    },
    {
        id: '616',
        name: 'Quảng Yên',
        code: '',
        type: 5,
        url_id: '558',
        base_id: '49'
    },
    {
        id: '617',
        name: 'Tiên Yên',
        code: '',
        type: 5,
        url_id: '559',
        base_id: '49'
    },
    {
        id: '216',
        name: 'M`Đrăk',
        code: '',
        type: 5,
        url_id: '155',
        base_id: '16'
    },
    {
        id: '217',
        name: 'Cư Jút',
        code: '',
        type: 5,
        url_id: '156',
        base_id: '17'
    },
    {
        id: '218',
        name: 'Đăk Glong',
        code: '',
        type: 5,
        url_id: '157',
        base_id: '17'
    },
    {
        id: '219',
        name: 'Đăk Mil',
        code: '',
        type: 5,
        url_id: '158',
        base_id: '17'
    },
    {
        id: '220',
        name: 'Đăk R`Lấp',
        code: '',
        type: 5,
        url_id: '159',
        base_id: '17'
    },
    {
        id: '221',
        name: 'Đăk Song',
        code: '',
        type: 5,
        url_id: '160',
        base_id: '17'
    },
    {
        id: '222',
        name: 'Gia Nghĩa',
        code: '',
        type: 5,
        url_id: '161',
        base_id: '17'
    },
    {
        id: '223',
        name: 'Krông Nô',
        code: '',
        type: 5,
        url_id: '162',
        base_id: '17'
    },
    {
        id: '224',
        name: 'Tuy Đức',
        code: '',
        type: 5,
        url_id: '163',
        base_id: '17'
    },
    {
        id: '225',
        name: 'Điện Biên',
        code: '',
        type: 5,
        url_id: '164',
        base_id: '18'
    },
    {
        id: '226',
        name: 'Điện Biên Đông',
        code: '',
        type: 5,
        url_id: '165',
        base_id: '18'
    },
    {
        id: '227',
        name: 'Điện Biên Phủ',
        code: '',
        type: 5,
        url_id: '166',
        base_id: '18'
    },
    {
        id: '228',
        name: 'Mường Ảng',
        code: '',
        type: 5,
        url_id: '167',
        base_id: '18'
    },
    {
        id: '229',
        name: 'Mường Chà',
        code: '',
        type: 5,
        url_id: '168',
        base_id: '18'
    },
    {
        id: '230',
        name: 'Mường Lay',
        code: '',
        type: 5,
        url_id: '169',
        base_id: '18'
    },
    {
        id: '231',
        name: 'Mường Nhé',
        code: '',
        type: 5,
        url_id: '170',
        base_id: '18'
    },
    {
        id: '232',
        name: 'Nậm Pồ',
        code: '',
        type: 5,
        url_id: '171',
        base_id: '18'
    },
    {
        id: '233',
        name: 'Tủa Chùa',
        code: '',
        type: 5,
        url_id: '172',
        base_id: '18'
    },
    {
        id: '234',
        name: 'Tuần Giáo',
        code: '',
        type: 5,
        url_id: '173',
        base_id: '18'
    },
    {
        id: '235',
        name: 'Biên Hòa',
        code: '',
        type: 5,
        url_id: '174',
        base_id: '19'
    },
    {
        id: '236',
        name: 'Cẩm Mỹ',
        code: '',
        type: 5,
        url_id: '175',
        base_id: '19'
    },
    {
        id: '237',
        name: 'Định Quán',
        code: '',
        type: 5,
        url_id: '176',
        base_id: '19'
    },
    {
        id: '238',
        name: 'Long Khánh',
        code: '',
        type: 5,
        url_id: '177',
        base_id: '19'
    },
    {
        id: '239',
        name: 'Long Thành',
        code: '',
        type: 5,
        url_id: '178',
        base_id: '19'
    },
    {
        id: '240',
        name: 'Nhơn Trạch',
        code: '',
        type: 5,
        url_id: '179',
        base_id: '19'
    },
    {
        id: '241',
        name: 'Tân Phú',
        code: '',
        type: 5,
        url_id: '180',
        base_id: '19'
    },
    {
        id: '242',
        name: 'Thống Nhất',
        code: '',
        type: 5,
        url_id: '181',
        base_id: '19'
    },
    {
        id: '272',
        name: 'Mang Yang',
        code: '',
        type: 5,
        url_id: '211',
        base_id: '21'
    },
    {
        id: '273',
        name: 'Phú Thiện',
        code: '',
        type: 5,
        url_id: '212',
        base_id: '21'
    },
    {
        id: '274',
        name: 'Pleiku',
        code: '',
        type: 5,
        url_id: '213',
        base_id: '21'
    },
    {
        id: '275',
        name: 'Bắc Mê',
        code: '',
        type: 5,
        url_id: '214',
        base_id: '22'
    },
    {
        id: '276',
        name: 'Bắc Quang',
        code: '',
        type: 5,
        url_id: '215',
        base_id: '22'
    },
    {
        id: '277',
        name: 'Đồng Văn',
        code: '',
        type: 5,
        url_id: '216',
        base_id: '22'
    },
    {
        id: '278',
        name: 'Hà Giang',
        code: '',
        type: 5,
        url_id: '217',
        base_id: '22'
    },
    {
        id: '279',
        name: 'Hoàng Su Phì',
        code: '',
        type: 5,
        url_id: '218',
        base_id: '22'
    },
    {
        id: '280',
        name: 'Mèo Vạc',
        code: '',
        type: 5,
        url_id: '219',
        base_id: '22'
    },
    {
        id: '281',
        name: 'Quản Bạ',
        code: '',
        type: 5,
        url_id: '220',
        base_id: '22'
    },
    {
        id: '282',
        name: 'Quang Bình',
        code: '',
        type: 5,
        url_id: '221',
        base_id: '22'
    },
    {
        id: '283',
        name: 'Vị Xuyên',
        code: '',
        type: 5,
        url_id: '222',
        base_id: '22'
    },
    {
        id: '284',
        name: 'Xín Mần',
        code: '',
        type: 5,
        url_id: '223',
        base_id: '22'
    },
    {
        id: '285',
        name: 'Yên Minh',
        code: '',
        type: 5,
        url_id: '224',
        base_id: '22'
    },
    {
        id: '286',
        name: 'Bình Lục',
        code: '',
        type: 5,
        url_id: '225',
        base_id: '23'
    },
    {
        id: '287',
        name: 'Duy Tiên',
        code: '',
        type: 5,
        url_id: '226',
        base_id: '23'
    },
    {
        id: '288',
        name: 'Kim Bảng',
        code: '',
        type: 5,
        url_id: '227',
        base_id: '23'
    },
    {
        id: '289',
        name: 'Lý Nhân',
        code: '',
        type: 5,
        url_id: '228',
        base_id: '23'
    },
    {
        id: '290',
        name: 'Phủ Lý',
        code: '',
        type: 5,
        url_id: '229',
        base_id: '23'
    },
    {
        id: '291',
        name: 'Thanh Liêm',
        code: '',
        type: 5,
        url_id: '230',
        base_id: '23'
    },
    {
        id: '292',
        name: 'Ba Đình',
        code: '',
        type: 5,
        url_id: '231',
        base_id: '24'
    },
    {
        id: '293',
        name: 'Ba Vì',
        code: '',
        type: 5,
        url_id: '232',
        base_id: '24'
    },
    {
        id: '294',
        name: 'Cầu Giấy',
        code: '',
        type: 5,
        url_id: '233',
        base_id: '24'
    },
    {
        id: '295',
        name: 'Chương Mỹ',
        code: '',
        type: 5,
        url_id: '234',
        base_id: '24'
    },
    {
        id: '296',
        name: 'Đan Phượng',
        code: '',
        type: 5,
        url_id: '235',
        base_id: '24'
    },
    {
        id: '297',
        name: 'Đông Anh',
        code: '',
        type: 5,
        url_id: '236',
        base_id: '24'
    },
    {
        id: '298',
        name: 'Đống Đa',
        code: '',
        type: 5,
        url_id: '237',
        base_id: '24'
    },
    {
        id: '328',
        name: 'Tx.Kỳ Anh',
        code: '',
        type: 5,
        url_id: '268',
        base_id: '25'
    },
    {
        id: '329',
        name: 'Lộc Hà',
        code: '',
        type: 5,
        url_id: '269',
        base_id: '25'
    },
    {
        id: '330',
        name: 'Nghi Xuân',
        code: '',
        type: 5,
        url_id: '270',
        base_id: '25'
    },
    {
        id: '331',
        name: 'Thạch Hà',
        code: '',
        type: 5,
        url_id: '271',
        base_id: '25'
    },
    {
        id: '332',
        name: 'Vũ Quang',
        code: '',
        type: 5,
        url_id: '272',
        base_id: '25'
    },
    {
        id: '333',
        name: 'Bình Giang',
        code: '',
        type: 5,
        url_id: '273',
        base_id: '26'
    },
    {
        id: '334',
        name: 'Cẩm Giàng',
        code: '',
        type: 5,
        url_id: '274',
        base_id: '26'
    },
    {
        id: '335',
        name: 'Chí Linh',
        code: '',
        type: 5,
        url_id: '275',
        base_id: '26'
    },
    {
        id: '336',
        name: 'Gia Lộc',
        code: '',
        type: 5,
        url_id: '276',
        base_id: '26'
    },
    {
        id: '337',
        name: 'Hải Dương',
        code: '',
        type: 5,
        url_id: '277',
        base_id: '26'
    },
    {
        id: '338',
        name: 'Kim Thành',
        code: '',
        type: 5,
        url_id: '278',
        base_id: '26'
    },
    {
        id: '339',
        name: 'Kinh Môn',
        code: '',
        type: 5,
        url_id: '279',
        base_id: '26'
    },
    {
        id: '340',
        name: 'Nam Sách',
        code: '',
        type: 5,
        url_id: '280',
        base_id: '26'
    },
    {
        id: '341',
        name: 'Ninh Giang',
        code: '',
        type: 5,
        url_id: '281',
        base_id: '26'
    },
    {
        id: '342',
        name: 'Thanh Hà',
        code: '',
        type: 5,
        url_id: '282',
        base_id: '26'
    },
    {
        id: '343',
        name: 'Thanh Miện',
        code: '',
        type: 5,
        url_id: '283',
        base_id: '26'
    },
    {
        id: '344',
        name: 'Tứ Kỳ',
        code: '',
        type: 5,
        url_id: '284',
        base_id: '26'
    },
    {
        id: '345',
        name: 'An Dương',
        code: '',
        type: 5,
        url_id: '285',
        base_id: '27'
    },
    {
        id: '346',
        name: 'An Lão',
        code: '',
        type: 5,
        url_id: '286',
        base_id: '27'
    },
    {
        id: '347',
        name: 'Bạch Long Vĩ',
        code: '',
        type: 5,
        url_id: '287',
        base_id: '27'
    },
    {
        id: '348',
        name: 'Cát Hải',
        code: '',
        type: 5,
        url_id: '288',
        base_id: '27'
    },
    {
        id: '349',
        name: 'Dương Kinh',
        code: '',
        type: 5,
        url_id: '289',
        base_id: '27'
    },
    {
        id: '350',
        name: 'Đồ Sơn',
        code: '',
        type: 5,
        url_id: '290',
        base_id: '27'
    },
    {
        id: '351',
        name: 'Hải An',
        code: '',
        type: 5,
        url_id: '291',
        base_id: '27'
    },
    {
        id: '352',
        name: 'Hồng Bàng',
        code: '',
        type: 5,
        url_id: '292',
        base_id: '27'
    },
    {
        id: '353',
        name: 'Kiến An',
        code: '',
        type: 5,
        url_id: '293',
        base_id: '27'
    },
    {
        id: '354',
        name: 'Kiến Thụy',
        code: '',
        type: 5,
        url_id: '294',
        base_id: '27'
    },
    {
        id: '384',
        name: 'Quận 9',
        code: '',
        type: 5,
        url_id: '326',
        base_id: '29'
    },
    {
        id: '385',
        name: 'Quận 10',
        code: '',
        type: 5,
        url_id: '327',
        base_id: '29'
    },
    {
        id: '386',
        name: 'Quận 11',
        code: '',
        type: 5,
        url_id: '328',
        base_id: '29'
    },
    {
        id: '387',
        name: 'Quận 12',
        code: '',
        type: 5,
        url_id: '329',
        base_id: '29'
    },
    {
        id: '388',
        name: 'Tân Bình',
        code: '',
        type: 5,
        url_id: '330',
        base_id: '29'
    },
    {
        id: '389',
        name: 'Tân Phú',
        code: '',
        type: 5,
        url_id: '331',
        base_id: '29'
    },
    {
        id: '390',
        name: 'Thủ Đức',
        code: '',
        type: 5,
        url_id: '332',
        base_id: '29'
    },
    {
        id: '391',
        name: 'Cao Phong',
        code: '',
        type: 5,
        url_id: '333',
        base_id: '30'
    },
    {
        id: '392',
        name: 'Đà Bắc',
        code: '',
        type: 5,
        url_id: '334',
        base_id: '30'
    },
    {
        id: '393',
        name: 'Hoà Bình',
        code: '',
        type: 5,
        url_id: '335',
        base_id: '30'
    },
    {
        id: '394',
        name: 'Kim Bôi',
        code: '',
        type: 5,
        url_id: '336',
        base_id: '30'
    },
    {
        id: '395',
        name: 'Kỳ Sơn',
        code: '',
        type: 5,
        url_id: '337',
        base_id: '30'
    },
    {
        id: '396',
        name: 'Lạc Sơn',
        code: '',
        type: 5,
        url_id: '338',
        base_id: '30'
    },
    {
        id: '397',
        name: 'Lạc Thủy',
        code: '',
        type: 5,
        url_id: '339',
        base_id: '30'
    },
    {
        id: '398',
        name: 'Lương Sơn',
        code: '',
        type: 5,
        url_id: '340',
        base_id: '30'
    },
    {
        id: '399',
        name: 'Mai Châu',
        code: '',
        type: 5,
        url_id: '341',
        base_id: '30'
    },
    {
        id: '400',
        name: 'Tân Lạc',
        code: '',
        type: 5,
        url_id: '342',
        base_id: '30'
    },
    {
        id: '401',
        name: 'Yên Thủy',
        code: '',
        type: 5,
        url_id: '343',
        base_id: '30'
    },
    {
        id: '402',
        name: 'Ân Thi',
        code: '',
        type: 5,
        url_id: '344',
        base_id: '31'
    },
    {
        id: '403',
        name: 'Hưng Yên',
        code: '',
        type: 5,
        url_id: '345',
        base_id: '31'
    },
    {
        id: '570',
        name: 'Minh Hóa',
        code: '',
        type: 5,
        url_id: '512',
        base_id: '46'
    },
    {
        id: '571',
        name: 'Quảng Ninh',
        code: '',
        type: 5,
        url_id: '513',
        base_id: '46'
    },
    {
        id: '572',
        name: 'Quảng Trạch',
        code: '',
        type: 5,
        url_id: '514',
        base_id: '46'
    },
    {
        id: '573',
        name: 'Tuyên Hóa',
        code: '',
        type: 5,
        url_id: '515',
        base_id: '46'
    },
    {
        id: '574',
        name: 'Bắc Trà My',
        code: '',
        type: 5,
        url_id: '516',
        base_id: '47'
    },
    {
        id: '575',
        name: 'Duy Xuyên',
        code: '',
        type: 5,
        url_id: '517',
        base_id: '47'
    },
    {
        id: '576',
        name: 'Đại Lộc',
        code: '',
        type: 5,
        url_id: '518',
        base_id: '47'
    },
    {
        id: '577',
        name: 'Điện Bàn',
        code: '',
        type: 5,
        url_id: '519',
        base_id: '47'
    },
    {
        id: '578',
        name: 'Đông Giang',
        code: '',
        type: 5,
        url_id: '520',
        base_id: '47'
    },
    {
        id: '579',
        name: 'Hiệp Đức',
        code: '',
        type: 5,
        url_id: '521',
        base_id: '47'
    },
    {
        id: '580',
        name: 'Hội An',
        code: '',
        type: 5,
        url_id: '522',
        base_id: '47'
    },
    {
        id: '581',
        name: 'Nam Giang',
        code: '',
        type: 5,
        url_id: '523',
        base_id: '47'
    },
    {
        id: '582',
        name: 'Nam Trà My',
        code: '',
        type: 5,
        url_id: '524',
        base_id: '47'
    },
    {
        id: '583',
        name: 'Nông Sơn',
        code: '',
        type: 5,
        url_id: '525',
        base_id: '47'
    },
    {
        id: '618',
        name: 'Uông Bí',
        code: '',
        type: 5,
        url_id: '560',
        base_id: '49'
    },
    {
        id: '619',
        name: 'Vân Đồn',
        code: '',
        type: 5,
        url_id: '561',
        base_id: '49'
    },
    {
        id: '620',
        name: 'Cam Lộ',
        code: '',
        type: 5,
        url_id: '562',
        base_id: '50'
    },
    {
        id: '621',
        name: 'Cồn Cỏ',
        code: '',
        type: 5,
        url_id: '563',
        base_id: '50'
    },
    {
        id: '622',
        name: 'Đa Krông',
        code: '',
        type: 5,
        url_id: '564',
        base_id: '50'
    },
    {
        id: '623',
        name: 'Đông Hà',
        code: '',
        type: 5,
        url_id: '565',
        base_id: '50'
    },
    {
        id: '624',
        name: 'Gio Linh',
        code: '',
        type: 5,
        url_id: '566',
        base_id: '50'
    },
    {
        id: '625',
        name: 'Hải Lăng',
        code: '',
        type: 5,
        url_id: '567',
        base_id: '50'
    },
    {
        id: '626',
        name: 'Hướng Hoá',
        code: '',
        type: 5,
        url_id: '568',
        base_id: '50'
    },
    {
        id: '627',
        name: 'Quảng Trị',
        code: '',
        type: 5,
        url_id: '569',
        base_id: '50'
    },
    {
        id: '628',
        name: 'Triệu Phong',
        code: '',
        type: 5,
        url_id: '570',
        base_id: '50'
    },
    {
        id: '629',
        name: 'Vĩnh Linh',
        code: '',
        type: 5,
        url_id: '571',
        base_id: '50'
    },
    {
        id: '630',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '572',
        base_id: '51'
    },
    {
        id: '631',
        name: 'Cù Lao Dung',
        code: '',
        type: 5,
        url_id: '573',
        base_id: '51'
    },
    {
        id: '632',
        name: 'Kế Sách',
        code: '',
        type: 5,
        url_id: '574',
        base_id: '51'
    },
    {
        id: '633',
        name: 'Long Phú',
        code: '',
        type: 5,
        url_id: '575',
        base_id: '51'
    },
    {
        id: '634',
        name: 'Mỹ Tú',
        code: '',
        type: 5,
        url_id: '576',
        base_id: '51'
    },
    {
        id: '635',
        name: 'Mỹ Xuyên',
        code: '',
        type: 5,
        url_id: '577',
        base_id: '51'
    },
    {
        id: '636',
        name: 'Ngã Năm',
        code: '',
        type: 5,
        url_id: '578',
        base_id: '51'
    },
    {
        id: '637',
        name: 'Sóc Trăng',
        code: '',
        type: 5,
        url_id: '579',
        base_id: '51'
    },
    {
        id: '638',
        name: 'Thạnh Trị',
        code: '',
        type: 5,
        url_id: '580',
        base_id: '51'
    },
    {
        id: '639',
        name: 'Trần Đề',
        code: '',
        type: 5,
        url_id: '581',
        base_id: '51'
    },
    {
        id: '640',
        name: 'Vĩnh Châu',
        code: '',
        type: 5,
        url_id: '582',
        base_id: '51'
    },
    {
        id: '641',
        name: 'Bắc Yên',
        code: '',
        type: 5,
        url_id: '583',
        base_id: '52'
    },
    {
        id: '642',
        name: 'Mai Sơn',
        code: '',
        type: 5,
        url_id: '584',
        base_id: '52'
    },
    {
        id: '643',
        name: 'Mộc Châu',
        code: '',
        type: 5,
        url_id: '585',
        base_id: '52'
    },
    {
        id: '644',
        name: 'Mường La',
        code: '',
        type: 5,
        url_id: '586',
        base_id: '52'
    },
    {
        id: '645',
        name: 'Phù Yên',
        code: '',
        type: 5,
        url_id: '587',
        base_id: '52'
    },
    {
        id: '673',
        name: 'Phú Bình',
        code: '',
        type: 5,
        url_id: '615',
        base_id: '55'
    },
    {
        id: '674',
        name: 'Phú Lương',
        code: '',
        type: 5,
        url_id: '616',
        base_id: '55'
    },
    {
        id: '675',
        name: 'Sông Công',
        code: '',
        type: 5,
        url_id: '617',
        base_id: '55'
    },
    {
        id: '676',
        name: 'Thái Nguyên',
        code: '',
        type: 5,
        url_id: '618',
        base_id: '55'
    },
    {
        id: '677',
        name: 'Võ Nhai',
        code: '',
        type: 5,
        url_id: '619',
        base_id: '55'
    },
    {
        id: '678',
        name: 'Bá Thước',
        code: '',
        type: 5,
        url_id: '620',
        base_id: '56'
    },
    {
        id: '679',
        name: 'Bỉm Sơn',
        code: '',
        type: 5,
        url_id: '621',
        base_id: '56'
    },
    {
        id: '680',
        name: 'Cẩm Thủy',
        code: '',
        type: 5,
        url_id: '622',
        base_id: '56'
    },
    {
        id: '681',
        name: 'Đông Sơn',
        code: '',
        type: 5,
        url_id: '623',
        base_id: '56'
    },
    {
        id: '682',
        name: 'Hà Trung',
        code: '',
        type: 5,
        url_id: '624',
        base_id: '56'
    },
    {
        id: '683',
        name: 'Hậu Lộc',
        code: '',
        type: 5,
        url_id: '625',
        base_id: '56'
    },
    {
        id: '684',
        name: 'Hoằng Hóa',
        code: '',
        type: 5,
        url_id: '626',
        base_id: '56'
    },
    {
        id: '685',
        name: 'Lang Chánh',
        code: '',
        type: 5,
        url_id: '627',
        base_id: '56'
    },
    {
        id: '686',
        name: 'Mường Lát',
        code: '',
        type: 5,
        url_id: '628',
        base_id: '56'
    },
    {
        id: '729',
        name: 'Tiểu Cần',
        code: '',
        type: 5,
        url_id: '671',
        base_id: '59'
    },
    {
        id: '730',
        name: 'Trà Cú',
        code: '',
        type: 5,
        url_id: '672',
        base_id: '59'
    },
    {
        id: '731',
        name: 'Trà Vinh',
        code: '',
        type: 5,
        url_id: '673',
        base_id: '59'
    },
    {
        id: '732',
        name: 'Chiêm Hóa',
        code: '',
        type: 5,
        url_id: '674',
        base_id: '60'
    },
    {
        id: '733',
        name: 'Hàm Yên',
        code: '',
        type: 5,
        url_id: '675',
        base_id: '60'
    },
    {
        id: '734',
        name: 'Lâm Bình',
        code: '',
        type: 5,
        url_id: '676',
        base_id: '60'
    },
    {
        id: '735',
        name: 'Na Hang',
        code: '',
        type: 5,
        url_id: '677',
        base_id: '60'
    },
    {
        id: '736',
        name: 'Sơn Dương',
        code: '',
        type: 5,
        url_id: '678',
        base_id: '60'
    },
    {
        id: '737',
        name: 'Tuyên Quang',
        code: '',
        type: 5,
        url_id: '679',
        base_id: '60'
    },
    {
        id: '738',
        name: 'Yên Sơn',
        code: '',
        type: 5,
        url_id: '680',
        base_id: '60'
    },
    {
        id: '739',
        name: 'Bình Minh',
        code: '',
        type: 5,
        url_id: '681',
        base_id: '61'
    },
    {
        id: '740',
        name: 'Bình Tân',
        code: '',
        type: 5,
        url_id: '682',
        base_id: '61'
    },
    {
        id: '741',
        name: 'Long Hồ',
        code: '',
        type: 5,
        url_id: '683',
        base_id: '61'
    },
    {
        id: '742',
        name: 'Mang Thít',
        code: '',
        type: 5,
        url_id: '684',
        base_id: '61'
    },
    {
        id: '1',
        name: 'An Giang',
        code: 'AGG',
        type: 3,
        url_id: '',
        base_id: '1926'
    },
    {
        id: '2',
        name: 'Bà Rịa-Vũng Tàu',
        code: 'VTU',
        type: 3,
        url_id: '2',
        base_id: '1926'
    },
    {
        id: '3',
        name: 'Bắc Giang',
        code: 'BGG',
        type: 3,
        url_id: '3',
        base_id: '1926'
    },
    {
        id: '4',
        name: 'Bắc Kạn',
        code: 'BKN',
        type: 3,
        url_id: '',
        base_id: '1926'
    },
    {
        id: '5',
        name: 'Bạc Liêu',
        code: 'BLU',
        type: 3,
        url_id: '',
        base_id: '1926'
    },
    {
        id: '6',
        name: 'Bắc Ninh',
        code: 'BNH',
        type: 3,
        url_id: '6',
        base_id: '1926'
    },
    {
        id: '7',
        name: 'Bến Tre',
        code: 'BTE',
        type: 3,
        url_id: '7',
        base_id: '1926'
    },
    {
        id: '8',
        name: 'Bình Định',
        code: 'BDH',
        type: 3,
        url_id: '8',
        base_id: '1926'
    },
    {
        id: '9',
        name: 'Bình Dương',
        code: 'BDG',
        type: 3,
        url_id: '9',
        base_id: '1926'
    },
    {
        id: '10',
        name: 'Bình Phước',
        code: 'BPC',
        type: 3,
        url_id: '10',
        base_id: '1926'
    },
    {
        id: '11',
        name: 'Bình Thuận',
        code: 'BTN',
        type: 3,
        url_id: '11',
        base_id: '1926'
    },
    {
        id: '12',
        name: 'Cà Mau',
        code: 'CMU',
        type: 3,
        url_id: '12',
        base_id: '1926'
    },
    {
        id: '13',
        name: 'Cần Thơ',
        code: 'CTO',
        type: 3,
        url_id: '13',
        base_id: '1926'
    },
    {
        id: '14',
        name: 'Cao Bằng',
        code: 'CBG',
        type: 3,
        url_id: '14',
        base_id: '1926'
    },
    {
        id: '15',
        name: 'Đà Nẵng',
        code: 'DNA',
        type: 3,
        url_id: '15',
        base_id: '1926'
    },
    {
        id: '16',
        name: 'Đắk Lắk',
        code: 'DLK',
        type: 3,
        url_id: '16',
        base_id: '1926'
    },
    {
        id: '17',
        name: 'Đăk Nông',
        code: 'DNG',
        type: 3,
        url_id: '17',
        base_id: '1926'
    },
    {
        id: '18',
        name: 'Điện Biên',
        code: 'DBN',
        type: 3,
        url_id: '18',
        base_id: '1926'
    },
    {
        id: '19',
        name: 'Đồng Nai',
        code: 'DNI',
        type: 3,
        url_id: '19',
        base_id: '1926'
    },
    {
        id: '20',
        name: 'Đồng Tháp',
        code: 'DTP',
        type: 3,
        url_id: '20',
        base_id: '1926'
    },
    {
        id: '21',
        name: 'Gia Lai',
        code: 'GLI',
        type: 3,
        url_id: '21',
        base_id: '1926'
    },
    {
        id: '22',
        name: 'Hà Giang',
        code: 'HGG',
        type: 3,
        url_id: '22',
        base_id: '1926'
    },
    {
        id: '23',
        name: 'Hà Nam',
        code: 'HNM',
        type: 3,
        url_id: '23',
        base_id: '1926'
    },
    {
        id: '24',
        name: 'Hà Nội',
        code: 'HNI',
        type: 3,
        url_id: '24',
        base_id: '1926'
    },
    {
        id: '25',
        name: 'Hà Tĩnh',
        code: 'HTH',
        type: 3,
        url_id: '25',
        base_id: '1926'
    },
    {
        id: '26',
        name: 'Hải Dương',
        code: 'HDG',
        type: 3,
        url_id: '26',
        base_id: '1926'
    },
    {
        id: '55',
        name: 'Thái Nguyên',
        code: 'TNN',
        type: 3,
        url_id: '55',
        base_id: '1926'
    },
    {
        id: '56',
        name: 'Thanh Hóa',
        code: 'THA',
        type: 3,
        url_id: '56',
        base_id: '1926'
    },
    {
        id: '57',
        name: 'Thừa Thiên-Huế',
        code: 'TTE',
        type: 3,
        url_id: '57',
        base_id: '1926'
    },
    {
        id: '58',
        name: 'Tiền Giang',
        code: 'TGG',
        type: 3,
        url_id: '58',
        base_id: '1926'
    },
    {
        id: '59',
        name: 'Trà Vinh',
        code: 'TVH',
        type: 3,
        url_id: '59',
        base_id: '1926'
    },
    {
        id: '60',
        name: 'Tuyên Quang',
        code: 'TQG',
        type: 3,
        url_id: '60',
        base_id: '1926'
    },
    {
        id: '61',
        name: 'Vĩnh Long',
        code: 'VLG',
        type: 3,
        url_id: '61',
        base_id: '1926'
    },
    {
        id: '62',
        name: 'Vĩnh Phúc',
        code: 'VPC',
        type: 3,
        url_id: '62',
        base_id: '1926'
    },
    {
        id: '63',
        name: 'Yên Bái',
        code: 'YBI',
        type: 3,
        url_id: '63',
        base_id: '1926'
    },
    {
        id: '64',
        name: 'An Phú',
        code: '',
        type: 5,
        url_id: '1',
        base_id: '1'
    },
    {
        id: '65',
        name: 'Châu Đốc',
        code: '',
        type: 5,
        url_id: '2',
        base_id: '1'
    },
    {
        id: '66',
        name: 'Châu Phú',
        code: '',
        type: 5,
        url_id: '3',
        base_id: '1'
    },
    {
        id: '67',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '4',
        base_id: '1'
    },
    {
        id: '68',
        name: 'Chợ Mới',
        code: '',
        type: 5,
        url_id: '5',
        base_id: '1'
    },
    {
        id: '69',
        name: 'Long Xuyên',
        code: '',
        type: 5,
        url_id: '6',
        base_id: '1'
    },
    {
        id: '70',
        name: 'Phú Tân',
        code: '',
        type: 5,
        url_id: '7',
        base_id: '1'
    },
    {
        id: '71',
        name: 'Tân Châu',
        code: '',
        type: 5,
        url_id: '8',
        base_id: '1'
    },
    {
        id: '72',
        name: 'Thoại Sơn',
        code: '',
        type: 5,
        url_id: '9',
        base_id: '1'
    },
    {
        id: '73',
        name: 'Tịnh Biên',
        code: '',
        type: 5,
        url_id: '10',
        base_id: '1'
    },
    {
        id: '74',
        name: 'Tri Tôn',
        code: '',
        type: 5,
        url_id: '11',
        base_id: '1'
    },
    {
        id: '75',
        name: 'Tân Thành',
        code: '',
        type: 5,
        url_id: '12',
        base_id: '2'
    },
    {
        id: '76',
        name: 'Vũng Tàu',
        code: '',
        type: 5,
        url_id: '13',
        base_id: '2'
    },
    {
        id: '77',
        name: 'Xuyên Mộc',
        code: '',
        type: 5,
        url_id: '14',
        base_id: '2'
    },
    {
        id: '78',
        name: 'Bà Rịa',
        code: '',
        type: 5,
        url_id: '15',
        base_id: '2'
    },
    {
        id: '79',
        name: 'Châu Đức',
        code: '',
        type: 5,
        url_id: '16',
        base_id: '2'
    },
    {
        id: '80',
        name: 'Côn Đảo',
        code: '',
        type: 5,
        url_id: '17',
        base_id: '2'
    },
    {
        id: '81',
        name: 'Đất Đỏ',
        code: '',
        type: 5,
        url_id: '18',
        base_id: '2'
    },
    {
        id: '111',
        name: 'Quế Võ',
        code: '',
        type: 5,
        url_id: '48',
        base_id: '6'
    },
    {
        id: '112',
        name: 'Thuận Thành',
        code: '',
        type: 5,
        url_id: '49',
        base_id: '6'
    },
    {
        id: '113',
        name: 'Tiên Du',
        code: '',
        type: 5,
        url_id: '50',
        base_id: '6'
    },
    {
        id: '114',
        name: 'Từ Sơn',
        code: '',
        type: 5,
        url_id: '51',
        base_id: '6'
    },
    {
        id: '115',
        name: 'Yên Phong',
        code: '',
        type: 5,
        url_id: '52',
        base_id: '6'
    },
    {
        id: '116',
        name: 'Ba Tri',
        code: '',
        type: 5,
        url_id: '53',
        base_id: '7'
    },
    {
        id: '117',
        name: 'Bến Tre',
        code: '',
        type: 5,
        url_id: '54',
        base_id: '7'
    },
    {
        id: '118',
        name: 'Bình Đại',
        code: '',
        type: 5,
        url_id: '55',
        base_id: '7'
    },
    {
        id: '119',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '56',
        base_id: '7'
    },
    {
        id: '120',
        name: 'Chợ Lách',
        code: '',
        type: 5,
        url_id: '57',
        base_id: '7'
    },
    {
        id: '121',
        name: 'Giồng Trôm',
        code: '',
        type: 5,
        url_id: '58',
        base_id: '7'
    },
    {
        id: '122',
        name: 'Mỏ Cày Bắc',
        code: '',
        type: 5,
        url_id: '59',
        base_id: '7'
    },
    {
        id: '123',
        name: 'Mỏ Cày Nam',
        code: '',
        type: 5,
        url_id: '60',
        base_id: '7'
    },
    {
        id: '124',
        name: 'Thạnh Phú',
        code: '',
        type: 5,
        url_id: '61',
        base_id: '7'
    },
    {
        id: '125',
        name: 'An Lão',
        code: '',
        type: 5,
        url_id: '62',
        base_id: '8'
    },
    {
        id: '126',
        name: 'An Nhơn',
        code: '',
        type: 5,
        url_id: '63',
        base_id: '8'
    },
    {
        id: '127',
        name: 'Hoài Ân',
        code: '',
        type: 5,
        url_id: '64',
        base_id: '8'
    },
    {
        id: '128',
        name: 'Hoài Nhơn',
        code: '',
        type: 5,
        url_id: '65',
        base_id: '8'
    },
    {
        id: '129',
        name: 'Phù Cát',
        code: '',
        type: 5,
        url_id: '66',
        base_id: '8'
    },
    {
        id: '130',
        name: 'Phù Mỹ',
        code: '',
        type: 5,
        url_id: '67',
        base_id: '8'
    },
    {
        id: '131',
        name: 'Quy Nhơn',
        code: '',
        type: 5,
        url_id: '68',
        base_id: '8'
    },
    {
        id: '132',
        name: 'Tây Sơn',
        code: '',
        type: 5,
        url_id: '69',
        base_id: '8'
    },
    {
        id: '133',
        name: 'Tuy Phước',
        code: '',
        type: 5,
        url_id: '70',
        base_id: '8'
    },
    {
        id: '134',
        name: 'Vân Canh',
        code: '',
        type: 5,
        url_id: '71',
        base_id: '8'
    },
    {
        id: '135',
        name: 'Vĩnh Thạnh',
        code: '',
        type: 5,
        url_id: '72',
        base_id: '8'
    },
    {
        id: '136',
        name: 'Bến Cát',
        code: '',
        type: 5,
        url_id: '73',
        base_id: '9'
    },
    {
        id: '137',
        name: 'Dầu Tiếng',
        code: '',
        type: 5,
        url_id: '74',
        base_id: '9'
    },
    {
        id: '167',
        name: 'Ngọc Hiển',
        code: '',
        type: 5,
        url_id: '104',
        base_id: '12'
    },
    {
        id: '168',
        name: 'Phú Tân',
        code: '',
        type: 5,
        url_id: '105',
        base_id: '12'
    },
    {
        id: '169',
        name: 'Thới Bình',
        code: '',
        type: 5,
        url_id: '106',
        base_id: '12'
    },
    {
        id: '170',
        name: 'Trần Văn Thời',
        code: '',
        type: 5,
        url_id: '107',
        base_id: '12'
    },
    {
        id: '171',
        name: 'U Minh',
        code: '',
        type: 5,
        url_id: '108',
        base_id: '12'
    },
    {
        id: '172',
        name: 'Bình Thủy',
        code: '',
        type: 5,
        url_id: '109',
        base_id: '13'
    },
    {
        id: '173',
        name: 'Cái Răng',
        code: '',
        type: 5,
        url_id: '110',
        base_id: '13'
    },
    {
        id: '174',
        name: 'Cờ Đỏ',
        code: '',
        type: 5,
        url_id: '111',
        base_id: '13'
    },
    {
        id: '175',
        name: 'Ninh Kiều',
        code: '',
        type: 5,
        url_id: '112',
        base_id: '13'
    },
    {
        id: '176',
        name: 'Ô Môn',
        code: '',
        type: 5,
        url_id: '113',
        base_id: '13'
    },
    {
        id: '177',
        name: 'Phong Điền',
        code: '',
        type: 5,
        url_id: '114',
        base_id: '13'
    },
    {
        id: '178',
        name: 'Thốt Nốt',
        code: '',
        type: 5,
        url_id: '115',
        base_id: '13'
    },
    {
        id: '179',
        name: 'Thới Lai',
        code: '',
        type: 5,
        url_id: '116',
        base_id: '13'
    },
    {
        id: '180',
        name: 'Vĩnh Thạnh',
        code: '',
        type: 5,
        url_id: '117',
        base_id: '13'
    },
    {
        id: '181',
        name: 'Bảo Lạc',
        code: '',
        type: 5,
        url_id: '119',
        base_id: '14'
    },
    {
        id: '182',
        name: 'Bảo Lâm',
        code: '',
        type: 5,
        url_id: '120',
        base_id: '14'
    },
    {
        id: '183',
        name: 'Cao Bằng',
        code: '',
        type: 5,
        url_id: '121',
        base_id: '14'
    },
    {
        id: '184',
        name: 'Hà Quảng',
        code: '',
        type: 5,
        url_id: '122',
        base_id: '14'
    },
    {
        id: '185',
        name: 'Hạ Lang',
        code: '',
        type: 5,
        url_id: '123',
        base_id: '14'
    },
    {
        id: '186',
        name: 'Hòa An',
        code: '',
        type: 5,
        url_id: '124',
        base_id: '14'
    },
    {
        id: '646',
        name: 'Quỳnh Nhai',
        code: '',
        type: 5,
        url_id: '588',
        base_id: '52'
    },
    {
        id: '647',
        name: 'Sông Mã',
        code: '',
        type: 5,
        url_id: '589',
        base_id: '52'
    },
    {
        id: '648',
        name: 'Sốp Cộp',
        code: '',
        type: 5,
        url_id: '590',
        base_id: '52'
    },
    {
        id: '649',
        name: 'Sơn La',
        code: '',
        type: 5,
        url_id: '591',
        base_id: '52'
    },
    {
        id: '650',
        name: 'Thuận Châu',
        code: '',
        type: 5,
        url_id: '592',
        base_id: '52'
    },
    {
        id: '651',
        name: 'Yên Châu',
        code: '',
        type: 5,
        url_id: '593',
        base_id: '52'
    },
    {
        id: '652',
        name: 'Bến Cầu',
        code: '',
        type: 5,
        url_id: '594',
        base_id: '53'
    },
    {
        id: '653',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '595',
        base_id: '53'
    },
    {
        id: '654',
        name: 'Dương Minh Châu',
        code: '',
        type: 5,
        url_id: '596',
        base_id: '53'
    },
    {
        id: '655',
        name: 'Gò Dầu',
        code: '',
        type: 5,
        url_id: '597',
        base_id: '53'
    },
    {
        id: '656',
        name: 'Hòa Thành',
        code: '',
        type: 5,
        url_id: '598',
        base_id: '53'
    },
    {
        id: '657',
        name: 'Tân Biên',
        code: '',
        type: 5,
        url_id: '599',
        base_id: '53'
    },
    {
        id: '658',
        name: 'Tân Châu',
        code: '',
        type: 5,
        url_id: '600',
        base_id: '53'
    },
    {
        id: '659',
        name: 'Tây Ninh',
        code: '',
        type: 5,
        url_id: '601',
        base_id: '53'
    },
    {
        id: '660',
        name: 'Trảng Bàng',
        code: '',
        type: 5,
        url_id: '602',
        base_id: '53'
    },
    {
        id: '661',
        name: 'Đông Hưng',
        code: '',
        type: 5,
        url_id: '603',
        base_id: '54'
    },
    {
        id: '662',
        name: 'Hưng Hà',
        code: '',
        type: 5,
        url_id: '604',
        base_id: '54'
    },
    {
        id: '663',
        name: 'Kiến Xương',
        code: '',
        type: 5,
        url_id: '605',
        base_id: '54'
    },
    {
        id: '664',
        name: 'Quỳnh Phụ',
        code: '',
        type: 5,
        url_id: '606',
        base_id: '54'
    },
    {
        id: '665',
        name: 'Thái Bình',
        code: '',
        type: 5,
        url_id: '607',
        base_id: '54'
    },
    {
        id: '666',
        name: 'Thái Thụy',
        code: '',
        type: 5,
        url_id: '608',
        base_id: '54'
    },
    {
        id: '667',
        name: 'Tiền Hải',
        code: '',
        type: 5,
        url_id: '609',
        base_id: '54'
    },
    {
        id: '668',
        name: 'Vũ Thư',
        code: '',
        type: 5,
        url_id: '610',
        base_id: '54'
    },
    {
        id: '669',
        name: 'Đại Từ',
        code: '',
        type: 5,
        url_id: '611',
        base_id: '55'
    },
    {
        id: '670',
        name: 'Định Hóa',
        code: '',
        type: 5,
        url_id: '612',
        base_id: '55'
    },
    {
        id: '671',
        name: 'Đồng Hỷ',
        code: '',
        type: 5,
        url_id: '613',
        base_id: '55'
    },
    {
        id: '672',
        name: 'Phổ Yên',
        code: '',
        type: 5,
        url_id: '614',
        base_id: '55'
    },
    {
        id: '702',
        name: 'Triệu Sơn',
        code: '',
        type: 5,
        url_id: '644',
        base_id: '56'
    },
    {
        id: '703',
        name: 'Vĩnh Lộc',
        code: '',
        type: 5,
        url_id: '645',
        base_id: '56'
    },
    {
        id: '704',
        name: 'Yên Định',
        code: '',
        type: 5,
        url_id: '646',
        base_id: '56'
    },
    {
        id: '705',
        name: 'Huế',
        code: '',
        type: 5,
        url_id: '647',
        base_id: '57'
    },
    {
        id: '706',
        name: 'Hương Thủy',
        code: '',
        type: 5,
        url_id: '648',
        base_id: '57'
    },
    {
        id: '707',
        name: 'Hương Trà',
        code: '',
        type: 5,
        url_id: '649',
        base_id: '57'
    },
    {
        id: '708',
        name: 'Nam Đông',
        code: '',
        type: 5,
        url_id: '650',
        base_id: '57'
    },
    {
        id: '709',
        name: 'A Lưới',
        code: '',
        type: 5,
        url_id: '651',
        base_id: '57'
    },
    {
        id: '710',
        name: 'Phong Điền',
        code: '',
        type: 5,
        url_id: '652',
        base_id: '57'
    },
    {
        id: '711',
        name: 'Phú Lộc',
        code: '',
        type: 5,
        url_id: '653',
        base_id: '57'
    },
    {
        id: '712',
        name: 'Phú Vang',
        code: '',
        type: 5,
        url_id: '654',
        base_id: '57'
    },
    {
        id: '713',
        name: 'Quảng Điền',
        code: '',
        type: 5,
        url_id: '655',
        base_id: '57'
    },
    {
        id: '714',
        name: 'Tx.Cai Lậy',
        code: '',
        type: 5,
        url_id: '656',
        base_id: '58'
    },
    {
        id: '715',
        name: 'Cái Bè',
        code: '',
        type: 5,
        url_id: '657',
        base_id: '58'
    },
    {
        id: '716',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '658',
        base_id: '58'
    },
    {
        id: '717',
        name: 'Chợ Gạo',
        code: '',
        type: 5,
        url_id: '659',
        base_id: '58'
    },
    {
        id: '718',
        name: 'Gò Công',
        code: '',
        type: 5,
        url_id: '660',
        base_id: '58'
    },
    {
        id: '719',
        name: 'Gò Công Đông',
        code: '',
        type: 5,
        url_id: '661',
        base_id: '58'
    },
    {
        id: '720',
        name: 'Gò Công Tây',
        code: '',
        type: 5,
        url_id: '662',
        base_id: '58'
    },
    {
        id: '721',
        name: 'Mỹ Tho',
        code: '',
        type: 5,
        url_id: '663',
        base_id: '58'
    },
    {
        id: '722',
        name: 'Tân Phú Đông',
        code: '',
        type: 5,
        url_id: '664',
        base_id: '58'
    },
    {
        id: '723',
        name: 'Tân Phước',
        code: '',
        type: 5,
        url_id: '665',
        base_id: '58'
    },
    {
        id: '724',
        name: 'Càng Long',
        code: '',
        type: 5,
        url_id: '666',
        base_id: '59'
    },
    {
        id: '725',
        name: 'Cầu Kè',
        code: '',
        type: 5,
        url_id: '667',
        base_id: '59'
    },
    {
        id: '726',
        name: 'Cầu Ngang',
        code: '',
        type: 5,
        url_id: '668',
        base_id: '59'
    },
    {
        id: '727',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '669',
        base_id: '59'
    },
    {
        id: '728',
        name: 'Tx.Duyên Hải',
        code: '',
        type: 5,
        url_id: '670',
        base_id: '59'
    },
    {
        id: '758',
        name: 'Nghĩa Lộ',
        code: '',
        type: 5,
        url_id: '700',
        base_id: '63'
    },
    {
        id: '759',
        name: 'Trạm Tấu',
        code: '',
        type: 5,
        url_id: '701',
        base_id: '63'
    },
    {
        id: '760',
        name: 'Trấn Yên',
        code: '',
        type: 5,
        url_id: '702',
        base_id: '63'
    },
    {
        id: '761',
        name: 'Văn Chấn',
        code: '',
        type: 5,
        url_id: '703',
        base_id: '63'
    },
    {
        id: '762',
        name: 'Văn Yên',
        code: '',
        type: 5,
        url_id: '704',
        base_id: '63'
    },
    {
        id: '763',
        name: 'Yên Bái',
        code: '',
        type: 5,
        url_id: '705',
        base_id: '63'
    },
    {
        id: '764',
        name: 'Yên Bình',
        code: '',
        type: 5,
        url_id: '706',
        base_id: '63'
    },
    {
        id: '138',
        name: 'Dĩ An',
        code: '',
        type: 5,
        url_id: '75',
        base_id: '9'
    },
    {
        id: '139',
        name: 'Phú Giáo',
        code: '',
        type: 5,
        url_id: '76',
        base_id: '9'
    },
    {
        id: '140',
        name: 'Tân Uyên',
        code: '',
        type: 5,
        url_id: '77',
        base_id: '9'
    },
    {
        id: '141',
        name: 'Thủ Dầu Một',
        code: '',
        type: 5,
        url_id: '78',
        base_id: '9'
    },
    {
        id: '142',
        name: 'Thuận An',
        code: '',
        type: 5,
        url_id: '79',
        base_id: '9'
    },
    {
        id: '143',
        name: 'Bình Long',
        code: '',
        type: 5,
        url_id: '80',
        base_id: '10'
    },
    {
        id: '144',
        name: 'Bù Đăng',
        code: '',
        type: 5,
        url_id: '81',
        base_id: '10'
    },
    {
        id: '145',
        name: 'Bù Đốp',
        code: '',
        type: 5,
        url_id: '82',
        base_id: '10'
    },
    {
        id: '146',
        name: 'Bù Gia Mập',
        code: '',
        type: 5,
        url_id: '83',
        base_id: '10'
    },
    {
        id: '147',
        name: 'Chơn Thành',
        code: '',
        type: 5,
        url_id: '84',
        base_id: '10'
    },
    {
        id: '148',
        name: 'Đồng Phú',
        code: '',
        type: 5,
        url_id: '85',
        base_id: '10'
    },
    {
        id: '149',
        name: 'Đồng Xoài',
        code: '',
        type: 5,
        url_id: '86',
        base_id: '10'
    },
    {
        id: '150',
        name: 'Hớn Quản',
        code: '',
        type: 5,
        url_id: '87',
        base_id: '10'
    },
    {
        id: '151',
        name: 'Lộc Ninh',
        code: '',
        type: 5,
        url_id: '88',
        base_id: '10'
    },
    {
        id: '187',
        name: 'Nguyên Bình',
        code: '',
        type: 5,
        url_id: '125',
        base_id: '14'
    },
    {
        id: '188',
        name: 'Phục Hòa',
        code: '',
        type: 5,
        url_id: '126',
        base_id: '14'
    },
    {
        id: '189',
        name: 'Quảng Uyên',
        code: '',
        type: 5,
        url_id: '127',
        base_id: '14'
    },
    {
        id: '190',
        name: 'Thạch An',
        code: '',
        type: 5,
        url_id: '128',
        base_id: '14'
    },
    {
        id: '191',
        name: 'Thông Nông',
        code: '',
        type: 5,
        url_id: '129',
        base_id: '14'
    },
    {
        id: '192',
        name: 'Trà Lĩnh',
        code: '',
        type: 5,
        url_id: '130',
        base_id: '14'
    },
    {
        id: '193',
        name: 'Trùng Khánh',
        code: '',
        type: 5,
        url_id: '131',
        base_id: '14'
    },
    {
        id: '194',
        name: 'Cẩm Lệ',
        code: '',
        type: 5,
        url_id: '132',
        base_id: '15'
    },
    {
        id: '195',
        name: 'Hải Châu',
        code: '',
        type: 5,
        url_id: '133',
        base_id: '15'
    },
    {
        id: '196',
        name: 'Hoà Vang',
        code: '',
        type: 5,
        url_id: '134',
        base_id: '15'
    },
    {
        id: '197',
        name: 'Hoàng Sa',
        code: '',
        type: 5,
        url_id: '135',
        base_id: '15'
    },
    {
        id: '198',
        name: 'Liên Chiểu',
        code: '',
        type: 5,
        url_id: '136',
        base_id: '15'
    },
    {
        id: '199',
        name: 'Ngũ Hành Sơn',
        code: '',
        type: 5,
        url_id: '137',
        base_id: '15'
    },
    {
        id: '200',
        name: 'Sơn Trà',
        code: '',
        type: 5,
        url_id: '138',
        base_id: '15'
    },
    {
        id: '243',
        name: 'Trảng Bom',
        code: '',
        type: 5,
        url_id: '182',
        base_id: '19'
    },
    {
        id: '244',
        name: 'Vĩnh Cửu',
        code: '',
        type: 5,
        url_id: '183',
        base_id: '19'
    },
    {
        id: '245',
        name: 'Xuân Lộc',
        code: '',
        type: 5,
        url_id: '184',
        base_id: '19'
    },
    {
        id: '246',
        name: 'Tp.Cao Lãnh',
        code: '',
        type: 5,
        url_id: '185',
        base_id: '20'
    },
    {
        id: '247',
        name: 'H.Cao Lãnh',
        code: '',
        type: 5,
        url_id: '186',
        base_id: '20'
    },
    {
        id: '248',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '187',
        base_id: '20'
    },
    {
        id: '249',
        name: 'Tx.Hồng Ngự',
        code: '',
        type: 5,
        url_id: '188',
        base_id: '20'
    },
    {
        id: '250',
        name: 'H.Hồng Ngự',
        code: '',
        type: 5,
        url_id: '189',
        base_id: '20'
    },
    {
        id: '251',
        name: 'Lai Vung',
        code: '',
        type: 5,
        url_id: '190',
        base_id: '20'
    },
    {
        id: '252',
        name: 'Lấp Vò',
        code: '',
        type: 5,
        url_id: '191',
        base_id: '20'
    },
    {
        id: '253',
        name: 'Sa Đéc',
        code: '',
        type: 5,
        url_id: '192',
        base_id: '20'
    },
    {
        id: '254',
        name: 'Tam Nông',
        code: '',
        type: 5,
        url_id: '193',
        base_id: '20'
    },
    {
        id: '255',
        name: 'Tân Hồng',
        code: '',
        type: 5,
        url_id: '194',
        base_id: '20'
    },
    {
        id: '256',
        name: 'Thanh Bình',
        code: '',
        type: 5,
        url_id: '195',
        base_id: '20'
    },
    {
        id: '257',
        name: 'Tháp Mười',
        code: '',
        type: 5,
        url_id: '196',
        base_id: '20'
    },
    {
        id: '258',
        name: 'An Khê',
        code: '',
        type: 5,
        url_id: '197',
        base_id: '21'
    },
    {
        id: '259',
        name: 'Ayun Pa',
        code: '',
        type: 5,
        url_id: '198',
        base_id: '21'
    },
    {
        id: '260',
        name: 'Chư Păh',
        code: '',
        type: 5,
        url_id: '199',
        base_id: '21'
    },
    {
        id: '261',
        name: 'Chư Prông',
        code: '',
        type: 5,
        url_id: '200',
        base_id: '21'
    },
    {
        id: '262',
        name: 'Chư Pưh',
        code: '',
        type: 5,
        url_id: '201',
        base_id: '21'
    },
    {
        id: '263',
        name: 'Chư Sê',
        code: '',
        type: 5,
        url_id: '202',
        base_id: '21'
    },
    {
        id: '264',
        name: 'Đăk Đoa',
        code: '',
        type: 5,
        url_id: '203',
        base_id: '21'
    },
    {
        id: '265',
        name: 'Đắk Pơ',
        code: '',
        type: 5,
        url_id: '204',
        base_id: '21'
    },
    {
        id: '266',
        name: 'Đức Cơ',
        code: '',
        type: 5,
        url_id: '205',
        base_id: '21'
    },
    {
        id: '267',
        name: 'Ia Grai',
        code: '',
        type: 5,
        url_id: '206',
        base_id: '21'
    },
    {
        id: '268',
        name: 'Ia Pa',
        code: '',
        type: 5,
        url_id: '207',
        base_id: '21'
    },
    {
        id: '269',
        name: 'KBang',
        code: '',
        type: 5,
        url_id: '208',
        base_id: '21'
    },
    {
        id: '270',
        name: 'Kông Chro',
        code: '',
        type: 5,
        url_id: '209',
        base_id: '21'
    },
    {
        id: '271',
        name: 'Krông Pa',
        code: '',
        type: 5,
        url_id: '210',
        base_id: '21'
    },
    {
        id: '299',
        name: 'Gia Lâm',
        code: '',
        type: 5,
        url_id: '238',
        base_id: '24'
    },
    {
        id: '300',
        name: 'Hà Đông',
        code: '',
        type: 5,
        url_id: '239',
        base_id: '24'
    },
    {
        id: '301',
        name: 'Hai Bà Trưng',
        code: '',
        type: 5,
        url_id: '240',
        base_id: '24'
    },
    {
        id: '302',
        name: 'Hoài Đức',
        code: '',
        type: 5,
        url_id: '241',
        base_id: '24'
    },
    {
        id: '303',
        name: 'Hoàn Kiếm',
        code: '',
        type: 5,
        url_id: '242',
        base_id: '24'
    },
    {
        id: '304',
        name: 'Hoàng Mai',
        code: '',
        type: 5,
        url_id: '243',
        base_id: '24'
    },
    {
        id: '305',
        name: 'Long Biên',
        code: '',
        type: 5,
        url_id: '244',
        base_id: '24'
    },
    {
        id: '306',
        name: 'Mê Linh',
        code: '',
        type: 5,
        url_id: '245',
        base_id: '24'
    },
    {
        id: '307',
        name: 'Mỹ Đức',
        code: '',
        type: 5,
        url_id: '246',
        base_id: '24'
    },
    {
        id: '308',
        name: 'Phú Xuyên',
        code: '',
        type: 5,
        url_id: '247',
        base_id: '24'
    },
    {
        id: '309',
        name: 'Phúc Thọ',
        code: '',
        type: 5,
        url_id: '248',
        base_id: '24'
    },
    {
        id: '310',
        name: 'Quốc Oai',
        code: '',
        type: 5,
        url_id: '249',
        base_id: '24'
    },
    {
        id: '311',
        name: 'Sóc Sơn',
        code: '',
        type: 5,
        url_id: '250',
        base_id: '24'
    },
    {
        id: '312',
        name: 'Sơn Tây',
        code: '',
        type: 5,
        url_id: '251',
        base_id: '24'
    },
    {
        id: '355',
        name: 'Lê Chân',
        code: '',
        type: 5,
        url_id: '295',
        base_id: '27'
    },
    {
        id: '356',
        name: 'Ngô Quyền',
        code: '',
        type: 5,
        url_id: '296',
        base_id: '27'
    },
    {
        id: '357',
        name: 'Thuỷ Nguyên',
        code: '',
        type: 5,
        url_id: '297',
        base_id: '27'
    },
    {
        id: '358',
        name: 'Tiên Lãng',
        code: '',
        type: 5,
        url_id: '298',
        base_id: '27'
    },
    {
        id: '359',
        name: 'Vĩnh Bảo',
        code: '',
        type: 5,
        url_id: '299',
        base_id: '27'
    },
    {
        id: '360',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '301',
        base_id: '28'
    },
    {
        id: '361',
        name: 'Châu Thành A',
        code: '',
        type: 5,
        url_id: '302',
        base_id: '28'
    },
    {
        id: '362',
        name: 'Tx.Long Mỹ',
        code: '',
        type: 5,
        url_id: '303',
        base_id: '28'
    },
    {
        id: '363',
        name: 'Ngã Bảy',
        code: '',
        type: 5,
        url_id: '304',
        base_id: '28'
    },
    {
        id: '364',
        name: 'Phụng Hiệp',
        code: '',
        type: 5,
        url_id: '305',
        base_id: '28'
    },
    {
        id: '365',
        name: 'Vị Thanh',
        code: '',
        type: 5,
        url_id: '306',
        base_id: '28'
    },
    {
        id: '366',
        name: 'Vị Thủy',
        code: '',
        type: 5,
        url_id: '307',
        base_id: '28'
    },
    {
        id: '367',
        name: 'Bình Chánh',
        code: '',
        type: 5,
        url_id: '309',
        base_id: '29'
    },
    {
        id: '368',
        name: 'Bình Tân',
        code: '',
        type: 5,
        url_id: '310',
        base_id: '29'
    },
    {
        id: '369',
        name: 'Bình Thạnh',
        code: '',
        type: 5,
        url_id: '311',
        base_id: '29'
    },
    {
        id: '370',
        name: 'Cần Giờ',
        code: '',
        type: 5,
        url_id: '312',
        base_id: '29'
    },
    {
        id: '371',
        name: 'Củ Chi',
        code: '',
        type: 5,
        url_id: '313',
        base_id: '29'
    },
    {
        id: '372',
        name: 'Gò Vấp',
        code: '',
        type: 5,
        url_id: '314',
        base_id: '29'
    },
    {
        id: '373',
        name: 'Hóc Môn',
        code: '',
        type: 5,
        url_id: '315',
        base_id: '29'
    },
    {
        id: '374',
        name: 'Nhà Bè',
        code: '',
        type: 5,
        url_id: '316',
        base_id: '29'
    },
    {
        id: '375',
        name: 'Phú Nhuận',
        code: '',
        type: 5,
        url_id: '317',
        base_id: '29'
    },
    {
        id: '376',
        name: 'Quận 1',
        code: '',
        type: 5,
        url_id: '318',
        base_id: '29'
    },
    {
        id: '377',
        name: 'Quận 2',
        code: '',
        type: 5,
        url_id: '319',
        base_id: '29'
    },
    {
        id: '378',
        name: 'Quận 3',
        code: '',
        type: 5,
        url_id: '320',
        base_id: '29'
    },
    {
        id: '379',
        name: 'Quận 4',
        code: '',
        type: 5,
        url_id: '321',
        base_id: '29'
    },
    {
        id: '380',
        name: 'Quận 5',
        code: '',
        type: 5,
        url_id: '322',
        base_id: '29'
    },
    {
        id: '381',
        name: 'Quận 6',
        code: '',
        type: 5,
        url_id: '323',
        base_id: '29'
    },
    {
        id: '382',
        name: 'Quận 7',
        code: '',
        type: 5,
        url_id: '324',
        base_id: '29'
    },
    {
        id: '383',
        name: 'Quận 8',
        code: '',
        type: 5,
        url_id: '325',
        base_id: '29'
    },
    {
        id: '404',
        name: 'Khoái Châu',
        code: '',
        type: 5,
        url_id: '346',
        base_id: '31'
    },
    {
        id: '405',
        name: 'Kim Động',
        code: '',
        type: 5,
        url_id: '347',
        base_id: '31'
    },
    {
        id: '406',
        name: 'Mỹ Hào',
        code: '',
        type: 5,
        url_id: '348',
        base_id: '31'
    },
    {
        id: '407',
        name: 'Phù Cừ',
        code: '',
        type: 5,
        url_id: '349',
        base_id: '31'
    },
    {
        id: '408',
        name: 'Tiên Lữ',
        code: '',
        type: 5,
        url_id: '350',
        base_id: '31'
    },
    {
        id: '409',
        name: 'Văn Giang',
        code: '',
        type: 5,
        url_id: '351',
        base_id: '31'
    },
    {
        id: '410',
        name: 'Văn Lâm',
        code: '',
        type: 5,
        url_id: '352',
        base_id: '31'
    },
    {
        id: '411',
        name: 'Yên Mỹ',
        code: '',
        type: 5,
        url_id: '353',
        base_id: '31'
    },
    {
        id: '412',
        name: 'Cam Lâm',
        code: '',
        type: 5,
        url_id: '354',
        base_id: '32'
    },
    {
        id: '413',
        name: 'Cam Ranh',
        code: '',
        type: 5,
        url_id: '355',
        base_id: '32'
    },
    {
        id: '414',
        name: 'Diên Khánh',
        code: '',
        type: 5,
        url_id: '356',
        base_id: '32'
    },
    {
        id: '415',
        name: 'Khánh Sơn',
        code: '',
        type: 5,
        url_id: '357',
        base_id: '32'
    },
    {
        id: '416',
        name: 'Khánh Vĩnh',
        code: '',
        type: 5,
        url_id: '358',
        base_id: '32'
    },
    {
        id: '417',
        name: 'Nha Trang',
        code: '',
        type: 5,
        url_id: '359',
        base_id: '32'
    },
    {
        id: '418',
        name: 'Ninh Hòa',
        code: '',
        type: 5,
        url_id: '360',
        base_id: '32'
    },
    {
        id: '419',
        name: 'Trường Sa',
        code: '',
        type: 5,
        url_id: '361',
        base_id: '32'
    },
    {
        id: '420',
        name: 'Vạn Ninh',
        code: '',
        type: 5,
        url_id: '362',
        base_id: '32'
    },
    {
        id: '421',
        name: 'An Biên',
        code: '',
        type: 5,
        url_id: '363',
        base_id: '33'
    },
    {
        id: '422',
        name: 'An Minh',
        code: '',
        type: 5,
        url_id: '364',
        base_id: '33'
    },
    {
        id: '423',
        name: 'Châu Thành',
        code: '',
        type: 5,
        url_id: '365',
        base_id: '33'
    },
    {
        id: '424',
        name: 'Giang Thành',
        code: '',
        type: 5,
        url_id: '366',
        base_id: '33'
    },
    {
        id: '425',
        name: 'Giồng Riềng',
        code: '',
        type: 5,
        url_id: '367',
        base_id: '33'
    },
    {
        id: '426',
        name: 'Gò Quao',
        code: '',
        type: 5,
        url_id: '368',
        base_id: '33'
    },
    {
        id: '427',
        name: 'Hà Tiên',
        code: '',
        type: 5,
        url_id: '369',
        base_id: '33'
    },
    {
        id: '428',
        name: 'Hòn Đất',
        code: '',
        type: 5,
        url_id: '370',
        base_id: '33'
    },
    {
        id: '429',
        name: 'Kiên Hải',
        code: '',
        type: 5,
        url_id: '371',
        base_id: '33'
    },
    {
        id: '430',
        name: 'Kiên Lương',
        code: '',
        type: 5,
        url_id: '372',
        base_id: '33'
    },
    {
        id: '458',
        name: 'Đạ Huoai',
        code: '',
        type: 5,
        url_id: '400',
        base_id: '36'
    },
    {
        id: '459',
        name: 'Đạ Tẻh',
        code: '',
        type: 5,
        url_id: '401',
        base_id: '36'
    },
    {
        id: '460',
        name: 'Đam Rông',
        code: '',
        type: 5,
        url_id: '402',
        base_id: '36'
    },
    {
        id: '461',
        name: 'Đơn Dương',
        code: '',
        type: 5,
        url_id: '403',
        base_id: '36'
    },
    {
        id: '462',
        name: 'Đức Trọng',
        code: '',
        type: 5,
        url_id: '404',
        base_id: '36'
    },
    {
        id: '463',
        name: 'Lạc Dương',
        code: '',
        type: 5,
        url_id: '405',
        base_id: '36'
    },
    {
        id: '464',
        name: 'Lâm Hà',
        code: '',
        type: 5,
        url_id: '406',
        base_id: '36'
    },
    {
        id: '465',
        name: 'Bắc Sơn',
        code: '',
        type: 5,
        url_id: '407',
        base_id: '37'
    },
    {
        id: '466',
        name: 'Bình Gia',
        code: '',
        type: 5,
        url_id: '408',
        base_id: '37'
    },
    {
        id: '467',
        name: 'Cao Lộc',
        code: '',
        type: 5,
        url_id: '409',
        base_id: '37'
    },
    {
        id: '468',
        name: 'Chi Lăng',
        code: '',
        type: 5,
        url_id: '410',
        base_id: '37'
    },
    {
        id: '469',
        name: 'Đình Lập',
        code: '',
        type: 5,
        url_id: '411',
        base_id: '37'
    },
    {
        id: '470',
        name: 'Hữu Lũng',
        code: '',
        type: 5,
        url_id: '412',
        base_id: '37'
    },
    {
        id: '471',
        name: 'Lạng Sơn',
        code: '',
        type: 5,
        url_id: '413',
        base_id: '37'
    },
    {
        id: '472',
        name: 'Lộc Bình',
        code: '',
        type: 5,
        url_id: '414',
        base_id: '37'
    },
    {
        id: '473',
        name: 'Tràng Định',
        code: '',
        type: 5,
        url_id: '415',
        base_id: '37'
    },
    {
        id: '474',
        name: 'Văn Lãng',
        code: '',
        type: 5,
        url_id: '416',
        base_id: '37'
    },
    {
        id: '475',
        name: 'Văn Quan',
        code: '',
        type: 5,
        url_id: '417',
        base_id: '37'
    },
    {
        id: '476',
        name: 'Bảo Thắng',
        code: '',
        type: 5,
        url_id: '418',
        base_id: '38'
    },
    {
        id: '477',
        name: 'Bảo Yên',
        code: '',
        type: 5,
        url_id: '419',
        base_id: '38'
    },
    {
        id: '478',
        name: 'Bát Xát',
        code: '',
        type: 5,
        url_id: '420',
        base_id: '38'
    },
    {
        id: '479',
        name: 'Bắc Hà',
        code: '',
        type: 5,
        url_id: '421',
        base_id: '38'
    },
    {
        id: '480',
        name: 'Lào Cai',
        code: '',
        type: 5,
        url_id: '422',
        base_id: '38'
    },
    {
        id: '481',
        name: 'Mường Khương',
        code: '',
        type: 5,
        url_id: '423',
        base_id: '38'
    },
    {
        id: '482',
        name: 'Sapa',
        code: '',
        type: 5,
        url_id: '424',
        base_id: '38'
    },
    {
        id: '483',
        name: 'Si Ma Cai',
        code: '',
        type: 5,
        url_id: '425',
        base_id: '38'
    },
    {
        id: '484',
        name: 'Văn Bàn',
        code: '',
        type: 5,
        url_id: '426',
        base_id: '38'
    },
    {
        id: '485',
        name: 'Bến Lức',
        code: '',
        type: 5,
        url_id: '427',
        base_id: '39'
    },
    {
        id: '486',
        name: 'Cần Đước',
        code: '',
        type: 5,
        url_id: '428',
        base_id: '39'
    },
    {
        id: '514',
        name: 'Đô Lương',
        code: '',
        type: 5,
        url_id: '456',
        base_id: '41'
    },
    {
        id: '515',
        name: 'Hưng Nguyên',
        code: '',
        type: 5,
        url_id: '457',
        base_id: '41'
    },
    {
        id: '516',
        name: 'Kỳ Sơn',
        code: '',
        type: 5,
        url_id: '458',
        base_id: '41'
    },
    {
        id: '517',
        name: 'Nam Đàn',
        code: '',
        type: 5,
        url_id: '459',
        base_id: '41'
    },
    {
        id: '518',
        name: 'Nghi Lộc',
        code: '',
        type: 5,
        url_id: '460',
        base_id: '41'
    },
    {
        id: '519',
        name: 'Nghĩa Đàn',
        code: '',
        type: 5,
        url_id: '461',
        base_id: '41'
    },
    {
        id: '520',
        name: 'Quế Phong',
        code: '',
        type: 5,
        url_id: '462',
        base_id: '41'
    },
    {
        id: '521',
        name: 'Quỳ Châu',
        code: '',
        type: 5,
        url_id: '463',
        base_id: '41'
    },
    {
        id: '522',
        name: 'Quỳ Hợp',
        code: '',
        type: 5,
        url_id: '464',
        base_id: '41'
    },
    {
        id: '523',
        name: 'Quỳnh Lưu',
        code: '',
        type: 5,
        url_id: '465',
        base_id: '41'
    },
    {
        id: '524',
        name: 'Tân Kỳ',
        code: '',
        type: 5,
        url_id: '466',
        base_id: '41'
    },
    {
        id: '525',
        name: 'Thái Hòa',
        code: '',
        type: 5,
        url_id: '467',
        base_id: '41'
    },
    {
        id: '526',
        name: 'Thanh Chương',
        code: '',
        type: 5,
        url_id: '468',
        base_id: '41'
    },
    {
        id: '527',
        name: 'Tương Dương',
        code: '',
        type: 5,
        url_id: '469',
        base_id: '41'
    },
    {
        id: '28021',
        name: 'Phú Riềng',
        code: 'PRG',
        type: 5,
        url_id: '',
        base_id: '10'
    },
    {
        id: '28023',
        name: 'Bắc Từ Liêm',
        code: '',
        type: 5,
        url_id: '',
        base_id: '24'
    },
    {
        id: '28024',
        name: 'Nam Từ Liêm',
        code: '',
        type: 5,
        url_id: '',
        base_id: '24'
    },
    {
        id: '28025',
        name: 'H.Kỳ Anh',
        code: '',
        type: 5,
        url_id: '',
        base_id: '25'
    },
    {
        id: '28026',
        name: 'H.Long Mỹ',
        code: '',
        type: 5,
        url_id: '',
        base_id: '28'
    },
    {
        id: '28027',
        name: 'Ia H`Drai',
        code: 'IaHDI',
        type: 5,
        url_id: '',
        base_id: '34'
    },
    {
        id: '28028',
        name: 'Hoàng Mai',
        code: 'HMI',
        type: 5,
        url_id: '',
        base_id: '41'
    },
    {
        id: '28029',
        name: 'Ba Đồn',
        code: 'BDN',
        type: 5,
        url_id: '',
        base_id: '46'
    },
    {
        id: '28030',
        name: 'Vân Hồ',
        code: 'VHO',
        type: 5,
        url_id: '',
        base_id: '52'
    },
    {
        id: '28031',
        name: 'H.Cai Lậy',
        code: 'CLY',
        type: 5,
        url_id: '',
        base_id: '58'
    },
    {
        id: '28032',
        name: 'H.Duyên Hải',
        code: 'DHI',
        type: 5,
        url_id: '',
        base_id: '59'
    },
    {
        id: '743',
        name: 'Tam Bình',
        code: '',
        type: 5,
        url_id: '685',
        base_id: '61'
    },
    {
        id: '744',
        name: 'Trà Ôn',
        code: '',
        type: 5,
        url_id: '686',
        base_id: '61'
    },
    {
        id: '745',
        name: 'Vĩnh Long',
        code: '',
        type: 5,
        url_id: '687',
        base_id: '61'
    },
    {
        id: '746',
        name: 'Vũng Liêm',
        code: '',
        type: 5,
        url_id: '688',
        base_id: '61'
    },
    {
        id: '747',
        name: 'Bình Xuyên',
        code: '',
        type: 5,
        url_id: '689',
        base_id: '62'
    },
    {
        id: '748',
        name: 'Lập Thạch',
        code: '',
        type: 5,
        url_id: '690',
        base_id: '62'
    },
    {
        id: '749',
        name: 'Phúc Yên',
        code: '',
        type: 5,
        url_id: '691',
        base_id: '62'
    },
    {
        id: '750',
        name: 'Sông Lô',
        code: '',
        type: 5,
        url_id: '692',
        base_id: '62'
    },
    {
        id: '751',
        name: 'Tam Dương',
        code: '',
        type: 5,
        url_id: '693',
        base_id: '62'
    },
    {
        id: '752',
        name: 'Tam Đảo',
        code: '',
        type: 5,
        url_id: '694',
        base_id: '62'
    },
    {
        id: '753',
        name: 'Vĩnh Tường',
        code: '',
        type: 5,
        url_id: '695',
        base_id: '62'
    },
    {
        id: '754',
        name: 'Vĩnh Yên',
        code: '',
        type: 5,
        url_id: '696',
        base_id: '62'
    },
    {
        id: '755',
        name: 'Yên Lạc',
        code: '',
        type: 5,
        url_id: '697',
        base_id: '62'
    },
    {
        id: '756',
        name: 'Lục Yên',
        code: '',
        type: 5,
        url_id: '698',
        base_id: '63'
    },
    {
        id: '757',
        name: 'Mù Cang Chải',
        code: '',
        type: 5,
        url_id: '699',
        base_id: '63'
    },
    {
        id: '112626',
        name: 'Quảng Tây',
        code: 'QTY',
        type: 3,
        url_id: '',
        base_id: '112625'
    },
    {
        id: '112627',
        name: 'Quảng Đông',
        code: 'QDG',
        type: 3,
        url_id: '',
        base_id: '112625'
    },
    {
        id: '112628',
        name: 'Ma Cao',
        code: 'MCO',
        type: 3,
        url_id: '',
        base_id: '112625'
    },
    {
        id: '112629',
        name: 'Hữu Nghị Quan',
        code: 'HNQ',
        type: 3,
        url_id: '',
        base_id: '112625'
    },
    {
        id: '112632',
        name: 'Bách Sắc',
        code: 'BSC',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112633',
        name: 'Hà Trì',
        code: 'THI',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112634',
        name: 'Liễu Châu',
        code: 'LCU',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '152',
        name: 'Phước Long',
        code: '',
        type: 5,
        url_id: '89',
        base_id: '10'
    },
    {
        id: '153',
        name: 'Bắc Bình',
        code: '',
        type: 5,
        url_id: '90',
        base_id: '11'
    },
    {
        id: '154',
        name: 'Đức Linh',
        code: '',
        type: 5,
        url_id: '91',
        base_id: '11'
    },
    {
        id: '155',
        name: 'Hàm Tân',
        code: '',
        type: 5,
        url_id: '92',
        base_id: '11'
    },
    {
        id: '156',
        name: 'Hàm Thuận Bắc',
        code: '',
        type: 5,
        url_id: '93',
        base_id: '11'
    },
    {
        id: '157',
        name: 'Hàm Thuận Nam',
        code: '',
        type: 5,
        url_id: '94',
        base_id: '11'
    },
    {
        id: '158',
        name: 'La Gi',
        code: '',
        type: 5,
        url_id: '95',
        base_id: '11'
    },
    {
        id: '159',
        name: 'Phan Thiết',
        code: '',
        type: 5,
        url_id: '96',
        base_id: '11'
    },
    {
        id: '160',
        name: 'Phú Quý',
        code: '',
        type: 5,
        url_id: '97',
        base_id: '11'
    },
    {
        id: '161',
        name: 'Tánh Linh',
        code: '',
        type: 5,
        url_id: '98',
        base_id: '11'
    },
    {
        id: '162',
        name: 'Tuy Phong',
        code: '',
        type: 5,
        url_id: '99',
        base_id: '11'
    },
    {
        id: '163',
        name: 'Cà Mau',
        code: '',
        type: 5,
        url_id: '100',
        base_id: '12'
    },
    {
        id: '164',
        name: 'Cái Nước',
        code: '',
        type: 5,
        url_id: '101',
        base_id: '12'
    },
    {
        id: '165',
        name: 'Đầm Dơi',
        code: '',
        type: 5,
        url_id: '102',
        base_id: '12'
    },
    {
        id: '166',
        name: 'Năm Căn',
        code: '',
        type: 5,
        url_id: '103',
        base_id: '12'
    },
    {
        id: '201',
        name: 'Thanh Khê',
        code: '',
        type: 5,
        url_id: '139',
        base_id: '15'
    },
    {
        id: '202',
        name: 'Buôn Đôn',
        code: '',
        type: 5,
        url_id: '141',
        base_id: '16'
    },
    {
        id: '203',
        name: 'Buôn Hồ',
        code: '',
        type: 5,
        url_id: '142',
        base_id: '16'
    },
    {
        id: '204',
        name: 'Buôn Ma Thuột',
        code: '',
        type: 5,
        url_id: '143',
        base_id: '16'
    },
    {
        id: '205',
        name: 'Cư Kuin',
        code: '',
        type: 5,
        url_id: '144',
        base_id: '16'
    },
    {
        id: '206',
        name: 'Cư M`gar',
        code: '',
        type: 5,
        url_id: '145',
        base_id: '16'
    },
    {
        id: '207',
        name: 'Ea H`leo',
        code: '',
        type: 5,
        url_id: '146',
        base_id: '16'
    },
    {
        id: '208',
        name: 'Ea Kar',
        code: '',
        type: 5,
        url_id: '147',
        base_id: '16'
    },
    {
        id: '209',
        name: 'Ea Súp',
        code: '',
        type: 5,
        url_id: '148',
        base_id: '16'
    },
    {
        id: '210',
        name: 'Krông Ana',
        code: '',
        type: 5,
        url_id: '149',
        base_id: '16'
    },
    {
        id: '211',
        name: 'Krông Bông',
        code: '',
        type: 5,
        url_id: '150',
        base_id: '16'
    },
    {
        id: '212',
        name: 'Krông Búk',
        code: '',
        type: 5,
        url_id: '151',
        base_id: '16'
    },
    {
        id: '213',
        name: 'Krông Năng',
        code: '',
        type: 5,
        url_id: '152',
        base_id: '16'
    },
    {
        id: '214',
        name: 'Krông Pắk',
        code: '',
        type: 5,
        url_id: '153',
        base_id: '16'
    },
    {
        id: '215',
        name: 'Lắk',
        code: '',
        type: 5,
        url_id: '154',
        base_id: '16'
    },
    {
        id: '313',
        name: 'Tây Hồ',
        code: '',
        type: 5,
        url_id: '252',
        base_id: '24'
    },
    {
        id: '314',
        name: 'Thạch Thất',
        code: '',
        type: 5,
        url_id: '253',
        base_id: '24'
    },
    {
        id: '315',
        name: 'Thanh Oai',
        code: '',
        type: 5,
        url_id: '254',
        base_id: '24'
    },
    {
        id: '316',
        name: 'Thanh Trì',
        code: '',
        type: 5,
        url_id: '255',
        base_id: '24'
    },
    {
        id: '317',
        name: 'Thanh Xuân',
        code: '',
        type: 5,
        url_id: '256',
        base_id: '24'
    },
    {
        id: '318',
        name: 'Thường Tín',
        code: '',
        type: 5,
        url_id: '257',
        base_id: '24'
    },
    {
        id: '319',
        name: 'Từ Liêm',
        code: '',
        type: 5,
        url_id: '258',
        base_id: '24'
    },
    {
        id: '320',
        name: 'Ứng Hòa',
        code: '',
        type: 5,
        url_id: '259',
        base_id: '24'
    },
    {
        id: '321',
        name: 'Can Lộc',
        code: '',
        type: 5,
        url_id: '261',
        base_id: '25'
    },
    {
        id: '322',
        name: 'Cẩm Xuyên',
        code: '',
        type: 5,
        url_id: '262',
        base_id: '25'
    },
    {
        id: '323',
        name: 'Đức Thọ',
        code: '',
        type: 5,
        url_id: '263',
        base_id: '25'
    },
    {
        id: '324',
        name: 'Hà Tĩnh',
        code: '',
        type: 5,
        url_id: '264',
        base_id: '25'
    },
    {
        id: '325',
        name: 'Hồng Lĩnh',
        code: '',
        type: 5,
        url_id: '265',
        base_id: '25'
    },
    {
        id: '326',
        name: 'Hương Khê',
        code: '',
        type: 5,
        url_id: '266',
        base_id: '25'
    },
    {
        id: '327',
        name: 'Hương Sơn',
        code: '',
        type: 5,
        url_id: '267',
        base_id: '25'
    },
    {
        id: '28019',
        name: 'Bắc Tân Uyên',
        code: 'BTU',
        type: 5,
        url_id: '',
        base_id: '9'
    },
    {
        id: '28020',
        name: 'Bàu Bàng',
        code: 'BBG',
        type: 5,
        url_id: '',
        base_id: '9'
    },
    {
        id: '528',
        name: 'Vinh',
        code: '',
        type: 5,
        url_id: '470',
        base_id: '41'
    },
    {
        id: '529',
        name: 'Yên Thành',
        code: '',
        type: 5,
        url_id: '471',
        base_id: '41'
    },
    {
        id: '530',
        name: 'Gia Viễn',
        code: '',
        type: 5,
        url_id: '472',
        base_id: '42'
    },
    {
        id: '531',
        name: 'Hoa Lư',
        code: '',
        type: 5,
        url_id: '473',
        base_id: '42'
    },
    {
        id: '532',
        name: 'Kim Sơn',
        code: '',
        type: 5,
        url_id: '474',
        base_id: '42'
    },
    {
        id: '533',
        name: 'Nho Quan',
        code: '',
        type: 5,
        url_id: '475',
        base_id: '42'
    },
    {
        id: '534',
        name: 'Ninh Bình',
        code: '',
        type: 5,
        url_id: '476',
        base_id: '42'
    },
    {
        id: '535',
        name: 'Tam Điệp',
        code: '',
        type: 5,
        url_id: '477',
        base_id: '42'
    },
    {
        id: '536',
        name: 'Yên Khánh',
        code: '',
        type: 5,
        url_id: '478',
        base_id: '42'
    },
    {
        id: '537',
        name: 'Yên Mô',
        code: '',
        type: 5,
        url_id: '479',
        base_id: '42'
    },
    {
        id: '538',
        name: 'Bác Ái',
        code: '',
        type: 5,
        url_id: '480',
        base_id: '43'
    },
    {
        id: '539',
        name: 'Ninh Hải',
        code: '',
        type: 5,
        url_id: '481',
        base_id: '43'
    },
    {
        id: '540',
        name: 'Ninh Phước',
        code: '',
        type: 5,
        url_id: '482',
        base_id: '43'
    },
    {
        id: '541',
        name: 'Ninh Sơn',
        code: '',
        type: 5,
        url_id: '483',
        base_id: '43'
    },
    {
        id: '542',
        name: 'Phan Rang-Tháp Chàm',
        code: '',
        type: 5,
        url_id: '484',
        base_id: '43'
    },
    {
        id: '584',
        name: 'Núi Thành',
        code: '',
        type: 5,
        url_id: '526',
        base_id: '47'
    },
    {
        id: '585',
        name: 'Phú Ninh',
        code: '',
        type: 5,
        url_id: '527',
        base_id: '47'
    },
    {
        id: '586',
        name: 'Phước Sơn',
        code: '',
        type: 5,
        url_id: '528',
        base_id: '47'
    },
    {
        id: '587',
        name: 'Quế Sơn',
        code: '',
        type: 5,
        url_id: '529',
        base_id: '47'
    },
    {
        id: '588',
        name: 'Tam Kỳ',
        code: '',
        type: 5,
        url_id: '530',
        base_id: '47'
    },
    {
        id: '589',
        name: 'Tây Giang',
        code: '',
        type: 5,
        url_id: '531',
        base_id: '47'
    },
    {
        id: '590',
        name: 'Thăng Bình',
        code: '',
        type: 5,
        url_id: '532',
        base_id: '47'
    },
    {
        id: '591',
        name: 'Tiên Phước',
        code: '',
        type: 5,
        url_id: '533',
        base_id: '47'
    },
    {
        id: '592',
        name: 'Ba Tơ',
        code: '',
        type: 5,
        url_id: '534',
        base_id: '48'
    },
    {
        id: '593',
        name: 'Bình Sơn',
        code: '',
        type: 5,
        url_id: '535',
        base_id: '48'
    },
    {
        id: '594',
        name: 'Đức Phổ',
        code: '',
        type: 5,
        url_id: '536',
        base_id: '48'
    },
    {
        id: '595',
        name: 'Lý Sơn',
        code: '',
        type: 5,
        url_id: '537',
        base_id: '48'
    },
    {
        id: '596',
        name: 'Minh Long',
        code: '',
        type: 5,
        url_id: '538',
        base_id: '48'
    },
    {
        id: '597',
        name: 'Mộ Đức',
        code: '',
        type: 5,
        url_id: '539',
        base_id: '48'
    },
    {
        id: '598',
        name: 'Nghĩa Hành',
        code: '',
        type: 5,
        url_id: '540',
        base_id: '48'
    },
    {
        id: '687',
        name: 'Nga Sơn',
        code: '',
        type: 5,
        url_id: '629',
        base_id: '56'
    },
    {
        id: '688',
        name: 'Ngọc Lặc',
        code: '',
        type: 5,
        url_id: '630',
        base_id: '56'
    },
    {
        id: '689',
        name: 'Như Thanh',
        code: '',
        type: 5,
        url_id: '631',
        base_id: '56'
    },
    {
        id: '690',
        name: 'Như Xuân',
        code: '',
        type: 5,
        url_id: '632',
        base_id: '56'
    },
    {
        id: '691',
        name: 'Nông Cống',
        code: '',
        type: 5,
        url_id: '633',
        base_id: '56'
    },
    {
        id: '692',
        name: 'Quan Hóa',
        code: '',
        type: 5,
        url_id: '634',
        base_id: '56'
    },
    {
        id: '693',
        name: 'Quan Sơn',
        code: '',
        type: 5,
        url_id: '635',
        base_id: '56'
    },
    {
        id: '694',
        name: 'Quảng Xương',
        code: '',
        type: 5,
        url_id: '636',
        base_id: '56'
    },
    {
        id: '695',
        name: 'Sầm Sơn',
        code: '',
        type: 5,
        url_id: '637',
        base_id: '56'
    },
    {
        id: '696',
        name: 'Thạch Thành',
        code: '',
        type: 5,
        url_id: '638',
        base_id: '56'
    },
    {
        id: '697',
        name: 'Thanh Hóa',
        code: '',
        type: 5,
        url_id: '639',
        base_id: '56'
    },
    {
        id: '698',
        name: 'Thiệu Hóa',
        code: '',
        type: 5,
        url_id: '640',
        base_id: '56'
    },
    {
        id: '699',
        name: 'Thọ Xuân',
        code: '',
        type: 5,
        url_id: '641',
        base_id: '56'
    },
    {
        id: '700',
        name: 'Thường Xuân',
        code: '',
        type: 5,
        url_id: '642',
        base_id: '56'
    },
    {
        id: '701',
        name: 'Tĩnh Gia',
        code: '',
        type: 5,
        url_id: '643',
        base_id: '56'
    },
    {
        id: '117412',
        name: 'Vũng Rô',
        code: 'VRO',
        type: 5,
        url_id: '',
        base_id: '45'
    },
    {
        id: '112635',
        name: 'Quế Lâm',
        code: 'QLM',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112636',
        name: 'Hạ Châu',
        code: 'HCU',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112637',
        name: 'Sùng Tả',
        code: 'STA',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112638',
        name: 'Nam Ninh',
        code: 'NNH',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112639',
        name: 'Lai Tân',
        code: 'LTN',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112640',
        name: 'Quý Cảng',
        code: 'QCG',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112641',
        name: 'Ngô Châu',
        code: 'NCU',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112642',
        name: 'Phòng Thành Cảng',
        code: 'PTC',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112643',
        name: 'Khâm Châu',
        code: 'KCU',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112644',
        name: 'Bắc Hải',
        code: 'BHI',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112645',
        name: 'Bằng Tường',
        code: 'BTG',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112646',
        name: 'Ngọc Lâm',
        code: 'NLM',
        type: 5,
        url_id: '',
        base_id: '112626'
    },
    {
        id: '112647',
        name: 'Quảng Châu',
        code: 'QCU',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112648',
        name: 'Thâm Quyến',
        code: 'TQN',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112649',
        name: 'Thanh Viễn',
        code: 'TVN',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112650',
        name: 'Thiều Quan',
        code: 'TQN',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112651',
        name: 'Hà Nguyên',
        code: 'HNN',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112652',
        name: 'Mai Châu',
        code: 'MCU',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112653',
        name: 'Triều Châu',
        code: 'TCU',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112654',
        name: 'Triệu Khánh',
        code: 'TKH',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112655',
        name: 'Vân Phù',
        code: 'VPU',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112656',
        name: 'Phật Sơn',
        code: 'PSN',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112657',
        name: 'Đông Hoản',
        code: 'DHN',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112658',
        name: 'Huệ Châu',
        code: 'HCU',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112659',
        name: 'Sán Vĩ',
        code: 'SVI',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112660',
        name: 'Yết Dương',
        code: 'YDG',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112661',
        name: 'Sán Đầu',
        code: 'SDU',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112662',
        name: 'Trạm Giang',
        code: 'TGG',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112663',
        name: 'Mậu Danh',
        code: 'MDH',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112664',
        name: 'Dương Giang',
        code: 'DGG',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112665',
        name: 'Giang Môn',
        code: 'GMN',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112666',
        name: 'Trung Sơn',
        code: 'TSN',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112667',
        name: 'Châu Hải',
        code: 'CHI',
        type: 5,
        url_id: '',
        base_id: '112627'
    },
    {
        id: '112668',
        name: 'Ma Cao',
        code: 'MCO',
        type: 5,
        url_id: '',
        base_id: '112628'
    },
    {
        id: '112669',
        name: 'Hữu Nghị Quan',
        code: 'HNQ',
        type: 5,
        url_id: '',
        base_id: '112629'
    },
    {
        id: '114233',
        name: 'Trà Sư',
        code: 'TSU',
        type: 5,
        url_id: '',
        base_id: '1'
    },
    {
        id: '114234',
        name: 'Chùa Bà Châu Đốc',
        code: 'CBCD',
        type: 5,
        url_id: '',
        base_id: '1'
    },
    {
        id: '114235',
        name: 'Cánh Đồng Quạt Gió',
        code: 'CDQG',
        type: 5,
        url_id: '',
        base_id: '5'
    },
    {
        id: '114236',
        name: 'Cồn Phụng',
        code: 'CPG',
        type: 5,
        url_id: '',
        base_id: '7'
    },
    {
        id: '114237',
        name: 'Phan Rí',
        code: 'PRI',
        type: 5,
        url_id: '',
        base_id: '11'
    },
    {
        id: '114238',
        name: 'Liên Hương',
        code: 'LHG',
        type: 5,
        url_id: '',
        base_id: '11'
    },
    {
        id: '114239',
        name: 'Coco Beach',
        code: 'CCB',
        type: 5,
        url_id: '',
        base_id: '11'
    },
    {
        id: '114240',
        name: 'Cổ Thạch',
        code: 'CTH',
        type: 5,
        url_id: '',
        base_id: '11'
    },
    {
        id: '114241',
        name: 'Hòn Rơm',
        code: 'HRM',
        type: 5,
        url_id: '',
        base_id: '11'
    },
    {
        id: '114242',
        name: 'Biển Khai Long',
        code: 'BKP',
        type: 5,
        url_id: '',
        base_id: '12'
    },
    {
        id: '114243',
        name: 'Chợ Nổi Cái Răng',
        code: 'CNCR',
        type: 5,
        url_id: '',
        base_id: '13'
    },
    {
        id: '114244',
        name: 'Hồ Lắk',
        code: 'HLK',
        type: 5,
        url_id: '',
        base_id: '16'
    },
    {
        id: '114245',
        name: 'Chư Đăng Ya',
        code: 'CDY',
        type: 5,
        url_id: '',
        base_id: '21'
    },
    {
        id: '114246',
        name: 'Biển Mũi Nai',
        code: 'BMN',
        type: 5,
        url_id: '',
        base_id: '33'
    },
    {
        id: '114247',
        name: 'Vũng Áng',
        code: 'VAG',
        type: 5,
        url_id: '',
        base_id: '25'
    },
    {
        id: '114248',
        name: 'Cát Bà',
        code: 'CBA',
        type: 5,
        url_id: '',
        base_id: '27'
    },
    {
        id: '114249',
        name: 'Chợ Nổi Ngã Bảy',
        code: 'CNNB',
        type: 5,
        url_id: '',
        base_id: '28'
    },
    {
        id: '114250',
        name: 'Vịnh Lăng Cô',
        code: 'VLC',
        type: 5,
        url_id: '',
        base_id: '57'
    },
    {
        id: '114251',
        name: 'Vịnh Ninh Vân',
        code: 'VNV',
        type: 5,
        url_id: '',
        base_id: '32'
    },
    {
        id: '114252',
        name: 'Bảo Hà',
        code: 'BHA',
        type: 5,
        url_id: '',
        base_id: '38'
    },
    {
        id: '114253',
        name: 'Làng Nổi Tân Lập',
        code: 'LNTL',
        type: 5,
        url_id: '',
        base_id: '39'
    },
    {
        id: '114254',
        name: 'Tràng An - Bái Đính',
        code: 'TABD',
        type: 5,
        url_id: '',
        base_id: '42'
    },
    {
        id: '114255',
        name: 'Tam Cốc Bích Động',
        code: 'TCBD',
        type: 5,
        url_id: '',
        base_id: '42'
    },
    {
        id: '114256',
        name: 'Ninh Chữ',
        code: 'NCU',
        type: 5,
        url_id: '',
        base_id: '43'
    },
    {
        id: '114258',
        name: 'Ghềnh Đá Dĩa',
        code: 'GDD',
        type: 5,
        url_id: '',
        base_id: '45'
    },
    {
        id: '114259',
        name: 'Vịnh Xuân Đài',
        code: 'VXD',
        type: 5,
        url_id: '',
        base_id: '45'
    },
    {
        id: '114260',
        name: 'Đầm Ô Loan',
        code: 'DOL',
        type: 5,
        url_id: '',
        base_id: '45'
    },
    {
        id: '114261',
        name: 'Phong Nha',
        code: 'PNA',
        type: 5,
        url_id: '',
        base_id: '46'
    },
    {
        id: '114262',
        name: 'Núi Bà Đen',
        code: 'NBD',
        type: 5,
        url_id: '',
        base_id: '53'
    },
    {
        id: '114263',
        name: 'Biển Tân Thành',
        code: 'BTT',
        type: 5,
        url_id: '',
        base_id: '58'
    },
    {
        id: '114264',
        name: 'Cù Lao Thái Sơn',
        code: 'CLTS',
        type: 5,
        url_id: '',
        base_id: '58'
    },
    {
        id: '114265',
        name: 'Biển Ba Động',
        code: 'BBD',
        type: 5,
        url_id: '',
        base_id: '59'
    },
    {
        id: '114266',
        name: 'Long Hải',
        code: 'LHI',
        type: 5,
        url_id: '',
        base_id: '2'
    },
    {
        id: '1694',
        name: 'Đà Nẵng',
        code: 'ĐN',
        type: 5,
        url_id: '',
        base_id: '15'
    },
    {
        id: '28458',
        name: 'Mũi Né',
        code: 'MNE',
        type: 5,
        url_id: '',
        base_id: '11'
    },
    {
        id: '135243',
        name: 'Sa Kỳ',
        code: 'SKY',
        type: 5,
        url_id: '',
        base_id: '599'
    },
    {
        id: '155849',
        code: 'PULUONG',
        type: 5,
        name: 'Pù Luông',
        url_id: '',
        base_id: '56'
    }
];
var cities = [{
        id: '1',
        code: 'AGG',
        name: 'An Giang',
        url_id: 1
    },
    {
        id: '2',
        code: 'VTU',
        name: 'Bà Rịa-Vũng Tàu',
        url_id: 2
    },
    {
        id: '3',
        code: 'BGG',
        name: 'Bắc Giang',
        url_id: 3
    },
    {
        id: '4',
        code: 'BKN',
        name: 'Bắc Kạn',
        url_id: 4
    },
    {
        id: '5',
        code: 'BLU',
        name: 'Bạc Liêu',
        url_id: 5
    },
    {
        id: '6',
        code: 'BNH',
        name: 'Bắc Ninh',
        url_id: 6
    },
    {
        id: '7',
        code: 'BTE',
        name: 'Bến Tre',
        url_id: 7
    },
    {
        id: '8',
        code: 'BDH',
        name: 'Bình Định',
        url_id: 8
    },
    {
        id: '9',
        code: 'BDG',
        name: 'Bình Dương',
        url_id: 9
    },
    {
        id: '10',
        code: 'BPC',
        name: 'Bình Phước',
        url_id: 10
    },
    {
        id: '11',
        code: 'BTN',
        name: 'Bình Thuận',
        url_id: 11
    },
    {
        id: '12',
        code: 'CMU',
        name: 'Cà Mau',
        url_id: 12
    },
    {
        id: '13',
        code: 'CTO',
        name: 'Cần Thơ',
        url_id: 13
    },
    {
        id: '14',
        code: 'CBG',
        name: 'Cao Bằng',
        url_id: 14
    },
    {
        id: '15',
        code: 'DNA',
        name: 'Đà Nẵng',
        url_id: 15
    },
    {
        id: '16',
        code: 'DLK',
        name: 'Đắk Lắk',
        url_id: 16
    },
    {
        id: '17',
        code: 'DNG',
        name: 'Đăk Nông',
        url_id: 17
    },
    {
        id: '18',
        code: 'DBN',
        name: 'Điện Biên',
        url_id: 18
    },
    {
        id: '19',
        code: 'DNI',
        name: 'Đồng Nai',
        url_id: 19
    },
    {
        id: '20',
        code: 'DTP',
        name: 'Đồng Tháp',
        url_id: 20
    },
    {
        id: '21',
        code: 'GLI',
        name: 'Gia Lai',
        url_id: 21
    },
    {
        id: '22',
        code: 'HGG',
        name: 'Hà Giang',
        url_id: 22
    },
    {
        id: '23',
        code: 'HNM',
        name: 'Hà Nam',
        url_id: 23
    },
    {
        id: '24',
        code: 'HNI',
        name: 'Hà Nội',
        url_id: 24
    },
    {
        id: '25',
        code: 'HTH',
        name: 'Hà Tĩnh',
        url_id: 25
    },
    {
        id: '26',
        code: 'HDG',
        name: 'Hải Dương',
        url_id: 26
    },
    {
        id: '27',
        code: 'HPG',
        name: 'Hải Phòng',
        url_id: 27
    },
    {
        id: '28',
        code: 'HGG',
        name: 'Hậu Giang',
        url_id: 28
    },
    {
        id: '29',
        code: 'HCM',
        name: 'Hồ Chí Minh',
        url_id: 29
    },
    {
        id: '30',
        code: 'HBH',
        name: 'Hòa Bình',
        url_id: 30
    },
    {
        id: '31',
        code: 'HYN',
        name: 'Hưng Yên',
        url_id: 31
    },
    {
        id: '32',
        code: 'KHA',
        name: 'Khánh Hòa',
        url_id: 32
    },
    {
        id: '33',
        code: 'KGG',
        name: 'Kiên Giang',
        url_id: 33
    },
    {
        id: '34',
        code: 'KTM',
        name: 'Kon Tum',
        url_id: 34
    },
    {
        id: '35',
        code: 'LCU',
        name: 'Lai Châu',
        url_id: 35
    },
    {
        id: '36',
        code: 'LDG',
        name: 'Lâm Đồng',
        url_id: 36
    },
    {
        id: '37',
        code: 'LSN',
        name: 'Lạng Sơn',
        url_id: 37
    },
    {
        id: '38',
        code: 'LCI',
        name: 'Lào Cai',
        url_id: 38
    },
    {
        id: '39',
        code: 'LAN',
        name: 'Long An',
        url_id: 39
    },
    {
        id: '40',
        code: 'NDH',
        name: 'Nam Định',
        url_id: 40
    },
    {
        id: '41',
        code: 'NAN',
        name: 'Nghệ An',
        url_id: 41
    },
    {
        id: '42',
        code: 'NBH',
        name: 'Ninh Bình',
        url_id: 42
    },
    {
        id: '43',
        code: 'NTN',
        name: 'Ninh Thuận',
        url_id: 43
    },
    {
        id: '44',
        code: 'PTO',
        name: 'Phú Thọ',
        url_id: 44
    },
    {
        id: '45',
        code: 'PYN',
        name: 'Phú Yên',
        url_id: 45
    },
    {
        id: '46',
        code: 'QBH',
        name: 'Quảng Bình',
        url_id: 46
    },
    {
        id: '47',
        code: 'QNM',
        name: 'Quảng Nam',
        url_id: 47
    },
    {
        id: '48',
        code: 'QNI',
        name: 'Quảng Ngãi',
        url_id: 48
    },
    {
        id: '49',
        code: 'QNH',
        name: 'Quảng Ninh',
        url_id: 49
    },
    {
        id: '50',
        code: 'QTI',
        name: 'Quảng Trị',
        url_id: 50
    },
    {
        id: '51',
        code: 'STG',
        name: 'Sóc Trăng',
        url_id: 51
    },
    {
        id: '52',
        code: 'SLA',
        name: 'Sơn La',
        url_id: 52
    },
    {
        id: '53',
        code: 'TNH',
        name: 'Tây Ninh',
        url_id: 53
    },
    {
        id: '54',
        code: 'TBH',
        name: 'Thái Bình',
        url_id: 54
    },
    {
        id: '55',
        code: 'TNN',
        name: 'Thái Nguyên',
        url_id: 55
    },
    {
        id: '56',
        code: 'THA',
        name: 'Thanh Hóa',
        url_id: 56
    },
    {
        id: '57',
        code: 'TTE',
        name: 'Thừa Thiên-Huế',
        url_id: 57
    },
    {
        id: '58',
        code: 'TGG',
        name: 'Tiền Giang',
        url_id: 58
    },
    {
        id: '59',
        code: 'TVH',
        name: 'Trà Vinh',
        url_id: 59
    },
    {
        id: '60',
        code: 'TQG',
        name: 'Tuyên Quang',
        url_id: 60
    },
    {
        id: '61',
        code: 'VLG',
        name: 'Vĩnh Long',
        url_id: 61
    },
    {
        id: '62',
        code: 'VPC',
        name: 'Vĩnh Phúc',
        url_id: 62
    },
    {
        id: '63',
        code: 'YBI',
        name: 'Yên Bái',
        url_id: 63
    }
];

/*initiate the autocomplete function on the "inputFrom" element, and pass along the countries array as possible autocomplete values:*/
autocompleteFrom(document.getElementById('inputFrom'), data, cities);
autocompleteTo(document.getElementById('inputTo'), data, cities);