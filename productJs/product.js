// ===============================
// GLOBALS
// ===============================
let count = 0;
const cartCount = document.querySelector("#cart-count");
const container = document.querySelector(".box");
const allProduct = document.querySelector(".alldata");
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

// ===============================
// Restore cart count (per logged-in user)
// ===============================
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (loggedInUser) {
  const cartKey = `cart_${loggedInUser.email}`;
  const cartData = JSON.parse(localStorage.getItem(cartKey)) || [];
  count = cartData.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = count;
} else {
  cartCount.textContent = 0;
}

// ===============================
// Fetch utilities
// ===============================
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

async function fetchAllProducts() {
  const urls = [
    "https://fakestoreapi.com/products",
    "https://dummyjson.com/products/category/smartphones",
    "https://dummyjson.com/products/category/laptops",
    "https://dummyjson.com/products/category/mens-shirts",
    "https://dummyjson.com/products/category/womens-dresses"
  ];

  const results = await Promise.all(urls.map(fetchAPI));

  return results.flatMap(data => {
    if (!data) return [];
    return data.products || data;
  });
}

// ===============================
// Helpers
// ===============================
function findProductById(products, id) {
  return products.find(p => p.id === id);
}

// ✅ Updated addToCart function (per-user)
function addToCart(product, quantity) {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("Please login first!");
    return;
  }

  const cartKey = `cart_${user.email}`; // unique cart per user
  let oldData = JSON.parse(localStorage.getItem(cartKey)) || [];

  let existingItem = oldData.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    oldData.push({ ...product, quantity });
  }

  localStorage.setItem(cartKey, JSON.stringify(oldData));
  console.log(`Added ${quantity} × ${product.title} to ${user.name}'s cart`);
}

// ===============================
// Render product details
// ===============================
function renderProductPage(product) {
  if (!product) {
    container.innerHTML = `<p class="text-center text-gray-500 text-lg">Product not found</p>`;
    return;
  }

  container.innerHTML = `
    <div class="flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden">
      <img 
        src="${product.image || product.images?.[0]}" 
        alt="${product.title}"
        class="w-full md:w-1/2 h-96 object-cover"
      />
      <div class="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-3">${product.title}</h1>
          <p class="text-gray-600 mb-6">${product.description || "No description available."}</p>
          <p class="text-blue-600 text-2xl font-semibold mb-6">Price: $${product.price}</p>
        </div>
        <div class="flex items-center gap-3">
          <button id="sub" class="px-4 py-2 bg-gray-200 rounded-lg text-lg font-semibold">-</button>
          <span id="qty" class="px-4 py-2 border rounded-lg text-lg">1</span>
          <button id="plus" class="px-4 py-2 bg-gray-200 rounded-lg text-lg font-semibold">+</button>
          <button id="add-btn" class="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Add to Cart</button>
        </div>
      </div>
    </div>
  `;

  // Quantity controls
  let quantity = 1;
  const qtyDisplay = document.querySelector("#qty");
  const plus = document.querySelector("#plus");
  const sub = document.querySelector("#sub");
  const addBtn = document.querySelector("#add-btn");

  plus.addEventListener("click", () => {
    quantity++;
    qtyDisplay.textContent = quantity;
  });

  sub.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      qtyDisplay.textContent = quantity;
    }
  });

  addBtn.addEventListener("click", () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Please login first");
      return;
    }

    addToCart(product, quantity);

    // Update cart count (per user)
    const cartKey = `cart_${user.email}`;
    const updatedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    count = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = count;
  });
}

// ===============================
// Render mini cards for search/filter
// ===============================
function renderSmallCards(products) {
  allProduct.innerHTML = "";
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = `
      bg-white rounded-xl shadow-sm hover:shadow-md transition
      p-3 cursor-pointer flex flex-col items-center
    `;
    card.innerHTML = `
      <img src="${p.image || p.images?.[0]}" alt="${p.title}" class="w-40 h-40 object-cover rounded-md mb-2">
      <p class="text-center font-semibold text-gray-800 line-clamp-2">${p.title}</p>
    `;
    card.addEventListener("click", () => {
      window.location.href = `product.html?id=${p.id}`;
    });
    allProduct.appendChild(card);
  });
}

// ===============================
// Search setup
// ===============================
function setupSearch(products) {
  const input = document.querySelector("#input");
  input.addEventListener("input", () => {
    const value = input.value.trim().toLowerCase();
    const filtered = products.filter(p =>
      (p.title || "").toLowerCase().includes(value)
    );
    renderSmallCards(filtered);
  });
}

// ===============================
// Initialize
// ===============================
async function showProduct() {
  const allProducts = await fetchAllProducts();
  const product = findProductById(allProducts, productId);
  renderProductPage(product);
  renderSmallCards(allProducts.slice(0, 8)); // show recommendations
  setupSearch(allProducts);
}

showProduct();
