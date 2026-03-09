import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    api
      .post("/api/login", { username, password })
      .then((res) => {
        if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);
          navigate("/dashboard", { replace: true });
        } else {
          setError("Unexpected response from server");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setError("Invalid username or password");
        } else if (err.message === "Network Error") {
          setError("Network error, please try again");
        } else {
          setError("Something went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label className="label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Enter username"
            />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter password"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="hint">
          <span>admin / admin123</span>
        </div>
      </div>
    </div>
  );
}

export default Login;

