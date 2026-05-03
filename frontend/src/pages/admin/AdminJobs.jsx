import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Briefcase, Building2, MapPin, Trash2, Search, ExternalLink } from "lucide-react";
import API from "../../API/api";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/admin/jobs");
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this job listing? This will also remove related applications.")) {
      try {
        await API.delete(`/admin/job/${id}`);
        setJobs(jobs.filter(j => j._id !== id));
      } catch (err) {
        alert("Deletion failed");
      }
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Moderation</h1>
          <p className="text-slate-500 font-medium">Review and moderate active job opportunities</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search jobs or companies..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Position</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Company</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic">Fetching job database...</td></tr>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <div>
                         <p className="font-bold text-slate-800 text-sm">{job.jobTitle}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">{job.jobType || "Full-time"}</p>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                           {job.company?.name.charAt(0)}
                         </div>
                         <span className="text-sm font-medium text-slate-700">{job.company?.name || "Unknown"}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2 text-slate-500 text-sm">
                         <MapPin size={14} className="text-emerald-500" />
                         {job.location}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                       <button 
                         onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
                         className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                         title="View Job"
                       >
                         <ExternalLink size={20} />
                       </button>
                       <button 
                         onClick={() => handleDelete(job._id)}
                         className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border-none bg-transparent cursor-pointer"
                         title="Remove Job"
                       >
                         <Trash2 size={20} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic">No job postings found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminJobs;
