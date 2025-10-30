const cartContainer = document.querySelector(".cart");

// LocalStorage se cart load
let cartData = [];
try {
  cartData = JSON.parse(localStorage.getItem("cart")) || [];
} catch {
  cartData = [];
}

// ----------------------------
// CART RENDER
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

  // Price details + Coupon + Clear Cart
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
  // Plus button
  document.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      cartData[index].quantity++;
      saveAndRender();
    });
  });

  // Sub button
  document.querySelectorAll(".sub").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      if (cartData[index].quantity > 1) {
        cartData[index].quantity--;
        saveAndRender();
      }
    });
  });

  // Quantity input
  document.querySelectorAll(".qty-input").forEach(inp => {
    inp.addEventListener("change", e => {
      const index = +e.target.dataset.index;
      const val = parseInt(e.target.value);
      if (val > 0) {
        cartData[index].quantity = val;
        saveAndRender();
      }
    });
  });

  // Delete button
  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      if (confirm("Delete this item?")) {
        cartData.splice(index, 1);
        saveAndRender();
      }
    });
  });

  // Buy button
  document.querySelectorAll(".buy").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      const item = cartData[index];
      alert(`Buying ${item.title} for $${(item.price * item.quantity).toFixed(2)}`);
    });
  });

  // Image modal
  document.querySelectorAll(".cart-item img").forEach(img => {
    img.addEventListener("click", () => {
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50";
      modal.innerHTML = `
        <div class="bg-white p-4 rounded">
          <img src="${img.src}" class="max-h-[80vh] rounded">
          <button class="close mt-3 bg-red-500 text-white px-4 py-1 rounded">Close</button>
        </div>`;
      document.body.appendChild(modal);
      modal.querySelector(".close").addEventListener("click", () => modal.remove());
    });
  });

  // Clear cart
  document.querySelector(".clear-cart")?.addEventListener("click", () => {
    if (confirm("Clear entire cart?")) {
      cartData = [];
      saveAndRender();
    }
  });

  // Coupon
  document.getElementById("applyCoupon")?.addEventListener("click", () => {
    const code = document.getElementById("coupon").value.trim();
    let total = cartData.reduce((sum, it) => sum + it.price * it.quantity, 0);
    if (code.toUpperCase() === "SAVE10") {
      total *= 0.9;
      document.getElementById("couponMsg").textContent =
        `Coupon applied! New total: $${total.toFixed(2)}`;
      document.getElementById("grandVal").textContent = total.toFixed(2);
    } else {
      document.getElementById("couponMsg").textContent = "Invalid coupon code.";
    }
  });
}

// ----------------------------
// SAVE + RERENDER
// ----------------------------
function saveAndRender() {
  localStorage.setItem("cart", JSON.stringify(cartData));
  renderCart();
}

// Initial render
renderCart();
