import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../services/adminAuthService";

function AdminLogin() {

  const navigate = useNavigate();

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {

    try {

      const data = await adminLogin(
        login.username,
        login.password
      );

localStorage.setItem("token", data.token);
localStorage.setItem("role", data.role);
localStorage.setItem("username", data.username);
localStorage.setItem("userId", data.id);
      if (data.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        alert("Please use the correct portal.");
      }

    } catch {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div style={page}>

      <div style={leftPanel}>
        <h1>🏛 Smart Goverance Platform</h1>
        <h2>Government Administration Portal</h2>

        <p>
          Manage citizens, officers, complaints,
          assignments and reports from one place.
        </p>
      </div>

      <div style={rightPanel}>

        <div style={card}>

          <h2>Government Login</h2>

          <input
            name="username"
            placeholder="Username"
            value={login.username}
            onChange={handleChange}
            style={input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={login.password}
            onChange={handleChange}
            style={input}
          />

          <button
            style={button}
            onClick={handleLogin}
          >
            Login
          </button>

          <Link to="/" style={backLink}>
            ← Back to Home
          </Link>

        </div>

      </div>

    </div>
  );
}

const page = {
  display: "flex",
  minHeight: "100vh",
};

const leftPanel = {
  flex: 1,
  background: "linear-gradient(135deg,#0D47A1,#42A5F5)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "60px",
};

const rightPanel = {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#F5F7FA",
};

const card = {
  width: "420px",
  background: "white",
  padding: "40px",
  borderRadius: "15px",
  boxShadow: "0 10px 25px rgba(0,0,0,.15)",
};

const input = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const button = {
  width: "100%",
  padding: "14px",
  marginTop: "25px",
  background: "#1565C0",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

const backLink = {
  display: "block",
  marginTop: "20px",
  textAlign: "center",
  textDecoration: "none",
  color: "#1565C0",
};

export default AdminLogin;