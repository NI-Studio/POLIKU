document.addEventListener("DOMContentLoaded", () => {
    // Matikan Splash Screen selepas 2.5 saat dan semak memori sistem
    setTimeout(() => { 
        checkSavedSession(); 
    }, 2500);

    // Logik interaktif untuk butang Navigasi Bawah
    const navItems = document.querySelectorAll(".nav-item, .nav-item-premium");
    navItems.forEach(item => {
        item.addEventListener("click", function() {
            if (!this.innerHTML.includes('fa-right-from-bracket')) {
                let siblings = this.parentElement.querySelectorAll(".nav-item, .nav-item-premium");
                siblings.forEach(nav => nav.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });
});

// ================= FUNGSI 1: NAVIGASI HALAMAN & SMART SYNC MENU =================
function navigateTo(targetPageId) {
    // Tukar Halaman
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(targetPageId);
    if (targetPage) targetPage.classList.add('active');

    // FIX: Automatik Sync Menu Bawah ke Halaman Semasa
    const allNavItems = document.querySelectorAll(".nav-item, .nav-item-premium");
    
    // Buang warna aktif pada semua butang
    allNavItems.forEach(nav => nav.classList.remove('active'));
    
    // Tambah warna aktif HANYA pada butang yang menghala ke halaman ini
    allNavItems.forEach(nav => {
        let onclickAttr = nav.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(targetPageId)) {
            nav.classList.add('active');
        }
    });
}


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


// ================= FUNGSI 3: JANA KAFE & MENU DINAMIK =================
function openCafe(cafeName, cafeLoc) {
    document.getElementById('dynamic-cafe-name').innerText = cafeName;
    document.getElementById('dynamic-cafe-loc').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${cafeLoc}`;
    
    // Jana menu berbeza & HANTAR NAMA KAFE SEKALI
    let menuHTML = "";
    if(cafeName.includes("Mawar")) {
        menuHTML += createMenu("Nasi Ayam Penyet", 8.00, cafeName);
        menuHTML += createMenu("Nasi Campur Berlauk", 6.50, cafeName);
        menuHTML += createMenu("Teh O Ais", 1.50, cafeName);
    } else if(cafeName.includes("FSKM")) {
        menuHTML += createMenu("Chicken Chop", 12.00, cafeName);
        menuHTML += createMenu("Spaghetti Bolognese", 10.00, cafeName);
        menuHTML += createMenu("Air Sirap", 1.00, cafeName);
    } else {
        menuHTML += createMenu("Kopi Latte Dingin", 7.00, cafeName);
        menuHTML += createMenu("Roti Bakar Kaya", 3.50, cafeName);
    }

    document.getElementById('dynamic-menu-list').innerHTML = menuHTML;
    navigateTo('cafe-detail-page');
}

// Tambah parameter cafeName supaya troli tahu makanan dari kedai mana
function createMenu(name, price, cafeName) {
    let priceStr = price.toFixed(2);
    return `
        <div class="menu-item-premium">
            <div class="m-info">
                <h5>${name}</h5>
                <p>RM ${priceStr}</p>
            </div>
            <button class="btn-add" onclick="addToCart('${name}', ${price}, '${cafeName}')">Tambah</button>
        </div>
    `;
}

// ================= FUNGSI 4: SISTEM TROLI (CART BERASINGAN) =================
let cart = []; 

// Fungsi mencipta ID unik untuk setiap barang yang ditambah (supaya mudah padam)
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function addToCart(itemName, itemPrice, cafeName) {
    // Simpan maklumat makanan beserta nama kafe
    cart.push({ id: generateId(), name: itemName, price: itemPrice, cafe: cafeName });
    updateCartBadge();
    alert(`✅ ${itemName} ditambah ke troli!`);
}

function updateCartBadge() {
    let count = cart.length;
    document.getElementById('home-cart-badge').innerText = count;
    document.getElementById('cafe-cart-badge').innerText = count;
}

function openCart() {
    let container = document.getElementById('cart-items-container');
    let emptyMsg = document.getElementById('empty-cart-msg');
    
    container.innerHTML = ""; 
    
    if (cart.length === 0) {
        emptyMsg.style.display = "block";
    } else {
        emptyMsg.style.display = "none";
        
        // Asingkan data troli mengikut nama Kafe
        let groupedCart = {};
        cart.forEach(item => {
            if(!groupedCart[item.cafe]) groupedCart[item.cafe] = [];
            groupedCart[item.cafe].push(item);
        });
        
        // Bina paparan (UI) berasingan untuk setiap kafe
        for (let cafe in groupedCart) {
            let items = groupedCart[cafe];
            let subtotal = 0;
            
            // Mula kotak (Card) untuk kafe ini
            let cafeHTML = `
                <div class="cart-cafe-group">
                    <h4 class="cart-cafe-title"><i class="fa-solid fa-store"></i> ${cafe}</h4>
                    <div class="cart-cafe-items">
            `;
            
            // Masukkan senarai makanan untuk kafe ini
            items.forEach(item => {
                subtotal += item.price;
                cafeHTML += `
                    <div class="cart-item">
                        <div>
                            <h5>${item.name}</h5>
                            <p class="price">RM ${item.price.toFixed(2)}</p>
                        </div>
                        <button class="btn-remove" onclick="removeFromCart('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            });
            
            // Kira Jumlah & Letak Butang Bayar Khas untuk kafe ini sahaja
            let total = subtotal + 2.00; // Caj Penghantaran RM2
            
            cafeHTML += `
                    </div>
                    <div class="receipt-summary-premium" style="box-shadow: none; padding: 10px 0 0 0; margin-top: 10px;">
                        <div class="summary-row"><p>Subtotal</p><p class="dark-text">RM ${subtotal.toFixed(2)}</p></div>
                        <div class="summary-row"><p>Caj Penghantaran</p><p class="dark-text">RM 2.00</p></div>
                        <div class="summary-divider" style="margin: 10px 0;"></div>
                        <div class="summary-row total"><p>Jumlah</p><p class="brand-text">RM ${total.toFixed(2)}</p></div>
                        
                        <button class="btn-primary checkout-btn" style="margin-top: 15px;" onclick="checkoutCafe('${cafe}')">
                            Bayar ${cafe} <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            `;
            
            container.innerHTML += cafeHTML;
        }
    }
    
    navigateTo('cart-page');
}

function removeFromCart(id) {
    // Padam hanya item yang mempunyai ID yang ditekan
    cart = cart.filter(item => item.id !== id);
    updateCartBadge();
    openCart(); 
}

function checkoutCafe(cafeName) {
    alert(`Pesanan berjaya dihantar ke ${cafeName}! Sila tunggu Rider anda.`);
    
    // Selepas bayar satu kafe, PADAM makanan dari kafe tersebut sahaja dalam troli
    cart = cart.filter(item => item.cafe !== cafeName);
    
    updateCartBadge();
    navigateTo('orders-page'); 
}

// ================= FUNGSI 5: SISTEM SIMPANAN MEMORI (LOCAL STORAGE) =================

function checkSavedSession() {
    const savedRole = localStorage.getItem("poliku_role");
    const isLoggedIn = localStorage.getItem("poliku_logged_in") === "true";

    if (savedRole) {
        if (savedRole === "user") navigateTo('home-page');
        else if (savedRole === "vendor") navigateTo('vendor-dashboard-page');
        else if (savedRole === "rider") navigateTo('rider-dashboard-page');
        
        updateProfileView(isLoggedIn);
    } else {
        navigateTo('welcome-page');
    }
}

function processLogin(event, role) {
    event.preventDefault(); 
    
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const passInput = form.querySelector('input[type="password"]'); // Tangkap password
    
    const email = emailInput ? emailInput.value : "user@email.com";
    const pass = passInput ? passInput.value : "";

    // WAJIBKAN PASSWORD "123456" UNTUK LOG MASUK
    if (pass !== "123456") {
        alert("Kata laluan salah! Sila guna '123456' untuk fasa percubaan.");
        return; // Hentikan dari log masuk
    }

    const name = email.split('@')[0]; 
    
    localStorage.setItem("poliku_role", role);
    localStorage.setItem("poliku_logged_in", "true");
    localStorage.setItem("poliku_name", name);
    localStorage.setItem("poliku_email", email);

    checkSavedSession(); 
}

function processGuest(role) {
    localStorage.setItem("poliku_role", role);
    localStorage.setItem("poliku_logged_in", "false"); 
    checkSavedSession();
}

function updateProfileView(isLoggedIn) {
    const loggedInSection = document.getElementById("logged-in-profile");
    const guestSection = document.getElementById("guest-profile");
    const homeGreeting = document.getElementById("home-greeting"); // Tangkap tajuk di Home
    
    if (isLoggedIn) {
        if(loggedInSection) loggedInSection.style.display = "block";
        if(guestSection) guestSection.style.display = "none";
        
        const name = localStorage.getItem("poliku_name");
        const email = localStorage.getItem("poliku_email");
        // Huruf besarkan awalan nama
        const capitalizedName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "Siswa";
        
        const nameDisplay = document.getElementById("profile-name-display");
        const emailDisplay = document.getElementById("profile-email-display");
        
        if(nameDisplay) nameDisplay.innerText = capitalizedName;
        if(emailDisplay) emailDisplay.innerText = email;
        
        // PAPAR NAMA JIKA LOG MASUK
        if(homeGreeting) homeGreeting.innerHTML = `Nak makan apa <br>hari ini, ${capitalizedName}?`;
        
    } else {
        if(loggedInSection) loggedInSection.style.display = "none";
        if(guestSection) guestSection.style.display = "block";
        
        // HILANGKAN NAMA JIKA TETAMU (GUEST)
        if(homeGreeting) homeGreeting.innerHTML = `Nak makan apa <br>hari ini?`;
    }
}

function processLogout() {
    localStorage.removeItem("poliku_role");
    localStorage.removeItem("poliku_logged_in");
    localStorage.removeItem("poliku_name");
    localStorage.removeItem("poliku_email");
    navigateTo('welcome-page');
}

// ================= FUNGSI 6: SKRIN TERAPUNG VENDOR / RIDER =================
function showDevAlert() {
    const alertBox = document.getElementById('dev-alert');
    if(alertBox) alertBox.style.display = 'flex';
}

function closeDevAlert() {
    const alertBox = document.getElementById('dev-alert');
    if(alertBox) alertBox.style.display = 'none';
}
