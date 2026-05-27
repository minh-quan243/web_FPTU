import './Cart.css';

import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

function Cart() {

  const [cartItems, setCartItems] = useState([]);

  // =========================
  // LOAD CART
  // =========================
  useEffect(() => {

    const cart =
      JSON.parse(
        localStorage.getItem('cart')
      ) || [];

    setCartItems(cart);

  }, []);

  // =========================
  // SAVE CART
  // =========================
  const updateCart = (updatedCart) => {

    setCartItems(updatedCart);

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedCart)
    );
  };

  // =========================
  // INCREASE QUANTITY
  // =========================
  const increaseQuantity = (id) => {

    const updatedCart =
      cartItems.map(item =>

        item._id === id

          ? {
              ...item,
              quantity:
                item.quantity + 1
            }

          : item
      );

    updateCart(updatedCart);
  };

  // =========================
  // DECREASE QUANTITY
  // =========================
  const decreaseQuantity = (id) => {

    const updatedCart =
      cartItems.map(item =>

        item._id === id

          ? {
              ...item,
              quantity:
                item.quantity - 1
            }

          : item
      )

      // REMOVE IF 0
      .filter(item =>
        item.quantity > 0
      );

    updateCart(updatedCart);
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = (id) => {

    const updatedCart =
      cartItems.filter(
        item => item._id !== id
      );

    updateCart(updatedCart);
  };

  // =========================
  // CLEAR CART
  // =========================
  const clearCart = () => {

    updateCart([]);
  };

  // =========================
  // TOTAL PRICE
  // =========================
  const totalPrice =
    cartItems.reduce(

      (total, item) =>

        total +
        item.price * item.quantity,

      0
    );

  // =========================
  // EMPTY CART
  // =========================
  if (cartItems.length === 0) {

    return (

      <div className="cart-page">

        <h1 className="cart-title">
          🛒 Your Cart
        </h1>

        <h2 className="empty-cart">
          Your cart is empty
        </h2>

      </div>
    );
  }

  return (

    <div className="cart-page">

      <h1 className="cart-title">
        🛒 Your Cart
      </h1>

      <div className="cart-container">

        {cartItems.map(item => (

          <div
            className="cart-card"
            key={item._id}
          >

            <img
              className="cart-image"
              src={
                item.image ||
                'https://via.placeholder.com/150'
              }
              alt={item.name}
            />

            <div className="cart-info">

              <h2>
                {item.name}
              </h2>

              <p className="cart-price">
                ${item.price}
              </p>

              <p className="cart-stock">
                Stock: {item.stock}
              </p>

              <div className="quantity-controls">

                <button
                  onClick={() =>
                    decreaseQuantity(item._id)
                  }
                >
                  -
                </button>

                <span>
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    increaseQuantity(item._id)
                  }
                >
                  +
                </button>

              </div>

              <h3 className="subtotal">

                Subtotal:
                $
                {(
                  item.price *
                  item.quantity
                ).toFixed(2)}

              </h3>

              <button
                className="remove-btn"
                onClick={() =>
                  removeItem(item._id)
                }
              >

                Remove

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* SUMMARY */}
      <div className="cart-summary">

        <h2>

          Total:
          ${totalPrice.toFixed(2)}

        </h2>

        <div className="cart-buttons">

          <button
            className="clear-btn"
            onClick={clearCart}
          >

            Clear Cart

          </button>

          <Link to="/checkout">

            <button
              className="checkout-btn"
            >

              Proceed To Checkout

            </button>

          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;