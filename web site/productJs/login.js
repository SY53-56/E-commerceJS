const form = document.querySelector("#login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!email || !password) {
    alert("Please fill in both fields");
    return;
  }

  const users = JSON.parse(localStorage.getItem("user")) || [];

  // Find user that matches email + password
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  // ✅ Login successful
  alert("Login successful!");
  localStorage.setItem("loggedInUser", JSON.stringify(user)); // optional, for tracking
  window.location.href = "e-.html"; // redirect to homepage
});
