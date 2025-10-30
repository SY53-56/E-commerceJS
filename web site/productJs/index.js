const container = document.querySelector("#content");
const searchInput = document.querySelector("#input");

// Fetch a single API endpoint safely
async function fetchAPI(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error fetching ${url}:`, err);
    return null;
  }
}

// Fetch all product sources
async function fetchAllProducts() {
  const urls = [
    "https://fakestoreapi.com/products",
    "https://dummyjson.com/products/category/smartphones",
    "https://dummyjson.com/products/category/laptops",
    "https://dummyjson.com/products/category/mens-shirts",
    "https://dummyjson.com/products/category/womens-dresses"
  ];

  const results = await Promise.allSettled(urls.map(fetchAPI));

  return results.flatMap(r => {
    if (r.status === "fulfilled" && r.value) {
      return r.value.products || r.value;
    }
    return [];
  });
}

// Render all products dynamically
function renderProducts(products) {
  container.innerHTML = "";
  if (!products.length) {
    container.innerHTML = `
      <p class="text-center text-gray-500 text-lg mt-10">
        No products found 😕
      </p>`;
    return;
  }

  container.className = `
    max-w-6xl mx-auto w-full px-4 pb-10
    grid 
    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
    gap-6
  `;

  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = `
      bg-white 
      rounded-2xl 
      shadow-sm 
      hover:shadow-lg 
      transition-all 
      duration-300 
      cursor-pointer 
      overflow-hidden 
      border 
      border-gray-300 
      hover:-translate-y-1
      flex 
      flex-col
      py-2
      px-2
    `;

    const img = document.createElement("img");
    img.src = product.image || product.images?.[0];
    img.alt = product.title;
    img.loading = "lazy";
    img.className = `
      w-full 
      h-52 
      object-cover 
      transition-transform 
      duration-300 
      hover:scale-105
    `;

    const info = document.createElement("div");
    info.className = "p-4 flex flex-col justify-between flex-1";

    const title = document.createElement("h2");
    title.textContent = product.title;
    title.className = `
      font-semibold 
      text-gray-800 
      text-base 
      mb-2 
      line-clamp-2
    `;

    const price = document.createElement("p");
    price.textContent = `$${product.price}`;
    price.className = `
      text-blue-600 
      font-bold 
      text-lg
    `;

    const button = document.createElement("button");
    button.textContent = "View Details";
    button.className = `
      mt-3 
      w-full 
      bg-blue-600 
      text-white 
      py-2 
      rounded-lg 
      font-medium 
      hover:bg-blue-700 
      transition
    `;
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = `product.html?id=${product.id}`;
    });

    info.appendChild(title);
    info.appendChild(price);
    info.appendChild(button);

    div.appendChild(img);
    div.appendChild(info);

    div.addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    fragment.appendChild(div);
  });

  container.appendChild(fragment);
}

// Initialize app and handle search
async function init() {
  const products = await fetchAllProducts();
  renderProducts(products);

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = products.filter(p =>
      (p.title || "").toLowerCase().includes(term)
    );
    renderProducts(filtered);
  });
}

init();


  const userInfo = document.querySelector("#user-info");

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
console.log(user)
  if (user) {
    // ✅ User is logged in
    userInfo.innerHTML = `
      <span class="mr-3"> <strong>${user.name}</strong></span>
      <button id="logout-btn" class="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition">Logout</button>
    `;

    // Logout button
    document.querySelector("#logout-btn").addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      alert("You have been logged out.");
      window.location.href = "login.html";
    });
  } else {
    // 🚪 No user logged in
    userInfo.innerHTML = `
      <a href="login.html" class="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition">Login</a>
    `;
  }

