import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DashboardCharts({ grievances = [] }) {

  const categoryData = {};

  grievances.forEach((g) => {
    categoryData[g.category] = (categoryData[g.category] || 0) + 1;
  });

  const categoryChart = Object.keys(categoryData).map((key) => ({
    category: key,
    count: categoryData[key],
  }));

  const statusData = [
    {
      name: "Pending",
      value: grievances.filter(g => g.status === "PENDING").length,
    },
    {
      name: "In Progress",
      value: grievances.filter(g => g.status === "IN_PROGRESS").length,
    },
    {
      name: "Closed",
      value: grievances.filter(g => g.status === "CLOSED").length,
    },
  ];

  const colors = [
    "#EF5350",
    "#FFB300",
    "#66BB6A",
  ];

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "25px",
        marginTop: "40px",
      }}
    >

      <div
        style={{
          background: "white",
          borderRadius: "15px",
          padding: "20px",
        }}
      >

        <h3>Complaints by Category</h3>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={categoryChart}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="category" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="count" fill="#1976D2" />

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div
        style={{
          background: "white",
          borderRadius: "15px",
          padding: "20px",
        }}
      >

        <h3>Complaint Status</h3>

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={statusData}
              dataKey="value"
              outerRadius={110}
              label
            >

              {statusData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={colors[index]}
                />
              ))}

            </Pie>

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );
}

export default DashboardCharts;