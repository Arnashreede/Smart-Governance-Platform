import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { citizenLogin } from "../services/citizenAuthService";
import api from "../api/axios";

function CitizenLogin() {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    if (!login.email || !login.password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // ==============================
      // LOGIN
      // ==============================

      const data = await citizenLogin(
    login.email,
    login.password
);

      console.log(
        "========== LOGIN RESPONSE =========="
      );
      console.log(data);

      // ==============================
      // STORE LOGIN INFORMATION
      // ==============================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      // This is the USER-SERVICE ID.
      // Do NOT use this as citizenId.
      localStorage.setItem(
        "userId",
        data.id
      );

      localStorage.setItem(
        "email",
        data.email || login.email
      );

      localStorage.setItem(
        "fullName",
        data.fullName || ""
      );

      // ==============================
      // CITIZEN LOGIN
      // ==============================

      if (data.role === "CITIZEN") {
        try {
          console.log(
            "Loading citizens to find actual citizen record..."
          );

          const response = await api.get(
            "/citizens"
          );

          const citizens =
            response.data || [];

          console.log(
            "CITIZENS FROM DATABASE:",
            citizens
          );

          // Find citizen using email
          const citizen =
            citizens.find(
              (item) =>
                String(item.email)
                  .toLowerCase()
                  .trim() ===
                String(
                  data.email || login.email
                )
                  .toLowerCase()
                  .trim()
            );

          if (!citizen) {
            console.error(
              "Citizen record not found for email:",
              data.email || login.email
            );

            alert(
              "Login successful, but your citizen profile could not be found."
            );

            return;
          }

          console.log(
            "========== ACTUAL CITIZEN =========="
          );
          console.log(citizen);

          // ==============================
          // IMPORTANT
          // ==============================

          // This is the REAL citizen-service ID.
          localStorage.setItem(
            "citizenId",
            citizen.id
          );

          // Use the citizen database name
          // if available.
          if (citizen.fullName) {
            localStorage.setItem(
              "fullName",
              citizen.fullName
            );
          }

          console.log(
            "USER ID:",
            data.id
          );

          console.log(
            "CITIZEN ID:",
            citizen.id
          );

          console.log(
            "CITIZEN NAME:",
            citizen.fullName
          );

          navigate(
            "/citizen-dashboard"
          );
        } catch (citizenError) {
          console.error(
            "Failed to load citizen records:",
            citizenError
          );

          alert(
            citizenError.response?.data?.message ||
              "Login successful, but citizen profile could not be loaded."
          );
        }
      } else {
        alert(
          "Please login through the Citizen Portal."
        );
      }
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={leftPanel}>
        <h1>👤 Citizen Portal</h1>

        <h2>
          Smart Goverance Platform
        </h2>

        <p>
          Register complaints, track complaint
          status, and stay updated on issue
          resolution.
        </p>
      </div>

      <div style={rightPanel}>
        <div style={card}>
          <h2>Citizen Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={login.email}
            onChange={handleChange}
            style={input}
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={login.password}
            onChange={handleChange}
            style={input}
            disabled={loading}
          />

          <button
            style={{
              ...button,
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            New Citizen?{" "}
            <Link to="/citizen/register">
              Register Here
            </Link>
          </p>

          <Link
            to="/"
            style={backLink}
          >
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
  background:
    "linear-gradient(135deg,#2E7D32,#66BB6A)",
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
  boxShadow:
    "0 10px 25px rgba(0,0,0,.15)",
};

const input = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: "14px",
  marginTop: "25px",
  background: "#2E7D32",
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
  color: "#2E7D32",
};

export default CitizenLogin;