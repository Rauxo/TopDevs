import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Users, Building2, Briefcase, ClipboardList, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import API from "../../API/api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    </AdminLayout>
  );

  const statCards = [
    { label: "Total Students", value: data.stats.userCount, icon: <Users size={20} /> },
    { label: "Registered Companies", value: data.stats.companyCount, icon: <Building2 size={20} /> },
    { label: "Live Job Postings", value: data.stats.jobCount, icon: <Briefcase size={20} /> },
    { label: "Total Applications", value: data.stats.applicationCount, icon: <ClipboardList size={20} /> },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-medium">Real-time platform metrics and recent activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded border border-slate-200 flex items-center gap-5 hover:border-slate-300 transition-colors">
            <div className="w-12 h-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Pending Verifications */}
        <div className="bg-white rounded p-6 md:p-8 border border-slate-200">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
               <Clock className="text-amber-500" size={18} /> Pending Verification
             </h3>
             <Link to="/admin/companies" className="text-xs font-bold text-blue-600 no-underline hover:underline">View All</Link>
           </div>
           
           <div className="space-y-3">
             {data.recentCompanies.length > 0 ? data.recentCompanies.map(comp => (
               <div key={comp._id} className="flex items-center justify-between p-4 bg-white rounded border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img src={`http://localhost:5000/${comp.companyIcon}`} className="w-10 h-10 rounded object-cover border border-slate-200 bg-white" alt="logo" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{comp.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(comp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link to="/admin/companies" className="p-2 bg-white rounded border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors shrink-0">
                    <ArrowRight size={16} />
                  </Link>
               </div>
             )) : (
               <div className="py-10 text-center text-sm font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded">
                 All companies verified.
               </div>
             )}
           </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded p-6 md:p-8 border border-slate-200">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
               <Briefcase className="text-blue-600" size={18} /> Recent Job Postings
             </h3>
             <Link to="/admin/jobs" className="text-xs font-bold text-blue-600 no-underline hover:underline">View All</Link>
           </div>
           
           <div className="space-y-3">
             {data.recentJobs.map(job => (
               <div key={job._id} className="flex items-center justify-between p-4 bg-white rounded border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{job.jobTitle}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{job.company?.name || "Unknown Company"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded border border-slate-200 tracking-wide">Live</span>
                  </div>
               </div>
             ))}
             {data.recentJobs.length === 0 && (
                <div className="py-10 text-center text-sm font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded">
                  No jobs posted recently.
                </div>
             )}
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
