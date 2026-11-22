import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "https://ecommerce-project-lk0j.onrender.com";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login first.");
        }

        const response = await fetch(
          `${API_URL}/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load orders");
        }

        setOrders(data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) return <h2>Loading orders...</h2>;

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="my-orders">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
         <div key={order._id} className="my-order-card">
            <h3>Order #{order._id.slice(-6)}</h3>

            <p>
              <strong>Name:</strong> {order.fullName}
            </p>

            <p>
              <strong>Phone:</strong> {order.phone}
            </p>

            <p>
              <strong>Address:</strong> {order.address}
            </p>

            <h3>Products</h3>

            {order.products.map((item, index) => (
              <div key={item._id || index}>
                <p>
                  {item.product?.name || "Product"} × {item.quantity}
                </p>
                <p>
                  Price: ${item.price}
                </p>
              </div>
            ))}

            <h3>
              Total: ${Number(order.totalPrice).toFixed(2)}
            </h3>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;