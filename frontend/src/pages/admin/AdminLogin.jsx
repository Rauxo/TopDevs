import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Phone, Lock, ArrowRight } from "lucide-react";
import API from "../../API/api";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/admin/login", formData);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("role", "admin");
      
      // Reload the page to remount the AdminProtectedRoute and show the dashboard seamlessly on the same URL
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                placeholder="1234567890"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer border-none"
          >
            {loading ? "Authenticating..." : (
              <> Login  <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
