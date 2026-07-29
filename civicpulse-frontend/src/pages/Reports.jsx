import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Reports() {
    return (
        <>
            <Sidebar />

            <div style={{ marginLeft: "270px", padding: "20px" }}>
                <Header />
            </div>

            <div style={container}>
                <h1>📊 Reports Dashboard</h1>

                <div style={cards}>
                    <div style={card}>
                        <h2>45</h2>
                        <p>Total Complaints</p>
                    </div>

                    <div style={card}>
                        <h2>18</h2>
                        <p>Pending</p>
                    </div>

                    <div style={card}>
                        <h2>20</h2>
                        <p>Resolved</p>
                    </div>

                    <div style={card}>
                        <h2>7</h2>
                        <p>In Progress</p>
                    </div>
                </div>
            </div>
        </>
    );
}

const container = {
    marginLeft: "270px",
    padding: "40px",
    background: "#F4F6F9",
    minHeight: "100vh",
};

const cards = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginTop: "30px",
};

const card = {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,.1)",
};

export default Reports;
