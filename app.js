/**
 * Fungsi untuk menukar halaman (View Navigation)
 * @param {string} targetPageId - ID elemen div yang ingin dipaparkan
 */
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
    // 1. Fungsi automatik buang Splash Screen selepas 2.5 saat dan tunjuk Welcome Page
    setTimeout(() => {
        navigateTo('welcome-page');
    }, 2500);

    // 2. Logik interaktif untuk butang Navigasi Bawah (dari kod sedia ada)
    const navItems = document.querySelectorAll(".nav-item");
    
    navItems.forEach(item => {
        item.addEventListener("click", function() {
            if (!this.innerHTML.includes('fa-right-from-bracket')) {
                navItems.forEach(nav => nav.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });
});

function navigateTo(targetPageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(targetPageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}
