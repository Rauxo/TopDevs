import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../API/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../../API/api";

function CompanyDashboard() {
  const { company, companyLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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
    navigate("/company/login");
  };

  if (!company) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed top-[72px] h-[calc(100vh-72px)] z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <img src={`http://localhost:5000/${company.companyIcon}`} className="w-10 h-10 rounded-xl object-cover" alt="logo" />
            <span className="font-bold text-slate-800 truncate">{company.name}</span>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "overview" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === "jobs" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              💼 Manage Jobs
            </button>
            <Link
              to="/company/create-job"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 no-underline"
            >
              ➕ Post New Job
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-all">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Welcome back, {company.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here's what's happening with your recruitment.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/company/create-job" className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:-translate-y-0.5 transition-all no-underline">
              Post a Job
            </Link>
          </div>
        </header>

        {/* Account Status */}
        {!company.isVerified && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-xl mb-8 flex items-center gap-4">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-amber-800 font-bold">Account Verification Pending</p>
              <p className="text-amber-700 text-xs">Our team is reviewing your documents. You'll be notified once verified.</p>
            </div>
          </div>
        )}

        {/* Content Tabs */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Active Jobs", value: jobs.length, color: "blue" },
                { label: "Total Applications", value: jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0), color: "emerald" },
                { label: "Unread Messages", value: "0", color: "purple" },
                { label: "New Candidates", value: "0", color: "orange" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Job Postings</h3>
                <div className="space-y-4">
                  {jobs.slice(0, 3).map(job => (
                    <div key={job._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                          {job.jobTitle.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{job.jobTitle}</p>
                          <p className="text-slate-500 text-[10px]">{job.location} • {new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Active</span>
                    </div>
                  ))}
                  {jobs.length === 0 && <p className="text-center py-10 text-slate-400">No jobs posted yet.</p>}
                  {jobs.length > 0 && <button onClick={() => setActiveTab("jobs")} className="w-full text-center text-sm font-bold text-emerald-600 pt-2">View all jobs</button>}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Company Profile</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-6">
                    <img src={`http://localhost:5000/${company.companyIcon}`} className="w-16 h-16 rounded-2xl object-cover" alt="logo" />
                    <div>
                      <p className="font-extrabold text-slate-800">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1 mb-4">
                      <span className="text-slate-400 text-xs font-bold uppercase">About</span>
                      <p className="text-slate-600 text-xs line-clamp-3">{company.about || "No description."}</p>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Founded</span>
                      <span className="font-bold text-slate-700">{company.founded || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Team Size</span>
                      <span className="font-bold text-slate-700">{company.teamSize || "N/A"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Phone</span>
                      <span className="font-bold text-slate-700">{company.phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Address</span>
                      <span className="font-bold text-slate-700 text-right max-w-[150px]">{company.address}</span>
                    </div>
                  </div>
                  <div className="pt-6">
                    <Link to="/company/edit-profile" className="block w-full text-center py-3 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-200 transition-all no-underline">
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Manage Your Job Postings</h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{jobs.length} Total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Job Role</th>
                    <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Date Posted</th>
                    <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Applications</th>
                    <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Status</th>
                    <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {jobs.map(job => (
                    <tr key={job._id} className="group">
                      <td className="py-4">
                        <p className="font-bold text-slate-800">{job.jobTitle}</p>
                        <p className="text-[10px] text-slate-400">{job.location}</p>
                      </td>
                      <td className="py-4 text-sm text-slate-500">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded ${job.applicationCount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                          {job.applicationCount || 0} Applications
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded">Active</span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => navigate(`/company/applicants/${job._id}`)}
                          className="text-emerald-600 font-bold text-xs hover:underline cursor-pointer border-none bg-none"
                        >
                          View Apps
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobs.length === 0 && <div className="text-center py-20 text-slate-400 italic">No jobs found. Start by posting one!</div>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CompanyDashboard;
