import React, { useContext } from "react";
import ChatSystem from "../components/ChatSystem";
import { AuthContext } from "../API/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";

const ChatPage = () => {
  const { user, company } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user && !company) {
    return <Navigate to="/" replace state={{ requireAuth: "user-login" }} />;
  }

  const type = user ? "user" : "company";

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      {/* ── Slim Top Bar ── */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            <h1 className="text-base font-black text-slate-900">Messages</h1>
          </div>
        </div>

        {/* Current user identity */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 hidden sm:block">
            {user?.username || company?.name}
          </span>
          <img
            src={
              user
                ? `http://localhost:5000/${user.profileImg}`
                : `http://localhost:5000/${company.companyIcon}`
            }
            className="w-8 h-8 rounded object-cover border border-slate-200"
            alt="profile"
          />
        </div>
      </header>

      {/* ── Chat Area fills remaining height ── */}
      <div className="flex-1 overflow-hidden">
        <ChatSystem type={type} />
      </div>
    </div>
  );
};

export default ChatPage;
