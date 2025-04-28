import React, { useState } from 'react';
import './Login.css';
import man from '../assets/6.png';
import logo from '../assets/OQ.png';
import { login } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(credentials.email, credentials.password);
    if (result.success) {
      navigate('/'); // Navigates to homepage
    } else {
      setError("Wrong Credentials. Try again!!!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="Oqulix Logo" className="login-logo" />
        <h2>XRPhysio</h2>
        <p>Revolutionizing physiotherapy through immersive VR experiences</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* ✅ Assign handleLogin to form's onSubmit */}
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          {/* ✅ Button type="submit" */}
          <button type="submit" className="app-btn">
            Login
          </button>
        </form>
      </div>

      <div className="login-right">
        <img src={man} alt="Physio VR Illustration" className="login-man-img" />
      </div>
    </div>
  );
};

export default Login;
