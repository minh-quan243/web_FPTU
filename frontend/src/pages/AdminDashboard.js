import { useEffect, useState } from 'react';

import axios from '../utils/axiosInstance';

import './AdminDashboard.css';

function AdminDashboard() {

  const [stats, setStats] = useState({

    totalUsers: 0,

    totalProducts: 0,

    totalOrders: 0,

    totalRevenue: 0,

    latestOrders: []

  });

  const [loading, setLoading] = useState(true);

  // LOAD DASHBOARD
  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const res =
          await axios.get('/admin/dashboard');

        setStats(res.data);

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }
    };

    fetchDashboard();

  }, []);

  if (loading) {

    return (

      <div className="admin-dashboard">

        <h1>Loading Dashboard...</h1>

      </div>
    );
  }

  return (

    <div className="admin-dashboard">

      <h1>Admin Dashboard</h1>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">

          <h2>Total Users</h2>

          <p>{stats.totalUsers}</p>

        </div>

        <div className="stat-card">

          <h2>Total Products</h2>

          <p>{stats.totalProducts}</p>

        </div>

        <div className="stat-card">

          <h2>Total Orders</h2>

          <p>{stats.totalOrders}</p>

        </div>

        <div className="stat-card">

          <h2>Total Revenue</h2>

          <p>${stats.totalRevenue}</p>

        </div>

      </div>

      {/* LATEST ORDERS */}

      <div className="latest-orders">

        <h2>Latest Orders</h2>

        {stats.latestOrders.length === 0 ? (

          <p>No orders yet</p>

        ) : (

          stats.latestOrders.map((order) => (

            <div
              key={order._id}
              className="order-card"
            >

              <div className="order-top">

                <h3>

                  Order #{order._id.slice(-6)}

                </h3>

                <span>

                  ${order.totalPrice}

                </span>

              </div>

              <p>

                <strong>User:</strong>

                {' '}

                {order.user?.name}

              </p>

              <p>

                <strong>Email:</strong>

                {' '}

                {order.user?.email}

              </p>

              <p>

                <strong>Paid:</strong>

                {' '}

                {order.isPaid
                  ? 'Yes'
                  : 'No'}

              </p>

              <p>

                <strong>Delivered:</strong>

                {' '}

                {order.isDelivered
                  ? 'Yes'
                  : 'No'}

              </p>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;