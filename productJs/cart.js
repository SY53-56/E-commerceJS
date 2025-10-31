const cartContainer = document.querySelector(".cart");
const userInfo = document.querySelector(".user");

// Get current logged-in user
const user = JSON.parse(localStorage.getItem("loggedInUser"));
console.log(user)
if (!user) {
  // If no user, redirect to login page
  alert("Please login to view your cart");
  window.location.href = "login.html";
}

if (userInfo) {
  userInfo.textContent = `${user.name}`;
}

// Generate user-specific cart key
const cartKey = `cart_${user.email}`;

// Load user-specific cart
let cartData = [];
try {
  cartData = JSON.parse(localStorage.getItem(cartKey , JSON.stringify(cartData))) || [];
} catch {
  cartData = [];
}

// ----------------------------
// RENDER CART
// ----------------------------
function renderCart() {
  cartContainer.innerHTML = "";

  if (cartData.length === 0) {
    cartContainer.innerHTML = `<h2 class="text-xl text-gray-400 text-center">Cart is empty</h2>`;
    return;
  }

  let grandTotal = 0;

  cartData.forEach((item, index) => {
    const div = document.createElement("div");
    div.className =
      "cart-item flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-200 py-4";

    const lineTotal = (item.price * item.quantity).toFixed(2);
    grandTotal += parseFloat(lineTotal);

    div.innerHTML = `
      <div class="flex items-center gap-4 w-full md:w-2/3">
        <img src="${item.image}" alt="${item.title}" class="w-24 h-24 object-cover rounded cursor-pointer">
        <div class="flex-1">
          <h3 class="font-semibold text-lg">${item.title}</h3>
          <p class="text-gray-600 mt-1">Price: $${item.price}</p>
          <div class="quantity-controls mt-2 flex items-center gap-2">
            <button class="sub px-2 py-1 bg-gray-200 rounded" data-index="${index}">-</button>
            <input type="number" min="1" value="${item.quantity}" data-index="${index}"
              class="qty-input w-16 text-center border rounded">
            <button class="plus px-2 py-1 bg-gray-200 rounded" data-index="${index}">+</button>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <h4 class="font-semibold">Total: $${lineTotal}</h4>
        <div class="actions flex flex-col gap-4 justify-center">
          <button class="delete bg-gray-500 text-white px-3 py-1 hover:bg-gray-600 transition duration-300 cursor-pointer rounded" data-index="${index}">remove</button>
          <button class="buy bg-gray-500 text-white px-3 py-1 hover:bg-gray-600 transition duration-300 cursor-pointer  rounded ml-2" data-index="${index}">save for later</button>
        </div>
      </div>
    `;

    cartContainer.appendChild(div);
  });

  // Summary section
  const summary = document.createElement("div");
  summary.className = "cart-summary mt-6 p-4 bg-gray-50 rounded";
  summary.innerHTML = `
    <h2 class="text-2xl text-gray-700 mb-4">Price Details</h2>
    <p class="flex justify-between"><span>Items (${cartData.length})</span><span>$${grandTotal.toFixed(2)}</span></p>
    <div class="coupon mt-4">
      <input type="text" id="coupon" placeholder="Enter coupon code"
        class="border px-3 py-1 rounded w-40">
      <button id="applyCoupon" class="bg-indigo-600 text-white px-3 py-1 rounded ml-2">Apply</button>
      <p id="couponMsg" class="text-sm mt-2 text-green-600"></p>
    </div>
    <div class="grand-total mt-4">
      <h3 class="text-xl font-semibold">Grand Total: $<span id="grandVal">${grandTotal.toFixed(2)}</span></h3>
    </div>
    <div class="mt-4 flex gap-3">
      <button class="checkout bg-blue-600 text-white px-4 py-2 rounded">Proceed to Checkout</button>
      <button class="clear-cart bg-red-600 text-white px-4 py-2 rounded">Clear Cart</button>
    </div>
  `;
  cartContainer.appendChild(summary);

  attachEventListeners();
}

// ----------------------------
// EVENT LISTENERS
// ----------------------------
function attachEventListeners() {
  document.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      cartData[index].quantity++;
      saveAndRender();
    });
  });

  document.querySelectorAll(".sub").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      if (cartData[index].quantity > 1) {
        cartData[index].quantity--;
        saveAndRender();
      }
    });
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      if (confirm("Delete this item?")) {
        cartData.splice(index, 1);
        saveAndRender();
      }
    });
  });

  document.querySelector(".clear-cart")?.addEventListener("click", () => {
    if (confirm("Clear entire cart?")) {
      cartData = [];
      saveAndRender();
    }
  });
}

// ----------------------------
// SAVE + RERENDER (USER-SPECIFIC)
// ----------------------------
function saveAndRender() {
  localStorage.setItem( JSON.stringify("cartkey"));
  renderCart();
}

// Initial render
renderCart();
