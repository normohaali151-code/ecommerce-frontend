import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    stock: "",
    image: "",
    price: "",
  });

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://ecommerce-project-lk0j.onrender.com/products");
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      category: "",
      stock: "",
      image: "",
      price: "",
    });

    setImageFile(null);
    setEditingId(null);
    setFileKey((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.image;

      // UPLOAD IMAGE FIRST
      if (imageFile) {
        const imageData = new FormData();
        imageData.append("image", imageFile);

        const uploadRes = await fetch(
          "https://ecommerce-project-lk0j.onrender.com/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: imageData,
          }
        );

        const uploadResult = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(
            uploadResult.message || "Image upload failed"
          );
        }

        imageUrl = uploadResult.imageUrl;
      }

      if (!imageUrl) {
        throw new Error("Please select a product image");
      }

      const productData = {
        ...form,
        image: imageUrl,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      const url = editingId
        ? `https://ecommerce-project-lk0j.onrender.com/products/${editingId}`
        : "https://ecommerce-project-lk0j.onrender.com/products";

      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Product operation failed");
      }

      alert(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetForm();
      fetchProducts();

    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      stock: String(product.stock ?? ""),
      image: product.image || "",
      price: String(product.price ?? ""),
    });

    setImageFile(null);
    setFileKey((prev) => prev + 1);

    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(
        `https://ecommerce-project-lk0j.onrender.com/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  if (loading) return <h2>Loading products...</h2>;

  return (
    <div className="admin-products">

      <h1>Manage Products</h1>

      <h3>Total Products: {products.length}</h3>

      <form className="product-form" onSubmit={handleSubmit}>

        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          min="0"
          value={form.stock}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label>Choose Product Image</label>

        <input
          key={fileKey}
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0] || null)}
          required={!editingId}
        />

        {editingId && form.image && (
          <div>
            <p>Current Image:</p>
            <img
              src={form.image}
              alt="Current product"
              className="product-preview"
            />
            <p>Choose a new image only if you want to replace it.</p>
          </div>
        )}

        {imageFile && (
          <p>Selected: {imageFile.name}</p>
        )}

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}

      </form>

      <hr />

      <h2>All Products</h2>

      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="product-card">

              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              )}

              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>
              <p>Price: ${product.price}</p>

              <button onClick={() => handleEdit(product)}>
                Edit
              </button>

              <button onClick={() => handleDelete(product._id)}>
                Delete
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default AdminProducts;