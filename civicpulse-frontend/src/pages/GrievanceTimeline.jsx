import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";

function GrievanceTimeline() {

    const { grievanceId } = useParams();

    const [history, setHistory] = useState([]);

    useEffect(() => {

        api.get(`/grievances/history/${grievanceId}`)
            .then(res => setHistory(res.data))
            .catch(console.error);

    }, [grievanceId]);

    return (

        <Box p={4}>

            <Typography
                variant="h4"
                mb={3}
                fontWeight="bold"
            >
                Complaint Timeline
            </Typography>

            <Card>

                <CardContent>

                    <Timeline>

                        {history.map((item) => (

                            <TimelineItem key={item.id}>

                                <TimelineSeparator>

                                    <TimelineDot color="primary" />

                                    <TimelineConnector />

                                </TimelineSeparator>

                                <TimelineContent>

                                    <Typography fontWeight="bold">

                                        {item.newStatus}

                                    </Typography>

                                    <Typography>

                                        {item.remarks}

                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >

                                        {item.updatedBy}

                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >

                                        {item.updatedAt}

                                    </Typography>

                                </TimelineContent>

                            </TimelineItem>

                        ))}

                    </Timeline>

                </CardContent>

            </Card>

        </Box>

    );

}

export default GrievanceTimeline;