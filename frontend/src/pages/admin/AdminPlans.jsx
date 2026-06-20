import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import API from "../../API/api";
import { Plus, Trash2, Zap, Shield, Rocket, X } from "lucide-react";

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

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded outline-none focus:bg-white focus:border-blue-600 transition-all font-medium text-sm text-slate-900";

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 font-medium">Manage premium tiers for users and companies.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded hover:bg-blue-700 transition-all border-none cursor-pointer"
        >
          <Plus size={18} /> Add Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded border border-slate-200 p-6 relative hover:border-slate-300 transition-colors">
              <button
                onClick={() => handleDeletePlan(plan._id)}
                className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer"
              >
                <Trash2 size={16} />
              </button>

              <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center mb-5 text-slate-900">
                {plan.name === 'Basic' ? <Zap size={20} /> :
                  plan.name === 'Standard' ? <Shield size={20} /> :
                    <Rocket size={20} />}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${plan.type === 'User' ? 'bg-white text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {plan.type}
                </span>
              </div>

              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                <span className="text-slate-500 font-bold text-sm">/{plan.durationInDays} days</span>
              </div>

              <div className="space-y-2 pt-5 border-t border-slate-100">
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
          {plans.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-slate-50 border border-dashed border-slate-300 rounded text-slate-500 font-bold text-sm">
              No plans created yet. Click "Add Plan" to get started.
            </div>
          )}
        </div>
      )}

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded border border-slate-200 shadow-xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">Create New Plan</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPlan} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Plan Name</label>
                <select
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className={inputClass}
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Target Type</label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
                  className={inputClass}
                >
                  <option value="User">User</option>
                  <option value="Company">Company</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                    placeholder="e.g. 499"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Msg Limit</label>
                  <input
                    type="number"
                    required
                    value={newPlan.messageLimit}
                    onChange={(e) => setNewPlan({ ...newPlan, messageLimit: e.target.value })}
                    placeholder="e.g. 50"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Duration (Days)</label>
                <input
                  type="number"
                  required
                  value={newPlan.durationInDays}
                  onChange={(e) => setNewPlan({ ...newPlan, durationInDays: e.target.value })}
                  placeholder="e.g. 30"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold text-sm rounded hover:bg-blue-700 transition-all border-none cursor-pointer"
                >
                  Create Plan
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-50 text-slate-700 font-bold text-sm rounded hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPlans;
