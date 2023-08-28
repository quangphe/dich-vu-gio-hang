const listService = document.getElementById('listService');
// hiển thị dịch vụ ra màn hình
function loadListService(choseService) {
    if (choseService.length == 0) {
        listService.innerHTML = 'không tìm thấy kết quả phù hợp'
    }
    else {
        listService.innerHTML = '';
        for (let i = 0; i < choseService.length; i++) {
            listService.insertAdjacentHTML('beforeend',
                `
            <div class="screen3__item modal-btn load" data-modal="more1">
                    <img width="262" height="223" src="${choseService[i].img[0]}" alt="">
                    <p><span class="btnAddCart">Thêm vào giỏ hàng</span></p>
            </div>
            `)
        }
        const btnAddCart = document.getElementsByClassName('btnAddCart');
        for (let i = 0; i < btnAddCart.length; i++) {
            btnAddCart[i].addEventListener('click', () => {
                alert('Thêm Sản Phẩm Thành Công');
                cartNumber(choseService[i]);
                cartTotal(choseService[i]);
            })
        }
    }
};

// hiển thị dịch vụ trong local storage
function loadNumberInCart() {
    let serviceNumberInCart = localStorage.getItem('CartNumbers');
    serviceNumberInCart = parseInt(serviceNumberInCart);
    if (serviceNumberInCart) {
        document.getElementById('cartNumbers').textContent = serviceNumberInCart;
    }
};

// thêm dịch vụ vào giỏ hàng
function cartNumber(choseService) {
    let serviceNumberInCart = localStorage.getItem('CartNumbers'); // lấy sản phẩm đang có trong cart
    serviceNumberInCart = parseInt(serviceNumberInCart);
    // kiểm tra trong cart có dịch vụ nào chưa
    if (serviceNumberInCart) {
        localStorage.setItem('CartNumbers', serviceNumberInCart + 1); // có rồi thì +1
        document.getElementById('cartNumbers').textContent = serviceNumberInCart + 1; // hiển thị cart number lên màn hình
    }
    else {
        localStorage.setItem('CartNumbers', 1);
        document.getElementById('cartNumbers').textContent = 1 // chưa có thì = 1
    };
    inCartService(choseService);
};

// lưu những dịch vụ đã được chọn
function inCartService(choseService) {
    let cartItems = localStorage.getItem('serviceInCart');
    cartItems = JSON.parse(cartItems);
    if (cartItems != null) {
        if (cartItems[choseService.serviceID] == undefined) {
            cartItems = {
                ...cartItems,
                [choseService.serviceID]: choseService,
            }
        }
        cartItems[choseService.serviceID].inCart += 1;
    }
    else {
        choseService.inCart = 1;
        cartItems = {
            [choseService.serviceID]: choseService,
        }
    }
    localStorage.setItem('serviceInCart', JSON.stringify(cartItems));
};

// gọi ra những dịch vụ đã được chọn
function loadListCartService() {
    let cartHeader = document.getElementsByClassName('table listCartService');
    let cartContent = document.getElementById('content');
    let cartTotal = localStorage.getItem('totalCart');
    let serviceInCart = localStorage.getItem('serviceInCart');
    const footer__payment = document.getElementById('footer__payment');
    serviceInCart = JSON.parse(serviceInCart);

    if (serviceInCart != null) {
        serviceInCart = (Object.values(serviceInCart));
        if (serviceInCart && cartContent) {
            cartContent.innerHTML = '';
            footer__payment.innerHTML = '';
            for (let i = 0; i < serviceInCart.length; i++) {
                cartContent.insertAdjacentHTML('beforeend',
                    `
                    <tr>
                        <td>
                            <div class="table__service">
                                <div class="table__service--pic">
                                    <img width="540" height="514" src="${serviceInCart[i].img[0]}"
                                        alt="">
                                </div>
                                <p>${serviceInCart[i].serviceName}</p>
                            </div>
                        </td>
                        <td>${convertVND(serviceInCart[i].price.toString())}đ</td>
                        <td>
                            <input type="number" value="${serviceInCart[i].inCart}" min="0" max="200">
                        </td>
                        <td>
                            <button class="table__service--btn btnRemove">Xóa</button>
                        </td>
                    </tr>
                    `
                );
            }

            footer__payment.innerHTML = `
                <div class="modal-footer__payment">
                    <p>Thanh toán: <span>${convertVND(cartTotal)}</span></p>
                </div>
                <div class="modal-footer__btn">
                    <button class="modal-footer__btnPayment" id="btnBuy">Thanh toán</button>
                </div>
            `
        }
        else {
            cartContent.innerHTML = '<h2>Cart Is Empty!</h2>';
        }
        const btnRemove = document.getElementsByClassName('btnRemove');
        for (let i = 0; i < btnRemove.length; i++) {
            btnRemove[i].addEventListener('click', () => {
                updateCartTotal(serviceInCart[i]);
                removeShowServiceInCart(i);
                updateCartNumber(serviceInCart[i]);
                loadListCartService();
            });
        };

        const btnBuy = document.getElementById('btnBuy');
        btnBuy.addEventListener('click', () => {
            creatBill();
            showBillDetail();
        })
    }
};

//tính tổng giá trị sản phẩm đã được chọn
function cartTotal(choseService) {
    let cartTotal = localStorage.getItem('totalCart');
    if (cartTotal != null) {
        cartTotal = parseInt(cartTotal);
        localStorage.setItem('totalCart', cartTotal + choseService.price);
    } else {
        localStorage.setItem('totalCart', choseService.price);
    }
};

// xóa sản phẩm bị remove khỏi màn hình và localstorage
function removeShowServiceInCart(choseService) {
    let serviceInCart = localStorage.getItem('serviceInCart');
    let cartContent = document.getElementById('content');
    let footerPayment = document.getElementById('footer__payment');
    cartContent.innerHTML = '';
    footerPayment.innerHTML = '';
    serviceInCart = JSON.parse(serviceInCart);
    serviceInCart = (Object.values(serviceInCart));
    serviceInCart.splice(choseService, 1);
    localStorage.setItem('serviceInCart', JSON.stringify(serviceInCart));
};

// update total cart sau khi remove
function updateCartTotal(choseService) {
    let cartTotal = localStorage.getItem('totalCart');
    cartTotal = Number(cartTotal);

    if (cartTotal == 0) {
        localStorage.setItem('totalCart', cartTotal);
    }
    else {
        localStorage.setItem('totalCart', cartTotal - (choseService.price * choseService.inCart));
    }
};

// update số sản phẩm trong cart sau khi remove
function updateCartNumber(choseService) {
    let serviceNumberInCarts = localStorage.getItem('CartNumbers'); //lấy ra số dịch vụ đang có trong cart
    serviceNumberInCarts = parseInt(serviceNumberInCarts);
    if (serviceNumberInCarts == 0) {
        localStorage.setItem('CartNumbers', 0);
        document.getElementById('cartNumbers').textContent = 0;
    }
    else {
        localStorage.setItem('CartNumbers', serviceNumberInCarts - choseService.inCart);
        document.getElementById('cartNumbers').textContent = serviceNumberInCarts - choseService.inCart;
    }
};

// đổi đơn vị tiền tệ
function convertVND(a) {
    let b = a.split(``);
    if (b.length >= 4 && b.length <= 6) {
        b.splice(b.length - 3, 0, `.`)
    } else if (b.length >= 7 && b.length <= 9) {
        b.splice(b.length - 3, 0, `.`);
        b.splice(b.length - 7, 0, `.`);
    }
    let c = b.join(``);
    return c;
};

// tạo bill và lưu vào local, việc lưu vào local giúp sau này lấy lại đc thông tin từ bill chuyển đến mangae bill của admin
function creatBill() {
    const inName = document.getElementById('inName');
    const inPhone = document.getElementById('inPhone');
    const inEmail = document.getElementById('inEmail');
    const inAddress = document.getElementById('inAddress');
    const cartTotal = localStorage.getItem('totalCart');
    let serviceInCart = localStorage.getItem('serviceInCart');
    serviceInCart = JSON.parse(serviceInCart);
    serviceInCart = (Object.values(serviceInCart));
    let i = 0;
    let newBill = {
        billID: i,
        name: inName.value,
        phone: inPhone.value,
        email: inEmail.value,
        add: inAddress.value,
        service: serviceInCart,
        total: cartTotal,
        date: new Date()
    }
    const billFormLocalStorage = localStorage.getItem('bill');
    const billParseJSon = JSON.parse(billFormLocalStorage);
    let finalBill = newBill;
    if (billFormLocalStorage != null) {
        if (newBill.billID != 1) {
            finalBill = {
                ...billParseJSon,
                [newBill.billID]: newBill
            }
        }
        newBill.billID += 1;
    }
    else {
        newBill.billID = 1;
        finalBill = {
            [newBill.billID]: newBill
        }
    }
    localStorage.setItem('bill', JSON.stringify(finalBill));
}

// dùng để show ra detail  đơn hàng sau khi ấn buy
function showBillDetail() {
    const cartTotal = localStorage.getItem('totalCart');
    if (confirm(`Tổng hóa đơn của bạn: ${cartTotal}`) == true) {
        alert('Đặt hàng dịch vụ thành công! Cảm ơn bạn đã đặt dịch vụ của chúng tôi. Vui lòng chờ xác nhận từ nhân viên.');
        // const thankyou = document.getElementById('thankyou_kn_1_0_0');
        // thankyou.innerHTML = `
        // <div class="payment_kn_1_0_0__box modal" id="modal-zoom">
        //     <div class="modal-bg"></div>
        //     <div class="modal-box animate-zoom">
        //         <div class="modal-body">
        //             <div class="modal__text">
        //                 <h2>Đặt hàng dịch vụ thành công!</h2>
        //                 <p>Cảm ơn bạn đã đặt dịch vụ của chúng tôi. Vui lòng chờ xác nhận từ nhân viên.</p>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        // `
        localStorage.removeItem('serviceInCart');
        localStorage.removeItem('CartNumbers');
        localStorage.removeItem('totalCart');
    }
    else {
        alert('Không thành công');
    }
}

loadListService(serviceData);
loadNumberInCart();
loadListCartService();