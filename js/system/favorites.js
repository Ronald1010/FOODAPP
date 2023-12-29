import {
  supabase,
  successNotification,
  errorNotification,
  doLogout,
} from "../main.js";

// Function to display recipes in favorites
async function displayRecipesInFavorites() {
  try {
    // Retrieve email from localStorage
    const userEmail = localStorage.getItem("email"); // Replace 'userEmail' with the key used to store the email

    if (!userEmail) {
      console.error("User email not found in localStorage");
      return;
    }

    // Get recipe IDs associated with the user's email stored in the favorites table
    let { data: favorites, error } = await supabase
      .from("favorites")
      .select("recipe_id")
      .eq("email", userEmail); // Assuming the column name storing email is 'email'

    if (error) {
      throw new Error(error.message);
    }

    // Fetch recipe data using the recipe IDs from the recipe table
    let recipesData = [];

    for (let i = 0; i < favorites.length; i++) {
      let recipeId = favorites[i].recipe_id;
      let { data: recipeData, error: recipeError } = await supabase
        .from("recipe")
        .select("*")
        .eq("id", recipeId)
        .single();

      if (recipeError) {
        throw new Error(recipeError.message);
      }

      if (recipeData) {
        recipesData.push(recipeData);
      }
    }
    console.log("Fetched Recipe Data:", recipesData); // Added console log

    // Display recipes in the cards
    const cardsFavorite = document.getElementById("cardsFavorite");

    // ... (existing code)

    if (cardsFavorite) {
      cardsFavorite.innerHTML = ""; // Clear existing content

      recipesData.forEach((recipe) => {
        // Create card structure for each recipe
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.width = "320px";
        card.style.marginBottom = "20px"; // You can adjust the margin value as needed

        // Limit the description text
        const truncatedDescription =
          recipe.discreption.length > 110
            ? `${recipe.discreption.slice(0, 110)}...`
            : recipe.discreption;

        card.innerHTML = `
      <div class="row g-0">
        <div class="col-4 py-2 mt-1 ">
        <a href="/Recipe/recipe.html">
          <img
            id="image_path"
            src="${recipe.image_path}"
            width="100px"
            style="border-radius: 5px"
            alt="Recipe Image"
          />
          </a>
        </div>
       
        <div class="col-8">
         
          <div class="card-body">
            <div class="row">
              <div class="col-10">
              <a href="/Recipe/recipe.html">
                <h6 class="card-title" id="dish_name" style="font-weight: bold">${recipe.dish_name}</h6>
                </a>
              </div>
              <div class="float-end col-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="#ff0000"
                  class="bi bi-trash delete-button"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                  />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                  />
                </svg>
              </div>
            </div>
            <a href="/Recipe/recipe.html">
           
            <p class="card-text" id="discreption ">${truncatedDescription}</p>
            </a>
          </div>
         
        </div>
       
      </div>
    `;

        //  event listeners
        // Find the image link inside the current card
        const imageElement = card.querySelector("#image_path");
        const imageLink = imageElement ? imageElement.parentNode : null;

        if (imageLink) {
          // Add click event listener to the image link
          imageLink.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default navigation behavior

            // Redirect to the recipe HTML page and pass the dishes_id as a query parameter
            const dishesId = recipe.dishes_id; // Use dishes_id here
            window.location.href = `/Recipe/recipe.html?id=${dishesId}`;
          });
        }

        // Find the card title link inside the current card
        const titleElement = card.querySelector("#dish_name");
        const titleLink = titleElement ? titleElement.parentNode : null;

        if (titleLink) {
          // Add click event listener to the card title link
          titleLink.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default navigation behavior

            // Redirect to the recipe HTML page and pass the dishes_id as a query parameter
            const dishesId = recipe.dishes_id; // Use dishes_id here
            window.location.href = `/Recipe/recipe.html?id=${dishesId}`;
          });
        }

        // Find the description link inside the current card
        const descriptionElement = card.querySelector("#discreption");
        const descriptionLink = descriptionElement
          ? descriptionElement.parentNode
          : null;

        if (descriptionLink) {
          // Add click event listener to the description link
          descriptionLink.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default navigation behavior

            // Redirect to the recipe HTML page and pass the dishes_id as a query parameter
            const dishesId = recipe.dishes_id; // Use dishes_id here
            window.location.href = `/Recipe/recipe.html?id=${dishesId}`;
          });
        }

        // end event listeners
        // Append the card to the cardsFavorite container
        cardsFavorite.appendChild(card);

        // Find the delete button (SVG icon) inside the current card
        const deleteButton = card.querySelector(".delete-button");

        // Add click event listener to the delete button (SVG icon)
        deleteButton.addEventListener("click", async (event) => {
          event.preventDefault();
          const recipeId = recipe.id;

          // Call the function to delete the recipe from favorites
          await deleteFromFavorites(recipeId);

          // Remove the card from the UI upon successful deletion
          card.remove();
        });
      });
    }
  } catch (err) {
    console.error("Error displaying recipes:", err);
    // Handle/display error if needed
  }
}

// Call the function to display recipes in favorites
displayRecipesInFavorites();

// Function to delete a row in the 'favorites' table
// Function to delete a row in the 'favorites' table
async function deleteFromFavorites(recipeId) {
  try {
    const userEmail = localStorage.getItem("email");

    if (!userEmail) {
      console.error("User email not found in localStorage");
      return;
    }

    // Delete the row from the 'favorites' table based on the recipe ID and user's email
    const { error } = await supabase
      .from("favorites")
      .delete()
      .match({ recipe_id: recipeId, email: userEmail });

    if (error) {
      throw new Error(error.message);
    }

    // Display success notification on successful deletion
    const successAlert = document.querySelector(".alert-success");
    successAlert.textContent = `Recipe deleted from favorites`;
    successAlert.classList.remove("d-none");
    successAlert.classList.add("d-block");

    // Hide the success notification after a few seconds (e.g., 5 seconds)
    setTimeout(() => {
      successAlert.classList.remove("d-block");
      successAlert.classList.add("d-none");
    }, 5000);
  } catch (err) {
    console.error("Error deleting recipe from favorites:", err);

    // Display error notification if there's an error during deletion
    const errorAlert = document.querySelector(".alert-danger");
    errorAlert.textContent =
      "Error deleting recipe from favorites. Please try again later.";
    errorAlert.classList.remove("d-none");
    errorAlert.classList.add("d-block");

    // Hide the error notification after a few seconds (e.g., 5 seconds)
    setTimeout(() => {
      errorAlert.classList.remove("d-block");
      errorAlert.classList.add("d-none");
    }, 5000);
  }
}

//
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
