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
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import SearchIcon from "@mui/icons-material/Search";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getNotifications,
  markAsRead,
} from "../services/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const citizenId = localStorage.getItem("citizenId");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(citizenId);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const total = notifications.length;
  const unread = notifications.filter(n => !n.read).length;
  const read = notifications.filter(n => n.read).length;

  const filteredNotifications = useMemo(() => {
  return notifications.filter((n) => {
    const title = (n.title || "").toLowerCase();
    const message = (n.message || "").toLowerCase();

    const matchSearch =
      title.includes(search.toLowerCase()) ||
      message.includes(search.toLowerCase());

    const matchFilter =
      filter === "ALL" ||
      (filter === "READ" && n.read) ||
      (filter === "UNREAD" && !n.read);

    return matchSearch && matchFilter;
  });
}, [notifications, search, filter]);


  return (
    <>
      <Sidebar />
      <Box sx={{ ml: "270px", p: 4, background: "#F4F6F9", minHeight: "100vh" }}>
        <Header />

        <Typography variant="h4" fontWeight="bold" mb={3}>
          🔔 Notifications
        </Typography>

        <Grid container spacing={3} mb={4}>
<Grid size={{ xs: 12, md: 4 }}>
                <Card><CardContent sx={{textAlign:"center"}}>
              <NotificationsIcon color="primary" sx={{fontSize:45}}/>
              <Typography variant="h4">{total}</Typography>
              <Typography>Total Notifications</Typography>
            </CardContent></Card>
          </Grid>
<Grid size={{ xs: 12, md: 4 }}>
                <Card><CardContent sx={{textAlign:"center"}}>
              <MarkEmailUnreadIcon color="warning" sx={{fontSize:45}}/>
              <Typography variant="h4">{unread}</Typography>
              <Typography>Unread</Typography>
            </CardContent></Card>
          </Grid>
<Grid size={{ xs: 12, md: 4 }}>
                <Card><CardContent sx={{textAlign:"center"}}>
              <MarkEmailReadIcon color="success" sx={{fontSize:45}}/>
              <Typography variant="h4">{read}</Typography>
              <Typography>Read</Typography>
            </CardContent></Card>
          </Grid>
        </Grid>

        <Card sx={{mb:3}}>
          <CardContent>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Search Notifications"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                InputProps={{
                  startAdornment:<InputAdornment position="start"><SearchIcon/></InputAdornment>
                }}
              />
              <TextField
                select
                label="Filter"
                value={filter}
                onChange={(e)=>setFilter(e.target.value)}
                sx={{width:180}}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="READ">Read</MenuItem>
                <MenuItem value="UNREAD">Unread</MenuItem>
              </TextField>
            </Stack>
          </CardContent>
        </Card>

        {loading ? (
          <Typography align="center">Loading notifications...</Typography>
        ) : filteredNotifications.length === 0 ? (
          <Card>
            <CardContent sx={{textAlign:"center",py:6}}>
              <NotificationsIcon sx={{fontSize:70}} color="disabled"/>
              <Typography variant="h6">No Notifications Found</Typography>
              <Typography color="text.secondary">You're all caught up.</Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredNotifications.map(notification=>(
              <Grid item xs={12} key={notification.id}>
                <Card sx={{
                  borderLeft:notification.read?"6px solid #4CAF50":"6px solid #1976D2",
                  "&:hover":{boxShadow:6}
                }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="h6" fontWeight="bold">
                        {notification.title}
                      </Typography>
                      <Chip
                        label={notification.read?"Read":"Unread"}
                        color={notification.read?"success":"warning"}
                      />
                    </Stack>

                    <Typography mt={2}>
                      {notification.message}
                    </Typography>

                    <Typography mt={2} color="text.secondary">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>

                    {!notification.read && (
                      <Button
                        sx={{mt:3}}
                        variant="contained"
                        startIcon={<MarkEmailReadIcon/>}
                        onClick={async () => {
  try {
    await markAsRead(notification.id);
    await loadNotifications();
  } catch (error) {
    console.error(error);
  }
}}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
}
