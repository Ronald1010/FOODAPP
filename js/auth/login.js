import { supabase, successNotification, errorNotification } from "../main.js";

const form_login = document.getElementById("form_login");

// Function to store user_id, firstname, lastname, email, and user_info_id in Local Storage
const storeUserDataInLocalStorage = (user) => {
  localStorage.setItem("user_id", user.id);
  localStorage.setItem("firstname", user.firstname);
  localStorage.setItem("lastname", user.lastname);
  localStorage.setItem("email", user.email);
  localStorage.setItem("user_info_id", user.user_info_id); // Save user_info_id
};

form_login.onsubmit = async (e) => {
  e.preventDefault();

  // Disable the submit button
  document.querySelector("#form_login button").disabled = true;
  document.querySelector("#form_login button").innerHTML = `
    <div class="spinner-border me-2" role="status"></div>
    <span>Loading...</span>
  `;

  // Get All values from input, select, textarea under form tag
  const formData = new FormData(form_login);

  try {
    // Supabase Sign-in
    let { data, error } = await supabase.auth.signInWithPassword({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Get data for session and user
    let session = data.session;
    let user = data.user;

    // If User can be accessed; Or user is already verified
    if (session != null && user != null) {
      // Store tokens for API
      localStorage.setItem("access_token", session.access_token);
      localStorage.setItem("refresh_token", session.refresh_token);

      // Store user details in Local Storage
      storeUserDataInLocalStorage({
        id: user.id,
        firstname: user.user_metadata.firstname,
        lastname: user.user_metadata.lastname,
        email: user.email,
        user_info_id: user.user_metadata.user_info_id, // Save user_info_id
      });
    }

    if (error == null) {
      // Show Notification
      successNotification("Login Successfully!");

      // Redirect to dashboard
      window.location.pathname = "/index.html";
    } else {
      errorNotification("Something wrong happened. Cannot login account.", 10);
      console.log(error);
    }
  } catch (err) {
    console.error("Error:", err.message);
    errorNotification("Something went wrong while logging in.", 10);
  }

  // Reset Form
  form_login.reset();

  // Enable Submit Button
  document.querySelector("#form_login button").disabled = false;
  document.querySelector("#form_login button").innerHTML = `Login`;
};
