import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import AdminSidebar from "../components/sidebar/AdminSidebar";
import Topbar from "../components/navbar/Topbar";

function AdminLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F4F7FC" }}>
      <AdminSidebar />

      <Box sx={{ flex: 1 }}>
        <Topbar />

        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;