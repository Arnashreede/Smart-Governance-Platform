import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";

import AssignOfficerDialog from "./AssignOfficerDialog";

function GrievanceTable({
  grievances = [],
  onRefresh,
}) {
  const [selectedGrievance, setSelectedGrievance] =
    useState(null);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const role = localStorage.getItem("role");

  const isCitizen = role === "CITIZEN";

  /*
   * ==========================================================
   * PREPARE ROWS
   * ==========================================================
   */

  const rows = useMemo(() => {
    const safeRows = grievances.map(
      (grievance, index) => ({
        ...grievance,

        id:
          grievance.id ??
          grievance.grievanceId ??
          `grievance-${index}`,
      })
    );

    const getStatusRank = (status) => {
      const value = String(
        status || ""
      ).toUpperCase();

      /*
       * Old unresolved complaints first.
       */
      if (
        value === "RESOLVED" ||
        value === "CLOSED" ||
        value === "COMPLETED"
      ) {
        return 2;
      }

      if (
        value === "ASSIGNED" ||
        value === "IN_PROGRESS" ||
        value === "ESCALATED"
      ) {
        return 1;
      }

      return 0;
    };

    const getDate = (row) => {
      const value =
        row.createdAt ??
        row.submittedAt ??
        row.createdDate ??
        row.date;

      if (!value) {
        return Number.MAX_SAFE_INTEGER;
      }

      const timestamp = new Date(value).getTime();

      if (Number.isNaN(timestamp)) {
        return Number.MAX_SAFE_INTEGER;
      }

      return timestamp;
    };

    return [...safeRows].sort((a, b) => {
      const statusDifference =
        getStatusRank(a.status) -
        getStatusRank(b.status);

      if (statusDifference !== 0) {
        return statusDifference;
      }

      return getDate(a) - getDate(b);
    });
  }, [grievances]);

  /*
   * ==========================================================
   * PAGINATION
   * ==========================================================
   */

  const visibleRows = useMemo(() => {
    const start = page * rowsPerPage;

    return rows.slice(
      start,
      start + rowsPerPage
    );
  }, [rows, page, rowsPerPage]);

  /*
   * ==========================================================
   * DATE
   * ==========================================================
   */

  const formatDate = (value) => {
    if (!value) {
      return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleString();
  };

  /*
   * ==========================================================
   * OFFICER
   * ==========================================================
   */

  const getOfficerName = (row) => {
    const officer =
      row.assignedOfficer ??
      row.assignedOfficerName ??
      row.officerName;

    if (
      officer === null ||
      officer === undefined ||
      String(officer).trim() === ""
    ) {
      return null;
    }

    if (typeof officer === "object") {
      return (
        officer.name ??
        officer.fullName ??
        officer.username ??
        officer.email ??
        null
      );
    }

    return String(officer);
  };

  /*
   * ==========================================================
   * PRIORITY
   * ==========================================================
   */

  const priorityStyle = (priority) => {
    const value = String(
      priority || ""
    ).toUpperCase();

    if (value === "HIGH") {
      return {
        background: "#FEE2E2",
        color: "#B91C1C",
        border: "#FCA5A5",
      };
    }

    if (value === "MEDIUM") {
      return {
        background: "#FFF4E5",
        color: "#C2410C",
        border: "#FDBA74",
      };
    }

    if (value === "LOW") {
      return {
        background: "#E8F5E9",
        color: "#15803D",
        border: "#86EFAC",
      };
    }

    return {
      background: "#F3F4F6",
      color: "#374151",
      border: "#D1D5DB",
    };
  };

  /*
   * ==========================================================
   * STATUS
   * ==========================================================
   */

  const statusStyle = (status) => {
    const value = String(
      status || ""
    ).toUpperCase();

    if (value === "OPEN") {
      return {
        background: "#E3F2FD",
        color: "#1565C0",
        border: "#90CAF9",
      };
    }

    if (value === "IN_PROGRESS") {
      return {
        background: "#FFF3E0",
        color: "#E65100",
        border: "#FFCC80",
      };
    }

    if (value === "ASSIGNED") {
      return {
        background: "#EDE9FE",
        color: "#6D28D9",
        border: "#C4B5FD",
      };
    }

    if (value === "ESCALATED") {
      return {
        background: "#FEE2E2",
        color: "#B91C1C",
        border: "#FCA5A5",
      };
    }

    if (value === "RESOLVED") {
      return {
        background: "#E8F5E9",
        color: "#2E7D32",
        border: "#A5D6A7",
      };
    }

    if (value === "CLOSED") {
      return {
        background: "#F3F4F6",
        color: "#4B5563",
        border: "#D1D5DB",
      };
    }

    return {
      background: "#F3F4F6",
      color: "#374151",
      border: "#D1D5DB",
    };
  };

  /*
   * ==========================================================
   * EMPTY
   * ==========================================================
   */

  if (rows.length === 0) {
    return (
      <Box
        sx={{
          minHeight: 350,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 55,
            mb: 1,
          }}
        >
          📋
        </Typography>

        <Typography
          variant="h6"
          fontWeight={700}
          color="#344054"
        >
          No complaints found
        </Typography>

        <Typography
          sx={{
            mt: 1,
            color: "#667085",
          }}
        >
          Complaint information will appear here
          when available.
        </Typography>
      </Box>
    );
  }

  /*
   * ==========================================================
   * TABLE
   * ==========================================================
   */

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          border: "1px solid #E4E7EC",
          borderRadius: "12px",
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            width: "100%",
            minWidth: isCitizen
              ? "1150px"
              : "1320px",

            tableLayout: "fixed",

            "& th": {
              backgroundColor: "#F8FAFC",
              color: "#344054",
              fontWeight: 800,
              fontSize: "14px",
              borderBottom:
                "1px solid #E4E7EC",
              whiteSpace: "nowrap",
            },

            "& td": {
              borderBottom:
                "1px solid #F0F2F5",
              verticalAlign: "middle",
            },

            "& tbody tr:hover": {
              backgroundColor: "#F8FBFF",
            },
          }}
        >
          <TableHead>
            <TableRow>

              {/* ID */}
              <TableCell
                align="center"
                sx={{ width: 65 }}
              >
                ID
              </TableCell>

              {/* COMPLAINT */}
              <TableCell
                align="left"
                sx={{ width: 210 }}
              >
                Complaint
              </TableCell>

              {/* CATEGORY */}
              <TableCell
                align="left"
                sx={{ width: 165 }}
              >
                Category
              </TableCell>

              {/* PRIORITY */}
              <TableCell
                align="center"
                sx={{ width: 120 }}
              >
                Priority
              </TableCell>

              {/* STATUS */}
              <TableCell
                align="center"
                sx={{ width: 155 }}
              >
                Status
              </TableCell>

              {/* DEPARTMENT */}
              <TableCell
                align="left"
                sx={{ width: 175 }}
              >
                Department
              </TableCell>

              {/* OFFICER */}
              <TableCell
                align="left"
                sx={{ width: 190 }}
              >
                Assigned Officer
              </TableCell>

              {/* DATE */}
              <TableCell
                align="left"
                sx={{ width: 175 }}
              >
                Submitted
              </TableCell>

              {/* ADMIN ACTION */}
              {!isCitizen && (
                <TableCell
                  align="center"
                  sx={{ width: 165 }}
                >
                  Action
                </TableCell>
              )}

            </TableRow>
          </TableHead>

          <TableBody>
            {visibleRows.map((row) => {
              const officer =
                getOfficerName(row);

              const priority =
                priorityStyle(row.priority);

              const status =
                statusStyle(row.status);

              const statusValue =
                String(
                  row.status || ""
                ).toUpperCase();

              const resolved =
                statusValue === "RESOLVED" ||
                statusValue === "CLOSED";

              const submittedDate =
                row.createdAt ??
                row.submittedAt ??
                row.createdDate ??
                row.date;

              return (
                <TableRow
                  key={row.id}
                  hover
                >

                  {/* ID */}
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: "#344054",
                    }}
                  >
                    {row.id}
                  </TableCell>

                  {/* COMPLAINT */}
                  <TableCell
                    align="left"
                    sx={{
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#102A43",
                        whiteSpace:
                          "nowrap",
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                      }}
                      title={
                        row.title || ""
                      }
                    >
                      {row.title ||
                        "Untitled Complaint"}
                    </Typography>
                  </TableCell>

                  {/* CATEGORY */}
                  <TableCell align="left">
                    <Chip
                      label={
                        row.category ||
                        "Not specified"
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        maxWidth:
                          "100%",
                      }}
                    />
                  </TableCell>

                  {/* PRIORITY */}
                  <TableCell align="center">
                    <Chip
                      label={
                        row.priority ||
                        "Not specified"
                      }
                      size="small"
                      icon={
                        String(
                          row.priority ||
                            ""
                        ).toUpperCase() ===
                        "HIGH" ? (
                          <WarningIcon />
                        ) : undefined
                      }
                      sx={{
                        fontWeight: 800,
                        backgroundColor:
                          priority.background,
                        color:
                          priority.color,
                        border:
                          `1px solid ${priority.border}`,

                        "& .MuiChip-icon":
                          {
                            color:
                              priority.color,
                          },
                      }}
                    />
                  </TableCell>

                  {/* STATUS */}
                  <TableCell align="center">
                    <Chip
                      label={String(
                        row.status ||
                          "UNKNOWN"
                      ).replaceAll(
                        "_",
                        " "
                      )}
                      size="small"
                      icon={
                        resolved ? (
                          <CheckCircleIcon />
                        ) : (
                          <AccessTimeIcon />
                        )
                      }
                      sx={{
                        fontWeight: 800,
                        backgroundColor:
                          status.background,
                        color:
                          status.color,
                        border:
                          `1px solid ${status.border}`,

                        "& .MuiChip-icon":
                          {
                            color:
                              status.color,
                          },
                      }}
                    />
                  </TableCell>

                  {/* DEPARTMENT */}
                  <TableCell
                    align="left"
                    sx={{
                      color: "#475467",
                      overflow: "hidden",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        whiteSpace:
                          "nowrap",
                        overflow:
                          "hidden",
                        textOverflow:
                          "ellipsis",
                      }}
                      title={
                        row.department ||
                        ""
                      }
                    >
                      {row.department ||
                        "Not assigned"}
                    </Typography>
                  </TableCell>

                  {/* OFFICER */}
                  <TableCell align="left">
                    {officer ? (
                      <Chip
                        icon={
                          <PersonIcon />
                        }
                        label={officer}
                        size="small"
                        variant="outlined"
                        sx={{
                          color:
                            "#1565C0",
                          borderColor:
                            "#90CAF9",
                          backgroundColor:
                            "#F5FAFF",
                          fontWeight: 600,
                          maxWidth:
                            "100%",

                          "& .MuiChip-label":
                            {
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                            },

                          "& .MuiChip-icon":
                            {
                              color:
                                "#1565C0",
                            },
                        }}
                      />
                    ) : (
                      <Chip
                        label="Not Assigned"
                        size="small"
                        variant="outlined"
                        sx={{
                          color:
                            "#98A2B3",
                          borderColor:
                            "#D0D5DD",
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </TableCell>

                  {/* SUBMITTED */}
                  <TableCell
                    align="left"
                    sx={{
                      color: "#667085",
                      fontSize: 13,
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {formatDate(
                      submittedDate
                    )}
                  </TableCell>

                  {/* ACTION */}
                  {!isCitizen && (
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={
                          <AssignmentIndIcon />
                        }
                        disabled={
                          resolved
                        }
                        onClick={() => {
                          setSelectedGrievance(
                            row
                          );
                          setOpen(true);
                        }}
                        sx={{
                          minWidth: 120,
                          borderRadius: 2,
                          textTransform:
                            "none",
                          fontWeight: 700,
                          backgroundColor:
                            officer
                              ? "#1565C0"
                              : "#1976D2",

                          "&:hover": {
                            backgroundColor:
                              "#0D47A1",
                          },
                        }}
                      >
                        {officer
                          ? "Reassign"
                          : "Assign"}
                      </Button>
                    </TableCell>
                  )}

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, newPage) => {
          setPage(newPage);
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(
            parseInt(
              event.target.value,
              10
            )
          );
          setPage(0);
        }}
        rowsPerPageOptions={[
          5,
          10,
          20,
          50,
        ]}
      />

      {/* ADMIN/OFFICER ASSIGNMENT */}
      {!isCitizen && (
        <AssignOfficerDialog
          open={open}
          grievance={selectedGrievance}
          onClose={() => {
            setOpen(false);
            setSelectedGrievance(null);

            if (onRefresh) {
              onRefresh();
            }
          }}
        />
      )}
    </>
  );
}

export default GrievanceTable;