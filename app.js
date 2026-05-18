const products = [
  {
    id: 1,
    name: "Aurora Wireless Headphones",
    category: "Audio",
    price: 129,
    oldPrice: 169,
    rating: 4.8,
    reviews: 214,
    stock: 18,
    fast: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Active noise cancellation, 38-hour battery life and soft memory foam cushions for all-day listening."
  },
  {
    id: 2,
    name: "Luma Smart Desk Lamp",
    category: "Home",
    price: 74,
    oldPrice: 95,
    rating: 4.6,
    reviews: 98,
    stock: 31,
    fast: true,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description: "A dimmable lamp with warm, neutral and focus modes plus a wireless charging base."
  },
  {
    id: 3,
    name: "Transit Weekender Backpack",
    category: "Bags",
    price: 88,
    oldPrice: 0,
    rating: 4.7,
    reviews: 156,
    stock: 12,
    fast: false,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description: "Water-resistant shell, laptop sleeve and a clamshell opening made for short trips."
  },
  {
    id: 4,
    name: "Pulse Fitness Watch",
    category: "Wearables",
    price: 199,
    oldPrice: 249,
    rating: 4.9,
    reviews: 331,
    stock: 9,
    fast: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "Health tracking, GPS workouts, sleep insights and a bright always-on display."
  },
  {
    id: 5,
    name: "Stoneware Dining Set",
    category: "Kitchen",
    price: 116,
    oldPrice: 145,
    rating: 4.5,
    reviews: 77,
    stock: 0,
    fast: false,
    image: "https://images.unsplash.com/photo-1498579397066-22750a3cb424?auto=format&fit=crop&w=900&q=80",
    description: "A 16-piece matte stoneware set with dinner plates, side plates, bowls and mugs."
  },
  {
    id: 6,
    name: "Flow Mechanical Keyboard",
    category: "Workspace",
    price: 142,
    oldPrice: 179,
    rating: 4.8,
    reviews: 184,
    stock: 24,
    fast: true,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    description: "Low-profile switches, hot-swap keys and multi-device Bluetooth pairing."
  },
  {
    id: 7,
    name: "Terra Ceramic Planter Duo",
    category: "Home",
    price: 48,
    oldPrice: 0,
    rating: 4.4,
    reviews: 63,
    stock: 42,
    fast: false,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80",
    description: "Two glazed ceramic planters with drainage trays for desks, shelves and windowsills."
  },
  {
    id: 8,
    name: "Atlas Carry-On Spinner",
    category: "Travel",
    price: 238,
    oldPrice: 299,
    rating: 4.7,
    reviews: 119,
    stock: 7,
    fast: true,
    image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=80",
    description: "Lightweight hard-shell carry-on with smooth spinner wheels and a compression divider."
  }
];

const state = {
  cart: JSON.parse(localStorage.getItem("novaCart") || "[]"),
  wishlist: JSON.parse(localStorage.getItem("novaWishlist") || "[]"),
  promo: "",
  filters: {
    query: "",
    category: "All",
    sort: "featured",
    maxPrice: 500,
    stockOnly: false,
    fastOnly: false
  }
};

const $ = (selector) => document.querySelector(selector);
const money = (value) => `$${value.toFixed(2)}`;

const elements = {
  grid: $("#productGrid"),
  resultCount: $("#resultCount"),
  categorySelect: $("#categorySelect"),
  searchInput: $("#searchInput"),
  sortSelect: $("#sortSelect"),
  priceRange: $("#priceRange"),
  priceLabel: $("#priceLabel"),
  stockOnly: $("#stockOnly"),
  fastDeliveryOnly: $("#fastDeliveryOnly"),
  cartDrawer: $("#cartDrawer"),
  overlay: $("#overlay"),
  cartItems: $("#cartItems"),
  checkoutItems: $("#checkoutItems"),
  cartCount: $("#cartCount"),
  wishlistCount: $("#wishlistCount"),
  drawerTotal: $("#drawerTotal"),
  subtotalValue: $("#subtotalValue"),
  discountValue: $("#discountValue"),
  shippingValue: $("#shippingValue"),
  totalValue: $("#totalValue"),
  toast: $("#toast"),
  quickView: $("#quickView"),
  quickViewContent: $("#quickViewContent")
};

function saveState() {
  localStorage.setItem("novaCart", JSON.stringify(state.cart));
  localStorage.setItem("novaWishlist", JSON.stringify(state.wishlist));
}

function getCartLines() {
  return state.cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.id)
  })).filter((item) => item.product);
}

function getSubtotal() {
  return getCartLines().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function getShipping() {
  const checked = document.querySelector("input[name='shipping']:checked");
  return checked?.value === "express" && state.cart.length ? 12 : 0;
}

function getDiscount(subtotal) {
  return state.promo === "NOVA15" && subtotal >= 75 ? subtotal * 0.15 : 0;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

function setupCategories() {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  elements.categorySelect.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join("");
}

function filteredProducts() {
  const filtered = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(state.filters.query.toLowerCase()) || product.category.toLowerCase().includes(state.filters.query.toLowerCase());
    const matchesCategory = state.filters.category === "All" || product.category === state.filters.category;
    const matchesPrice = product.price <= state.filters.maxPrice;
    const matchesStock = !state.filters.stockOnly || product.stock > 0;
    const matchesFast = !state.filters.fastOnly || product.fast;
    return matchesQuery && matchesCategory && matchesPrice && matchesStock && matchesFast;
  });

  return filtered.sort((a, b) => {
    if (state.filters.sort === "priceLow") return a.price - b.price;
    if (state.filters.sort === "priceHigh") return b.price - a.price;
    if (state.filters.sort === "rating") return b.rating - a.rating;
    return b.reviews - a.reviews;
  });
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  elements.resultCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;
  elements.grid.innerHTML = visibleProducts.length ? visibleProducts.map(productCard).join("") : `<p class="empty-state">No products match those filters. Try clearing a filter.</p>`;
}

function productCard(product) {
  const inWishlist = state.wishlist.includes(product.id);
  const sale = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 640 480%22%3E%3Crect width=%22640%22 height=%22480%22 fill=%22%23e8edf1%22/%3E%3Cpath d=%22M120 335h400L395 165l-86 112-55-71z%22 fill=%22%2392a1ad%22/%3E%3Ccircle cx=%22458%22 cy=%22128%22 r=%2243%22 fill=%22%23c2ccd4%22/%3E%3C/svg%3E'">
        ${sale ? `<span class="sale-pill">${sale}% off</span>` : ""}
        <span class="stock-pill">${product.stock ? "In stock" : "Sold out"}</span>
      </div>
      <div class="product-body">
        <div class="product-meta"><span>${product.category}</span><span>${product.fast ? "Fast delivery" : "Standard"}</span></div>
        <h3>${product.name}</h3>
        <div class="rating-row"><span>${product.rating} stars (${product.reviews})</span><strong class="price">${money(product.price)}</strong></div>
        <div class="card-actions">
          <button class="primary-action" type="button" data-add="${product.id}" ${product.stock ? "" : "disabled"}>${product.stock ? "Add to cart" : "Sold out"}</button>
          <button class="icon-button wishlist-toggle ${inWishlist ? "active" : ""}" type="button" data-wishlist="${product.id}" aria-label="Toggle wishlist">♡</button>
          <button class="icon-button" type="button" data-view="${product.id}" aria-label="Quick view">⌕</button>
        </div>
      </div>
    </article>
  `;
}

function renderCart() {
  const lines = getCartLines();
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const discount = getDiscount(subtotal);
  const total = Math.max(subtotal - discount + shipping, 0);
  const itemCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

  elements.cartCount.textContent = itemCount;
  elements.wishlistCount.textContent = state.wishlist.length;
  elements.drawerTotal.textContent = money(total);
  elements.subtotalValue.textContent = money(subtotal);
  elements.discountValue.textContent = `-${money(discount)}`;
  elements.shippingValue.textContent = money(shipping);
  elements.totalValue.textContent = money(total);

  elements.cartItems.innerHTML = lines.length ? lines.map(cartLine).join("") : `<p class="empty-state">Your cart is empty. Add a product to see the full checkout flow.</p>`;
  elements.checkoutItems.innerHTML = lines.length ? lines.map(summaryLine).join("") : `<p class="empty-state">No items added yet.</p>`;
  saveState();
}

function cartLine(item) {
  return `
    <article class="cart-line">
      <img src="${item.product.image}" alt="${item.product.name}">
      <div>
        <h3>${item.product.name}</h3>
        <p>${money(item.product.price)} each</p>
        <div class="qty-control">
          <button type="button" data-dec="${item.id}" aria-label="Decrease quantity">−</button>
          <strong>${item.qty}</strong>
          <button type="button" data-inc="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-button" type="button" data-remove="${item.id}">Remove</button>
    </article>
  `;
}

function summaryLine(item) {
  return `
    <div class="summary-line">
      <span>${item.product.name} × ${item.qty}</span>
      <strong>${money(item.product.price * item.qty)}</strong>
    </div>
  `;
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product || product.stock < 1) return;
  const line = state.cart.find((item) => item.id === id);
  if (line) line.qty += 1;
  else state.cart.push({ id, qty: 1 });
  renderCart();
  openCart();
  showToast(`${product.name} added to cart`);
}

function changeQuantity(id, amount) {
  const line = state.cart.find((item) => item.id === id);
  if (!line) return;
  line.qty += amount;
  if (line.qty <= 0) state.cart = state.cart.filter((item) => item.id !== id);
  renderCart();
}

function toggleWishlist(id) {
  state.wishlist = state.wishlist.includes(id)
    ? state.wishlist.filter((item) => item !== id)
    : [...state.wishlist, id];
  renderProducts();
  renderCart();
}

function openCart() {
  elements.cartDrawer.classList.add("open");
  elements.cartDrawer.setAttribute("aria-hidden", "false");
  elements.overlay.classList.add("visible");
}

function closeCart() {
  elements.cartDrawer.classList.remove("open");
  elements.cartDrawer.setAttribute("aria-hidden", "true");
  elements.overlay.classList.remove("visible");
}

function openQuickView(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  elements.quickViewContent.innerHTML = `
    <div class="quick-view-grid">
      <img src="${product.image}" alt="${product.name}">
      <div class="quick-view-copy">
        <p class="eyebrow">${product.category}</p>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>${money(product.price)}</strong> · ${product.rating} stars · ${product.stock ? `${product.stock} available` : "Sold out"}</p>
        <button class="primary-action" type="button" data-add="${product.id}" ${product.stock ? "" : "disabled"}>${product.stock ? "Add to cart" : "Sold out"}</button>
      </div>
    </div>
  `;
  elements.quickView.showModal();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.dataset.add) addToCart(Number(target.dataset.add));
  if (target.dataset.wishlist) toggleWishlist(Number(target.dataset.wishlist));
  if (target.dataset.view) openQuickView(Number(target.dataset.view));
  if (target.dataset.inc) changeQuantity(Number(target.dataset.inc), 1);
  if (target.dataset.dec) changeQuantity(Number(target.dataset.dec), -1);
  if (target.dataset.remove) {
    state.cart = state.cart.filter((item) => item.id !== Number(target.dataset.remove));
    renderCart();
  }
});

$("#cartButton").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);
$("#checkoutLink").addEventListener("click", closeCart);
$("#closeQuickView").addEventListener("click", () => elements.quickView.close());

elements.searchInput.addEventListener("input", (event) => {
  state.filters.query = event.target.value;
  renderProducts();
});

elements.categorySelect.addEventListener("change", (event) => {
  state.filters.category = event.target.value;
  renderProducts();
});

elements.sortSelect.addEventListener("change", (event) => {
  state.filters.sort = event.target.value;
  renderProducts();
});

elements.priceRange.addEventListener("input", (event) => {
  state.filters.maxPrice = Number(event.target.value);
  elements.priceLabel.textContent = `$${state.filters.maxPrice}`;
  renderProducts();
});

elements.stockOnly.addEventListener("change", (event) => {
  state.filters.stockOnly = event.target.checked;
  renderProducts();
});

elements.fastDeliveryOnly.addEventListener("change", (event) => {
  state.filters.fastOnly = event.target.checked;
  renderProducts();
});

document.querySelectorAll("input[name='shipping']").forEach((input) => {
  input.addEventListener("change", renderCart);
});

$("#clearFilters").addEventListener("click", () => {
  state.filters = { query: "", category: "All", sort: "featured", maxPrice: 500, stockOnly: false, fastOnly: false };
  elements.searchInput.value = "";
  elements.categorySelect.value = "All";
  elements.sortSelect.value = "featured";
  elements.priceRange.value = 500;
  elements.priceLabel.textContent = "$500";
  elements.stockOnly.checked = false;
  elements.fastDeliveryOnly.checked = false;
  renderProducts();
});

$("#copyCodeButton").addEventListener("click", async () => {
  try {
    await navigator.clipboard?.writeText("NOVA15");
  } catch (error) {
    $("#promoInput").value = "NOVA15";
  }
  showToast("Promo code copied");
});

$("#applyPromo").addEventListener("click", () => {
  state.promo = $("#promoInput").value.trim().toUpperCase();
  renderCart();
  showToast(state.promo === "NOVA15" ? "Promo applied" : "Promo code not recognised");
});

$("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.cart.length) {
    showToast("Add at least one product before checkout");
    return;
  }
  const orderNumber = `NC-${Date.now().toString().slice(-6)}`;
  state.cart = [];
  state.promo = "";
  $("#promoInput").value = "";
  renderCart();
  showToast(`Order ${orderNumber} placed successfully`);
  event.target.reset();
});

setupCategories();
renderProducts();
renderCart();
