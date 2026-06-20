import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../API/AuthContext";
import { ArrowLeft, Camera } from "lucide-react";
import API from "../../API/api";

const EditCompanyProfile = () => {
  const { company, setCompany } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    about: "",
    founded: "",
    teamSize: "",
    companyIcon: null,
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        about: company.about || "",
        founded: company.founded || "",
        teamSize: company.teamSize || "",
        companyIcon: null,
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "companyIcon") {
      setFormData({ ...formData, companyIcon: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("about", formData.about);
    data.append("founded", formData.founded);
    data.append("teamSize", formData.teamSize);
    if (formData.companyIcon) {
      data.append("companyIcon", formData.companyIcon);
    }

    try {
      const res = await API.put("/company/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCompany(res.data.company);
      alert("Company profile updated successfully!");
      navigate("/company/dashboard");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!company) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900">Edit Company Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                   <img 
                    src={formData.companyIcon ? URL.createObjectURL(formData.companyIcon) : `http://localhost:5000/${company.companyIcon}`} 
                    alt="preview" 
                    className="w-full h-full object-cover"
                   />
                </div>
                <label htmlFor="icon-upload" className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                  <Camera size={18} />
                </label>
                <input type="file" id="icon-upload" name="companyIcon" onChange={handleChange} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Company Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Founded Year</label>
                <input name="founded" value={formData.founded} onChange={handleChange} placeholder="e.g. 2015" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Team Size</label>
                <input name="teamSize" value={formData.teamSize} onChange={handleChange} placeholder="e.g. 10-50" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Address</label>
              <input name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">About Company</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:border-blue-500 transition-all resize-none"
                placeholder="Describe your company..."
              ></textarea>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
              >
                {loading ? "Updating..." : "Update Company Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyProfile;
