import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setLoading(true);
    setError("");

    api
      .get("/api/profile")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setError("Session expired. Please log in again.");
        } else if (err.message === "Network Error") {
          setError("Network error, please try again");
        } else {
          setError("Failed to load profile");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  function handleLogout() {
    api
      .post("/api/logout")
      .catch(() => {})
      .finally(() => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      });
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <div className="title">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card">
          <div className="title">Dashboard</div>
          <div className="error">{error}</div>
          <button className="button" onClick={handleLogout}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <div className="header">
          <h1 className="title">Dashboard</h1>
          <button className="button secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {data && (
          <div className="content">
            <p className="text">
              <strong>Username:</strong> {data.username}
            </p>
            <p className="text">
              <strong>Message:</strong> {data.message}
            </p>
            <p className="text">
              <strong>Login time:</strong>{" "}
              {new Date(data.loginAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

