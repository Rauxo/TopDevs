import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, FileText, Mail, FolderOpen } from "lucide-react";
import API from "../../API/api";

const ViewApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/job/applications/${jobId}`);
        setApplicants(res.data.applications);
      } catch (err) {
        console.error("Error fetching applicants", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

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
                <div key={app._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                      <User size={28} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{app.name}</h3>
                      <p className="text-xs text-slate-500">{app.email}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Phone</span>
                      <span className="font-bold text-slate-700">{app.phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Education</span>
                      <span className="font-bold text-slate-700">{app.education}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="text-slate-400">Address</span>
                      <span className="font-bold text-slate-700">{app.address}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex gap-3">
                    <a
                      href={`http://localhost:5000/${app.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors no-underline flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> View Resume
                    </a>
                    <button className="flex-1 py-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                      <Mail size={16} /> Contact
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
