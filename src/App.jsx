import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Pages/Sidebar";
import LoginPage from "./Pages/Login/LoginPage";
import UnauthorizedPage from "./Pages/UnauthorizedPage";
// import AdminPage from "./Pages/AdminPage";
import UserPage from "./Pages/Users/UserPage";
// import NotFound from "./pages/NotFound";
import { AuthProvider } from "./Context/ContextProvider";
import ProtectedRoute from "./Context/ProtectedRoute";
import GetAllZoneList from "./Pages/Zones/GetAllZoneList";
import "./Components/Styles/Mainpage.css";
// import GetAllUsersList from "./Pages/Users/getAllUsers";
import UnderDevelopment from "./Pages/CommonComponents/UnderDevlopment";
import "./Components/Styles/Mainpage.css";
// import MainHeader from "./Pages/CommonComponents/MainHeader";
import ProtectedLayout from "./Context/ProtectedLayout";
import DashboardPage from "./Pages/Dashboard/Dashboard";
import LogReportPage from "./Pages/Logs/LogReportPage";
import SMSTab from "./Pages/SMS/SMSTab";
import EmailTab from "./Pages/Email/EmailTab";
import { ToasterContainer } from "./Pages/CommonComponents/Toaster";
import ThresholdsPage from "./Pages/Threshold/pages/ThresholdsPage";
function App() {
  return (
    <div className="Mainapp">
      <ToasterContainer />
      <AuthProvider>
        <Router>
          <div className="Header_app">
            <div className="main-content">
              {/* <MainHeader /> */}
              {/* Public Routes */}
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/not-found" element={<UnauthorizedPage />} />
                <Route path="*" element={<LoginPage />} />
                {/* Protected Routes */}

                {/*Dashboard Routes*/}
                <Route element={<ProtectedLayout />}>
                  <Route
                    path="/liveOccupancy"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin","Operator","Viewer"]}
                      >
                        {/* <HelloworldC /> */}
                        <DashboardPage />
                        {/* <UnderDevelopment /> */}
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/historicalAnalytics"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin","Operator","Viewer"]}
                      >
                        <UnderDevelopment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/predictions"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin","Operator","Viewer"]}
                      >
                        <UnderDevelopment />
                      </ProtectedRoute>
                    }
                  />
                  {/*Settings  Routes*/}
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin","Operator","Viewer"]}
                      >
                        {/* <GetAllUsersList /> */}
                        <UserPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/zones"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                      >
                        <GetAllZoneList />
                        {/* <UnderDevelopment /> */}
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/threshold"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                      >
                        <ThresholdsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/sms"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                      >
                        {/* <UnderDevelopment /> */}
                        <SMSTab/>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/email"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin"]}
                      >
                        {/* <UnderDevelopment /> */}
                        <EmailTab />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/logs"
                    element={
                      <ProtectedRoute
                        allowedRoles={["Admin","Operator","Viewer"]}
                      >
                        {/* <UnderDevelopment /> */}
                        <LogReportPage/>
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
