import ProductCard from "./productCard";

function ProductList({ products, addToCart }) {
  if (products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          addToCart={addToCart}
        />
      ))}
    </div>
  );
}

export default ProductList;