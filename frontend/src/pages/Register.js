import { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Register failed");
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <h1>Create Account ✨</h1>

        <p className="subtitle">
          Join MyShop today
        </p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {success && (
          <p className="success-message">
            {success}
          </p>
        )}

        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            {loading ? "Loading..." : "Register"}
          </button>

        </form>

        <p className="login-text">
          Already have an account?
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;