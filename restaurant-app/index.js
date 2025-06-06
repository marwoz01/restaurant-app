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
    .map((menu) => {
      const { name, price, ingredients, image } = menu;
      return `
        <div class="card">
          <img src="./img/${image}" alt="${name}">
          <div class="card-content">
            <h2>${name}</h2>
            <p>${ingredients ? ingredients.join(", ") : ""}</p>
            <h3>${price}zł</h3>
            <button class="btn">Zamów</button>
          </div>
        </div>`;
    })
    .join("");
}

// Obsługa kliknięcia w kategorię
document.querySelectorAll(".category").forEach((category) => {
  category.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedCategory = category.getAttribute("data-category");

    if (selectedCategory === "pulledPorkBurgers") {
      document.getElementById("container").innerHTML =
        getMenuHtml(pulledPorkBurgers);
    } else if (selectedCategory === "smashBurgers") {
      document.getElementById("container").innerHTML =
        getMenuHtml(smashBurgers);
    } else if (selectedCategory === "zapiekanki") {
      document.getElementById("container").innerHTML = getMenuHtml(zapiekanki);
    } else if (selectedCategory === "dodatki") {
      document.getElementById("container").innerHTML = getMenuHtml(dodatki);
    } else if (selectedCategory === "napoje") {
      document.getElementById("container").innerHTML = getMenuHtml(napoje);
    }
  });
});

// Domyślnie wyświetl kategorię smashBurgers
document.getElementById("container").innerHTML = getMenuHtml(smashBurgers);

// === KOSZYK ===

// Dodawanie produktu do koszyka
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (cart[product.name]) {
    cart[product.name].quantity += 1;
  } else {
    cart[product.name] = {
      name: product.name,
      price: product.price,
      quantity: 1,
    };
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
}

// Aktualizacja liczby sztuk w ikonie koszyka
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const badge = document.querySelector("#cart-icon small");
  if (badge) badge.textContent = `Koszyk (${total})`;
}

// Wyświetlanie zawartości koszyka
function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  cartContainer.innerHTML = "";

  let total = 0;

  if (Object.keys(cart).length === 0) {
    cartContainer.innerHTML = "<p>Koszyk jest pusty</p>";
    if (totalDisplay) totalDisplay.textContent = "Razem: 0.00 zł";
    return;
  }

  for (const item of Object.values(cart)) {
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
  }

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

// Inicjalizacja
document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.getElementById("cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", toggleCartPanel);
  }

  updateCartCount();
  renderCartItems();
});

// Obsługa kliknięć: dodawanie i usuwanie z koszyka
document.addEventListener("click", (e) => {
  // Dodanie do koszyka
  if (e.target.classList.contains("btn")) {
    const card = e.target.closest(".card");
    const name = card.querySelector("h2").textContent;
    const priceText = card.querySelector("h3").textContent;
    const price = parseFloat(priceText.replace("zł", "").trim());

    const product = { name, price };
    addToCart(product);
  }

  // Usunięcie z koszyka (obsługa kliknięcia ikonki)
  if (
    e.target.classList.contains("remove-btn") ||
    e.target.closest(".remove-btn")
  ) {
    const button = e.target.closest(".remove-btn");
    const item = button.closest(".cart-item");
    const name = item.getAttribute("data-name");
    removeFromCart(name);
  }
});
