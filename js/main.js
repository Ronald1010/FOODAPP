// Import all of Bootstrap's JS
// import * as bootstrap from "bootstrap";

// Import Router
import { setRouter } from "./router/router.js";

// Import supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Set Router
setRouter();

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://yjzcvrbsaxmfuaeakpzl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqemN2cmJzYXhtZnVhZWFrcHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMwNzI2MTcsImV4cCI6MjAxODY0ODYxN30.P-m8N8agGuJ5r0Og4hBOyfoKgQmh95IxwibSl_BV_nw"
);

// Success Notification
function successNotification(message, seconds = 0) {
  document.querySelector(".alert-success").classList.remove("d-none");
  document.querySelector(".alert-success").classList.add("d-block");
  document.querySelector(".alert-success").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-success").classList.remove("d-block");
      document.querySelector(".alert-success").classList.add("d-none");
    }, seconds * 1000);
  }
}

// Error Notification
function errorNotification(message, seconds = 0) {
  document.querySelector(".alert-danger").classList.remove("d-none");
  document.querySelector(".alert-danger").classList.add("d-block");
  document.querySelector(".alert-danger").innerHTML = message;

  if (seconds != 0) {
    setTimeout(function () {
      document.querySelector(".alert-danger").classList.remove("d-block");
      document.querySelector(".alert-danger").classList.add("d-none");
    }, seconds * 1000);
  }
}

// Logout Function
async function doLogout() {
  // Supabase Logout
  let { error } = await supabase.auth.signOut();

  if (error == null) {
    successNotification("Logout Successfully!");

    // Clear local Storage
    localStorage.clear();

    // Redirect to login page
    window.location.pathname = "/login/login.html";
  } else {
    errorNotification("Logout Failed!", 15);
  }
}

export { supabase, successNotification, errorNotification, doLogout };
