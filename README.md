# 🛍️ Multi-User E-Commerce Cart System

A modern e-commerce web app built using **HTML**, **CSS**, and **Vanilla JavaScript**, featuring user-specific carts, dynamic product fetching, and local storage-based login and cart persistence.

---

## 🚀 Features
  
### 👥 User System
- 🔐 Register and login functionality.  
- 🧠 Persistent login using `localStorage`.  
- 👤 Displays the logged-in user’s name.  
- 🚪 Logout resets the session but keeps the user’s saved cart.

### 🛒 Cart System (User-Specific)
Each logged-in user has their own **separate cart**, stored using a unique key in localStorage.



✅ Add, remove, or update product quantity.  
✅ Calculates total and grand total dynamically.  
✅ Fully isolated cart data per user.  

### 💳 Product Management
- Fetches product data from:
  - [FakeStore API](https://fakestoreapi.com/products)
  - [DummyJSON API](https://dummyjson.com/products)
- Shows detailed product view:
  - 🖼️ Image
  - 📝 Description
  - 💵 Price
  - ➕ Quantity controls
  - 🛒 “Add to Cart” button

### 🔍 Search & Recommendations
- Instant search using keywords.  
- Recommended product list appears on every product page.



##🧰 Technologies Used
Tech	Purpose
HTML5	Structure and content
CSS3	Styling and layout
JavaScript (ES6)	Logic and interactivity
LocalStorage API	Persistent user and cart data



##👨‍💻 Author

sahul yadav
💼 Front-End Developer
📧 yadavsahul220@gmail.com


##⚙️ Setup Instructions

Clone the repository:

git clone https://github.com/yourusername/ecommerce-cart.git


Open the folder:

cd ecommerce-cart
