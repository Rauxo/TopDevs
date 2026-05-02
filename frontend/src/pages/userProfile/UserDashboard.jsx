import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../../API/api";

function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await API.get("/job/my-applications");
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Error fetching applications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-12">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full p-1 bg-white">
                <img
                  src={`http://localhost:5000/${user.profileImg}`}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <h1 className="text-2xl font-light text-slate-800">{user.username}</h1>
              <div className="flex gap-2 justify-center">
                <Link 
                  to="/edit-profile"
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm rounded-lg transition-colors no-underline"
                >
                  Edit Profile
                </Link>
                <button onClick={handleLogout} className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-lg transition-colors">
                  Logout
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <div className="text-center md:text-left">
                <span className="font-bold block md:inline">{applications.length}</span> <span className="text-slate-500">applications</span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">{user.username}</p>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">
                {user.about || "No bio yet."}
              </p>
              <p className="text-blue-900 text-sm font-medium mt-2">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-slate-200">
          <div className="flex justify-center gap-12 -mt-px">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "applications" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-400"
              }`}
            >
              <span>📋</span> Applications
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "saved" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-400"
              }`}
            >
              <span>🔖</span> Saved
            </button>
            <button
              onClick={() => setActiveTab("tagged")}
              className={`flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "tagged" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-400"
              }`}
            >
              <span>👥</span> Tagged
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "applications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-10">Loading applications...</div>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <div key={app._id} className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900">{app.job?.jobTitle}</h3>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded">Applied</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{new Date(app.createdAt).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                      <span className="text-xs font-medium text-slate-600">{app.job?.location}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-400">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-xl font-light">No job applications yet</p>
                  <button onClick={() => navigate("/jobs")} className="mt-4 text-blue-500 font-bold text-sm">Find your first job</button>
                </div>
              )}
            </div>
          )}
          {activeTab !== "applications" && (
            <div className="text-center py-20 text-slate-400">
              <p className="text-xl font-light">Nothing to show here yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
