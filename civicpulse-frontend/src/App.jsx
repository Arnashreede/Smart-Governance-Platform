import { Routes, Route, Navigate } from "react-router-dom";
import DepartmentServices from "./pages/DepartmentServices";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BudgetDashboard from "./pages/BudgetDashboard";
import CitizenRegistration from "./pages/CitizenRegistration";
import ViewCitizens from "./pages/ViewCitizens";
import CitizenDashboard from "./pages/CitizenDashboard";
import MyAssignedComplaints from "./pages/MyAssignedComplaints";
import CitizenApplication from "./pages/CitizenApplication";
import MyApplications from "./pages/MyApplications";
import UploadDocument from "./pages/UploadDocument";
import RegisterGrievance from "./pages/RegisterGrievance";
import ViewGrievances from "./pages/ViewGrievances";
import OfficerRegistration from "./pages/OfficerRegistration";
import ViewOfficers from "./pages/ViewOfficers";
import AssignOfficer from "./pages/AssignOfficer";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerApplicationDashboard from "./pages/OfficerApplicationDashboard";
import BudgetManagement from "./pages/BudgetManagement";
import CertificatePage from "./pages/CertificatePage";
import ViewCertificates from "./pages/ViewCertificates";
import WelfareDashboard from "./pages/welfare/Dashboard";
import WelfareSchemes from "./pages/welfare/WelfareSchemes";
import ApplyScheme from "./pages/welfare/ApplyScheme";
import Applications from "./pages/welfare/Applications";
import WelfareReports from "./pages/welfare/Reports"
import CitizenLogin from "./pages/CitizenLogin";
import OfficerLogin from "./pages/OfficerLogin";
import AdminLogin from "./pages/AdminLogin";
import ViewMyApplication from "./pages/welfare/ViewMyApplication";
import TrackComplaint from "./pages/TrackComplaint";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import WelfareManagement from "./pages/adminwelfare/WelfareManagement";
import AddScheme from "./pages/adminwelfare/AddScheme";
import EditScheme from "./pages/adminwelfare/EditScheme";
import WelfareApplications from "./pages/adminwelfare/WelfareApplications";
import OfficerApplications from "./pages/officerwelfare/OfficerApplications";
import ApplicationDetails from "./pages/officerwelfare/ApplicationDetails";
import Beneficiaries from "./pages/officerwelfare/Beneficiaries";
import OfficerProfile from "./pages/officerwelfare/OfficerProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import DepartmentManagement from "./pages/DepartmentManagement";
import DepartmentDetails from "./pages/DepartmentDetails";
import Receipt from "./pages/welfare/Receipt";
import GrievanceTimeline from "./pages/GrievanceTimeline";
import AssignedOfficers from "./pages/AssignedOfficers";
import ServiceManagement from "./pages/ServiceManagement";
import ServiceFormBuilder from "./pages/ServiceFormBuilder";
import ServiceApplicationForm from "./pages/ServiceApplicationForm";
import EditBudget from "./pages/EditBudget";
import CreateBudget from "./pages/CreateBudget";
import BudgetDetails from "./pages/BudgetDetails";
import FundDistribution from "./pages/FundDistribution";
import TransactionHistory from "./pages/TransactionHistory";
import BudgetReport from "./pages/BudgetReport";
import Profile from "./pages/Profile";
import MyCertificates from "./pages/MyCertificates";
import BenefitsReceived from "./pages/BenefitsReceived";
function App() {
  return (
    
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citizen-login" element={<CitizenLogin />} />
        <Route path="/officer-login" element={<OfficerLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
    path="/service-application/:serviceId"
    element={<ServiceApplicationForm />}
/>
<Route
    path="/budgets/edit/:id"
    element={
        <ProtectedRoute>
            <EditBudget />
        </ProtectedRoute>
    }
/>
<Route
    path="/budgets/:id/report"
    element={<BudgetReport />}
/>
<Route
    path="/budgets/create"
    element={
        <ProtectedRoute>
            <CreateBudget />
        </ProtectedRoute>
    }
/>

<Route
    path="/budgets/:id"
    element={
        <ProtectedRoute>
            <BudgetDetails />
        </ProtectedRoute>
    }
/>

<Route
    path="/budgets/edit/:id"
    element={
        <ProtectedRoute>
            <EditBudget />
        </ProtectedRoute>
    }
/>

<Route
    path="/fund-distribution/:id"
    element={
        <ProtectedRoute>
            <FundDistribution />
        </ProtectedRoute>
    }
/>
<Route
    path="/budgets/:id/transactions"
    element={<TransactionHistory />}
/>
<Route
    path="/officer/certificates"
    element={
        <ProtectedRoute>
            <ViewCertificates />
        </ProtectedRoute>
    }
/>
        <Route
    path="/department-services"
    element={<DepartmentServices />}
/>
<Route
  path="/budgets"
  element={
    <ProtectedRoute>
      <BudgetDashboard />
    </ProtectedRoute>
  }
/>
<Route
    path="/assignments"
    element={
        <ProtectedRoute>
            <AssignedOfficers />
        </ProtectedRoute>
    }
/>
<Route
    path="/grievances/timeline/:grievanceId"
    element={<GrievanceTimeline />}
/>
<Route
    path="/service-form-builder"
    element={<ServiceFormBuilder />}
/>
<Route
    path="/receipt"
    element={<Receipt />}
/>
<Route
  path="/admin/services"
  element={
    <ProtectedRoute>
      <ServiceManagement />
    </ProtectedRoute>
  }
/>
<Route
  path="/budget-management"
  element={
    <ProtectedRoute>
      <BudgetManagement />
    </ProtectedRoute>
  }
/> 
<Route
  path="/welfare/dashboard"
  element={
    <ProtectedRoute>
      <WelfareDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/welfare"
  element={
    <ProtectedRoute>
      <WelfareManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/welfare/add"
  element={
    <ProtectedRoute>
      <AddScheme />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/welfare/edit/:id"
  element={
    <ProtectedRoute>
      <EditScheme />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/welfare/applications"
  element={
    <ProtectedRoute>
      <WelfareApplications />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/welfare/application/:id"
  element={
    <ProtectedRoute>
      <ApplicationDetails />
    </ProtectedRoute>
  }
/>
<Route
  path="/welfare/reports"
  element={
    <ProtectedRoute>
      <WelfareReports />
    </ProtectedRoute>
  }
/>
<Route path="/welfare/schemes" element={<WelfareSchemes />} />
<Route path="/welfare/apply" element={<ApplyScheme />} />
<Route path="/welfare/applications" element={<Applications />} />
<Route
  path="/welfare/application/:id"
  element={
    <ProtectedRoute>
      <ViewMyApplication />
    </ProtectedRoute>
  }
/>
<Route path="/welfare/beneficiaries" element={<Beneficiaries />} />
<Route path="/welfare/reports" element={<Reports />} />
       {/* Citizen */}
        <Route
  path="/citizen/register"
  element={<CitizenRegistration />}
/>
<Route path="/upload-document" element={<UploadDocument />} />
        <Route
          path="/citizens"
          element={
            <ProtectedRoute>
              <ViewCitizens />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen-dashboard"
          element={
            <ProtectedRoute>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/application"
          element={
            <ProtectedRoute>
              <CitizenApplication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Certificates */}
        <Route
          path="/certificates"
          element={
            <ProtectedRoute>
              <ViewCertificates />
            </ProtectedRoute>
          }
        />
<Route
  path="/officer/my-complaints"
  element={<MyAssignedComplaints />}
/>
        <Route
          path="/certificate/:id"
          element={
            <ProtectedRoute>
              <CertificatePage />
            </ProtectedRoute>
          }
        />

        {/* Grievances */}
        <Route
          path="/grievance/register"
          element={
            <ProtectedRoute>
              <RegisterGrievance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/grievances"
          element={
            <ProtectedRoute>
              <ViewGrievances />
            </ProtectedRoute>
          }
        />

        {/* Officers */}
        <Route
          path="/officer/register"
          element={
            <ProtectedRoute>
              <OfficerRegistration />
            </ProtectedRoute>
          }
        />
<Route path="/officer-register" element={<OfficerRegistration />} />
        <Route
          path="/officers"
          element={
            <ProtectedRoute>
              <ViewOfficers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assign-officer"
          element={
            <ProtectedRoute>
              <AssignOfficer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer-dashboard"
          element={
            <ProtectedRoute>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
<Route path="/officer/welfare" element={<OfficerApplications />} />

<Route
    path="/officer/welfare/:id"
    element={<ApplicationDetails />}
/>

<Route
    path="/officer/beneficiaries"
    element={<Beneficiaries />}
/>

<Route
    path="/officer/profile"
    element={<OfficerProfile />}
/>
        <Route
          path="/officer/applications"
          element={
            <ProtectedRoute>
              <OfficerApplicationDashboard />
            </ProtectedRoute>
          }
        />
<Route
  path="/departments"
  element={
    <ProtectedRoute>
      <DepartmentManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/departments/:department"
  element={
    <ProtectedRoute>
      <DepartmentDetails />
    </ProtectedRoute>
  }
/>
        {/* Other Pages */}
        <Route
          path="/track-complaint"
          element={
            <ProtectedRoute>
              <TrackComplaint />
            </ProtectedRoute>
          }
        />
<Route path="/welfare/dashboard" element={<WelfareDashboard />} />
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route
  path="/benefits-received"
  element={
    <ProtectedRoute>
      <BenefitsReceived />
    </ProtectedRoute>
  }
/>
<Route path="/my-applications" element={<MyApplications />} />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
<Route
  path="/my-certificates"
  element={
    <ProtectedRoute>
      <MyCertificates />
    </ProtectedRoute>
  }
/>
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Unknown Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    
  );
}

export default App;