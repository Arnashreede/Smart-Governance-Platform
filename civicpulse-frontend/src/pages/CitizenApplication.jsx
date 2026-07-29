import { useState } from "react";
import { Container, Typography } from "@mui/material";

import ApplicantProfile from "../components/application/ApplicantProfile";
import Instructions from "../components/application/Instructions";
import ServiceCards from "../components/application/ServiceCards";
import ServiceInformation from "../components/application/ServiceInformation";
import DocumentUpload from "../components/application/DocumentUpload";
import RecentApplications from "../components/application/RecentApplications";
import DynamicForm from "../components/application/DynamicForm";

import { services } from "../data/services";
import {
  submitApplication,
  uploadDocument,
} from "../services/applicationService";

function CitizenApplication() {
  const [application, setApplication] = useState({
    applicationType: "",
  });

  const [documents, setDocuments] = useState({});

  // Replace later with backend data
  const [applications] = useState([]);

  const info = services.find(
    (service) => service.name === application.applicationType
  );

  const handleSubmit = async () => {
    try {
      const request = {
        ...application,
        citizenId: Number(localStorage.getItem("userId")),
        applicantName: localStorage.getItem("fullName"),
        remarks: application.remarks || "",
      };

      console.log("Request:", request);

      const savedApplication = await submitApplication(request);

      // Upload selected documents
      for (const file of Object.values(documents)) {
        if (file) {
          await uploadDocument(savedApplication.id, file);
        }
      }

      alert("Application submitted successfully!");

      setApplication({
        applicationType: "",
      });

      setDocuments({});
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.error(error);

      alert(JSON.stringify(error.response?.data));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        gutterBottom
      >
        CivicPulse Service Application
      </Typography>

      <ApplicantProfile />

      <Instructions />

      <ServiceCards
        application={application}
        setApplication={setApplication}
      />

      <DynamicForm
        application={application}
        setApplication={setApplication}
      />

      <ServiceInformation info={info} />

      <DocumentUpload
        application={application}
        info={info}
        documents={documents}
        setDocuments={setDocuments}
        handleSubmit={handleSubmit}
      />

      <RecentApplications applications={applications} />
    </Container>
  );
}

export default CitizenApplication;