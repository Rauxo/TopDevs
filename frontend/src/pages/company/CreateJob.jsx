import React, { useState } from "react";
import API from "../../API/api";
import { useNavigate } from "react-router-dom";
import { Briefcase, Send } from "lucide-react";

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    description: "",
    requirements: "",
    expiredDate: "",
    location: "",
    salary: "",
    jobType: "Full-time",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/job/create", formData);
      alert("Job posted successfully!");
      navigate("/company/dashboard");
    } catch (err) {
      console.error("Error creating job", err);
      alert(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-slate-100">
            <div className="mb-10 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded mb-4">
                <Briefcase size={14} /> Hiring Portal
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900">Post a New Job</h1>
              <p className="text-slate-500 mt-2">Fill in the details to find the best talent for your company.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Job Title</label>
                  <input
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Location</label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. New York, Remote"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Job Type</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:bg-white outline-none transition-all appearance-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Salary Range (Optional)</label>
                  <input
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹5,00,000 - ₹8,00,000"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Expiry Date</label>
                  <input
                    type="date"
                    name="expiredDate"
                    value={formData.expiredDate}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Detailed Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Describe the role, day-to-day responsibilities, etc."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Key Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="List skills, experience, and qualifications needed..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-blue-600 text-white font-bold text-lg rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-[0.98]"
              >
                {loading ? "Posting Job..." : <span className="flex items-center justify-center gap-2">Publish Job Posting <Send size={20} /></span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateJob;
