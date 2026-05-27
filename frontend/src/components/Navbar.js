import './Navbar.css';

import { Link, useNavigate } from 'react-router-dom';

function Navbar() {

  const navigate = useNavigate();

  const role = localStorage.getItem('role');

  const token = localStorage.getItem('token');

  const cart =
    JSON.parse(localStorage.getItem('cart')) || [];

  // CART COUNT
  const cartCount = cart.reduce(
    (total, item) => total + item.qty,
    0
  );

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('refreshToken');

    localStorage.removeItem('role');

    navigate('/login');
  };

  return (

    <nav className="navbar">

      {/* LEFT */}
      <div className="nav-left">

        <Link to="/" className="logo">
          FPTU Shipping
        </Link>

      </div>

      {/* RIGHT */}
      <div className="nav-right">

        {/* CART */}
        <Link to="/cart">
          Cart ({cartCount})
        </Link>

        {/* USER MENU */}
        {token && role === 'user' && (

          <>

            <Link to="/my-orders">
              My Orders
            </Link>

            <Link to="/profile">
              Profile
            </Link>

          </>

        )}

        {/* ADMIN MENU */}
        {token && role === 'admin' && (

          <>

            <Link to="/admin">
              Dashboard
            </Link>

            <Link to="/admin/create-product">
              Add Product
            </Link>

            <Link to="/admin/orders">
              Admin Orders
            </Link>

            <Link to="/profile">
              Profile
            </Link>

          </>

        )}

        {/* GUEST MENU */}
        {!token && (

          <>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

          </>

        )}

        {/* LOGOUT */}
        {token && (

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        )}

      </div>

    </nav>
  );
}

export default Navbar;