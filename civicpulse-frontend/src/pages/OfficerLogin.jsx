import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../services/adminAuthService";

function OfficerLogin() {

  const navigate = useNavigate();

  const [login, setLogin] = useState({
    email: "",
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
        login.email,
        login.password
      );

      console.log(data);

      // Save Login Details
      localStorage.setItem("token", data.token);
localStorage.setItem("role", data.role);
localStorage.setItem("userId", data.id);
localStorage.setItem("email", data.email);
localStorage.setItem("fullName", data.fullName);

localStorage.setItem(
  "employeeId",
  data.employeeId || data.id
);

localStorage.setItem(
  "departmentId",
  data.departmentId || ""
);

localStorage.setItem(
  "departmentName",
  data.departmentName || ""
);

      if (data.role === "OFFICER") {
        navigate("/officer-dashboard");
      } else {
        alert("Please login through the Officer Portal.");
      }

    } catch (error) {

      console.error(error);

      if (error.response) {
        alert(error.response.data?.message || "Invalid Email or Password");
      } else {
        alert("Unable to connect to server.");
      }

    }

  };

  return (

    <div style={page}>

      <div style={leftPanel}>

        <h1>👮 Officer Portal</h1>

        <h2>Smart Goverance Platform</h2>

        <p>
          View assigned complaints, update complaint status,
          and manage citizen grievances efficiently.
        </p>

      </div>

      <div style={rightPanel}>

        <div style={card}>

          <h2>Officer Login</h2>

          <input
            name="email"
            placeholder="Official Email"
            value={login.email}
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

          <Link
            to="/officer-register"
            style={{
              display: "block",
              marginTop: "15px",
              textAlign: "center",
              textDecoration: "none",
              color: "#1976D2",
              fontWeight: "bold",
            }}
          >
            Register as Officer
          </Link>

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
  background: "linear-gradient(135deg,#EF6C00,#FFB74D)",
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
  background: "#EF6C00",
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
  color: "#EF6C00",
};

export default OfficerLogin;