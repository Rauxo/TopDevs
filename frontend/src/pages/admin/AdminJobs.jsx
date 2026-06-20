import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Briefcase, MapPin, Trash2, Search, ExternalLink } from "lucide-react";
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Moderation</h1>
          <p className="text-slate-500 font-medium">Review and moderate active job opportunities</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search jobs or companies..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded outline-none focus:border-blue-600 transition-all font-medium text-sm text-slate-900"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900">Position</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900">Company</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900">Location</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-500 text-sm font-bold">Fetching job database...</td></tr>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{job.jobTitle}</p>
                      <p className="text-xs text-slate-500 mt-0.5 uppercase font-bold">{job.jobType || "Full-time"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0">
                          {job.company?.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{job.company?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <MapPin size={14} className="text-blue-600 shrink-0" />
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 items-center">
                        <button
                          onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all border-none bg-transparent cursor-pointer"
                          title="View Job"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all border-none bg-transparent cursor-pointer"
                          title="Remove Job"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-500 text-sm font-bold">No job postings found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminJobs;
