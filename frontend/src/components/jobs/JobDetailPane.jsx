import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Calendar, FileText, X, ArrowRight, Target, Briefcase, DollarSign, Clock, Phone } from "lucide-react";
import API from "../../API/api";
import { AuthContext } from "../../API/AuthContext";

const JobDetailPane = ({ jobId, onClose }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    education: "",
    resume: null,
  });

  useEffect(() => {
    if (!jobId) return;
    
    const fetchJob = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/job/detail/${jobId}`);
        setJob(res.data.job);
        setAlreadyApplied(res.data.alreadyApplied);
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.username || "",
            email: user.email || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId, user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login as a user to apply");
      navigate("/login");
      return;
    }

    setApplying(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append("jobId", jobId);

    try {
      await API.post("/job/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted successfully!");
      setShowModal(false);
      setAlreadyApplied(true);
    } catch (err) {
      console.error("Error applying for job", err);
      alert(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (!jobId) return (
    <div className="flex flex-col items-center justify-center h-full bg-white text-slate-400 p-10">
       <Briefcase size={48} className="mb-4 text-slate-200" />
       <p className="text-base font-bold">Select a job to view details</p>
    </div>
  );

  if (loading || authLoading) return (
    <div className="flex justify-center items-center h-full bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!job) return (
    <div className="text-center py-20 text-base font-bold text-slate-400 bg-white">Job not found.</div>
  );

  return (
    <div className="bg-white font-sans relative h-full flex flex-col">
      {/* Mobile Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded p-1.5 transition-colors lg:hidden"
        >
          <X size={20} />
        </button>
      )}

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {/* Simple Header */}
        <div className="bg-white px-6 pt-6 pb-4 border-b border-slate-200 shrink-0">
           <div className="flex flex-col gap-4">
              {/* Title & Apply Button */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.jobTitle}</h1>
                  <p className="text-sm text-slate-600 underline cursor-pointer mb-2">{job.company?.name || "Unknown Company"}</p>
                  <p className="text-sm text-slate-600 mb-2">{job.location}</p>
                </div>
                
                <div className="shrink-0 w-full md:w-auto">
                   {user ? (
                     <button
                       onClick={() => !alreadyApplied && setShowModal(true)}
                       disabled={alreadyApplied}
                       className={`px-6 py-2 font-bold rounded transition-colors flex items-center justify-center w-full md:w-auto text-sm ${
                         alreadyApplied 
                           ? "bg-slate-200 text-slate-500 cursor-not-allowed" 
                           : "bg-blue-600 text-white hover:bg-blue-700"
                       }`}
                     >
                       {alreadyApplied ? "Applied" : "Apply now"}
                     </button>
                   ) : (
                     <button onClick={() => navigate("/login")} className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors text-sm">
                       Sign in to Apply
                     </button>
                   )}
                </div>
              </div>
           </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-6 space-y-6">
           
           {/* Job Details Box */}
           <div className="border border-slate-200 rounded p-4">
              <h3 className="font-bold text-slate-900 mb-3 text-base">Job details</h3>
              <div className="space-y-4">
                {job.salary && (
                  <div>
                    <p className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5"><DollarSign size={14}/> Pay</p>
                    <p className="text-sm bg-slate-100 text-slate-700 inline-block px-2 py-1 rounded">{job.salary}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5"><Briefcase size={14}/> Job type</p>
                  <p className="text-sm bg-slate-100 text-slate-700 inline-block px-2 py-1 rounded">{job.jobType || "Full-time"}</p>
                </div>
              </div>
           </div>

           {/* Description */}
           <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-900 mb-3 text-base">Full Job Description</h3>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{job.description}</p>
           </div>
           
           {/* Requirements */}
           <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-900 mb-3 text-base">Requirements</h3>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
           </div>

           {/* Simple Company Card */}
           <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-slate-900 mb-3 text-base">About the Company</h3>
              <div className="text-sm text-slate-700 space-y-2">
                 <p>{job.company?.phone || "Phone not available"}</p>
                 <p>{job.company?.address || "Address not provided"}</p>
              </div>
              <button onClick={() => navigate(`/company/profile/${job.company?._id}`)} className="mt-4 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 font-bold transition-colors text-sm">
                 View Company
              </button>
           </div>
        </div>

        {/* Application Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">Apply to {job.company?.name || "Company"}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1">
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Full Name *</label>
                      <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Phone Number *</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700">Highest Education *</label>
                      <input name="education" value={formData.education} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-1 mt-4">
                    <label className="text-sm font-bold text-slate-700">Current Address *</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows="2" className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-600 resize-none"></textarea>
                  </div>
                  <div className="space-y-1 mt-4">
                    <label className="text-sm font-bold text-slate-700">Resume (PDF/DOC) *</label>
                    <input type="file" name="resume" onChange={handleChange} required accept=".pdf,.doc,.docx" className="w-full px-3 py-2 border border-slate-300 rounded text-sm text-slate-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-blue-700 hover:file:bg-slate-200" />
                  </div>
                  
                  <div className="pt-4 mt-6 border-t border-slate-200">
                    <button
                      type="submit"
                      disabled={applying}
                      className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      {applying ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPane;
