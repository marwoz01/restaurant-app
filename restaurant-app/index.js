import {
  pulledPorkBurgers,
  smashBurgers,
  zapiekanki,
  dodatki,
  napoje,
} from "./menu.js";

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
                </div>
            </div>`;
    })
    .join("");
}

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

document.getElementById("container").innerHTML = getMenuHtml(smashBurgers);
