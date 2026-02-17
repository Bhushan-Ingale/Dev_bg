import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuideLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "guide@devguide.com" && password === "guide123") {
      localStorage.setItem("role", "guide");
      navigate("/guide");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Guide Login</h2>

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button className="btn-primary" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default GuideLogin;
