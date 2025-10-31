const form = document.querySelector("#login-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  if (!email || !password) {
    alert("Please fill in both fields");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Find user that matches email + password
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password");
    return;
  }

  // ✅ Login successful
  alert(`Welcome, ${user.name}!`);
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  window.location.href = "index.html"; // redirect to homepage
});
