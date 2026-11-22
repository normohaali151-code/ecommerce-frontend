import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "https://ecommerce-project-lk0j.onrender.com";

function Checkout({ cart = [], setCart }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("EVC Plus");
  const [paymentPhone, setPaymentPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  async function handlePlaceOrder(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all delivery fields.");
      return;
    }

    if (
      paymentMethod === "EVC Plus" &&
      !/^61\d{7}$/.test(paymentPhone.trim())
    ) {
      setError("Enter a valid demo EVC number (61XXXXXXX).");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login before placing an order.");
      }

      const orderProducts = cart.map((item) => ({
        product: item._id,
        quantity: Number(item.quantity),
      }));

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          products: orderProducts,
          paymentMethod,
          paymentPhone: paymentPhone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed.");
      }

      setSuccess(
        "Demo payment successful! Your order has been placed."
      );

      if (setCart) {
        setCart([]);
      }

      localStorage.removeItem("cart");

      setTimeout(() => {
        navigate("/my-orders");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout">

      <h1>Checkout</h1>

      <div className="order-summary">
        <h2>Order Summary</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item._id}>
              <p>
                {item.name} × {item.quantity}
              </p>

              <p>
                ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
              </p>
            </div>
          ))
        )}

        <h2>Total: ${total.toFixed(2)}</h2>
      </div>

      {error && (
        <p className="checkout-error">{error}</p>
      )}

      {success && (
        <p className="checkout-success">{success}</p>
      )}

      <form onSubmit={handlePlaceOrder}>

        <h2>Delivery Information</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Delivery Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <textarea
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <div className="payment-section">

          <h2>Payment Method</h2>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="EVC Plus"
              checked={paymentMethod === "EVC Plus"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            EVC Plus
          </label>

          {paymentMethod === "EVC Plus" && (
            <div>
              <input
                type="tel"
                placeholder="EVC Number (61XXXXXXX)"
                value={paymentPhone}
                onChange={(e) => setPaymentPhone(e.target.value)}
                required
              />

              <p>
                Enter a demo number starting with 61.
              </p>
            </div>
          )}

          <p className="demo-notice">
            DEMO PAYMENT ONLY — No real money will be charged.
          </p>

        </div>

        <button
          type="submit"
          disabled={loading || cart.length === 0}
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>

      </form>

    </div>
  );
}

export default Checkout;