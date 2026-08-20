import { useEffect, useMemo, useState } from "react";

import {
  getAllGrievances,
  getCitizenGrievances,
} from "../services/grievanceService";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import GrievanceTable from "../components/GrievanceTable";

function ViewGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  const loadGrievances = async () => {
    try {
      setLoading(true);

      let data = [];

      if (role === "ADMIN") {
        data = await getAllGrievances();
      } else if (role === "OFFICER") {
        // Officers can currently view all grievances.
        // Assignment permissions remain available to them.
        data = await getAllGrievances();
      } else if (role === "CITIZEN") {
        const citizenId = localStorage.getItem("userId");

        if (!citizenId) {
          console.error("Citizen ID not found in localStorage.");
          setGrievances([]);
          return;
        }

        data = await getCitizenGrievances(citizenId);
      }

      if (!Array.isArray(data)) {
        data = [];
      }

      setGrievances(data);
    } catch (error) {
      console.error("Failed to load grievances:", error);
      setGrievances([]);
      alert("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  /*
   * Complaint ordering:
   *
   * 1. Unresolved + unassigned
   * 2. Unresolved + assigned
   * 3. Resolved / Closed
   *
   * Inside each group:
   * oldest complaint first.
   *
   * No complaint data is hardcoded here.
   */
  const sortedGrievances = useMemo(() => {
    const getStatus = (grievance) =>
      String(grievance?.status || "").toUpperCase();

    const isFinished = (grievance) => {
      const status = getStatus(grievance);

      return (
        status === "RESOLVED" ||
        status === "CLOSED" ||
        status === "COMPLETED"
      );
    };

    const hasOfficer = (grievance) => {
      const officer =
        grievance?.assignedOfficer ??
        grievance?.assignedOfficerName ??
        grievance?.officerName;

      return (
        officer !== null &&
        officer !== undefined &&
        String(officer).trim() !== ""
      );
    };

    const getDate = (grievance) => {
      const value =
        grievance?.createdAt ??
        grievance?.submittedAt ??
        grievance?.createdDate ??
        grievance?.date;

      if (!value) {
        return Number.MAX_SAFE_INTEGER;
      }

      const timestamp = new Date(value).getTime();

      return Number.isNaN(timestamp)
        ? Number.MAX_SAFE_INTEGER
        : timestamp;
    };

    return [...grievances].sort((a, b) => {
      const aFinished = isFinished(a);
      const bFinished = isFinished(b);

      const aAssigned = hasOfficer(a);
      const bAssigned = hasOfficer(b);

      /*
       * Group priority:
       *
       * 0 = unresolved + unassigned
       * 1 = unresolved + assigned
       * 2 = resolved / closed
       */
      const aGroup = aFinished ? 2 : aAssigned ? 1 : 0;
      const bGroup = bFinished ? 2 : bAssigned ? 1 : 0;

      if (aGroup !== bGroup) {
        return aGroup - bGroup;
      }

      // Oldest first inside the same group.
      return getDate(a) - getDate(b);
    });
  }, [grievances]);

  return (
    <>
      <Sidebar />

      <div style={container}>
  <Header />

  <div style={pageHeader}>
    <div>
      <h1 style={title}>📋 My Complaints</h1>

      <p style={subtitle}>
        View your complaints, their current status, and the officer
        handling each complaint.
      </p>
    </div>
  </div>

  {role === "CITIZEN" && (
    <div style={infoBox}>
      <strong>Complaint Status</strong>

      <div style={{ marginTop: "5px" }}>
        Track the progress of your submitted complaints and see the
        department and officer currently handling each request.
      </div>
    </div>
  )}

  <div style={tableCard}>
    {loading ? (
      <div style={loadingBox}>
        <div style={spinner}></div>
        <p>Loading complaints...</p>
      </div>
    ) : (
      <GrievanceTable
        grievances={sortedGrievances}
        onRefresh={loadGrievances}
      />
    )}
  </div>
</div>
    </>
  );
}

/* =========================
   PAGE STYLES
========================= */

const container = {
  marginLeft: "270px",
  padding: "30px",
  background: "#F4F6F9",
  minHeight: "100vh",
  boxSizing: "border-box",
};

const pageHeader = {
  marginTop: "30px",
  marginBottom: "20px",
};

const title = {
  margin: 0,
  fontSize: "34px",
  fontWeight: 800,
  color: "#102A43",
};

const subtitle = {
  marginTop: "8px",
  marginBottom: 0,
  color: "#667085",
  fontSize: "16px",
};

const infoBox = {
  background: "#EAF3FF",
  border: "1px solid #C7DFFF",
  borderRadius: "12px",
  padding: "16px 20px",
  marginBottom: "20px",
  color: "#1557A6",
  fontSize: "15px",
  lineHeight: 1.5,
};

const tableCard = {
  background: "#FFFFFF",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 5px 18px rgba(0, 0, 0, 0.08)",
};

const loadingBox = {
  height: "450px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#667085",
};

const spinner = {
  width: "35px",
  height: "35px",
  border: "4px solid #E5E7EB",
  borderTop: "4px solid #1976D2",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

export default ViewGrievances;