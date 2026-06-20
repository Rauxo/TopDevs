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

  if (loading) return <div className="flex justify-center items-center h-96 animate-pulse text-slate-400">Initializing System Data...</div>;

  const statCards = [
    { label: "Total Students", value: data.stats.userCount, icon: <Users size={24} />, color: "blue" },
    { label: "Registered Companies", value: data.stats.companyCount, icon: <Building2 size={24} />, color: "emerald" },
    { label: "Live Job Postings", value: data.stats.jobCount, icon: <Briefcase size={24} />, color: "slate" },
    { label: "Total Applications", value: data.stats.applicationCount, icon: <ClipboardList size={24} />, color: "orange" },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 font-medium">Real-time platform metrics and recent activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-${stat.color}-500 shadow-lg shadow-${stat.color}-500/20`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Pending Verifications */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <Clock className="text-amber-500" /> Pending Verification
             </h3>
             <Link to="/admin/companies" className="text-xs font-bold text-blue-600 no-underline hover:underline">View All</Link>
           </div>
           
           <div className="space-y-4">
             {data.recentCompanies.length > 0 ? data.recentCompanies.map(comp => (
               <div key={comp._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <img src={`http://localhost:5000/${comp.companyIcon}`} className="w-10 h-10 rounded-xl object-cover" alt="logo" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{comp.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{new Date(comp.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Link to="/admin/companies" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 transition-colors">
                    <ArrowRight size={18} />
                  </Link>
               </div>
             )) : (
               <div className="py-10 text-center text-slate-400 italic font-medium">All companies verified.</div>
             )}
           </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <Briefcase className="text-blue-500" /> Recent Job Postings
             </h3>
             <Link to="/admin/jobs" className="text-xs font-bold text-blue-600 no-underline hover:underline">View All</Link>
           </div>
           
           <div className="space-y-4">
             {data.recentJobs.map(job => (
               <div key={job._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{job.jobTitle}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{job.company?.name || "Unknown Company"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[9px] font-black uppercase rounded">Live</span>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
