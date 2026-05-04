import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ClipboardList, FolderGit2, Zap, CheckCircle2, MessageSquare } from "lucide-react";
import API from "../../API/api";

function UserDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "active");
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
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-emerald-500 to-cyan-500">
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
          <div className="flex justify-center gap-8 md:gap-12 -mt-px flex-wrap">
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "projects" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <FolderGit2 size={14} /> Projects
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "active" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <Zap size={14} /> Active Applications
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "status" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <CheckCircle2 size={14} /> Application Status
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`flex items-center gap-2 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors border-t ${
                activeTab === "messages" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"
              }`}
            >
              <MessageSquare size={14} /> Messages
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "projects" && (
             <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
               <div className="text-slate-300 mb-4 flex justify-center">
                 <FolderGit2 size={48} />
               </div>
               <p className="text-slate-400 italic">No projects showcased yet.</p>
             </div>
          )}

          {(activeTab === "active" || activeTab === "status") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-10">Loading applications...</div>
              ) : (activeTab === "active" ? applications.filter(a => !a.status || a.status === "Applied" || a.status === "Pending") : applications).length > 0 ? (
                (activeTab === "active" ? applications.filter(a => !a.status || a.status === "Applied" || a.status === "Pending") : applications).map((app) => (
                  <div key={app._id} className="p-5 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900 text-base">{app.job?.jobTitle}</h3>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
                        app.status === "Accepted" ? "bg-emerald-100 text-emerald-700" :
                        app.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {app.status || "Applied"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {app.job?.company?.companyIcon ? (
                        <img 
                          src={`http://localhost:5000/${app.job.company.companyIcon}`} 
                          alt="company" 
                          className="w-5 h-5 rounded object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[10px]">
                          {app.job?.company?.name?.charAt(0) || "J"}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-500">{app.job?.company?.name || "Unknown Company"}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 mb-4">{new Date(app.createdAt).toLocaleDateString()}</p>
                    
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Zap size={14} className="text-slate-400" />
                      <span className="text-xs font-medium text-slate-600">{app.job?.location}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-300 flex flex-col items-center">
                  <div className="mb-4">
                    <ClipboardList size={64} />
                  </div>
                  <p className="text-xl font-light">No applications found</p>
                  {activeTab === "active" && (
                    <button onClick={() => navigate("/jobs")} className="mt-4 text-emerald-600 font-bold text-sm hover:underline">Find your first job</button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
              <div className="text-emerald-500/30 mb-6 flex justify-center">
                <MessageSquare size={64} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Private Messaging</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">Access your secure conversations in the dedicated messaging portal.</p>
              <Link 
                to="/messages"
                className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 no-underline"
              >
                Open Messages
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
