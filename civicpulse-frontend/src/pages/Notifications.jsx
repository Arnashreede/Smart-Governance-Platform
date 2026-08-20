import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Stack,
  InputAdornment,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  getNotifications,
  markAsRead,
} from "../services/notificationService";


// ============================================================
// GET LOGGED-IN USER ROLE
// ============================================================

const getLoggedInUserRole = () => {
  const storedRole =
    localStorage.getItem("role") ||
    localStorage.getItem("userRole") ||
    localStorage.getItem("user_role");

  if (storedRole) {
    return storedRole.toUpperCase();
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return "";
  }

  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return "";
    }

    const decodedPayload = JSON.parse(
      atob(
        payload
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    const role =
      decodedPayload.role ||
      decodedPayload.roles?.[0] ||
      "";

    return role.toString().toUpperCase();

  } catch (error) {
    console.error(
      "Unable to read user role from token:",
      error
    );

    return "";
  }
};


// ============================================================
// GET LOGGED-IN CITIZEN ID
// ============================================================

const getLoggedInCitizenId = () => {
  return localStorage.getItem("userId");
};


// ============================================================
// NOTIFICATIONS PAGE
// ============================================================

export default function Notifications() {

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("ALL");


  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================

  useEffect(() => {
    loadNotifications();
  }, []);


  const loadNotifications = async () => {

    try {

      setError("");

      setLoading(true);

      const role = getLoggedInUserRole();

      const citizenId = getLoggedInCitizenId();

      console.log(
        "Notification user role:",
        role
      );


      let data;


      // ======================================================
      // ADMIN
      // ======================================================

      if (role === "ADMIN") {

        data = await getNotifications();

      }


      // ======================================================
      // CITIZEN
      // ======================================================

      else if (role === "CITIZEN") {

        if (!citizenId) {

          console.warn(
            "Citizen ID is not available."
          );

          setNotifications([]);

          return;
        }

        data = await getNotifications(
          citizenId
        );

      }


      // ======================================================
      // OTHER ROLES
      // ======================================================

      else {

        data = await getNotifications();

      }


      // ======================================================
      // NORMALIZE API RESPONSE
      // ======================================================

      if (Array.isArray(data)) {

        setNotifications(data);

      } else if (
        data &&
        Array.isArray(data.notifications)
      ) {

        setNotifications(
          data.notifications
        );

      } else {

        console.warn(
          "Unexpected notification response:",
          data
        );

        setNotifications([]);

      }

    } catch (e) {

      console.error(
        "Failed to load notifications:",
        e
      );

      setError(
        "Unable to load notifications. Please try again."
      );

      setNotifications([]);

    } finally {

      setLoading(false);

      setRefreshing(false);

    }
  };


  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {

    setRefreshing(true);

    await loadNotifications();

  };


  // ==========================================================
  // COUNTS
  // ==========================================================

  const total =
    notifications.length;


  const unread =
    notifications.filter(
      (notification) =>
        notification.read === false
    ).length;


  const read =
    notifications.filter(
      (notification) =>
        notification.read === true
    ).length;


  // ==========================================================
  // SEARCH + FILTER + SORT
  // ==========================================================
  //
  // IMPORTANT:
  //
  // Unread notifications are always placed BEFORE read
  // notifications.
  //
  // Within each group, newest notifications appear first.
  //
  // No hardcoded IDs or dates.
  //
  // ==========================================================

  const filteredNotifications = useMemo(() => {

    const searchText =
      search.trim().toLowerCase();


    const filtered =
      notifications.filter(
        (notification) => {

          const title =
            (
              notification.title ||
              ""
            ).toLowerCase();


          const message =
            (
              notification.message ||
              ""
            ).toLowerCase();


          const type =
            (
              notification.type ||
              ""
            ).toLowerCase();


          const matchSearch =
            !searchText ||
            title.includes(searchText) ||
            message.includes(searchText) ||
            type.includes(searchText);


          const matchFilter =
            filter === "ALL" ||
            (
              filter === "READ" &&
              notification.read === true
            ) ||
            (
              filter === "UNREAD" &&
              notification.read === false
            );


          return (
            matchSearch &&
            matchFilter
          );
        }
      );


    // ========================================================
    // SORT
    // ========================================================

    return [...filtered].sort(
      (a, b) => {

        // ----------------------------------------------------
        // 1. UNREAD FIRST
        // ----------------------------------------------------

        if (
          a.read !== b.read
        ) {

          return a.read ? 1 : -1;

        }


        // ----------------------------------------------------
        // 2. NEWEST FIRST
        // ----------------------------------------------------

        const dateA =
          a.createdAt
            ? new Date(
                a.createdAt
              ).getTime()
            : 0;


        const dateB =
          b.createdAt
            ? new Date(
                b.createdAt
              ).getTime()
            : 0;


        return dateB - dateA;

      }
    );

  }, [
    notifications,
    search,
    filter,
  ]);


  // ==========================================================
  // MARK NOTIFICATION AS READ
  // ==========================================================

  const handleMarkAsRead = async (
    notificationId
  ) => {

    try {

      setError("");

      await markAsRead(
        notificationId
      );

      await loadNotifications();

    } catch (error) {

      console.error(
        "Failed to mark notification as read:",
        error
      );

      setError(
        "Unable to mark the notification as read."
      );

    }
  };


  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <>
      <Sidebar />

      <Box
        sx={{
          ml: "270px",
          p: 4,
          background: "#F4F6F9",
          minHeight: "100vh",
        }}
      >

        <Header />


        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2}
          sx={{ mb: 3 }}
        >

          <Typography
            variant="h4"
            fontWeight="bold"
          >
            🔔 Notifications
          </Typography>


          <Button
            variant="outlined"
            startIcon={
              <RefreshIcon />
            }
            onClick={
              handleRefresh
            }
            disabled={
              loading ||
              refreshing
            }
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </Button>

        </Stack>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>

        )}


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <Grid
          container
          spacing={3}
          sx={{ mb: 4 }}
        >

          {/* TOTAL */}

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >

            <Card>

              <CardContent
                sx={{
                  textAlign: "center",
                }}
              >

                <NotificationsIcon
                  color="primary"
                  sx={{
                    fontSize: 45,
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {total}
                </Typography>

                <Typography>
                  Total Notifications
                </Typography>

              </CardContent>

            </Card>

          </Grid>


          {/* UNREAD */}

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >

            <Card>

              <CardContent
                sx={{
                  textAlign: "center",
                }}
              >

                <NotificationsIcon
                  color="warning"
                  sx={{
                    fontSize: 45,
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {unread}
                </Typography>

                <Typography>
                  Unread
                </Typography>

              </CardContent>

            </Card>

          </Grid>


          {/* READ */}

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >

            <Card>

              <CardContent
                sx={{
                  textAlign: "center",
                }}
              >

                <MarkEmailReadIcon
                  color="success"
                  sx={{
                    fontSize: 45,
                  }}
                />

                <Typography
                  variant="h4"
                  fontWeight="bold"
                >
                  {read}
                </Typography>

                <Typography>
                  Read
                </Typography>

              </CardContent>

            </Card>

          </Grid>

        </Grid>


        {/* ==================================================
            SEARCH + FILTER
        ================================================== */}

        <Card
          sx={{
            mb: 3,
          }}
        >

          <CardContent>

            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
            >

              <TextField
                fullWidth
                label="Search Notifications"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                    >
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />


              <TextField
                select
                label="Filter"
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value
                  )
                }
                sx={{
                  width: {
                    xs: "100%",
                    md: 180,
                  },
                }}
              >

                <MenuItem value="ALL">
                  All
                </MenuItem>

                <MenuItem value="UNREAD">
                  Unread
                </MenuItem>

                <MenuItem value="READ">
                  Read
                </MenuItem>

              </TextField>

            </Stack>

          </CardContent>

        </Card>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading ? (

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
            }}
          >

            <Stack
              spacing={2}
              alignItems="center"
            >

              <CircularProgress />

              <Typography>
                Loading notifications...
              </Typography>

            </Stack>

          </Box>

        ) : filteredNotifications.length === 0 ? (

          /* ==================================================
             EMPTY STATE
          ================================================== */

          <Card>

            <CardContent
              sx={{
                textAlign: "center",
                py: 8,
              }}
            >

              <NotificationsIcon
                sx={{
                  fontSize: 70,
                }}
                color="disabled"
              />

              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                }}
              >
                {notifications.length === 0
                  ? "No Notifications Found"
                  : "No Matching Notifications"}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                {notifications.length === 0
                  ? "There are currently no notifications for this account."
                  : "Try changing your search or filter."}
              </Typography>

            </CardContent>

          </Card>

        ) : (

          /* ==================================================
             NOTIFICATION LIST
          ================================================== */

          <Grid
            container
            spacing={3}
          >

            {filteredNotifications.map(
              (notification) => (

                <Grid
                  size={12}
                  key={notification.id}
                >

                  <Card
                    sx={{
                      borderLeft:
                        notification.read
                          ? "6px solid #4CAF50"
                          : "6px solid #1976D2",

                      transition:
                        "all 0.2s ease",

                      "&:hover": {
                        boxShadow: 6,
                        transform:
                          "translateY(-2px)",
                      },
                    }}
                  >

                    <CardContent>

                      {/* ======================================
                          TITLE + STATUS
                      ====================================== */}

                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        justifyContent="space-between"
                        alignItems={{
                          xs: "flex-start",
                          sm: "center",
                        }}
                        spacing={1}
                      >

                        <Typography
                          variant="h6"
                          fontWeight="bold"
                        >
                          {notification.title ||
                            "Notification"}
                        </Typography>


                        <Chip
                          label={
                            notification.read
                              ? "Read"
                              : "Unread"
                          }
                          color={
                            notification.read
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />

                      </Stack>


                      {/* ======================================
                          TYPE
                      ====================================== */}

                      {notification.type && (

                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{
                            display: "block",
                            mt: 1,
                            fontWeight: 600,
                          }}
                        >
                          {notification.type}
                        </Typography>

                      )}


                      {/* ======================================
                          MESSAGE
                      ====================================== */}

                      <Typography
                        sx={{
                          mt: 2,
                        }}
                      >
                        {notification.message ||
                          "No message available."}
                      </Typography>


                      {/* ======================================
                          CREATED DATE
                      ====================================== */}

                      {notification.createdAt && (

                        <Typography
                          mt={2}
                          color="text.secondary"
                          variant="body2"
                        >
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </Typography>

                      )}


                      {/* ======================================
                          MODULE
                      ====================================== */}

                      {notification.module && (

                        <Typography
                          mt={1}
                          color="text.secondary"
                          variant="body2"
                        >
                          Module:{" "}
                          {notification.module}
                        </Typography>

                      )}


                      {/* ======================================
                          REFERENCE
                      ====================================== */}

                      {notification.referenceId && (

                        <Typography
                          mt={1}
                          color="text.secondary"
                          variant="body2"
                        >
                          Reference:{" "}
                          {notification.referenceId}
                        </Typography>

                      )}


                      {/* ======================================
                          MARK AS READ
                      ====================================== */}

                      {!notification.read && (

                        <Button
                          sx={{
                            mt: 3,
                          }}
                          variant="contained"
                          startIcon={
                            <MarkEmailReadIcon />
                          }
                          onClick={() =>
                            handleMarkAsRead(
                              notification.id
                            )
                          }
                        >
                          Mark as Read
                        </Button>

                      )}

                    </CardContent>

                  </Card>

                </Grid>

              )
            )}

          </Grid>

        )}

      </Box>
    </>
  );
}