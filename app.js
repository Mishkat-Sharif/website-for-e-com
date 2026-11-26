/* ========================================
   ShopVibe — E-Commerce JavaScript
   ======================================== */

// ============ PRODUCT DATA ============
const products = [
    { id: 1,  name: "Wireless Noise-Cancelling Headphones", category: "electronics", price: 149.99, originalPrice: 249.99, badge: "sale", rating: 4.8, reviews: 342, icon: "fa-solid fa-headphones", description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions." },
    { id: 2,  name: "Smart Fitness Watch Pro", category: "electronics", price: 199.99, originalPrice: null, badge: "new", rating: 4.6, reviews: 128, icon: "fa-solid fa-clock", description: "Track your health & fitness with heart rate monitoring, GPS, sleep tracking, and 7-day battery life." },
    { id: 3,  name: "Classic Leather Jacket", category: "fashion", price: 189.00, originalPrice: 320.00, badge: "sale", rating: 4.9, reviews: 215, icon: "fa-solid fa-vest-patches", description: "Genuine leather jacket with a timeless design. Soft inner lining for all-day comfort." },
    { id: 4,  name: "Minimalist Running Shoes", category: "sports", price: 89.99, originalPrice: null, badge: "hot", rating: 4.7, reviews: 467, icon: "fa-solid fa-shoe-prints", description: "Ultra-lightweight running shoes with responsive cushioning and breathable mesh upper." },
    { id: 5,  name: "Organic Skincare Set", category: "beauty", price: 59.99, originalPrice: 89.99, badge: "sale", rating: 4.5, reviews: 183, icon: "fa-solid fa-pump-soap", description: "Complete skincare routine with cleanser, toner, moisturizer, and serum — all organic and cruelty-free." },
    { id: 6,  name: "Ergonomic Office Chair", category: "home", price: 349.00, originalPrice: 499.00, badge: "sale", rating: 4.8, reviews: 92, icon: "fa-solid fa-chair", description: "Adjustable lumbar support, breathable mesh back, and premium build quality for long work days." },
    { id: 7,  name: "Premium Bluetooth Speaker", category: "electronics", price: 79.99, originalPrice: null, badge: "new", rating: 4.4, reviews: 256, icon: "fa-solid fa-volume-high", description: "360° surround sound with deep bass. Waterproof design and 12-hour playtime." },
    { id: 8,  name: "Cotton Linen Summer Dress", category: "fashion", price: 65.00, originalPrice: 95.00, badge: "sale", rating: 4.6, reviews: 134, icon: "fa-solid fa-shirt", description: "Breathable cotton-linen blend perfect for warm days. Available in 6 beautiful colors." },
    { id: 9,  name: "Yoga Mat Premium", category: "sports", price: 45.99, originalPrice: null, badge: null, rating: 4.7, reviews: 389, icon: "fa-solid fa-mattress-pillow", description: "Extra thick, non-slip yoga mat with alignment lines. Eco-friendly TPE material." },
    { id: 10, name: "Scented Candle Collection", category: "home", price: 34.99, originalPrice: 49.99, badge: "hot", rating: 4.3, reviews: 211, icon: "fa-solid fa-fire-flame-curved", description: "Set of 4 hand-poured soy candles with calming fragrances: lavender, vanilla, cedarwood, and jasmine." },
    { id: 11, name: "4K Action Camera", category: "electronics", price: 229.00, originalPrice: 349.00, badge: "sale", rating: 4.5, reviews: 178, icon: "fa-solid fa-camera", description: "Capture every adventure in stunning 4K. Waterproof up to 30m with image stabilization." },
    { id: 12, name: "Luxury Face Serum", category: "beauty", price: 42.00, originalPrice: null, badge: "new", rating: 4.9, reviews: 97, icon: "fa-solid fa-droplet", description: "Vitamin C & hyaluronic acid serum for radiant, hydrated skin. Visible results in 2 weeks." },
];

// ============ STATE ============
let cart = JSON.parse(localStorage.getItem("sv_cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("sv_wishlist")) || [];

// ============ DOM REFS ============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const productsGrid = $("#productsGrid");
const cartSidebar  = $("#cartSidebar");
const cartOverlay  = $("#cartOverlay");
const cartItemsEl  = $("#cartItems");
const cartFooter   = $("#cartFooter");
const cartTotalEl  = $("#cartTotal");
const cartCountEl  = $("#cartCount");
const wishlistCountEl = $("#wishlistCount");
const toastContainer = $("#toastContainer");
const backToTop    = $("#backToTop");
const header       = $(".header");
const hamburger    = $("#hamburger");
const mainNav      = $("#mainNav");
const modalOverlay = $("#modalOverlay");
const quickViewModal = $("#quickViewModal");
const modalBody    = $("#modalBody");

// ============ RENDER PRODUCTS ============
function renderProducts(filter = "all") {
    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
    productsGrid.innerHTML = filtered.map(p => `
        <div class="product-card" data-category="${p.category}">
            ${p.badge ? `<span class="product-card__badge badge--${p.badge}">${p.badge === 'sale' ? 'Sale' : p.badge === 'new' ? 'New' : 'Hot'}</span>` : ''}
            <div class="product-card__actions">
                <button onclick="toggleWishlist(${p.id})" title="Wishlist" class="${wishlist.includes(p.id) ? 'wishlisted' : ''}">
                    <i class="fa-${wishlist.includes(p.id) ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <button onclick="openQuickView(${p.id})" title="Quick View">
                    <i class="fa-solid fa-eye"></i>
                </button>
            </div>
            <div class="product-card__img"><i class="${p.icon}"></i></div>
            <div class="product-card__info">
                <span class="product-card__category">${p.category}</span>
                <h3 class="product-card__name">${p.name}</h3>
                <div class="product-card__rating">
                    ${renderStars(p.rating)}
                    <span>(${p.reviews})</span>
                </div>
                <div class="product-card__price">
                    <span class="current">$${p.price.toFixed(2)}</span>
                    ${p.originalPrice ? `<span class="original">$${p.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="product-card__cart-btn" onclick="addToCart(${p.id})">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join("");
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) stars += '<i class="fa-solid fa-star"></i>';
        else if (i - rating < 1) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        else stars += '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

// ============ CART ============
function saveCart() {
    localStorage.setItem("sv_cart", JSON.stringify(cart));
    updateCartUI();
}

function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, qty: 1 });
    }
    saveCart();
    const product = products.find(p => p.id === id);
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function updateQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    saveCart();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-cart-shopping"></i><p>Your cart is empty</p></div>`;
        cartFooter.style.display = "none";
        return;
    }

    cartFooter.style.display = "block";
    let total = 0;

    cartItemsEl.innerHTML = cart.map(item => {
        const p = products.find(prod => prod.id === item.id);
        const subtotal = p.price * item.qty;
        total += subtotal;
        return `
            <div class="cart-item">
                <div class="cart-item__img"><i class="${p.icon}"></i></div>
                <div class="cart-item__details">
                    <div class="cart-item__name">${p.name}</div>
                    <div class="cart-item__price">$${p.price.toFixed(2)}</div>
                    <div class="cart-item__qty">
                        <button onclick="updateQty(${p.id}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty(${p.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item__remove" onclick="removeFromCart(${p.id})"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    }).join("");

    cartTotalEl.textContent = `$${total.toFixed(2)}`;
}

// ============ WISHLIST ============
function toggleWishlist(id) {
    const idx = wishlist.indexOf(id);
    const product = products.find(p => p.id === id);
    if (idx > -1) {
        wishlist.splice(idx, 1);
        showToast(`Removed from wishlist`, 'error');
    } else {
        wishlist.push(id);
        showToast(`${product.name} added to wishlist!`, 'success');
    }
    localStorage.setItem("sv_wishlist", JSON.stringify(wishlist));
    wishlistCountEl.textContent = wishlist.length;
    renderProducts(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
}

// ============ QUICK VIEW ============
function openQuickView(id) {
    const p = products.find(prod => prod.id === id);
    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail__img"><i class="${p.icon}"></i></div>
            <div class="product-detail__info">
                <span class="product-card__category">${p.category}</span>
                <h2>${p.name}</h2>
                <div class="rating">${renderStars(p.rating)} <span style="color: var(--gray); font-size: .88rem; margin-left: 6px;">(${p.reviews} reviews)</span></div>
                <div class="price">$${p.price.toFixed(2)} ${p.originalPrice ? `<span style="font-size: 1rem; color: var(--gray); text-decoration: line-through; font-weight: 400; margin-left: 10px;">$${p.originalPrice.toFixed(2)}</span>` : ''}</div>
                <p class="description">${p.description}</p>
                <button class="btn btn--primary" onclick="addToCart(${p.id}); closeQuickView();"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
            </div>
        </div>
    `;
    modalOverlay.classList.add("open");
    quickViewModal.classList.add("open");
}

function closeQuickView() {
    modalOverlay.classList.remove("open");
    quickViewModal.classList.remove("open");
}

// ============ CART SIDEBAR ============
function openCart() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
}

// ============ TOAST ============
function showToast(message, type = 'success') {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'circle-xmark'}"></i> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 2500);
}

// ============ COUNTDOWN ============
function startCountdown() {
    const end = new Date();
    end.setDate(end.getDate() + 3);
    end.setHours(23, 59, 59);

    function update() {
        const now = new Date();
        const diff = end - now;
        if (diff <= 0) return;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        $("#cd-days").textContent = String(d).padStart(2, '0');
        $("#cd-hours").textContent = String(h).padStart(2, '0');
        $("#cd-mins").textContent = String(m).padStart(2, '0');
        $("#cd-secs").textContent = String(s).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}

// ============ SEARCH ============
function handleSearch() {
    const q = $("#searchInput").value.trim().toLowerCase();
    if (!q) { renderProducts('all'); return; }
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
    productsGrid.innerHTML = filtered.length ? filtered.map(p => `
        <div class="product-card" data-category="${p.category}">
            ${p.badge ? `<span class="product-card__badge badge--${p.badge}">${p.badge === 'sale' ? 'Sale' : p.badge === 'new' ? 'New' : 'Hot'}</span>` : ''}
            <div class="product-card__actions">
                <button onclick="toggleWishlist(${p.id})" title="Wishlist" class="${wishlist.includes(p.id) ? 'wishlisted' : ''}"><i class="fa-${wishlist.includes(p.id) ? 'solid' : 'regular'} fa-heart"></i></button>
                <button onclick="openQuickView(${p.id})" title="Quick View"><i class="fa-solid fa-eye"></i></button>
            </div>
            <div class="product-card__img"><i class="${p.icon}"></i></div>
            <div class="product-card__info">
                <span class="product-card__category">${p.category}</span>
                <h3 class="product-card__name">${p.name}</h3>
                <div class="product-card__rating">${renderStars(p.rating)}<span>(${p.reviews})</span></div>
                <div class="product-card__price">
                    <span class="current">$${p.price.toFixed(2)}</span>
                    ${p.originalPrice ? `<span class="original">$${p.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="product-card__cart-btn" onclick="addToCart(${p.id})"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
            </div>
        </div>
    `).join("") : `<p style="text-align:center;grid-column:1/-1;padding:40px;color:var(--gray);">No products found for "${q}"</p>`;
    // Scroll to products
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// ============ EVENT LISTENERS ============
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    updateCartUI();
    wishlistCountEl.textContent = wishlist.length;
    startCountdown();

    // Filter buttons
    $$(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            $$(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderProducts(btn.dataset.filter);
        });
    });

    // Category cards
    $$(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            const cat = card.dataset.category;
            $$(".filter-btn").forEach(b => { b.classList.remove("active"); if (b.dataset.filter === cat) b.classList.add("active"); });
            renderProducts(cat);
            document.getElementById("products").scrollIntoView({ behavior: "smooth" });
        });
    });

    // Cart
    $("#cartBtn").addEventListener("click", openCart);
    $("#closeCart").addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // Modal
    $("#closeModal").addEventListener("click", closeQuickView);
    modalOverlay.addEventListener("click", closeQuickView);

    // Hamburger
    hamburger.addEventListener("click", () => { mainNav.classList.toggle("open"); });

    // Search
    $("#searchBtn").addEventListener("click", handleSearch);
    $("#searchInput").addEventListener("keyup", (e) => { if (e.key === "Enter") handleSearch(); });

    // Scroll effects
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 50);
        backToTop.classList.toggle("visible", window.scrollY > 400);
    });

    backToTop.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });

    // Newsletter
    $("#newsletterForm").addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Thanks for subscribing! 🎉", "success");
        e.target.reset();
    });

    // Checkout
    $("#checkoutBtn").addEventListener("click", () => {
        if (cart.length === 0) return;
        showToast("Redirecting to checkout… (Demo)", "success");
        setTimeout(() => { cart = []; saveCart(); closeCart(); }, 1500);
    });
});
