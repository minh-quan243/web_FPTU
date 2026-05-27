import './AdminOrders.css';

import { useEffect, useState } from 'react';

function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // FETCH ALL ORDERS
  const fetchOrders = async () => {

    try {

      const token =
        localStorage.getItem('token');

      const response = await fetch(
        'http://localhost:5000/orders',
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();
      
      console.log(data);

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

  useEffect(() => {

    fetchOrders();

  }, []);

  // MARK DELIVERED
  const markDelivered = async (id) => {

    try {

      const token =
        localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:5000/orders/${id}/deliver`,
        {
          method: 'PUT',

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {

        alert('✅ Order delivered');

        fetchOrders();

      } else {

        alert(
          data.message ||
          'Failed to update order'
        );

      }

    } catch (error) {

      alert('Server error');

    }

  };

  // LOADING
  if (loading) {

    return (

      <div className="adminorders-page">

        <h1>Loading orders...</h1>

      </div>
    );
  }

  // ERROR
  if (error) {

    return (

      <div className="adminorders-page">

        <h1>{error}</h1>

      </div>
    );
  }

  return (

    <div className="adminorders-page">

      <h1 className="adminorders-title">

        🛒 Admin Orders

      </h1>

      {orders.length === 0 ? (

        <p className="no-orders">

          No orders found

        </p>

      ) : (

        orders.map((order) => (

          <div
            className="admin-order-card"
            key={order._id}
          >

            {/* HEADER */}
            <div className="admin-order-header">

              <div>

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

              <div>

                <p>
                  👤
                  {' '}
                  {order.user?.name}
                </p>

                <p>
                  📧
                  {' '}
                  {order.user?.email}
                </p>

              </div>

            </div>

            {/* SHIPPING */}
            <div className="shipping-box">

              <h4>
                Shipping Info
              </h4>

              <p>
                Name:
                {' '}
                {order.shippingInfo.fullName}
              </p>

              <p>
                Address:
                {' '}
                {order.shippingInfo.address}
              </p>

              <p>
                City:
                {' '}
                {order.shippingInfo.city}
              </p>

              <p>
                Phone:
                {' '}
                {order.shippingInfo.phone}
              </p>

            </div>

            {/* STATUS */}
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

            {/* PRODUCTS */}
            <div className="admin-order-items">

              {order.orderItems.map(
                (item, index) => (

                  <div
                    className="admin-order-item"
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

            {/* TOTAL */}
            <h2 className="admin-order-total">

              Total:
              {' '}
              $
              {order.totalPrice.toFixed(2)}

            </h2>

            {/* BUTTON */}
            {!order.isDelivered && (

              <button
                className="deliver-btn"
                onClick={() =>
                  markDelivered(order._id)
                }
              >

                Mark As Delivered

              </button>

            )}

          </div>

        ))

      )}

    </div>
  );
}

export default AdminOrders;