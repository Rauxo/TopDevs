import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../API/AuthContext";
import API from "../API/api";
import { Check, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const { user, company, refreshAuth } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const type = user ? "User" : "Company";

  useEffect(() => {
    fetchPlans();
  }, [type]);

  const fetchPlans = async () => {
    try {
      const res = await API.get(`/payment/plans?type=${type}`);
      setPlans(res.data.plans);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (planId) => {
    try {
      const res = await API.post("/payment/create-order", { planId });
      const { paymentUrl } = res.data;

      if (paymentUrl) {
        // Redirect to CodeShop payment page
        window.location.href = paymentUrl;
      } else {
        alert("Failed to get payment URL. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Choose Your <span className="text-emerald-600">Growth</span> Plan
          </h1>
          <p className="text-lg text-slate-500 font-bold max-w-2xl mx-auto">
            Unlock unlimited messaging, priority support, and exclusive features tailored for your success.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan._id}
                className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-10 flex flex-col hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:border-emerald-200 group"
              >
                <div className="mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg ${
                    plan.name === 'Basic' ? 'bg-blue-500 shadow-blue-500/20' : 
                    plan.name === 'Standard' ? 'bg-purple-500 shadow-purple-500/20' : 
                    'bg-emerald-500 shadow-emerald-500/20'
                  }`}>
                    {plan.name === 'Basic' ? <Zap size={28} /> : 
                     plan.name === 'Standard' ? <Shield size={28} /> : 
                     <Rocket size={28} />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                    <span className="text-slate-400 font-bold">/{plan.durationInDays} days</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    {plan.messageLimit} Messages
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    Priority Support
                  </li>
                  <li className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                    <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    Profile Visibility Boost
                  </li>
                </ul>

                <button 
                  onClick={() => handleCheckout(plan._id)}
                  className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 border-none cursor-pointer group-hover:scale-105 active:scale-95"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
