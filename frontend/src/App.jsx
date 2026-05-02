import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Create from "./pages/auth/Create";
import UserDashboard from "./pages/userProfile/UserDashboard";
import EditProfile from "./pages/userProfile/EditProfile";
import PublicUserProfile from "./pages/userProfile/PublicUserProfile";
import ProtectedRoute from "./Protected Routes/ProtectedRoute";
import CompanyLogin from "./pages/company/auth/CompanyLogin";
import CompanyCreate from "./pages/company/auth/CompanyCreate";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyProtectedRoute from "./Protected Routes/CompanyProtectedRoute";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import NotFound from "./NotFound";

import Jobs from "./pages/jobs/Jobs";
import JobDetail from "./pages/jobs/JobDetail";
import CreateJob from "./pages/company/CreateJob";
import ViewApplicants from "./pages/company/ViewApplicants";
import EditCompanyProfile from "./pages/company/EditCompanyProfile";
import CompanyProfile from "./pages/company/CompanyProfile";
import Search from "./pages/Search";
import Layout from "./Layout/Layout";
import Learn from "./pages/learn/Learn";
import Leaderboard from "./pages/leaderboard/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/company/profile/:id" element={<CompanyProfile />} />
          <Route path="/user/profile/:id" element={<PublicUserProfile />} />

          {/* User Protected Routes */}
          <Route
            path="/UserDashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Company Routes */}
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/create" element={<CompanyCreate />} />
          <Route
            path="/company/dashboard"
            element={
              <CompanyProtectedRoute>
                <CompanyDashboard />
              </CompanyProtectedRoute>
            }
          />
          <Route
            path="/company/create-job"
            element={
              <CompanyProtectedRoute>
                <CreateJob />
              </CompanyProtectedRoute>
            }
          />
          <Route
            path="/company/applicants/:jobId"
            element={
              <CompanyProtectedRoute>
                <ViewApplicants />
              </CompanyProtectedRoute>
            }
          />
          <Route
            path="/company/edit-profile"
            element={
              <CompanyProtectedRoute>
                <EditCompanyProfile />
              </CompanyProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}


export default App;
