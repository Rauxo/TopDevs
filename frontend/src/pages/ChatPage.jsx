import React, { useContext } from "react";
import ChatSystem from "../components/ChatSystem";
import { AuthContext } from "../API/AuthContext";
import { Navigate } from "react-router-dom";
import { MessageSquare, Sparkles, ShieldCheck } from "lucide-react";

const ChatPage = () => {
  const { user, company } = useContext(AuthContext);

  if (!user && !company) {
    return <Navigate to="/login" />;
  }

  const type = user ? "user" : "company";

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8fafc] relative overflow-hidden flex flex-col">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Page Header */}
        <div className="bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <MessageSquare size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Messages</h1>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-md">Real-time</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <ShieldCheck size={12} className="text-blue-500" /> End-to-end Encrypted
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Session</p>
              <p className="text-xs font-black text-slate-700">{user?.username || company?.name}</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 p-0.5">
              <img 
                src={user ? `http://localhost:5000/${user.profileImg}` : `http://localhost:5000/${company.companyIcon}`} 
                className="w-full h-full rounded-full object-cover" 
                alt="profile" 
              />
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex justify-center items-center">
          <div className="w-full max-w-[1400px] h-[calc(100vh-250px)] min-h-[600px]">
            <ChatSystem type={type} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
