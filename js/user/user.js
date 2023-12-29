import {
  supabase,
  successNotification,
  errorNotification,
  doLogout,
} from "../main.js";

//
//
btn_logout.onclick = doLogout;
async function fetchAndDisplayUserInfo() {
  try {
    // Retrieve email from Local Storage
    const userEmail = localStorage.getItem("email");

    if (!userEmail) {
      console.error("Email not found in Local Storage");
      return;
    }

    // Fetch user info from the user_info table using the email
    let { data: user, error } = await supabase
      .from("user_info")
      .select("firstname, lastname, email, image_path")
      .eq("email", userEmail);

    if (error) {
      console.error("Error fetching user info:", error.message);
      return;
    }

    // Display fetched user info in HTML elements
    if (user && user.length > 0) {
      document.getElementById("firstname").textContent = user[0].firstname;
      document.getElementById("lastname").textContent = user[0].lastname;
      document.getElementById("email").textContent = user[0].email;

      // Update profile image source with the fetched image path or default image if null
      const profileImage = document.getElementById("profile_image");
      profileImage.src =
        user[0].image_path ||
        "http://bootdey.com/img/Content/avatar/avatar1.png"; // Replace with your default image URL

      // Log fetched user info to the console
      console.log("Fetched User Info:", user);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

// Call the function to fetch and display user info when the page loads
window.onload = fetchAndDisplayUserInfo;

// HANDLE FILE UPLOAD

// Function to delete the existing image from Supabase Storage
function getUserIdFromLocalStorage() {
  const userId = localStorage.getItem("user_id"); // Replace "user_id" with your actual key
  return userId;
}
async function deleteExistingImage(userId) {
  try {
    const { data, error } = await supabase.storage
      .from("profile_pictures")
      .remove([
        `user_${userId}/profile.jpg`, // Remove only the file path within the storage bucket
      ]);

    if (error) {
      throw new Error(`Error deleting existing image: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting existing image:", error);
    return null;
  }
}

// UPDATE IMAGE_PATH
async function updateImagePathByEmail(email, imageUrl) {
  try {
    console.log("Updating image path in user_info table...");

    const { data: userData, error: userError } = await supabase
      .from("user_info")
      .update({ image_path: imageUrl })
      .eq("email", email);

    if (userError) {
      throw new Error(
        `Error updating image path in user_info table: ${userError.message}`
      );
    }

    console.log("Image path updated in user_info table:", userData);
    return userData;
  } catch (error) {
    console.error("Error updating image path in user_info table:", error);
    return null;
  }
}

// Function to upload image to Supabase Storage and update user profile
function generateCacheBust() {
  return Math.random().toString(36).substring(7);
}

// Function to upload image to Supabase Storage and update user profile
async function uploadImageAndUpdateProfile(file) {
  try {
    const userId = getUserIdFromLocalStorage(); // Retrieve user ID from localStorage

    // Delete existing image (if any)
    const deletionResult = await deleteExistingImage(userId);
    console.log("Deletion Result:", deletionResult);

    // Wait for a short delay to ensure deletion completes
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the delay as needed

    // Upload the new image to Supabase Storage after the delay
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile_pictures")
      .upload(`/user_${userId}/profile.jpg`, file, {
        cacheControl: "3600",
      });

    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    // Construct the image URL with a cache-busting query parameter
    const cacheBust = generateCacheBust(); // Generate a cache-busting string
    const imageUrl = `https://yjzcvrbsaxmfuaeakpzl.supabase.co/storage/v1/object/public/profile_pictures/user_${userId}/profile.jpg?cache=${cacheBust}`;

    // Update image path in user_info table based on email
    const userEmail = localStorage.getItem("email");
    const updateImagePathResult = await updateImagePathByEmail(
      userEmail,
      imageUrl
    );
    console.log("Update Image Path Result:", updateImagePathResult);

    if (updateImagePathResult) {
      const profileImage = document.getElementById("profile_image");
      profileImage.src = `${imageUrl}&timestamp=${new Date().getTime()}`; // Update the image source with the newly uploaded image

      // Show success notification
      successNotification("Image uploaded and UI updated successfully.", 10);
    }

    // Rest of the code remains unchanged...
    // ...
  } catch (error) {
    console.error("Error:", error);
    // Show error notification
    errorNotification("Error uploading image. Please try again later.", 5);
    return null;
  }
}

// Example usage when a user uploads an image
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");

uploadButton.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (file) {
    const updateResult = await uploadImageAndUpdateProfile(file);
    if (updateResult) {
      // Update UI or notify user about successful image upload and profile update
      console.log("Image uploaded and profile updated successfully.");
    }
  } else {
    // Display error notification when no file is selected
    errorNotification("No file selected.", 5);
    console.error("No file selected.");
  }
});

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
