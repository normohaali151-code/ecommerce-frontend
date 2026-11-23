import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function ProductDetails({ addToCart }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/products/${id}`);

        if (!response.ok) {
          throw new Error("Product lama helin");
        }

        const data = await response.json();

        // Waxaan u beddelnay data.product sababtoo ah backend-kaagu sidaas ayuu u soo celiyaa
        setProduct(data.product || data);
        setError("");
      } catch (error) {
        console.log(error);
        setError("Product lama soo qaadi karin");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="message">Loading product...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!product) {
    return <p className="error">Product lama helin.</p>;
  }

  return (
    <main className="details-page">
      <Link to="/" className="back-link">
        ← Back to Products
      </Link>

      <div className="details-card">
        <div className="details-image">
        <img 
  src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`} 
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