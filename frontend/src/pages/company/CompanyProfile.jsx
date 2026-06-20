import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone, CheckCircle2, ArrowRight, AlertTriangle, ShieldX, MessageSquare } from "lucide-react";
import API from "../../API/api";
import { AuthContext } from "../../API/AuthContext";

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(AuthContext);

  const handleMessage = async () => {
    if (!user) return alert("Please login to message the company");
    try {
      await API.post("/message/send", {
        receiverId: company._id,
        receiverType: "Company",
        text: "Hi, I'm interested in your company!"
      });
      navigate("/UserDashboard", { state: { activeTab: "messages" } });
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!company) return (
    <div className="text-center py-20">Company not found.</div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Cover */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 to-blue-600"></div>

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
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-500" /> {company.address}</span>
                <span className="flex items-center gap-1.5"><Mail size={16} className="text-blue-500" /> {company.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={16} className="text-blue-500" /> {company.phone}</span>
              </div>
            </div>
            <div className="pb-2">
               {company.isVerified ? (
                 <span className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded text-sm flex items-center gap-2">
                   <CheckCircle2 size={16} /> Verified Company
                 </span>
               ) : (
                 <span className="px-4 py-2 bg-amber-100 text-amber-700 font-bold rounded text-sm flex items-center gap-2">
                   <AlertTriangle size={16} /> Company Not Verified
                 </span>
               )}
            </div>
            {user && (
              <div className="pb-2">
                <button 
                  onClick={handleMessage}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 transition-all flex items-center gap-2 border-none cursor-pointer"
                >
                  <MessageSquare size={18} /> Message
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
          <div className="lg:col-span-2 space-y-12">
            {!company.isVerified && (
              <div className="bg-amber-50 border-2 border-dashed border-amber-200 p-8 rounded-[32px] text-center mb-8">
                 <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <ShieldX size={32} className="text-amber-600" />
                 </div>
                 <h3 className="text-xl font-bold text-amber-900 mb-2">Trust & Safety Notice</h3>
                 <p className="text-amber-700 text-sm max-w-lg mx-auto">
                   This company is currently undergoing our verification process. Job applications and other operations are temporarily disabled for your safety.
                 </p>
              </div>
            )}

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Open Positions ({jobs.length})</h2>
              <div className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <div
                      key={job._id}
                      onClick={() => company.isVerified && navigate(`/jobs/${job._id}`)}
                      className={`p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all flex items-center justify-between group ${
                        company.isVerified ? "hover:shadow-md hover:border-blue-200 cursor-pointer" : "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div>
                        <h3 className={`font-bold text-slate-800 transition-colors ${company.isVerified ? "group-hover:text-blue-600" : ""}`}>{job.jobTitle}</h3>
                        <p className="text-sm text-slate-500 mt-1">{job.location} • {job.jobType || "Full-time"}</p>
                      </div>
                      {company.isVerified ? (
                        <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          View <ArrowRight size={16} />
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Disabled</span>
                      )}
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
