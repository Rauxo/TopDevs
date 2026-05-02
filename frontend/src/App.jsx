import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Create from "./pages/auth/Create";
import UserDashboard from "./pages/userProfile/UserDashboard";
import ProtectedRoute from "./Protected Routes/ProtectedRoute";
import CompanyLogin from "./pages/company/auth/CompanyLogin";
import CompanyCreate from "./pages/company/auth/CompanyCreate";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyProtectedRoute from "./Protected Routes/CompanyProtectedRoute";
import HomeScreen from "./pages/HomeScreen/HomeScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />

        {/* User Protected Routes */}
        <Route
          path="/UserDashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
