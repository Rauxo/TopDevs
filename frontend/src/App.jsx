import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import ScrollToTop from "./components/ScrollToTop";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminLearning from "./pages/admin/AdminLearning";
import AdminProtectedRoute from "./Protected Routes/AdminProtectedRoute";

import Jobs from "./pages/jobs/Jobs";
import JobDetail from "./pages/jobs/JobDetail";
import CreateJob from "./pages/company/CreateJob";
import ViewApplicants from "./pages/company/ViewApplicants";
import EditCompanyProfile from "./pages/company/EditCompanyProfile";
import CompanyProfile from "./pages/company/CompanyProfile";
import Companies from "./pages/company/Companies";
import Search from "./pages/Search";
import Layout from "./Layout/Layout";
import Learn from "./pages/learn/Learn";
import LevelsPage from "./pages/learn/LevelsPage";
import LevelContentPage from "./pages/learn/LevelContentPage";
import SolvePage from "./pages/learn/SolvePage";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import TermsConditions from "./pages/legal/TermsConditions";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import ChatPage from "./pages/ChatPage";
import Pricing from "./pages/Pricing";
import PaymentStatus from "./pages/PaymentStatus";
// import Lenis from "lenis";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useEffect } from "react";

// gsap.registerPlugin(ScrollTrigger);
function App() {
  //  useEffect(() => {
  //   const lenis = new Lenis({
  //     duration: 1.2,
  //     smoothWheel: true,
  //     wheelMultiplier: 1,
  //   });

  //   lenis.on("scroll", ScrollTrigger.update);

  //   const update = (time) => {
  //     lenis.raf(time * 1000);
  //   };

  //   gsap.ticker.add(update);
  //   gsap.ticker.lagSmoothing(0);

  //   return () => {
  //     lenis.destroy();
  //     gsap.ticker.remove(update);
  //   };
  // }, []);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/search" element={<Search />} />
          <Route path="/company/profile/:id" element={<CompanyProfile />} />
          <Route path="/user/profile/:id" element={<PublicUserProfile />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment-status" element={<PaymentStatus />} />

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
          <Route
            path="/learn/:languageId/levels"
            element={
              <ProtectedRoute>
                <LevelsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/level/:levelId"
            element={
              <ProtectedRoute>
                <LevelContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/solve/:levelId"
            element={
              <ProtectedRoute>
                <SolvePage />
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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/companies"
            element={
              <AdminProtectedRoute>
                <AdminCompanies />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <AdminProtectedRoute>
                <AdminJobs />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/plans"
            element={
              <AdminProtectedRoute>
                <AdminPlans />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/learning"
            element={
              <AdminProtectedRoute>
                <AdminLearning />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
