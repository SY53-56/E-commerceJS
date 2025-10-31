const form = document.querySelector("#register-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  // Get existing users or empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  if (users.some(u => u.email === email)) {
    alert("Email already registered. Please login.");
    return;
  }

  // Add new user as object
  const newUser = { name, email, password };
  users.push(newUser);

  // Save back to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful!");
  window.location.href = "login.html"; // redirect to login
});
