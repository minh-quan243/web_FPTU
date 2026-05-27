import { useState } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );

      localStorage.setItem(
        "role",
        data.user.role
      );

      // REDIRECT
      navigate('/');

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Welcome Back 👋</h1>

        <p className="subtitle">
          Login to continue shopping
        </p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

        <p className="register-text">
          Don’t have an account?
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;