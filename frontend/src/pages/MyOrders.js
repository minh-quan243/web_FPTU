import './MyOrders.css';

import { useEffect, useState } from 'react';

function MyOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const token =
          localStorage.getItem('token');

        const response = await fetch(
          'http://localhost:5000/orders/my',
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (response.ok) {

          setOrders(data);

        } else {

          setError(
            data.message ||
            'Failed to fetch orders'
          );

        }

      } catch (error) {

        setError('Server error');

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  // LOADING
  if (loading) {

    return (

      <div className="myorders-page">

        <h1>Loading orders...</h1>

      </div>
    );
  }

  // ERROR
  if (error) {

    return (

      <div className="myorders-page">

        <h1>{error}</h1>

      </div>
    );
  }

  return (

    <div className="myorders-page">

      <h1 className="orders-title">
        📦 My Orders
      </h1>

      {orders.length === 0 ? (

        <p className="no-orders">
          No orders found
        </p>

      ) : (

        orders.map((order) => (

          <div
            className="order-card"
            key={order._id}
          >

            <div className="order-header">

              <h3>
                Order ID:
                {' '}
                {order._id}
              </h3>

              <p>
                Date:
                {' '}
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>

            </div>

            <div className="order-status">

              <p>

                💰 Paid:
                {' '}

                {order.isPaid
                  ? 'Yes'
                  : 'No'}

              </p>

              <p>

                🚚 Delivered:
                {' '}

                {order.isDelivered
                  ? 'Yes'
                  : 'No'}

              </p>

            </div>

            <div className="order-items">

              {order.orderItems.map(
                (item, index) => (

                  <div
                    className="order-item"
                    key={index}
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
                        {item.qty}
                      </p>

                      <p>
                        $
                        {item.price}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

            <h2 className="order-total">

              Total:
              {' '}
              $
              {order.totalPrice.toFixed(2)}

            </h2>

          </div>

        ))

      )}

    </div>
  );
}

export default MyOrders;