import {
  pulledPorkBurgers,
  smashBurgers,
  zapiekanki,
  dodatki,
  napoje,
} from "./menu.js";

// Funkcja generująca HTML dla przekazanej tablicy dań
function getMenuHtml(menuArr) {
  return menuArr
    .map(
      ({ name, price, ingredients, image }) => `
      <div class="card">
        <img src="./img/${image}" alt="${name}">
        <div class="card-content">
          <h2>${name}</h2>
          <p>${ingredients ? ingredients.join(", ") : ""}</p>
          <h3>${price}zł</h3>
          <button class="btn">Zamów</button>
        </div>
      </div>
    `
    )
    .join("");
}

// Renderowanie wybranej kategorii
function renderCategory(category) {
  let menuData;
  switch (category) {
    case "pulledPorkBurgers":
      menuData = pulledPorkBurgers;
      break;
    case "smashBurgers":
      menuData = smashBurgers;
      break;
    case "zapiekanki":
      menuData = zapiekanki;
      break;
    case "dodatki":
      menuData = dodatki;
      break;
    case "napoje":
      menuData = napoje;
      break;
    default:
      menuData = smashBurgers;
  }
  document.getElementById("container").innerHTML = getMenuHtml(menuData);
}

// Obsługa kliknięcia w kategorię
document.querySelectorAll(".category").forEach((category) => {
  category.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedCategory = category.getAttribute("data-category");
    renderCategory(selectedCategory);
  });
});

// Domyślnie renderuj smashBurgers
renderCategory("smashBurgers");

// --- KOSZYK ---

// Dodawanie produktu do koszyka
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (cart[product.name]) {
    cart[product.name].quantity += 1;
  } else {
    cart[product.name] = { ...product, quantity: 1 };
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Aktualizacja licznika koszyka
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const totalItems = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const badge = document.querySelector("#cart-icon small");
  if (badge) badge.textContent = `Koszyk (${totalItems})`;
}

// Renderowanie zawartości koszyka
function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  cartContainer.innerHTML = "";

  if (Object.keys(cart).length === 0) {
    cartContainer.innerHTML = "<p>Koszyk jest pusty</p>";
    if (totalDisplay) totalDisplay.textContent = "Razem: 0.00 zł";
    return;
  }

  let total = 0;
  Object.values(cart).forEach((item) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.setAttribute("data-name", item.name);
    div.innerHTML = `
      <span>${item.name} (${item.price} zł) × ${item.quantity}</span>
      <button class="remove-btn" style="background: none; border: none; cursor: pointer;">
        <i class="fa-solid fa-xmark" style="color: red;"></i>
      </button>
    `;
    cartContainer.appendChild(div);
  });

  if (totalDisplay) {
    totalDisplay.textContent = `Razem: ${total.toFixed(2)} zł`;
  }
}

// Usuwanie produktu z koszyka
function removeFromCart(name) {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  delete cart[name];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Przełączanie widoczności panelu koszyka
function toggleCartPanel() {
  document.getElementById("cart-panel").classList.toggle("open");
}

// Inicjalizacja zdarzeń
document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", toggleCartPanel);
  }

  updateCartCount();
  renderCartItems();
});

// Obsługa kliknięć (dodanie do koszyka i usuwanie z koszyka)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn")) {
    const card = e.target.closest(".card");
    const name = card.querySelector("h2").textContent;
    const priceText = card.querySelector("h3").textContent;
    const price = parseFloat(priceText.replace("zł", "").trim());
    addToCart({ name, price });
  }

  // Usuwanie z koszyka po kliknięciu ikonki X
  if (
    e.target.classList.contains("remove-btn") ||
    e.target.closest(".remove-btn")
  ) {
    e.stopPropagation();
    const button = e.target.closest(".remove-btn");
    const item = button.closest(".cart-item");
    const name = item.getAttribute("data-name");
    removeFromCart(name);
  }
});

// Toggle menu hamburger
const menuToggle = document.getElementById("menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const menu = document.getElementById("menu-list");
    if (menu) menu.classList.toggle("active");
  });
}

// Zamknij koszyk po kliknięciu poza nim
document.addEventListener("click", (e) => {
  const cartPanel = document.getElementById("cart-panel");
  const cartIcon = document.getElementById("cart-icon");

  if (cartPanel && cartIcon && cartPanel.classList.contains("open")) {
    if (
      !cartPanel.contains(e.target) &&
      !cartIcon.contains(e.target) &&
      !e.target.closest(".remove-btn")
    ) {
      cartPanel.classList.remove("open");
    }
  }
});

// Otwórz modal po kliknięciu Zamów
const checkoutBtn = document.getElementById("checkout-btn");
const orderModal = document.getElementById("order-modal");
if (checkoutBtn && orderModal) {
  checkoutBtn.addEventListener("click", () => {
    orderModal.style.display = "flex";

    const cartPanel = document.getElementById("cart-panel");
    if (cartPanel) cartPanel.classList.remove("open");
  });
}

// Zamknij modal po kliknięciu na X
const closeModalBtn = document.getElementById("close-modal");
if (closeModalBtn && orderModal) {
  closeModalBtn.addEventListener("click", () => {
    orderModal.style.display = "none";
  });
}

// Zamknij modal po kliknięciu poza modal-content
if (orderModal) {
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) {
      orderModal.style.display = "none";
    }
  });
}

// Obsługa wysłania formularza zamówienia
const orderForm = document.getElementById("order-form");
if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Zamówienie zostało wysłane!");
    if (orderModal) orderModal.style.display = "none";
  });
}
