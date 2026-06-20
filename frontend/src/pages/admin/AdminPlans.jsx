import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import API from "../../API/api";
import { Plus, Trash2, Zap, Shield, Rocket } from "lucide-react";

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "Basic",
    type: "User",
    price: "",
    messageLimit: "",
    durationInDays: "30"
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await API.get("/admin/plans");
      setPlans(res.data.plans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/plans", newPlan);
      setShowAddModal(false);
      setNewPlan({ name: "Basic", type: "User", price: "", messageLimit: "", durationInDays: "30" });
      fetchPlans();
    } catch (err) {
      alert("Failed to create plan");
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await API.delete(`/admin/plan/${id}`);
      fetchPlans();
    } catch (err) {
      alert("Failed to delete plan");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
            <p className="text-slate-500 font-bold mt-1">Manage premium tiers for users and companies.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded hover:bg-blue-700 transition-all shadow-blue-500/20 border-none cursor-pointer"
          >
            <Plus size={18} /> Add New Plan
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan._id} className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 relative group hover:shadow-md transition-all">
                <button 
                  onClick={() => handleDeletePlan(plan._id)}
                  className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white ${
                  plan.name === 'Basic' ? 'bg-blue-500' : 
                  plan.name === 'Standard' ? 'bg-slate-500' : 
                  'bg-blue-500'
                }`}>
                  {plan.name === 'Basic' ? <Zap size={24} /> : 
                   plan.name === 'Standard' ? <Shield size={24} /> : 
                   <Rocket size={24} />}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    plan.type === 'User' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                  }`}>
                    {plan.type}
                  </span>
                </div>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                  <span className="text-slate-400 font-bold text-sm">/{plan.durationInDays} days</span>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-50">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Message Limit</span>
                    <span className="text-slate-900 font-black">{plan.messageLimit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-bold">Duration</span>
                    <span className="text-slate-900 font-black">{plan.durationInDays} Days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Plan Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-10 animate-in zoom-in-95 duration-300">
              <h2 className="text-2xl font-black text-slate-900 mb-8">Create New Plan</h2>
              <form onSubmit={handleAddPlan} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Plan Name</label>
                  <select 
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-700"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Target Type</label>
                  <select 
                    value={newPlan.type}
                    onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-700"
                  >
                    <option value="User">User</option>
                    <option value="Company">Company</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Price (INR)</label>
                    <input 
                      type="number" 
                      required
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                      placeholder="e.g. 499"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Msg Limit</label>
                    <input 
                      type="number" 
                      required
                      value={newPlan.messageLimit}
                      onChange={(e) => setNewPlan({ ...newPlan, messageLimit: e.target.value })}
                      placeholder="e.g. 50"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Duration (Days)</label>
                  <input 
                    type="number" 
                    required
                    value={newPlan.durationInDays}
                    onChange={(e) => setNewPlan({ ...newPlan, durationInDays: e.target.value })}
                    placeholder="e.g. 30"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded outline-none focus:bg-white focus:border-blue-500 transition-all font-bold text-slate-700"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 border-none cursor-pointer"
                  >
                    Create Plan
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-5 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-200 transition-all border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;
