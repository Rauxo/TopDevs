import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Mail, Phone, CheckCircle2, ArrowRight, ShieldX, MessageSquare, Building2, Users } from "lucide-react";
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
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!company) return (
    <div className="text-center py-20 bg-slate-50 min-h-screen">
      <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
      <p className="text-lg font-bold text-slate-600">Company not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Flush Header ── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Logo */}
            {company.companyIcon ? (
              <img
                src={`http://localhost:5000/${company.companyIcon}`}
                alt={company.name}
                className="w-24 h-24 rounded object-cover border border-slate-200 bg-white"
              />
            ) : (
              <div className="w-24 h-24 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-3xl">
                {company.name.charAt(0)}
              </div>
            )}
            
            {/* Title & Badges */}
            <div className="text-center md:text-left pt-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{company.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3">
                {company.isVerified ? (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded text-xs flex items-center gap-1.5 border border-blue-100">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded text-xs border border-slate-200">
                    Unverified
                  </span>
                )}
                {company.founded && (
                  <span className="text-slate-500 text-sm font-medium">Est. {company.founded}</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          {user && (
            <div className="flex-shrink-0 pt-2">
              <button 
                onClick={handleMessage}
                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors flex items-center gap-2 border-none cursor-pointer w-full md:w-auto justify-center"
              >
                <MessageSquare size={18} /> Message Company
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Layout ── */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-2 space-y-12">
            
            {!company.isVerified && (
              <div className="bg-white border-l-4 border-amber-500 p-6 rounded text-left shadow-sm">
                 <div className="flex items-start gap-4">
                   <ShieldX size={24} className="text-amber-500 flex-shrink-0 mt-1" />
                   <div>
                     <h3 className="text-lg font-bold text-slate-900 mb-1">Trust & Safety Notice</h3>
                     <p className="text-slate-600 text-sm">
                       This company is currently undergoing our verification process. Job applications and other operations are temporarily disabled for your safety.
                     </p>
                   </div>
                 </div>
              </div>
            )}

            {/* About Section */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6">About Us</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed text-base">
                  {company.about || "No description provided."}
                </p>
              </div>
            </section>

            {/* Open Positions */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-6 border-b border-slate-200 pb-4">
                Open Positions <span className="text-blue-600 ml-2">({jobs.length})</span>
              </h2>
              
              <div className="flex flex-col">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <div
                      key={job._id}
                      onClick={() => company.isVerified && navigate(`/jobs/${job._id}`)}
                      className={`py-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                        company.isVerified ? "cursor-pointer hover:bg-white px-4 -mx-4 rounded transition-colors" : "opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div>
                        <h3 className={`text-xl font-bold text-slate-900 mb-1 transition-colors ${company.isVerified ? "group-hover:text-blue-600" : ""}`}>
                          {job.jobTitle}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                          <MapPin size={14} /> {job.location} <span className="text-slate-300">•</span> {job.jobType || "Full-time"}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {company.isVerified ? (
                          <span className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-300 text-slate-900 font-bold text-sm rounded group-hover:bg-slate-50 group-hover:border-slate-400 transition-colors">
                            View Role
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest bg-slate-100 px-3 py-1 rounded">Disabled</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 italic py-4">No open positions at the moment.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            
            {/* At a glance */}
            <div className="bg-slate-900 p-8 rounded text-white shadow-sm">
              <h3 className="text-lg font-bold mb-6 border-b border-slate-700 pb-4">At a Glance</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm leading-tight">{company.address || "Location not provided"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm truncate">{company.email || "N/A"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm truncate">{company.phone || "N/A"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users size={18} className="text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm truncate">{company.teamSize ? `${company.teamSize} Employees` : "Team size N/A"}</span>
                </li>
              </ul>
            </div>

            {/* Gallery */}
            {company.companyImages && company.companyImages.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Office Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  {company.companyImages.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000/${img}`}
                      alt={`Office ${i}`}
                      className="w-full h-24 object-cover rounded border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfile;
