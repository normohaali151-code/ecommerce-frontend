import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import ProductList from "./components/productlist";
import Cart from "./components/cart";
import ProductDetails from "./components/ProductDetails";
import Checkout from "./components/checkout";
import MyOrders from "./components/MyOrders";
import AdminDashboard from "./components/AdminDashboard";
import AdminOrders from "./components/AdminOrders";
import AdminUsers from "./components/AdminUsers";
import AdminProducts from "./components/AdminProducts";
import Login from "./Login";
import Register from "./Register";

import "./App.css";

function App() {
  const location = useLocation();

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // SAVE CART
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // GET PRODUCTS FROM BACKEND
  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);

        const response = await fetch(
          "https://ecommerce-project-lk0j.onrender.com/products"
        );

        if (!response.ok) {
          throw new Error("Products lama soo qaadi karin");
        }

        const data = await response.json();

        setProducts(data.products || []);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (location.pathname === "/") {
      getProducts();
    }
  }, [location.pathname]);

  // ADD TO CART
  function addToCart(product) {
    setCart((oldCart) => {
      const existing = oldCart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return oldCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...oldCart, { ...product, quantity: 1 }];
    });
  }

  // INCREASE QUANTITY
  function increaseQuantity(id) {
    setCart((oldCart) =>
      oldCart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  // DECREASE QUANTITY
  function decreaseQuantity(id) {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // REMOVE FROM CART
  function removeFromCart(id) {
    setCart((oldCart) =>
      oldCart.filter((item) => item._id !== id)
    );
  }

  // FILTER PRODUCTS
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" ||
      product.category?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // CATEGORIES
  const categories = [
    "all",
    ...new Set(
      products.map((product) => product.category).filter(Boolean)
    ),
  ];

  return (
    <div>
      {/* NAVBAR */}
      <header className="navbar">
        <h2>Our E-Commerce</h2>

        <nav>
          <Link to="/">Products</Link>

          <Link to="/cart">
            Cart ({cart.length})
          </Link>

          <Link to="/checkout">Checkout</Link>

          <Link to="/my-orders">My Orders</Link>

          <Link to="/admin">Admin</Link>

          <Link to="/admin/orders">
            Manage Orders
          </Link>

          <Link to="/admin/products">
            Manage Products
          </Link>

          <Link to="/admin/users">
            Manage Users
          </Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span className="welcome">
                Hi, {user.name}
              </span>

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  setUser(null);
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      {/* ROUTES */}
      <Routes>

        {/* PRODUCTS */}
        <Route
          path="/"
          element={
            <main>
              <h1>Our Products</h1>

              <div className="filters">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all"
                        ? "All Categories"
                        : cat}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <p>Loading products...</p>
              ) : (
                <ProductList
                  products={filteredProducts}
                  addToCart={addToCart}
                />
              )}
            </main>
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/products/:id"
          element={
            <productDetails addToCart={addToCart} />
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<Checkout cart={cart} />}
        />

        {/* MY ORDERS */}
        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* ADMIN ORDERS */}
        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        {/* ADMIN PRODUCTS */}
        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        {/* ADMIN USERS */}
        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}