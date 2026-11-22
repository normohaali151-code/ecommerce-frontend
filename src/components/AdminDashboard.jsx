import { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalSales: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://ecommerce-project-lk0j.onrender.com/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome to your store management</p>

      <div className="admin-stats">

        <div className="admin-card">
          <h3>Total Products</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div className="admin-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="admin-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="admin-card">
          <h3>Total Sales</h3>
          <p>${stats.totalSales}</p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;