function setRouter() {
  switch (window.location.pathname) {
    // Redirect to login page if not logged in and accessing root path
    case "/":
      if (!localStorage.getItem("access_token")) {
        window.location.pathname = "/login/login.html";
      } else {
        window.location.pathname = "/index.html";
      }
      break;

    // If already logged in, redirect away from login/register pages
    case "/login/login.html":
    case "/register.html":
      if (localStorage.getItem("access_token")) {
        window.location.pathname = "/index.html";
      }
      break;

    // For other cases, maintain the default behavior
    default:
      break;
  }
}

export { setRouter };
