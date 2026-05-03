import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import API from "../../API/api";

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const compRes = await API.get(`/company/public-profile/${id}`);
        setCompany(compRes.data.company);
        
        // Fetch jobs for this company
        const jobRes = await API.get("/job/all");
        const companyJobs = jobRes.data.jobs.filter(job => job.company?._id === id);
        setJobs(companyJobs);
      } catch (err) {
        console.error("Error fetching company profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!company) return (
    <div className="text-center py-20">Company not found.</div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Cover */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-emerald-600 to-sky-600"></div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="relative -mt-24 mb-12">
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center md:items-end gap-8">
            <div className="w-40 h-40 rounded-[32px] bg-white p-2 shadow-lg -mt-20 md:-mt-32">
              <img
                src={`http://localhost:5000/${company.companyIcon}`}
                alt={company.name}
                className="w-full h-full rounded-[24px] object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left pb-2">
              <h1 className="text-4xl font-black text-slate-900 mb-2">{company.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 font-medium mt-2">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-emerald-500" /> {company.address}</span>
                <span className="flex items-center gap-1.5"><Mail size={16} className="text-emerald-500" /> {company.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={16} className="text-emerald-500" /> {company.phone}</span>
              </div>
            </div>
            <div className="pb-2">
               <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm flex items-center gap-2">
                 <CheckCircle2 size={16} /> Verified Company
               </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions ({jobs.length})</h2>
              <div className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <div
                      key={job._id}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{job.jobTitle}</h3>
                          <p className="text-sm text-slate-500 mt-1">{job.location} • {job.jobType || "Full-time"}</p>
                        </div>
                        <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No open positions at the moment.</p>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Office Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {company.companyImages?.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000/${img}`}
                    alt={`Office ${i}`}
                    className="w-full h-40 object-cover rounded-2xl shadow-sm"
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">About {company.name}</h3>
              <p className="text-slate-600 leading-relaxed text-sm mb-6">
                {company.about || "No description available."}
              </p>
              <div className="space-y-4 pt-6 border-t border-slate-50">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Founded</span>
                    <span className="font-bold text-slate-700">{company.founded || "N/A"}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Team Size</span>
                    <span className="font-bold text-slate-700">{company.teamSize || "N/A"}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
