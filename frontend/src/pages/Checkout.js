import './Checkout.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [fullName, setFullName] =
    useState('');

  const [address, setAddress] =
    useState('');

  const [city, setCity] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [paymentMethod, setPaymentMethod] =
    useState('Cash On Delivery');

  // LOAD CART
  useEffect(() => {

    const savedCart =
      JSON.parse(
        localStorage.getItem('cart')
      ) || [];

    setCart(savedCart);

  }, []);

  // TOTAL PRICE
  const totalPrice =
    cart.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  // PLACE ORDER
  const handleCheckout = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem('token');

    // CHECK LOGIN
    if (!token) {

      alert('Please login first');

      navigate('/login');

      return;
    }

    // ORDER DATA
    const orderData = {

      orderItems: cart.map((item) => ({

        product: item._id,

        name: item.name,

        image: item.image,

        price: item.price,

        qty: item.quantity,

      })),

      shippingInfo: {

        fullName,

        address,

        city,

        phone,

      },

      paymentMethod,

      totalPrice,

    };

    try {

      const response = await fetch(
        'http://localhost:5000/orders',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert('✅ Order placed successfully');

        // CLEAR CART
        localStorage.removeItem('cart');

        setCart([]);

        // RESET FORM
        setFullName('');
        setAddress('');
        setCity('');
        setPhone('');

        // REDIRECT
        navigate('/');

      } else {

        alert(data.message || 'Order failed');

      }

    } catch (error) {

      console.error(error);

      alert('Server error');

    }

  };

  // EMPTY CART
  if (cart.length === 0) {

    return (

      <div className="checkout-page">

        <h1 className="checkout-title">
          Checkout
        </h1>

        <p className="empty-checkout">
          Your cart is empty 🛒
        </p>

      </div>
    );
  }

  return (

    <div className="checkout-page">

      <h1 className="checkout-title">
        💳 Checkout
      </h1>

      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-form-box">

          <form
            className="checkout-form"
            onSubmit={handleCheckout}
          >

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              required
            />

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            >

              <option>
                Cash On Delivery
              </option>

              <option>
                PayPal
              </option>

              <option>
                Credit Card
              </option>

            </select>

            <button type="submit">
              Place Order
            </button>

          </form>

        </div>

        {/* RIGHT */}
        <div className="checkout-summary">

          <h2>
            Order Summary
          </h2>

          {cart.map(item => (

            <div
              className="summary-item"
              key={item._id}
            >

              <img
                src={item.image}
                alt={item.name}
              />

              <div>

                <h4>
                  {item.name}
                </h4>

                <p>
                  Qty:
                  {' '}
                  {item.quantity}
                </p>

                <p>
                  $
                  {(item.price *
                    item.quantity).toFixed(2)}
                </p>

              </div>

            </div>

          ))}

          <hr />

          <h2 className="total-price">

            Total:
            {' '}
            $
            {totalPrice.toFixed(2)}

          </h2>

        </div>

      </div>

    </div>
  );
}

export default Checkout;