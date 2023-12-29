import { supabase, successNotification, errorNotification } from "../main";

const form_register = document.getElementById("signupForm");

form_register.onsubmit = async (e) => {
  e.preventDefault();

  // Disable the submit button
  document.querySelector("#signupForm button").disabled = true;
  document.querySelector(
    "#signupForm button"
  ).innerHTML = `<div class="spinner-border me-2" role="status"></div><span>Loading...</span>`;

  // Get all values from input, select, textarea under form tag
  const formData = new FormData(form_register);

  // Check if both password and password confirmation match
  if (formData.get("password") === formData.get("password_confirmation")) {
    try {
      // Supabase SignUp
      const { data, error } = await supabase.auth.signUp({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (error) {
        throw error;
      }

      if (data && data.user) {
        // Store the user_id
        const user_id = data.user.id;

        // Check if user_id exists
        if (user_id != null) {
          // Insert user information into user_info table
          const { data: userInfoData, error: userInfoError } = await supabase
            .from("user_info")
            .insert([
              {
                firstname: formData.get("firstname"),
                lastname: formData.get("lastname"),
                email: formData.get("email"),
                user_id: user_id,
              },
            ]);

          if (userInfoError) {
            throw userInfoError;
          }

          // Show notification on successful registration
          successNotification(
            "Registered Successfully! <a href='./index.html'>Click here to Login!</a>",
            20
          );

          // Reset Form
          form_register.reset();
        } else {
          throw new Error("User ID is null or undefined");
        }
      } else {
        throw new Error("User data is null or undefined");
      }
    } catch (error) {
      // Handle errors
      errorNotification(
        `Something went wrong: ${error.message || "Unknown error"}`,
        10
      );
      console.error(error);
    } finally {
      // Enable Submit Button
      document.querySelector("#signupForm button").disabled = false;
      document.querySelector("#signupForm button").innerHTML = `Register`;
    }
  } else {
    // Handle password mismatch error
    errorNotification("Password and Confirm Password do not match", 10);
  }
};
