import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { registerOfficer } from "../services/officerService";
import { getDepartments } from "../services/departmentService";

function OfficerRegistration() {

    const [departments, setDepartments] = useState([]);

    const [officer, setOfficer] = useState({
        fullName: "",
        email: "",
        phone: "",
        departmentId: "",
        designation: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await getDepartments();

            // If your service already returns response.data
            setDepartments(response);

            // If it returns Axios response instead, use:
            // setDepartments(response.data);

        } catch (error) {
            console.error(error);
            alert("Failed to load departments");
        }
    };

    const handleChange = (e) => {
        setOfficer({
            ...officer,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {

        if (officer.password !== officer.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
const selectedDepartment = departments.find(
    d => d.id === Number(officer.departmentId)
);

const response = await registerOfficer({
    fullName: officer.fullName,
    email: officer.email,
    phone: officer.phone,
    designation: officer.designation,
    department: selectedDepartment?.name,
    departmentId: selectedDepartment?.id,
    role: "OFFICER",
    password: officer.password
});
            alert(
                "Officer Registered Successfully!\n\nOfficer ID : "
                + (response.officerId || response.id)
            );

            setOfficer({
                fullName: "",
                email: "",
                phone: "",
                departmentId: "",
                designation: "",
                password: "",
                confirmPassword: ""
            });

        } catch (error) {

            console.error(error);

            if (error.response) {
                alert(error.response.data.message || "Registration Failed");
            } else {
                alert("Registration Failed");
            }

        }
    };

    return (
        <>
            <Navbar />

            <div style={containerStyle}>

                <h2 style={{ textAlign: "center" }}>
                    Officer Registration
                </h2>

                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={officer.fullName}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Official Email"
                    value={officer.email}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={officer.phone}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <select
                    name="departmentId"
                    value={officer.departmentId}
                    onChange={handleChange}
                    style={inputStyle}
                >
                    <option value="">Select Department</option>

                    {departments.map((department) => (
                        <option
                            key={department.id}
                            value={department.id}
                        >
                            {department.name}
                        </option>
                    ))}

                </select>

                <select
                    name="designation"
                    value={officer.designation}
                    onChange={handleChange}
                    style={inputStyle}
                >
                    <option value="">Select Designation</option>
                    <option value="Department Manager">
                        Department Manager
                    </option>
                    <option value="Senior Officer">
                        Senior Officer
                    </option>
                    <option value="Officer">
                        Officer
                    </option>
                    <option value="Junior Officer">
                        Junior Officer
                    </option>
                    <option value="Trainee Officer">
                        Trainee Officer
                    </option>
                </select>

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={officer.password}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={officer.confirmPassword}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <button
                    onClick={handleSubmit}
                    style={buttonStyle}
                >
                    Register Officer
                </button>

            </div>
        </>
    );
}

const containerStyle = {
    maxWidth: "500px",
    margin: "40px auto",
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,.1)"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "15px",
    boxSizing: "border-box"
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#1565C0",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px"
};

export default OfficerRegistration;