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
      alert("Welcome Admin!");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <ShieldCheck size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Admin Terminal</h1>
          <p className="text-slate-400 font-medium">Access secure administrative dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white/5 p-8 rounded-[32px] border border-white/10 backdrop-blur-xl">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                required
                placeholder="1234567890"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all font-medium"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all font-medium"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Authenticating..." : (
              <>Initialize Dashboard <ArrowRight size={20} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
