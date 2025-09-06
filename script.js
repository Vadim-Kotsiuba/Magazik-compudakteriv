// ===== Пошук =====
const searchInput = document.getElementById("searchInput");
const productContainer = document.getElementById("productContainer");
const products = [...productContainer.getElementsByClassName("product")];

searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  products.forEach(product => {
    const title = product.querySelector("h3").innerText.toLowerCase();
    product.classList.toggle("hidden", !title.includes(filter));
  });
});

// ===== Сортування =====
const sortSelect = document.getElementById("sortSelect");
sortSelect.addEventListener("change", () => {
  const sorted = [...products].sort((a, b) => {
    const priceA = +a.dataset.price;
    const priceB = +b.dataset.price;

    if (sortSelect.value === "asc") return priceA - priceB;
    if (sortSelect.value === "desc") return priceB - priceA;
    return 0;
  });

  sorted.forEach(p => productContainer.appendChild(p));
});

// ===== Фільтрація =====
const categoryCheckboxes = document.querySelectorAll(".category");
const brandCheckboxes = document.querySelectorAll(".brand");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const inStock = document.getElementById("inStock");

function filterProducts() {
  const selectedCategories = [...categoryCheckboxes].filter(c => c.checked).map(c => c.value);
  const selectedBrands = [...brandCheckboxes].filter(b => b.checked).map(b => b.value);
  const maxPrice = +priceRange.value;
  const stockOnly = inStock.checked;

  priceValue.textContent = maxPrice;

  products.forEach(product => {
    const { category, brand, price, stock } = product.dataset;
    const visible =
      (selectedCategories.length === 0 || selectedCategories.includes(category)) &&
      (selectedBrands.length === 0 || selectedBrands.includes(brand)) &&
      (+price <= maxPrice) &&
      (!stockOnly || stock === "true");

    product.classList.toggle("hidden", !visible);
  });
}

[...categoryCheckboxes, ...brandCheckboxes].forEach(el => el.addEventListener("change", filterProducts));
priceRange.addEventListener("input", filterProducts);
inStock.addEventListener("change", filterProducts);

// ===== Універсальна функція для модалок =====
function setupModal(openBtnId, modalId, closeSelector) {
  const openBtn = document.getElementById(openBtnId);
  const modal = document.getElementById(modalId);
  const closeBtn = modal.querySelector(closeSelector);

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// FAQ modal
setupModal("faqBtn", "faqModal", ".close");

// Contacts modal
setupModal("contactBtn", "contactModal", "#closeContact");

// ===== FAQ аккордеон =====
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    item.classList.toggle("active");
    document.querySelectorAll(".faq-item").forEach(i => {
      if (i !== item) i.classList.remove("active");
    });
  });
});

// ===== Каталог: фільтрація =====
document.querySelectorAll(".dropdown-content a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const category = link.dataset.category;

    products.forEach(product => {
      product.classList.toggle("hidden", category !== "all" && product.dataset.category !== category);
    });
  });
});
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

// Відкрити/закрити корзину
cartBtn.addEventListener("click", () => {
  cartModal.classList.toggle("active");
});

closeCart.addEventListener("click", () => {
  cartModal.classList.remove("active");
});

// Додавання товару
document.querySelectorAll(".product .btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.closest(".product");
    const title = product.querySelector("h3").innerText;
    const price = parseInt(product.dataset.price);

    cart.push({ title, price });
    updateCart();
  });
});

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `${item.title} - ${item.price} грн 
      <button onclick="removeFromCart(${index})">x</button>`;
    cartItems.appendChild(li);
  });

  cartCount.innerText = cart.length;
  cartTotal.innerText = `Сума: ${total} грн`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}
