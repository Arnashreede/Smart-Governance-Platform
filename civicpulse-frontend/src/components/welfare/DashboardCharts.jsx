import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

const applicationData = [
    { month: "Jan", applications: 30 },
    { month: "Feb", applications: 45 },
    { month: "Mar", applications: 52 },
    { month: "Apr", applications: 40 },
    { month: "May", applications: 70 },
    { month: "Jun", applications: 60 }
];

const budgetData = [
    { name: "Utilized", value: 65 },
    { name: "Remaining", value: 35 }
];

const COLORS = ["#1976d2", "#90caf9"];

export default function DashboardCharts() {

    return (

        <Grid container spacing={3} sx={{ mt: 1 }}>

            <Grid item xs={12} md={8}>

                <Card>

                    <CardContent>

                        <Typography variant="h6" gutterBottom>
                            Applications Trend
                        </Typography>

                        <ResponsiveContainer width="100%" height={300}>

                            <BarChart data={applicationData}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="month" />

                                <YAxis />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="applications"
                                    fill="#1976d2"
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} md={4}>

                <Card>

                    <CardContent>

                        <Typography variant="h6" gutterBottom>
                            Budget Utilization
                        </Typography>

                        <ResponsiveContainer width="100%" height={300}>

                            <PieChart>

                                <Pie
                                    data={budgetData}
                                    dataKey="value"
                                    outerRadius={90}
                                    label
                                >

                                    {budgetData.map((entry, index) => (

                                        <Cell
                                            key={index}
                                            fill={COLORS[index]}
                                        />

                                    ))}

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>

    );

}