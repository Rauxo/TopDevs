import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, FileText, Mail, FolderOpen } from "lucide-react";
import API from "../../API/api";

const ViewApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/job/applications/${jobId}`);
      setApplicants(res.data.applications);
    } catch (err) {
      console.error("Error fetching applicants", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await API.put(`/job/update-status/${appId}`, { status: newStatus });
      // Update local state instead of full refetch for better UX
      setApplicants(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error("Error updating status", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 rounded-full transition-colors flex items-center justify-center">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900">Job Applicants</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : applicants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicants.map((app) => (
                <div key={app._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <User size={28} className="text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{app.name}</h3>
                        <p className="text-xs text-slate-500">{app.email}</p>
                      </div>
                    </div>
                    <div className="relative group">
                       <select 
                        value={app.status || "Applied"}
                        disabled={updatingId === app._id}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-widest border-none outline-none rounded-lg px-2 py-1.5 cursor-pointer transition-all ${
                          app.status === "Accepted" ? "bg-emerald-100 text-emerald-700" :
                          app.status === "Rejected" ? "bg-red-100 text-red-700" :
                          app.status === "Pending" ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        }`}
                       >
                         <option value="Applied">Applied</option>
                         <option value="Pending">Pending</option>
                         <option value="Accepted">Accepted</option>
                         <option value="Rejected">Rejected</option>
                       </select>
                       {updatingId === app._id && (
                         <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Phone</span>
                      <span className="font-bold text-slate-700">{app.phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Education</span>
                      <span className="font-bold text-slate-700">{app.education}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-tighter">Address</span>
                      <span className="font-bold text-slate-700 leading-tight">{app.address}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex gap-3 mt-auto">
                    <a
                      href={`http://localhost:5000/${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-50 transition-all no-underline flex items-center justify-center gap-2"
                    >
                      <FileText size={14} /> Resume
                    </a>
                    <button className="flex-1 py-3 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      <Mail size={14} /> Contact
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[32px] text-center border border-slate-100 flex flex-col items-center">
              <div className="text-slate-200 mb-6">
                <FolderOpen size={80} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">No applicants yet</h2>
              <p className="text-slate-500 mt-2">When someone applies for this job, their details will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewApplicants;
