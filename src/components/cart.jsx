import { Link } from "react-router-dom";

function Cart({
  cart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <h1>Your Cart</h1>

        <p>Your cart is empty.</p>

        <Link to="/">
          <button>Continue Shopping</button>
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Cart</h1>

      {cart.map((item) => (
        <div className="cart-item" key={item._id}>
          <img
            src={item.image}
            alt={item.name}
          />

          <div>
            <h2>{item.name}</h2>

            <p>${item.price}</p>

            <div className="quantity">
              <button
                onClick={() => decreaseQuantity(item._id)}
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => increaseQuantity(item._id)}
              >
                +
              </button>
            </div>

            <button
              className="remove-button"
              onClick={() => removeFromCart(item._id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <h2>Total: ${total.toFixed(2)}</h2>

      <Link to="/">
        <button>Continue Shopping</button>
      </Link>
    </main>
  );
}

export default Cart;