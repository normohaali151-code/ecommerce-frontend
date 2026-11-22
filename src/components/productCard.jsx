import { Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <img 
  src={
    product.image?.startsWith("http") 
      ? product.image 
      : `https://ecommerce-project-lk0j.onrender.com/uploads/${product.image}`
  } 
  alt={product.name} 
/> 


      <h2>{product.name}</h2>

      <p>{product.description}</p>

      <h3>${product.price}</h3>

      <p>Category: {product.category}</p>

      <p>Stock: {product.stock}</p>

      <div className="product-buttons">
        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>

        <Link to={`/products/${product._id}`}>
          <button className="details-button">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;