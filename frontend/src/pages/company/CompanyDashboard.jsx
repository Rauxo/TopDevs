import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, Briefcase, PlusCircle, LogOut, AlertTriangle, MessageSquare, Trash2, Building2 } from "lucide-react";
import API from "../../API/api";

function CompanyDashboard() {
  const { company, companyLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "overview");

  useEffect(() => {
    if (company) {
      fetchCompanyJobs();
    }
  }, [company]);

  const fetchCompanyJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/job/company-jobs");
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await companyLogout();
    navigate("/");
  };

  const handleDeleteJob = async (e, jobId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/job/delete/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      console.error("Error deleting job", err);
      alert("Failed to delete job");
    }
  };

  const checkVerification = (e, path) => {
    if (!company.isVerified) {
      e.preventDefault();
      alert("Please wait until we verify your company account.");
      return false;
    }
    if (path) navigate(path);
    return true;
  };

  if (!company) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 hidden md:flex flex-col fixed top-[72px] h-[calc(100vh-72px)] z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <img src={`http://localhost:5000/${company.companyIcon}`} className="w-10 h-10 rounded object-cover border border-slate-200 bg-white" alt="logo" />
            <span className="font-bold text-slate-900 truncate text-base">{company.name}</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-bold transition-colors border-none cursor-pointer ${
                activeTab === "overview" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200 bg-transparent"
              }`}
            >
              <LayoutDashboard size={18} /> Overview
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-bold transition-colors border-none cursor-pointer ${
                activeTab === "jobs" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200 bg-transparent"
              }`}
            >
              <Briefcase size={18} /> Manage Jobs
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-bold transition-colors border-none cursor-pointer ${
                activeTab === "messages" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200 bg-transparent"
              }`}
            >
              <MessageSquare size={18} /> Messages
            </button>
            <button
              onClick={(e) => checkVerification(e, "/company/create-job")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-bold text-slate-600 hover:bg-slate-200 border-none bg-transparent transition-colors cursor-pointer"
            >
              <PlusCircle size={18} /> Post New Job
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-slate-900 font-bold text-sm hover:bg-slate-100 rounded transition-colors border border-slate-300 bg-white cursor-pointer">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 bg-white">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {company.name.split(' ')[0]}
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage your jobs, applications, and company profile.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={(e) => checkVerification(e, "/company/create-job")} 
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors border-none cursor-pointer text-sm"
            >
              Post a Job
            </button>
          </div>
        </header>

        {/* Account Status */}
        {!company.isVerified && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded mb-8 flex items-center gap-4">
            <span className="text-slate-400"><AlertTriangle size={20} /></span>
            <div>
              <p className="text-slate-900 font-bold text-sm">Account Verification Pending</p>
              <p className="text-slate-500 text-xs mt-0.5">Our team is reviewing your documents. You'll be notified once verified.</p>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Active Jobs", value: jobs.length },
                { label: "Total Applications", value: jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0) },
                { label: "Unread Messages", value: "0" },
                { label: "New Candidates", value: "0" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded border border-slate-200 hover:border-slate-300 transition-colors">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-slate-900">Recent Job Postings</h3>
                  <button onClick={() => setActiveTab("jobs")} className="text-blue-600 text-xs font-bold hover:underline bg-transparent border-none cursor-pointer">View All</button>
                </div>
                <div className="space-y-3">
                  {jobs.slice(0, 3).map(job => (
                    <div key={job._id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 font-black shrink-0">
                          {job.jobTitle.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{job.jobTitle}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{job.location} • {new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded uppercase tracking-wide border border-slate-200 shrink-0 ml-2">Active</span>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded">
                      <Briefcase size={24} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-500">No jobs posted yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded border border-slate-200">
                <h3 className="text-lg font-black text-slate-900 mb-6">Company Profile</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                    <img src={`http://localhost:5000/${company.companyIcon}`} className="w-12 h-12 rounded object-cover border border-slate-200 bg-white" alt="logo" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-sm truncate">{company.name}</p>
                      <p className="text-xs text-slate-500 truncate">{company.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">About</span>
                      <p className="text-slate-700 text-sm leading-relaxed">{company.about || "No description provided."}</p>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                      <span className="text-slate-500 text-xs font-bold">Founded</span>
                      <span className="font-bold text-slate-900 text-sm">{company.founded || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                      <span className="text-slate-500 text-xs font-bold">Team Size</span>
                      <span className="font-bold text-slate-900 text-sm">{company.teamSize || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                      <span className="text-slate-500 text-xs font-bold">Phone</span>
                      <span className="font-bold text-slate-900 text-sm">{company.phone}</span>
                    </div>
                    <div className="flex flex-col items-start py-1 mt-2">
                      <span className="text-slate-500 text-xs font-bold">Address</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 leading-snug">{company.address}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <Link to="/company/edit-profile" className="block w-full text-center py-2.5 bg-slate-900 text-white font-bold text-sm rounded hover:bg-black transition-colors no-underline">
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="bg-white p-6 md:p-8 rounded border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900">Manage Your Job Postings</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-900 text-xs font-bold rounded border border-slate-200">{jobs.length} Total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="pb-3 font-black text-slate-900 text-[10px] uppercase tracking-wider">Job Role</th>
                    <th className="pb-3 font-black text-slate-900 text-[10px] uppercase tracking-wider">Date Posted</th>
                    <th className="pb-3 font-black text-slate-900 text-[10px] uppercase tracking-wider">Applications</th>
                    <th className="pb-3 font-black text-slate-900 text-[10px] uppercase tracking-wider">Status</th>
                    <th className="pb-3 font-black text-slate-900 text-[10px] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map(job => (
                    <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-slate-900 text-sm">{job.jobTitle}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{job.location}</p>
                      </td>
                      <td className="py-4 pr-4 text-sm font-bold text-slate-700">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded border ${job.applicationCount > 0 ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}>
                          {job.applicationCount || 0} Apps
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-2 py-1 bg-white text-slate-900 border border-slate-200 text-[10px] font-bold rounded uppercase tracking-wide">Active</span>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-3 items-center">
                          <button 
                            onClick={(e) => checkVerification(e, `/company/applicants/${job._id}`)}
                            className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-700 transition-colors cursor-pointer border-none"
                          >
                            View Application
                          </button>
                          <button
                            onClick={(e) => handleDeleteJob(e, job._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer border-none bg-transparent flex items-center"
                            title="Delete Job"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobs.length === 0 && (
                <div className="text-center py-16 bg-slate-50 rounded border border-slate-200 mt-4">
                  <p className="text-sm font-bold text-slate-500">No jobs found. Start by posting one!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
           <div className="bg-white p-12 md:p-20 rounded border border-slate-200 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded flex items-center justify-center mb-6 text-slate-900">
               <MessageSquare size={24} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-3">Corporate Communications</h3>
             <p className="text-slate-500 mb-8 max-w-sm text-sm font-medium">Manage candidate requests and active conversations in the professional messaging terminal.</p>
             <Link 
              to="/messages"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded hover:bg-blue-700 transition-colors no-underline"
             >
               Go to Messages
             </Link>
           </div>
        )}
      </main>
    </div>
  );
}

export default CompanyDashboard;
