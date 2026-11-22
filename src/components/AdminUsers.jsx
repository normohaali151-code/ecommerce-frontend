import { useEffect, useState } from "react";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://ecommerce-project-lk0j.onrender.com/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Ma hubtaa inaad tirtirayso user-kan?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://ecommerce-project-lk0j.onrender.com/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <h2>Loading users...</h2>;

  if (error) return <p>{error}</p>;

  return (
    <div className="admin-users">
      <h1>Manage Users</h1>

      <h3>Total Users: {users.length}</h3>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map((user) => (
         <div key={user._id} className="user-card">
            <h3>{user.name}</h3>

            <p>Email: {user.email}</p>

            <p>Role: {user.role}</p>

            <button
              onClick={() => deleteUser(user._id)}
              disabled={user.role === "admin"}
            >
              Delete User
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminUsers;