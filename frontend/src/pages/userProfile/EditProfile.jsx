import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../API/AuthContext";
import { ArrowLeft, Camera } from "lucide-react";
import API from "../../API/api";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    about: "",
    profileImg: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        about: user.about || "",
        profileImg: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImg") {
      setFormData({ ...formData, profileImg: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("about", formData.about);
    if (formData.profileImg) {
      data.append("profileImg", formData.profileImg);
    }

    try {
      const res = await API.put("/auth/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.user);
      alert("Profile updated successfully!");
      navigate("/UserDashboard");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                   <img 
                    src={formData.profileImg ? URL.createObjectURL(formData.profileImg) : `http://localhost:5000/${user.profileImg}`} 
                    alt="preview" 
                    className="w-full h-full object-cover"
                   />
                </div>
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                  <Camera size={18} />
                </label>
                <input type="file" id="profile-upload" name="profileImg" onChange={handleChange} className="hidden" accept="image/*" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">About / Bio</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all resize-none"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
              >
                {loading ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
