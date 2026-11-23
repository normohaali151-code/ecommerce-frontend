import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "https://ecommerce-project-lk0j.onrender.com";

function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("http://")) {
    return image.replace(/^http:\/\//i, "https://");
  }

  if (image.startsWith("https://")) {
    return image;
  }

  return `${API_URL}/uploads/${image}`;
}

function ProductDetails({ addToCart }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Product lama helin"
          );
        }

        const foundProduct = data.product || data;

        if (!foundProduct || !foundProduct._id) {
          throw new Error("Product lama helin");
        }

        setProduct(foundProduct);

      } catch (error) {
        console.error("Product Details Error:", error);
        setError(error.message || "Product lama soo qaadi karin");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <p className="message">
        Loading product...
      </p>
    );
  }

  if (error) {
    return (
      <main className="details-page">
        <Link to="/" className="back-link">
          ← Back to Products
        </Link>
        <p className="error">{error}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <p className="error">
        Product lama helin.
      </p>
    );
  }

  return (
    <main className="details-page">

      <Link to="/" className="back-link">
        ← Back to Products
      </Link>

      <div className="details-card">

        <div className="details-image">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
          />
        </div>

        <div className="details-info">

          <h1>{product.name}</h1>

          <p className="details-description">
            {product.description}
          </p>

          <h2>${product.price}</h2>

          <p>
            <strong>Category:</strong>{" "}
            {product.category}
          </p>

          <p>
            <strong>Stock:</strong>{" "}
            {product.stock}
          </p>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
          >
            {product.stock > 0
              ? "Add to Cart"
              : "Out of Stock"}
          </button>

        </div>
      </div>
    </main>
  );
}

export default ProductDetails;