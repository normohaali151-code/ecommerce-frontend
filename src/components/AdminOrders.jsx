import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "https://ecommerce-project-lk0j.onrender.com/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load orders");
      }

      setOrders(Array.isArray(data) ? data : []);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE ORDER STATUS
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `https://ecommerce-project-lk0j.onrender.com/admin/orders/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id
              ? { ...order, status: data.order.status }
              : order
          )
        );

        alert("Order status updated successfully!");
      } else {
        alert(data.message || "Update failed");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  // DELETE ORDER
  const deleteOrder = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this order?"
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `https://ecommerce-project-lk0j.onrender.com/admin/orders/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.filter((order) => order._id !== id)
        );

        alert("Order deleted successfully!");
      } else {
        alert(data.message || "Delete failed");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  if (loading) return <h2>Loading orders...</h2>;

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="admin-orders">

      <h1>Manage Orders</h1>

      <h3>Total Orders: {orders.length}</h3>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (

          <div key={order._id} className="order-card">

            <h3>Order ID: {order._id}</h3>

            <hr />

            <h3>Customer Information</h3>

            <p><strong>Name:</strong> {order.fullName}</p>

            <p><strong>Phone:</strong> {order.phone}</p>

            <p><strong>Address:</strong> {order.address}</p>

            <p>
              <strong>Email:</strong>{" "}
              {order.user?.email || "N/A"}
            </p>

            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <hr />

            <h3>Ordered Products</h3>

            {order.products?.map((item, index) => (

              <div key={index} className="ordered-product">

                <p>
                  <strong>Product:</strong>{" "}
                  {item.product?.name || "Product unavailable"}
                </p>

                <p><strong>Quantity:</strong> {item.quantity}</p>

                <p><strong>Price:</strong> ${item.price}</p>

                <p>
                  <strong>Subtotal:</strong>{" "}
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                <hr />

              </div>

            ))}

            <h3>
              Total Price: ${Number(order.totalPrice).toFixed(2)}
            </h3>

            <p>
              <strong>Current Status:</strong> {order.status}
            </p>

            <label>Update Order Status:</label>

            <select
              className="order-status"
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              className="delete-order-btn"
              onClick={() => deleteOrder(order._id)}
            >
              Delete Order
            </button>

          </div>

        ))
      )}

    </div>
  );
}

export default AdminOrders;