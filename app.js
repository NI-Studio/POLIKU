// ================= FUNGSI 1: NAVIGASI HALAMAN =================
function navigateTo(targetPageId) {
    // Dapatkan semua elemen yang mempunyai class 'page'
    const pages = document.querySelectorAll('.page');
    
    // Buang class 'active' dari semua halaman
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Tambah class 'active' pada halaman yang dipanggil
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. Matikan Splash Screen selepas 2.5 saat
    setTimeout(() => {
        navigateTo('welcome-page');
    }, 2500);

    // 2. Logik interaktif untuk butang Navigasi Bawah (Support kedua-dua kelas Nav Lama & Premium)
    const navItems = document.querySelectorAll(".nav-item, .nav-item-premium");
    
    navItems.forEach(item => {
        item.addEventListener("click", function() {
            if (!this.innerHTML.includes('fa-right-from-bracket')) {
                // Hanya buang active class pada nav di dalam kumpulan yang sama sahaja
                let siblings = this.parentElement.querySelectorAll(".nav-item, .nav-item-premium");
                siblings.forEach(nav => nav.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });
});


// ================= FUNGSI 2: FILTER KATEGORI =================
function filterCategory(category) {
    // Tukar warna butang kategori aktif (Menggunakan .cat-pill untuk rekaan premium)
    document.querySelectorAll('.cat-pill').forEach(card => card.classList.remove('active'));
    document.getElementById('cat-' + category).classList.add('active');

    // Tapis senarai kafe
    const cafes = document.querySelectorAll('.cafe-item');
    cafes.forEach(cafe => {
        if (category === 'semua' || cafe.getAttribute('data-category').includes(category)) {
            cafe.style.display = 'block'; // Guna block untuk kad premium
        } else {
            cafe.style.display = 'none';
        }
    });
}


// ================= FUNGSI 3: BUKA KAFE & JANA MENU DINAMIK =================
function openCafe(cafeName, cafeLoc) {
    // Tukar tajuk & lokasi
    document.getElementById('dynamic-cafe-name').innerText = cafeName;
    document.getElementById('dynamic-cafe-loc').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${cafeLoc}`;
    
    // Jana menu berbeza mengikut kafe (Sistem Ringkas)
    let menuHTML = "";
    if(cafeName.includes("Mawar")) {
        menuHTML += createMenu("Nasi Ayam Penyet", 8.00);
        menuHTML += createMenu("Nasi Campur Berlauk", 6.50);
        menuHTML += createMenu("Teh O Ais", 1.50);
    } else if(cafeName.includes("FSKM")) {
        menuHTML += createMenu("Chicken Chop", 12.00);
        menuHTML += createMenu("Spaghetti Bolognese", 10.00);
        menuHTML += createMenu("Air Sirap", 1.00);
    } else {
        menuHTML += createMenu("Kopi Latte Dingin", 7.00);
        menuHTML += createMenu("Roti Bakar Kaya", 3.50);
    }

    document.getElementById('dynamic-menu-list').innerHTML = menuHTML;
    navigateTo('cafe-detail-page');
}

// Rekaan HTML ditukar kepada kelas CSS Premium yang baru supaya lebih cantik
function createMenu(name, price) {
    // Format nombor jadi RM 0.00
    let priceStr = price.toFixed(2);
    return `
        <div class="menu-item-premium">
            <div class="m-info">
                <h5>${name}</h5>
                <p>RM ${priceStr}</p>
            </div>
            <button class="btn-add" onclick="addToCart('${name}', ${price})">Tambah</button>
        </div>
    `;
}


// ================= FUNGSI 4: SISTEM TROLI (CART) =================
// Sistem ini dikekalkan 100% sama seperti fail asal anda
let cart = []; // Array simpan data

function addToCart(itemName, itemPrice) {
    cart.push({ name: itemName, price: itemPrice });
    updateCartBadge();
    
    // Popup ringkas memberitahu item berjaya ditambah
    alert(`✅ ${itemName} ditambah ke troli!`);
}

function updateCartBadge() {
    let count = cart.length;
    document.getElementById('home-cart-badge').innerText = count;
    document.getElementById('cafe-cart-badge').innerText = count;
}

function openCart() {
    let container = document.getElementById('cart-items-container');
    let summary = document.getElementById('cart-summary');
    let emptyMsg = document.getElementById('empty-cart-msg');
    
    container.innerHTML = ""; // Kosongkan senarai lama
    
    if (cart.length === 0) {
        emptyMsg.style.display = "block";
        summary.style.display = "none";
    } else {
        emptyMsg.style.display = "none";
        summary.style.display = "block";
        
        let subtotal = 0;
        
        // Loop setiap item dalam array cart
        cart.forEach((item, index) => {
            subtotal += item.price;
            container.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h5>${item.name}</h5>
                        <p class="price">RM ${item.price.toFixed(2)}</p>
                    </div>
                    <button class="btn-remove" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        });
        
        // Kira Total
        document.getElementById('cart-subtotal').innerText = "RM " + subtotal.toFixed(2);
        let grandTotal = subtotal + 2.00; // RM2 Delivery Fee
        document.getElementById('cart-total').innerText = "RM " + grandTotal.toFixed(2);
    }
    
    navigateTo('cart-page');
}

function removeFromCart(index) {
    cart.splice(index, 1); // Buang 1 item pada index tersebut
    updateCartBadge();
    openCart(); // Refresh paparan troli
}

function checkout() {
    alert("Pesanan berjaya dihantar ke Kafe! Sila tunggu Rider anda.");
    cart = []; // Kosongkan troli selepas beli
    updateCartBadge();
    navigateTo('orders-page'); // Bawa ke muka surat tracking pesanan
}
