import { doLogout, supabase } from "../main.js";

// Assign Logout Functionality
const btn_logout = document.getElementById("btn_logout");

btn_logout.onclick = doLogout;

async function fetchAndDisplayDishes() {
  const { data: dishes, error } = await supabase.from("dishes").select("*");

  if (error) {
    console.error("Error fetching dishes:", error);
    return;
  }

  console.log("Fetched dishes:", dishes); // Log fetched dishes

  mainDishes(dishes);
  noodleDishes(dishes); // Call the function to display noodle dishes
  snacksDishes(dishes); // Call the function to display snacks dishes
  riceDishes(dishes); // Call the function to display snacks dishes
  soupDishes(dishes); // Call the function to display
  dissertSweet(dishes);
  beverages(dishes); // Call the function to display
}
// MainDishes
function mainDishes(dishesData) {
  const mainDishesContainer = document.getElementById("mainDishes");

  const filteredMainDishes = dishesData.filter(
    (dish) => dish.categories_id === 2
  );

  console.log("Filtered main dishes:", filteredMainDishes); // Log filtered main dishes

  filteredMainDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    mainDishesContainer.appendChild(dishElement);
  });
}
// NoodleDishes
function noodleDishes(dishesData) {
  const noodleDishesContainer = document.getElementById("noodleDishes");

  const filteredNoodleDishes = dishesData.filter(
    (dish) => dish.categories_id === 1
  );

  console.log("Filtered noodle dishes:", filteredNoodleDishes); // Log filtered noodle dishes

  filteredNoodleDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    noodleDishesContainer.appendChild(dishElement);
  });
}
// Snacks
function snacksDishes(dishesData) {
  const snacksDishesContainer = document.getElementById("snacksDishes");

  const filteredSnacksDishes = dishesData.filter(
    (dish) => dish.categories_id === 4
  );

  console.log("Filtered snacks dishes:", filteredSnacksDishes); // Log filtered snacks dishes

  filteredSnacksDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    snacksDishesContainer.appendChild(dishElement);
  });
}
// Rice Dishes

function riceDishes(dishesData) {
  const riceDishesContainer = document.getElementById("riceDishes");

  const filteredriceDishes = dishesData.filter(
    (dish) => dish.categories_id === 6
  );

  console.log("Filtered rice dishes:", filteredriceDishes); // Log filtered snacks dishes

  filteredriceDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    riceDishesContainer.appendChild(dishElement);
  });
}
// Soup Dishes
function soupDishes(dishesData) {
  const soupDishesContainer = document.getElementById("soupDishes");

  const filteredsoupDishes = dishesData.filter(
    (dish) => dish.categories_id === 7
  );

  console.log("Filtered Soup dishes:", filteredsoupDishes); // Log filtered snacks dishes

  filteredsoupDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    soupDishesContainer.appendChild(dishElement);
  });
}
// Dessert and Sweets
function dissertSweet(dishesData) {
  const dissertSweetContainer = document.getElementById("dissertSweet");

  const filtereddissertSweet = dishesData.filter(
    (dish) => dish.categories_id === 8
  );

  console.log("Filtered Desserts and Sweet dishes:", filtereddissertSweet); // Log filtered snacks dishes

  filtereddissertSweet.forEach((dish) => {
    const dishElement = createDishElement(dish);
    dissertSweetContainer.appendChild(dishElement);
  });
}
// Beverages

function beverages(dishesData) {
  const beveragesContainer = document.getElementById("beverages");

  const filteredbeverages = dishesData.filter(
    (dish) => dish.categories_id === 8
  );

  console.log("Filtered beverages:", filteredbeverages); // Log filtered snacks dishes

  filteredbeverages.forEach((dish) => {
    const dishElement = createDishElement(dish);
    beveragesContainer.appendChild(dishElement);
  });
}

// Dish Element Creation
function createDishElement(dish) {
  const dishElement = document.createElement("div");
  dishElement.classList.add("col-4");

  dishElement.innerHTML = `
    <a href="./Recipe/recipe.html?id=${dish.id}">
      <div class="card">
        <img
          src="${dish.image_path}"
          class="card-img-top"
          alt="..."
        />
        <small class="card-title text-center">${dish.dish_name}</small>
      </div>
    </a>
  `;

  return dishElement;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayDishes();
});

// Collapse Dishes
// Get the button element
// Get all elements with the class "category-text"
const categoryButtons = document.querySelectorAll(".category-text");

// Add event listeners to all category buttons
categoryButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const sectionId = this.getAttribute("aria-controls");
    const section = document.getElementById(sectionId);

    // Toggle the collapse class on the respective dish section
    if (section.classList.contains("show")) {
      section.classList.remove("show");
      this.setAttribute("aria-expanded", "false");
    } else {
      section.classList.add("show");
      this.setAttribute("aria-expanded", "true");
    }
  });
});

// SEARCH FUNCTIONS
// SEARCH FUNCTIONS
async function fetchSearchSuggestions(query) {
  try {
    const { data: recipes, error } = await supabase
      .from("recipe")
      .select("dishes_id, dish_name") // Select 'dishes_id' and 'dish_name' fields for suggestions
      .ilike("dish_name", `%${query}%`); // Search for dish_names containing the query (case insensitive)

    if (error) {
      throw error;
    }

    return recipes; // Return the fetched recipes
  } catch (error) {
    console.error("Error fetching search suggestions:", error.message);
    return [];
  }
}

inputBox.addEventListener("input", async function (event) {
  const query = event.target.value.trim();

  if (query.length > 0) {
    const suggestions = await fetchSearchSuggestions(query);
    displaySearchSuggestions(suggestions);
  } else {
    searchDropdown.innerHTML = "";
    searchDropdown.style.display = "none";
  }
});

function displaySearchSuggestions(suggestions) {
  const searchDropdown = document.getElementById("search-dropdown");
  searchDropdown.innerHTML = "";

  if (suggestions.length > 0) {
    suggestions.forEach((suggestion) => {
      const item = document.createElement("a");
      item.setAttribute("class", "dropdown-item");
      item.setAttribute(
        "href",
        `/Recipe/recipe.html?id=${suggestion.dishes_id}`
      ); // Use 'dishes_id' in the URL
      item.textContent = suggestion.dish_name;

      searchDropdown.appendChild(item);
    });

    searchDropdown.style.display = "block";
  } else {
    searchDropdown.style.display = "none";
  }
}

function navigateToRecipePage(recipeId) {
  // Handle the recipe ID, for example, display it in console
  console.log(`Clicked Recipe ID: ${recipeId}`);
  // You can perform any action here based on the clicked recipe ID
}
