import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (
    <div style={page}>

      {/* Hero Section */}
      <div style={hero}>

        <h1 style={title}>🏛 Smart Goverance Platform</h1>

        <h2 style={subtitle}>
          Smart Governance & Citizen Services Platform
        </h2>

        <p style={description}>
          A cloud-native platform for complaint registration,
          officer management, complaint tracking and analytics.
        </p>

        <div style={buttons}>

          <button
            style={citizenBtn}
            onClick={() => navigate("/citizen-login")}
          >
            👤 Citizen Portal
          </button>

          <button
            style={officerBtn}
            onClick={() => navigate("/officer-login")}
          >
            👮 Officer Portal
          </button>

          <button
            style={adminBtn}
            onClick={() => navigate("/admin-login")}
          >
            🏛 Government Portal
          </button>

        </div>

      </div>

      {/* Features */}

      <div style={featureSection}>

        <h2>Platform Features</h2>

        <div style={features}>

          <div style={card}>
            <h1>📋</h1>
            <h3>Complaint Registration</h3>
            <p>Citizens can register complaints online.</p>
          </div>

          <div style={card}>
            <h1>📍</h1>
            <h3>Track Complaints</h3>
            <p>Real-time complaint status tracking.</p>
          </div>

          <div style={card}>
            <h1>👮</h1>
            <h3>Officer Assignment</h3>
            <p>Government assigns officers instantly.</p>
          </div>

          <div style={card}>
            <h1>📊</h1>
            <h3>Analytics Dashboard</h3>
            <p>Monitor complaints and reports visually.</p>
          </div>

        </div>

      </div>

      {/* Footer */}

      <footer style={footer}>
        © 2026 Smart Goverance Platform for Administrative Operations with Citizen Assistance Group2 | Smart Governance Platform
      </footer>

    </div>
  );
}

const page = {
  background: "#F5F7FA",
  minHeight: "100vh",
};

const hero = {
  background: "linear-gradient(135deg,#1565C0,#42A5F5)",
  color: "white",
  textAlign: "center",
  padding: "80px 20px",
};

const title = {
  fontSize: "52px",
};

const subtitle = {
  marginTop: "15px",
};

const description = {
  maxWidth: "700px",
  margin: "20px auto",
  fontSize: "18px",
};

const buttons = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  flexWrap: "wrap",
  marginTop: "40px",
};

const citizenBtn = {
  background: "#4CAF50",
  color: "white",
  border: "none",
  padding: "15px 30px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

const officerBtn = {
  background: "#FB8C00",
  color: "white",
  border: "none",
  padding: "15px 30px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

const adminBtn = {
  background: "#E53935",
  color: "white",
  border: "none",
  padding: "15px 30px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

const featureSection = {
  padding: "60px 30px",
  textAlign: "center",
};

const features = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: "25px",
  marginTop: "40px",
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0 5px 15px rgba(0,0,0,.1)",
};

const footer = {
  background: "#0D47A1",
  color: "white",
  textAlign: "center",
  padding: "20px",
  marginTop: "50px",
};

export default Home;