import React, { useState, useEffect, useContext, useRef } from "react";
import { Send, User, Building2, Clock, CheckCircle2, MessageSquare, Search, ExternalLink, ChevronLeft, MoreVertical, Sparkles } from "lucide-react";
import { AuthContext } from "../API/AuthContext";
import { useSocket } from "../API/SocketContext";
import API from "../API/api";
import { useNavigate } from "react-router-dom";

const ChatSystem = ({ type }) => { // type: 'user' or 'company'
  const { user, company } = useContext(AuthContext);
  const socket = useSocket();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const chatEndRef = useRef(null);

  const currentId = user?._id || company?._id;

  useEffect(() => {
    fetchConversations();
  }, [currentId]);

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv._id);
    }
  }, [activeConv]);

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (msg) => {
        if (activeConv && msg.conversationId === activeConv._id) {
          setMessages((prev) => [...prev, msg]);
        }
        fetchConversations();
      });
    }
    return () => socket?.off("receive_message");
  }, [socket, activeConv]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await API.get("/message/conversations");
      setConversations(res.data.conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await API.get(`/message/messages/${convId}`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    try {
      const receiverId = activeConv.otherParticipant._id;
      const receiverType = activeConv.otherParticipantType;
      
      const res = await API.post("/message/send", {
        receiverId,
        receiverType,
        text: newMessage
      });

      const msgData = {
        conversationId: activeConv._id,
        senderId: currentId,
        senderType: type === "user" ? "User" : "Company",
        text: newMessage,
        receiverId
      };

      socket.emit("private_message", msgData);
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage("");
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.limitReached) {
        setShowUpgradeModal(true);
      } else {
        console.error(err);
      }
    }
  };

  const handleAccept = async (convId) => {
    try {
      await API.put(`/message/accept/${convId}`);
      fetchConversations();
      if (activeConv?._id === convId) {
        setActiveConv(prev => ({ ...prev, status: "accepted" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToProfile = () => {
    if (!activeConv) return;
    const { _id } = activeConv.otherParticipant;
    const path = activeConv.otherParticipantType === "User" 
      ? `/user/profile/${_id}` 
      : `/company/profile/${_id}`;
    navigate(path);
  };

  const pendingRequests = conversations.filter(c => c.status === "pending" && c.initiatedBy.type !== (type === "user" ? "User" : "Company"));
  const activeChats = conversations.filter(c => c.status === "accepted" || (c.status === "pending" && c.initiatedBy.type === (type === "user" ? "User" : "Company")));

  return (
    <div className="flex h-full bg-white/40 rounded-[40px] shadow-[0_20px_70px_rgba(0,0,0,0.08)] border border-white/60 overflow-hidden backdrop-blur-3xl transition-all duration-500">
      {/* Sidebar */}
      <div className={`w-full md:w-96 border-r border-slate-200 flex flex-col bg-white/70 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Chats</h2>
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border border-transparent rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-blue-500/30 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-8 scroll-smooth">
          {type === "company" && pendingRequests.length > 0 && (
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 ml-4 flex items-center gap-2">
                 <Clock size={12} /> Pending Approval ({pendingRequests.length})
               </p>
               <div className="space-y-3">
                 {pendingRequests.map(conv => (
                   <div 
                    key={conv._id} 
                    onClick={() => setActiveConv(conv)}
                    className={`p-4 rounded-[28px] cursor-pointer transition-all border-2 ${activeConv?._id === conv._id ? "bg-amber-50 border-amber-200 shadow-lg shadow-amber-200/20" : "bg-white/50 border-transparent hover:bg-white hover:shadow-md"}`}
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-slate-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                          <User size={24} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-black text-slate-800 truncate">{conv.otherParticipant.username}</p>
                          <p className="text-[10px] text-amber-600 font-black uppercase tracking-tighter">Wants to connect</p>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          <div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-4">Active Communications</p>
             <div className="space-y-3">
               {activeChats.length > 0 ? activeChats.map(conv => (
                 <div 
                  key={conv._id} 
                  onClick={() => setActiveConv(conv)}
                  className={`p-4 rounded-[28px] cursor-pointer transition-all border-2 ${activeConv?._id === conv._id ? "bg-blue-50 border-blue-200 shadow-lg shadow-blue-200/20" : "bg-white/50 border-transparent hover:bg-white hover:shadow-md"}`}
                 >
                   <div className="flex items-center gap-4">
                      {conv.otherParticipantType === "User" ? (
                        <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden shadow-sm border-2 border-white">
                          <img src={`http://localhost:5000/${conv.otherParticipant.profileImg}`} className="w-full h-full object-cover" alt="p" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                          <Building2 size={24} />
                        </div>
                      )}
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-black text-slate-800 truncate">{conv.otherParticipant.username || conv.otherParticipant.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate italic">Active session</p>
                      </div>
                      {conv.status === "pending" && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>}
                   </div>
                 </div>
               )) : (
                 <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                      <MessageSquare size={32} />
                    </div>
                    <p className="text-slate-400 text-sm font-bold">No active sessions</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
               <div className="flex items-center gap-4">
                  <button onClick={() => setActiveConv(null)} className="md:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors border-none bg-transparent cursor-pointer">
                    <ChevronLeft size={24} />
                  </button>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 border-2 border-white shadow-sm overflow-hidden">
                      {activeConv.otherParticipantType === "User" ? (
                        <img src={`http://localhost:5000/${activeConv.otherParticipant.profileImg}`} className="w-full h-full object-cover" alt="p" />
                      ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white"><Building2 size={28} /></div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{activeConv.otherParticipant.username || activeConv.otherParticipant.name}</h4>
                    <button 
                      onClick={navigateToProfile}
                      className="text-[10px] text-blue-600 font-black uppercase tracking-widest flex items-center gap-1.5 hover:text-blue-700 transition-all border-none bg-transparent cursor-pointer group"
                    >
                      View Profile <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
               </div>
               
               <div className="flex items-center gap-3">
                 {type === "company" && activeConv.status === "pending" && (
                   <button 
                    onClick={() => handleAccept(activeConv._id)}
                    className="px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2 border-none cursor-pointer shadow-xl shadow-blue-500/20"
                   >
                     Approve Access <CheckCircle2 size={16} />
                   </button>
                 )}
                 <button className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-all border-none bg-transparent cursor-pointer">
                   <MoreVertical size={20} />
                 </button>
               </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-slate-50/20">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.senderId === currentId ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] group`}>
                    <div className={`p-5 rounded-[32px] text-sm font-bold shadow-sm transition-all hover:shadow-md ${
                      msg.senderId === currentId 
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-blue-200/50" 
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-2 mt-2 px-2 ${msg.senderId === currentId ? "justify-end" : "justify-start"}`}>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                       {msg.senderId === currentId && <div className="w-1 h-1 bg-blue-500 rounded-full"></div>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            {activeConv.status === "accepted" || (activeConv.status === "pending" && activeConv.initiatedBy.type === (type === "user" ? "User" : "Company")) ? (
              <form onSubmit={handleSendMessage} className="p-8 border-t border-slate-100 bg-white/80 backdrop-blur-xl">
                <div className="relative flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full px-8 py-5 bg-slate-100/60 border-2 border-transparent rounded-[28px] outline-none focus:bg-white focus:border-blue-500/30 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)] transition-all font-bold text-slate-800"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="p-5 bg-slate-900 text-white rounded-[24px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 border-none cursor-pointer flex items-center justify-center group active:scale-95"
                  >
                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-10 bg-amber-50/50 backdrop-blur-sm text-center border-t border-amber-100">
                <div className="w-16 h-16 bg-amber-100 rounded-[24px] flex items-center justify-center mx-auto mb-6 text-amber-600">
                  <Clock size={32} />
                </div>
                <h3 className="text-lg font-black text-amber-900 mb-2 uppercase tracking-tight">Access Restricted</h3>
                <p className="text-amber-700 text-sm font-bold max-w-sm mx-auto opacity-70">
                  Waiting for the other party to approve your connection request before communication can begin.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-12 text-center bg-slate-50/30">
             <div className="w-32 h-32 bg-white rounded-[48px] shadow-2xl flex items-center justify-center mb-10 border border-white animate-bounce-slow">
               <MessageSquare size={64} className="text-blue-500/30" />
             </div>
             <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Your Workspace</h3>
             <p className="text-slate-500 font-bold max-w-[320px] leading-relaxed">Select a secure session from the terminal to begin encrypted real-time communication.</p>
             <div className="mt-10 flex gap-2">
                {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-slate-200 rounded-full"></div>)}
             </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-10 text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-blue-100 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-blue-600">
              <Sparkles size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Limit Reached</h3>
            <p className="text-slate-500 font-bold mb-10 leading-relaxed">
              You've reached your free message limit. Upgrade to a premium plan to continue your conversations and unlock unlimited potential.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate("/pricing")}
                className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 border-none cursor-pointer"
              >
                View Plans
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-5 bg-slate-100 text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all border-none cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;
