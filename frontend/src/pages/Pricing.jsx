import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../API/AuthContext";
import API from "../API/api";
import { Check, Zap, Shield, Rocket } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";
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
      const { payment_session_id } = res.data;

      if (payment_session_id) {
        const cashfree = await load({
          mode: "sandbox", 
        });

        cashfree.checkout({
          paymentSessionId: payment_session_id,
          redirectTarget: "_self",
        });
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
            Choose Your <span className="text-blue-600">Growth</span> Plan
          </h1>
          <p className="text-sm text-slate-600 font-medium max-w-xl mx-auto">
            Unlock unlimited messaging, priority support, and exclusive features tailored for your success.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan._id}
                className="bg-white rounded border border-slate-200 p-8 flex flex-col hover:border-blue-600 transition-colors group"
              >
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className={`w-12 h-12 rounded border border-slate-200 flex items-center justify-center mb-5 ${
                    plan.name === 'Basic' ? 'bg-slate-50 text-slate-700' : 
                    plan.name === 'Standard' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                    'bg-slate-900 text-white'
                  }`}>
                    {plan.name === 'Basic' ? <Zap size={20} /> : 
                     plan.name === 'Standard' ? <Shield size={20} /> : 
                     <Rocket size={20} />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">₹{plan.price}</span>
                    <span className="text-xs text-slate-500 font-medium">/{plan.durationInDays} days</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong className="font-bold">{plan.messageLimit}</strong> Messages</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-700 text-sm">
                    <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Profile Visibility Boost</span>
                  </li>
                </ul>

                <button 
                  onClick={() => handleCheckout(plan._id)}
                  className={`w-full py-2.5 font-bold text-sm rounded transition-colors border-none cursor-pointer ${
                    plan.name === 'Standard' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
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
