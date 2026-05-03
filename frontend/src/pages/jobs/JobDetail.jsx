import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, MapPin, Calendar, FileText, X, ArrowRight } from "lucide-react";
import API from "../../API/api";
import { AuthContext } from "../../API/AuthContext";

const JobDetail = () => {
  const { id } = useParams();
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
    const fetchJob = async () => {
      try {
        const res = await API.get(`/job/detail/${id}`);
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
  }, [id, user]);

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
    data.append("jobId", id);

    try {
      await API.post("/job/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Error applying for job", err);
      alert(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading || authLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!job) return (
    <div className="text-center py-20">Job not found.</div>
  );

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {job.company?.companyIcon ? (
                  <img
                    src={`http://localhost:5000/${job.company.companyIcon}`}
                    alt={job.company.name}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-100"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-3xl">
                    {job.company?.name ? job.company.name.charAt(0) : "J"}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{job.jobTitle}</h1>
                  <div className="flex flex-wrap items-center gap-6 text-slate-600 font-medium">
                    <span className="flex items-center gap-2"><Building2 size={18} className="text-emerald-500" /> {job.company?.name || "Unknown Company"}</span>
                    <span className="flex items-center gap-2"><MapPin size={18} className="text-emerald-500" /> {job.location}</span>
                    <span className="text-emerald-600 flex items-center gap-2"><Calendar size={18} /> Exp: {new Date(job.expiredDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              {user ? (
                <button
                  onClick={() => !alreadyApplied && setShowModal(true)}
                  disabled={alreadyApplied}
                  className={`px-10 py-4 font-bold rounded-2xl shadow-lg transition-all ${
                    alreadyApplied 
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none" 
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 hover:-translate-y-1"
                  }`}
                >
                  {alreadyApplied ? "Already Applied" : "Apply for this Job"}
                </button>
              ) : (
                <div className="flex flex-col items-center md:items-end gap-3">
                  <p className="text-slate-600 font-semibold text-sm">Please Login to Apply for the Job</p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 hover:-translate-y-1"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Job Description</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </section>

              <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
              </section>
            </div>

            <div className="space-y-6">
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Job Overview</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Job Type</span>
                    <span className="font-bold text-slate-800">{job.jobType || "Full-time"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Salary</span>
                    <span className="font-bold text-emerald-600">{job.salary || "Not Specified"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Posted on</span>
                    <span className="font-bold text-slate-800">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </section>

              <section className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg">
                <h2 className="text-lg font-bold mb-4">About Company</h2>
                <p className="text-emerald-100 text-sm mb-4">Contact: {job.company?.phone || "N/A"}</p>
                <p className="text-emerald-100 text-sm mb-6">{job.company?.address || "N/A"}</p>
                <button 
                  onClick={() => navigate(`/company/profile/${job.company?._id}`)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors cursor-pointer border-none bg-none"
                >
                  View Profile
                </button>
              </section>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-drop-in">
              <div className="px-8 py-6 bg-emerald-600 flex justify-between items-center text-white">
                <h2 className="text-2xl font-bold">Apply for {job.jobTitle}</h2>
                <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform p-1">
                  <X size={28} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Highest Education</label>
                    <input name="education" value={formData.education} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Current Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none resize-none"></textarea>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Resume (PDF/DOC)</label>
                  <div className="relative">
                    <input type="file" name="resume" onChange={handleChange} required accept=".pdf,.doc,.docx" className="hidden" id="resume-upload" />
                    <label htmlFor="resume-upload" className="flex items-center justify-center gap-3 w-full px-4 py-6 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                      <FileText size={24} className="text-emerald-600" />
                      <span className="font-bold text-slate-600">{formData.resume ? formData.resume.name : "Click to upload your resume"}</span>
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={applying}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  {applying ? "Submitting Application..." : (
                    <>
                      Submit Application <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JobDetail;
