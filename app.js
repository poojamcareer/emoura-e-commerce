const PRODUCTS = [
  {
    id: "w-aurora-gown",
    name: "Aurora Silk Gown",
    brand: "Aurelia Atelier",
    category: "women",
    price: "$420",
    tag: "New",
    tone: "rgba(201, 75, 122, 0.35)",
  },
  {
    id: "w-velvet-wrap",
    name: "Velvet Wrap Dress",
    brand: "Maison Lune",
    category: "women",
    price: "$310",
    tag: "Bestseller",
    tone: "rgba(159, 51, 92, 0.35)",
  },
  {
    id: "w-garden-sari",
    name: "Garden Muse Sari",
    brand: "Savana Loom",
    category: "women",
    price: "$520",
    tag: "Limited",
    tone: "rgba(197, 161, 74, 0.35)",
  },
  {
    id: "g-rose-tulle",
    name: "Rose Tulle Dress",
    brand: "Petite Palais",
    category: "girls",
    price: "$140",
    tag: "New",
    tone: "rgba(201, 75, 122, 0.3)",
  },
  {
    id: "g-pastel-jumpsuit",
    name: "Pastel Jumpsuit",
    brand: "Cloudberry",
    category: "girls",
    price: "$98",
    tag: "Bestseller",
    tone: "rgba(148, 180, 196, 0.35)",
  },
  {
    id: "g-sunlit-linen",
    name: "Sunlit Linen Set",
    brand: "Little Mirra",
    category: "girls",
    price: "$110",
    tag: "Sustainable",
    tone: "rgba(217, 201, 165, 0.45)",
  },
  {
    id: "b-rose-serum",
    name: "Rose Quartz Serum",
    brand: "Opaline Labs",
    category: "beauty",
    price: "$86",
    tag: "Bestseller",
    tone: "rgba(222, 158, 176, 0.4)",
  },
  {
    id: "b-velour-lip",
    name: "Velour Lip Veil",
    brand: "Maison Lune",
    category: "beauty",
    price: "$58",
    tag: "New",
    tone: "rgba(153, 75, 102, 0.35)",
  },
  {
    id: "b-moonlit-palette",
    name: "Moonlit Eyes Palette",
    brand: "Noir Botanica",
    category: "beauty",
    price: "$72",
    tag: "Limited",
    tone: "rgba(120, 122, 161, 0.35)",
  },
  {
    id: "f-ivory-heel",
    name: "Ivory Sculpted Heel",
    brand: "Valore",
    category: "footwear",
    price: "$240",
    tag: "Bestseller",
    tone: "rgba(213, 196, 170, 0.45)",
  },
  {
    id: "f-gilded-sandal",
    name: "Gilded Strap Sandal",
    brand: "Aurelia Atelier",
    category: "footwear",
    price: "$210",
    tag: "New",
    tone: "rgba(197, 161, 74, 0.4)",
  },
  {
    id: "f-noir-boot",
    name: "Noir City Boot",
    brand: "Elyssé",
    category: "footwear",
    price: "$320",
    tag: "Limited",
    tone: "rgba(60, 60, 70, 0.3)",
  },
];

const BRANDS = [
  { name: "Aurelia Atelier", focus: "Silk & couture" },
  { name: "Maison Lune", focus: "Evening romance" },
  { name: "Savana Loom", focus: "Heritage weaves" },
  { name: "Opaline Labs", focus: "Glow rituals" },
  { name: "Noir Botanica", focus: "Modern glam" },
  { name: "Valore", focus: "Architect heels" },
  { name: "Petite Palais", focus: "Girls couture" },
  { name: "Elyssé", focus: "Statement boots" },
];

const INSIGHTS = [
  { title: "Your Most Loved", text: "Soft silhouettes and rose-gold finishes are trending in your views." },
  { title: "Luxury Drops", text: "Two new designer capsules arrive this week. Reserve early." },
  { title: "Stylist Picks", text: "Pair silk gowns with sculpted heels for a full Emoura look." },
];

const VIEW_KEY = "emoura_views";
const BAG_KEY = "emoura_bag";

const formatCount = (count) => (count > 9 ? "9+" : `${count}`);

const readStore = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (err) {
    return fallback;
  }
};

const writeStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const addView = (id) => {
  const views = readStore(VIEW_KEY, {});
  views[id] = (views[id] || 0) + 1;
  writeStore(VIEW_KEY, views);
};

const addToBag = (id) => {
  const bag = readStore(BAG_KEY, {});
  bag[id] = (bag[id] || 0) + 1;
  writeStore(BAG_KEY, bag);
  updateBagCount();
  showToast("Added to Bag");
};

const updateBagCount = () => {
  const bag = readStore(BAG_KEY, {});
  const count = Object.values(bag).reduce((sum, val) => sum + val, 0);
  const badge = document.querySelector("#bagCount");
  if (badge) {
    badge.textContent = formatCount(count);
  }
};

const showToast = (message) => {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  const msg = toast.querySelector(".toast-msg");
  msg.textContent = message;
  toast.classList.add("active");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("active"), 1600);
};

const openModal = (product) => {
  const modal = document.querySelector(".modal");
  if (!modal) return;
  modal.querySelector("h3").textContent = product.name;
  modal.querySelector(".modal-brand").textContent = product.brand;
  modal.querySelector(".modal-price").textContent = product.price;
  modal.querySelector(".modal-tag").textContent = product.tag;
  modal.querySelector(".modal-desc").textContent =
    "Exclusive Emoura styling, crafted for luminous elegance and confident silhouettes.";
  modal.classList.add("active");
};

const closeModal = () => {
  const modal = document.querySelector(".modal");
  if (modal) modal.classList.remove("active");
};

const renderProducts = (category, filter = "All") => {
  const grid = document.querySelector("#productGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const list = PRODUCTS.filter((item) => item.category === category);
  const filtered =
    filter === "All" ? list : list.filter((item) => item.tag.toLowerCase() === filter.toLowerCase());

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media" style="--tone: ${product.tone}">
        ${product.brand}
      </div>
      <div>
        <p class="product-title">${product.name}</p>
        <div class="product-meta">
          <span>${product.tag}</span>
          <span class="price">${product.price}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-outline" data-action="view">View</button>
        <button class="btn btn-primary" data-action="bag">Add</button>
      </div>
    `;
    card.addEventListener("click", (event) => {
      const action = event.target.getAttribute("data-action");
      if (action === "view") {
        addView(product.id);
        openModal(product);
      }
      if (action === "bag") {
        addToBag(product.id);
      }
    });
    grid.appendChild(card);
  });
};

const renderBrands = () => {
  const grid = document.querySelector("#brandGrid");
  if (!grid) return;
  grid.innerHTML = "";
  BRANDS.forEach((brand) => {
    const card = document.createElement("div");
    card.className = "brand-card";
    card.innerHTML = `<span>${brand.name}</span>${brand.focus}`;
    grid.appendChild(card);
  });
};

const renderInsights = () => {
  const row = document.querySelector("#insightRow");
  if (!row) return;
  row.innerHTML = "";
  INSIGHTS.forEach((insight) => {
    const card = document.createElement("div");
    card.className = "insight";
    card.innerHTML = `<h3>${insight.title}</h3><p>${insight.text}</p>`;
    row.appendChild(card);
  });
};

const renderRecommendations = () => {
  const grid = document.querySelector("#recommendGrid");
  if (!grid) return;
  const views = readStore(VIEW_KEY, {});
  const ranked = [...PRODUCTS].sort((a, b) => (views[b.id] || 0) - (views[a.id] || 0));
  const picks = ranked.slice(0, 6);
  grid.innerHTML = "";
  picks.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media" style="--tone: ${product.tone}">
        ${product.brand}
      </div>
      <div>
        <p class="product-title">${product.name}</p>
        <div class="product-meta">
          <span>Recommended</span>
          <span class="price">${product.price}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn btn-outline" data-action="view">View</button>
        <button class="btn btn-primary" data-action="bag">Add</button>
      </div>
    `;
    card.addEventListener("click", (event) => {
      const action = event.target.getAttribute("data-action");
      if (action === "view") {
        addView(product.id);
        openModal(product);
      }
      if (action === "bag") {
        addToBag(product.id);
      }
    });
    grid.appendChild(card);
  });
};

const setupFilters = (category) => {
  const chips = document.querySelectorAll(".chip");
  if (!chips.length) return;
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderProducts(category, chip.dataset.filter);
    });
  });
};

const bindModal = () => {
  const modal = document.querySelector(".modal");
  if (!modal) return;
  modal.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal-overlay") || event.target.dataset.close === "true") {
      closeModal();
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  updateBagCount();
  bindModal();
  if (page === "women" || page === "girls" || page === "beauty" || page === "footwear") {
    renderProducts(page);
    setupFilters(page);
  }
  if (page === "explore") {
    renderBrands();
  }
  if (page === "dashboard") {
    renderRecommendations();
    renderInsights();
  }
});
