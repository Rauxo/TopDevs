import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../API/api";
import { AuthContext } from "../API/AuthContext";
import { CheckCircle, XCircle, Loader2, Sparkles } from "lucide-react";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshAuth } = useContext(AuthContext);
  const [status, setStatus] = useState("loading"); // loading, success, failed
  const [message, setMessage] = useState("Verifying your payment...");

  const order_id = searchParams.get("order_id");
  const plan_id = searchParams.get("plan_id");

  useEffect(() => {
    if (order_id && plan_id) {
      verifyPayment();
    } else {
      setStatus("failed");
      setMessage("Invalid payment session.");
    }
  }, [order_id, plan_id]);

  const verifyPayment = async () => {
    try {
      const res = await API.post("/payment/verify-payment", {
        order_id,
        planId: plan_id,
      });
      await refreshAuth();
      setStatus("success");
      setMessage(res.data.message || "Payment verified successfully!");
    } catch (err) {
      setStatus("failed");
      setMessage(err.response?.data?.message || "Payment verification failed.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-12 text-center border border-white">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 size={64} className="text-blue-500 animate-spin mb-8" />
            <h2 className="text-2xl font-black text-slate-900 mb-4">Verifying Payment</h2>
            <p className="text-slate-500 font-bold">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-blue-100 rounded-[32px] flex items-center justify-center mb-8 text-blue-600 shadow-lg shadow-blue-500/10">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Payment Success!</h2>
            <p className="text-slate-500 font-bold mb-10">{message}</p>
            <button 
              onClick={() => navigate("/messages")}
              className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 border-none cursor-pointer flex items-center justify-center gap-2"
            >
              Start Messaging <Sparkles size={18} />
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-100 rounded-[32px] flex items-center justify-center mb-8 text-red-600 shadow-lg shadow-red-500/10">
              <XCircle size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Payment Failed</h2>
            <p className="text-slate-500 font-bold mb-10">{message}</p>
            <button 
              onClick={() => navigate("/pricing")}
              className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 border-none cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
