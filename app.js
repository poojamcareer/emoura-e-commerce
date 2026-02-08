const API_BASE = "http://localhost:8080";

const USER_KEY = "emoura_user";
const SESSION_KEY = "emoura_session";
const VIEW_KEY = "emoura_views";
const BAG_KEY = "emoura_bag";
const WISHLIST_KEY = "emoura_wishlist";

const BRANDS = [
  { name: "Versace", focus: "Regal Sensuality" },
  { name: "Valentino", focus: "Romantic Couture" },
  { name: "Gucci", focus: "Opulent Femme" },
  { name: "Louis Vuitton", focus: "Eternal Luxury" },
  { name: "Chanel", focus: "Parisian Poise" },
  { name: "Burberry", focus: "Noble Grace" },
  { name: "Dior", focus: "Divine Femininity" },
  { name: "Hermes", focus: "Silent Opulence" },
  { name: "YSL", focus: "Sensual Power" },
  { name: "Christian Louboutin", focus: "Scarlet Desire" },
  { name: "Dolce & Gabbana", focus: "Italian Romance" },
  { name: "Jimmy Choo", focus: "Glamour Heels" },
  { name: "Balmain", focus: "Structured Power" },
  { name: "Givenchy Kids", focus: "Modern Mini" },
  { name: "Tom Ford Beauty", focus: "Bold Sensuality" },
  { name: "Valmont", focus: "Swiss Regeneration" },
  { name: "Raw Mango", focus: "Textile Poetry" },
  { name: "Ekaya", focus: "Banarasi Luxury" },
  { name: "Sabyasachi", focus: "Heritage Opulence" },
  { name: "JJ Valaya", focus: "Royal Heritage" },
  { name: "Masaba", focus: "Bold Heritage" },
  { name: "Manish Malhotra", focus: "Cinematic Glamour" },
  { name: "House of Pataudi", focus: "Timeless Soles" },
  { name: "Mahima Mahajan Shoes", focus: "Elegant Craft" },
  { name: "Kama Ayurveda", focus: "Natural Radiance" }
];

const FALLBACK_PRODUCTS = [
  {
    id: "w-aurora-gown",
    name: "Aurora Silk Gown",
    brand: "Aurelia Atelier",
    category: "women",
    price: 38075,
    rating: 4.6,
    image: "assets/products/aurora-gown.jpg",
    description: "",
  },
  {
    id: "w-velvet-wrap",
    name: "Velvet Wrap Dress",
    brand: "Maison Lune",
    category: "women",
    price: 28103,
    rating: 4.3,
    image: "assets/products/velvet-wrap.jpg",
    description: "",
  },
  {
    id: "g-lavan-lace",
    name: "Lavan Lace Ball Gown",
    brand: "Petite Palais",
    category: "girls",
    price: 18900,
    rating: 4.2,
    image: "assets/products/lavan lace ball gown for little princess.jpg",
    description: "",
  },
  {
    id: "b-rose-serum",
    name: "Rose Quartz Serum",
    brand: "Opaline Labs",
    category: "beauty",
    price: 7963,
    rating: 4.7,
    image: "assets/products/rose-serum.jpg",
    description: "",
  },
  {
    id: "f-classic-sneaker",
    name: "Classic Sneaker",
    brand: "Gucci",
    category: "footwear",
    price: 38000,
    rating: 5,
    image: "assets/products/classic sneaker.jpg",
    description: "",
  },
  {
    id: "b-moonlit-palette",
    name: "Moonlit Eyes Palette",
    brand: "Maison Lune",
    category: "beauty",
    price: 6660,
    rating: 4.1,
    image: "assets/products/moonlit-palette.jpg",
    description: "",
  },
];

let PRODUCTS = [];

const readStore = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
};

const writeStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getSessionId = () => {
  let session = readStore(SESSION_KEY, null);
  if (!session) {
    session = `sess_${Math.random().toString(36).slice(2, 10)}`;
    writeStore(SESSION_KEY, session);
  }
  return session;
};

const getUserId = () => {
  const user = readStore(USER_KEY, null);
  return user?.id || user?.mobile || "guest";
};

const formatPrice = (value) => {
  const num = Number(value || 0);
  return `RS ${num.toLocaleString("en-IN")}`;
};

const normalizeImage = (url) => {
  if (!url) return "assets/products/placeholder.jpg";
  if (url.startsWith("/")) return url.slice(1);
  return url;
};

const apiFetch = async (path, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (err) {
    return null;
  }
};

const mapApiProduct = (product, index = 0) => {
  return {
    id: product.id ?? product.productId ?? `${product.name || "item"}-${index}`,
    name: product.name || "Product",
    brand: product.brand || "Emoura",
    category: product.category || "women",
    price: formatPrice(product.price),
    rating: product.rating ?? 0,
    image: normalizeImage(product.imageUrl || product.image || product.imageURL || ""),
    description: product.description || "",
    tag: product.tag || (product.rating >= 4.5 ? "Bestseller" : "New"),
    tone: "rgba(201, 75, 122, 0.35)",
  };
};

const loadProducts = async () => {
  const data = await apiFetch("/api/products");
  if (Array.isArray(data) && data.length) {
    PRODUCTS = data.map(mapApiProduct);
    return;
  }
  PRODUCTS = FALLBACK_PRODUCTS.map((item) => ({
    ...item,
    price: formatPrice(item.price),
    tag: item.rating >= 4.5 ? "Bestseller" : "New",
    tone: "rgba(201, 75, 122, 0.35)",
  }));
};

const addView = async (product) => {
  const views = readStore(VIEW_KEY, {});
  views[product.id] = (views[product.id] || 0) + 1;
  writeStore(VIEW_KEY, views);
  if (typeof product.id === "number") {
    await apiFetch(
      `/api/views?sessionId=${encodeURIComponent(getSessionId())}&productId=${product.id}`,
      { method: "POST" }
    );
  }
};

const addToBag = async (product) => {
  const bag = readStore(BAG_KEY, {});
  bag[product.id] = (bag[product.id] || 0) + 1;
  writeStore(BAG_KEY, bag);
  if (typeof product.id === "number") {
    await apiFetch(
      `/api/cart?userId=${encodeURIComponent(getUserId())}&productId=${product.id}&qty=${bag[product.id]}`,
      { method: "POST" }
    );
  }
  updateBagBadge();
};

const removeFromBag = async (product) => {
  const bag = readStore(BAG_KEY, {});
  if (!bag[product.id]) return;
  bag[product.id] -= 1;
  if (bag[product.id] <= 0) delete bag[product.id];
  writeStore(BAG_KEY, bag);
  if (typeof product.id === "number") {
    await apiFetch(
      `/api/cart?userId=${encodeURIComponent(getUserId())}&productId=${product.id}`,
      { method: "DELETE" }
    );
  }
  updateBagBadge();
};

const toggleWishlist = async (product) => {
  const list = readStore(WISHLIST_KEY, {});
  if (list[product.id]) {
    delete list[product.id];
    if (typeof product.id === "number") {
      await apiFetch(
        `/api/wishlist?userId=${encodeURIComponent(getUserId())}&productId=${product.id}`,
        { method: "DELETE" }
      );
    }
  } else {
    list[product.id] = true;
    if (typeof product.id === "number") {
      await apiFetch(
        `/api/wishlist?userId=${encodeURIComponent(getUserId())}&productId=${product.id}`,
        { method: "POST" }
      );
    }
  }
  writeStore(WISHLIST_KEY, list);
  updateWishlistBadge();
  return !!list[product.id];
};

const updateBagBadge = async () => {
  const badge = document.querySelector("#bagCount");
  if (!badge) return;
  const apiItems = await apiFetch(`/api/cart?userId=${encodeURIComponent(getUserId())}`);
  if (Array.isArray(apiItems)) {
    const count = apiItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    badge.textContent = count;
    return;
  }
  const bag = readStore(BAG_KEY, {});
  const count = Object.values(bag).reduce((sum, val) => sum + val, 0);
  badge.textContent = count;
};

const updateWishlistBadge = () => {
  const badge = document.querySelector("#wishlistCount");
  if (!badge) return;
  const list = readStore(WISHLIST_KEY, {});
  badge.textContent = Object.keys(list).length;
};

const buildCard = (product) => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <div class="product-media" style="--tone: ${product.tone}">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div>
      <p class="product-title">${product.name}</p>
      <div class="product-meta">
        <span>${product.tag}</span>
        <span class="price">${product.price}</span>
      </div>
    </div>
    <div class="card-actions">
      <button class="btn btn-outline like-btn ${readStore(WISHLIST_KEY, {})[product.id] ? "liked" : ""}" data-action="like" aria-label="Like">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.8 8.6c0 5-8.8 11-8.8 11s-8.8-6-8.8-11a4.8 4.8 0 0 1 8.8-2.7 4.8 4.8 0 0 1 8.8 2.7z"></path>
        </svg>
      </button>
      <button class="btn btn-outline" data-action="view">View</button>
      <button class="btn btn-primary" data-action="bag">Add</button>
    </div>
  `;
  card.addEventListener("click", async (event) => {
    const actionBtn = event.target.closest("[data-action]");
    if (!actionBtn) return;
    const action = actionBtn.getAttribute("data-action");
    if (action === "like") {
      const liked = await toggleWishlist(product);
      actionBtn.classList.toggle("liked", liked);
    }
    if (action === "view") {
      await addView(product);
    }
    if (action === "bag") {
      await addToBag(product);
    }
  });
  return card;
};

const renderProducts = (category, filter = "all") => {
  const grid = document.querySelector("#productGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const items = PRODUCTS.filter((product) => {
    if (category && product.category !== category) return false;
    if (filter === "all") return true;
    if (filter === "new") return product.tag === "New";
    if (filter === "bestsellers") return product.tag === "Bestseller";
    if (filter === "limited") return product.tag === "Limited";
    return true;
  });
  items.forEach((product) => grid.appendChild(buildCard(product)));
};

const renderRecommendations = async () => {
  const grid = document.querySelector("#recommendGrid");
  if (!grid) return;
  const apiRecs = await apiFetch(`/api/recommendations?sessionId=${encodeURIComponent(getSessionId())}`);
  const list = Array.isArray(apiRecs) && apiRecs.length ? apiRecs.map(mapApiProduct) : PRODUCTS.slice(0, 4);
  grid.innerHTML = "";
  list.slice(0, 4).forEach((product) => grid.appendChild(buildCard(product)));
};

const renderBrandGrid = () => {
  const grid = document.querySelector("#brandGrid");
  if (!grid) return;
  grid.innerHTML = "";
  BRANDS.forEach((brand) => {
    const card = document.createElement("div");
    card.className = "brand-card";
    card.innerHTML = `
      <h3>${brand.name}</h3>
      <p>${brand.focus}</p>
    `;
    grid.appendChild(card);
  });
};

const renderBag = async () => {
  const bagList = document.querySelector("#bagList");
  if (!bagList) return;
  const items = await apiFetch(`/api/cart?userId=${encodeURIComponent(getUserId())}`);
  const productMap = new Map(PRODUCTS.map((product) => [String(product.id), product]));
  const bagItems = Array.isArray(items) ? items : [];
  if (bagItems.length) {
    bagList.innerHTML = "";
    bagItems.forEach((item) => {
      const product = productMap.get(String(item.productId));
      if (!product) return;
      const row = document.createElement("div");
      row.className = "product-card";
      row.innerHTML = `
        <div class="product-media" style="--tone: ${product.tone}">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div>
          <p class="product-title">${product.name}</p>
          <div class="product-meta">
            <span>Qty: ${item.quantity}</span>
            <span class="price">${product.price}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-outline" data-action="minus">-</button>
          <button class="btn btn-primary" data-action="plus">+</button>
        </div>
      `;
      row.addEventListener("click", async (event) => {
        const actionBtn = event.target.closest("[data-action]");
        if (!actionBtn) return;
        const action = actionBtn.getAttribute("data-action");
        if (action === "minus") {
          await removeFromBag(product);
          renderBag();
        }
        if (action === "plus") {
          await addToBag(product);
          renderBag();
        }
      });
      bagList.appendChild(row);
    });
    return;
  }
  bagList.innerHTML = "<p>Your bag is empty. Start exploring Emoura.</p>";
};

const renderWishlist = async () => {
  const grid = document.querySelector("#wishlistGrid");
  if (!grid) return;
  const apiList = await apiFetch(`/api/wishlist?userId=${encodeURIComponent(getUserId())}`);
  const list = Array.isArray(apiList) && apiList.length ? apiList.map(mapApiProduct) : PRODUCTS.filter((product) => readStore(WISHLIST_KEY, {})[product.id]);
  if (!list.length) {
    grid.innerHTML = "<p>No liked products yet. Tap a heart to save your favorites.</p>";
    return;
  }
  grid.innerHTML = "";
  list.forEach((product) => grid.appendChild(buildCard(product)));
};

const renderProfile = async () => {
  const nameEl = document.querySelector("#profileName");
  const mobileEl = document.querySelector("#profileMobile");
  const wishlistEl = document.querySelector("#profileWishlist");
  const bagEl = document.querySelector("#profileBag");
  const statusEl = document.querySelector("#profileStatus");
  if (!nameEl || !mobileEl || !wishlistEl || !bagEl || !statusEl) return;

  const user = readStore(USER_KEY, null);
  nameEl.textContent = user?.name || "Guest";
  mobileEl.textContent = `Mobile: ${user?.mobile || "-"}`;

  const wishlist = readStore(WISHLIST_KEY, {});
  wishlistEl.textContent = Object.keys(wishlist).length;

  const apiItems = await apiFetch(`/api/cart?userId=${encodeURIComponent(getUserId())}`);
  const bagCount = Array.isArray(apiItems)
    ? apiItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : Object.values(readStore(BAG_KEY, {})).reduce((sum, val) => sum + val, 0);
  bagEl.textContent = bagCount;

  statusEl.textContent = user ? "Signed in" : "Guest mode";
};

const showToast = (msg) => {
  const toast = document.querySelector(".toast");
  const toastMsg = toast?.querySelector(".toast-msg");
  if (!toast) return;
  if (toastMsg && msg) toastMsg.textContent = msg;
  toast.classList.add("active");
  setTimeout(() => toast.classList.remove("active"), 2000);
};

const setProfileEditable = (editable) => {
  const email = document.querySelector("#profileEmail");
  const address = document.querySelector("#profileAddress");
  const pincode = document.querySelector("#profilePincode");
  const saveBtn = document.querySelector("#profileSaveBtn");
  const editBtn = document.querySelector("#profileEditBtn");

  [email, address, pincode].forEach((input) => {
    if (!input) return;
    input.disabled = !editable;
  });
  if (saveBtn) saveBtn.style.display = editable ? "inline-flex" : "none";
  if (editBtn) editBtn.style.display = editable ? "none" : "inline-flex";
};

const loadProfileDetails = async () => {
  const user = readStore(USER_KEY, null);
  if (!user?.mobile) return;
  const data = await apiFetch(`/api/users/by-mobile?mobile=${encodeURIComponent(user.mobile)}`);
  if (!data) return;
  const email = document.querySelector("#profileEmail");
  const address = document.querySelector("#profileAddress");
  const pincode = document.querySelector("#profilePincode");
  if (email) email.value = data.email || "";
  if (address) address.value = data.address || "";
  if (pincode) pincode.value = data.pincode || "";
  if (data.email || data.address || data.pincode) {
    setProfileEditable(false);
  }
};

const bindProfileForm = () => {
  const form = document.querySelector("#profileForm");
  if (!form) return;
  const saveMsg = document.querySelector("#profileSaveMsg");
  const editBtn = document.querySelector("#profileEditBtn");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = readStore(USER_KEY, null);
    if (!user?.mobile) {
      if (saveMsg) saveMsg.textContent = "Please login first.";
      return;
    }
    const payload = {
      email: document.querySelector("#profileEmail")?.value || "",
      address: document.querySelector("#profileAddress")?.value || "",
      pincode: document.querySelector("#profilePincode")?.value || "",
    };
    const res = await apiFetch(
      `/api/users/profile?mobile=${encodeURIComponent(user.mobile)}`,
      { method: "POST", body: JSON.stringify(payload) }
    );
    if (res?.error) {
      if (saveMsg) saveMsg.textContent = res.error;
      return;
    }
    if (saveMsg) saveMsg.textContent = "";
    setProfileEditable(false);
    showToast("Profile saved");
  });

  editBtn?.addEventListener("click", () => {
    setProfileEditable(true);
  });
};

const setupFilters = (category) => {
  const chips = document.querySelectorAll(".chip");
  if (!chips.length) return;
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderProducts(category, chip.dataset.filter || "all");
    });
  });
};

const setupLogin = () => {
  const form = document.querySelector("#loginForm");
  if (!form) return;

  const nameInput = document.querySelector("#nameInput");
  const mobileInput = document.querySelector("#mobileInput");
  const sendOtpBtn = document.querySelector("#sendOtp");
  const otpArea = document.querySelector("#otpArea");
  const otpInput = document.querySelector("#otpInput");
  const verifyOtpBtn = document.querySelector("#verifyOtp");
  const resendOtpBtn = document.querySelector("#resendOtp");
  const message = document.querySelector("#loginMessage");

  const showMsg = (text) => {
    if (message) message.textContent = text || "";
  };

  const requestOtp = async () => {
    const name = (nameInput?.value || "").trim();
    const mobile = (mobileInput?.value || "").trim();
    if (!mobile) {
      showMsg("Enter your mobile number.");
      return;
    }
    showMsg("Sending OTP...");
    const res = await apiFetch(
      `/api/auth/request-otp?mobile=${encodeURIComponent(mobile)}&name=${encodeURIComponent(name)}`,
      { method: "POST" }
    );
    if (res?.error) {
      showMsg(res.error);
      return;
    }
    if (otpArea) otpArea.style.display = "grid";
    showMsg("OTP sent. Please verify.");
  };

  const verifyOtp = async () => {
    const name = (nameInput?.value || "").trim();
    const mobile = (mobileInput?.value || "").trim();
    const otp = (otpInput?.value || "").trim();
    if (!mobile || !otp) {
      showMsg("Enter mobile and OTP.");
      return;
    }
    showMsg("Verifying...");
    const res = await apiFetch(
      `/api/auth/verify-otp?mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otp)}&name=${encodeURIComponent(name)}`,
      { method: "POST" }
    );
    if (res?.error) {
      showMsg(res.error);
      return;
    }
    writeStore(USER_KEY, {
      id: res?.id || res?.userId || mobile,
      name: res?.name || name || "Guest",
      mobile,
    });
    showMsg("Logged in.");
    window.location.href = "dashboard.htm";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    requestOtp();
  });

  sendOtpBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    requestOtp();
  });

  verifyOtpBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    verifyOtp();
  });

  resendOtpBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    requestOtp();
  });

  const skipBtn = document.querySelector("#skipLogin");
  skipBtn?.addEventListener("click", () => {
    window.location.href = "dashboard.htm";
  });
};

const initPage = async () => {
  await loadProducts();
  updateBagBadge();
  updateWishlistBadge();

  const page = document.body?.dataset?.page;
  if (page === "dashboard") {
    renderRecommendations();
  }
  if (page === "explore") {
    renderBrandGrid();
  }
  if (page === "women") {
    renderProducts("women");
    setupFilters("women");
  }
  if (page === "girls") {
    renderProducts("girls");
    setupFilters("girls");
  }
  if (page === "beauty") {
    renderProducts("beauty");
    setupFilters("beauty");
  }
  if (page === "footwear") {
    renderProducts("footwear");
    setupFilters("footwear");
  }
  if (page === "bag") {
    renderBag();
  }
  if (page === "wishlist") {
    renderWishlist();
  }
  if (page === "profile") {
    renderProfile();
    loadProfileDetails();
    bindProfileForm();
  }
  if (page === "login") {
    setupLogin();
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initPage();
});
