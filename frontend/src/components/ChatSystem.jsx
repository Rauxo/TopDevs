import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Send, User, Building2, Clock, CheckCircle2, MessageSquare,
  Search, ExternalLink, ChevronLeft, Sparkles
} from "lucide-react";
import { AuthContext } from "../API/AuthContext";
import { useSocket } from "../API/SocketContext";
import API from "../API/api";
import { useNavigate } from "react-router-dom";

const ChatSystem = ({ type }) => {
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

  useEffect(() => { fetchConversations(); }, [currentId]);
  useEffect(() => { if (activeConv) fetchMessages(activeConv._id); }, [activeConv]);

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
      const res = await API.post("/message/send", { receiverId, receiverType, text: newMessage });
      const msgData = {
        conversationId: activeConv._id,
        senderId: currentId,
        senderType: type === "user" ? "User" : "Company",
        text: newMessage,
        receiverId,
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
        setActiveConv((prev) => ({ ...prev, status: "accepted" }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigateToProfile = () => {
    if (!activeConv) return;
    const { _id } = activeConv.otherParticipant;
    const path =
      activeConv.otherParticipantType === "User"
        ? `/user/profile/${_id}`
        : `/company/profile/${_id}`;
    navigate(path);
  };

  const pendingRequests = conversations.filter(
    (c) => c.status === "pending" && c.initiatedBy.type !== (type === "user" ? "User" : "Company")
  );
  const activeChats = conversations.filter(
    (c) =>
      c.status === "accepted" ||
      (c.status === "pending" && c.initiatedBy.type === (type === "user" ? "User" : "Company"))
  );

  // Conversation item
  const ConvItem = ({ conv, isPending }) => {
    const isActive = activeConv?._id === conv._id;
    return (
      <div
        key={conv._id}
        onClick={() => setActiveConv(conv)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded cursor-pointer transition-colors ${
          isActive ? "bg-slate-100 border border-slate-200" : "hover:bg-slate-50"
        }`}
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
          {conv.otherParticipantType === "User" ? (
            <img
              src={`http://localhost:5000/${conv.otherParticipant.profileImg}`}
              className="w-full h-full object-cover"
              alt="p"
            />
          ) : (
            <Building2 size={16} className="text-slate-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">
            {conv.otherParticipant.username || conv.otherParticipant.name}
          </p>
          <p className={`text-xs truncate ${isPending ? "text-amber-600 font-medium" : "text-slate-400"}`}>
            {isPending ? "Wants to connect" : "Active"}
          </p>
        </div>
        {conv.status === "pending" && !isPending && (
          <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">

      {/* ── Sidebar ── */}
      <div
        className={`flex-shrink-0 w-64 border-r border-slate-200 flex flex-col bg-white ${
          activeConv ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Search */}
        <div className="px-3 py-3 border-b border-slate-100">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 bg-slate-100 border border-transparent rounded text-xs outline-none focus:bg-white focus:border-slate-300 transition-all"
            />
          </div>
        </div>

        {/* Lists */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
          {/* Pending */}
          {type === "company" && pendingRequests.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 px-2 mb-1 flex items-center gap-1">
                <Clock size={10} /> Pending ({pendingRequests.length})
              </p>
              <div className="space-y-0.5">
                {pendingRequests.map((conv) => (
                  <ConvItem key={conv._id} conv={conv} isPending />
                ))}
              </div>
            </div>
          )}

          {/* Active Chats */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 mb-1">
              Conversations
            </p>
            <div className="space-y-0.5">
              {activeChats.length > 0 ? (
                activeChats.map((conv) => (
                  <ConvItem key={conv._id} conv={conv} isPending={false} />
                ))
              ) : (
                <div className="py-10 text-center">
                  <MessageSquare size={24} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-slate-400 text-xs">No conversations yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Chat Pane ── */}
      <div className={`flex-1 flex flex-col overflow-hidden ${!activeConv ? "hidden md:flex" : "flex"}`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConv(null)}
                  className="md:hidden p-1 text-slate-400 hover:text-slate-700 border-none bg-transparent cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                {/* Avatar */}
                <div className="w-8 h-8 rounded border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {activeConv.otherParticipantType === "User" ? (
                    <img
                      src={`http://localhost:5000/${activeConv.otherParticipant.profileImg}`}
                      className="w-full h-full object-cover"
                      alt="p"
                    />
                  ) : (
                    <Building2 size={14} className="text-slate-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-none">
                    {activeConv.otherParticipant.username || activeConv.otherParticipant.name}
                  </p>
                  <button
                    onClick={navigateToProfile}
                    className="text-[10px] text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700 border-none bg-transparent cursor-pointer p-0 mt-0.5"
                  >
                    View Profile <ExternalLink size={10} />
                  </button>
                </div>
              </div>

              {/* Accept button for company */}
              {type === "company" && activeConv.status === "pending" && (
                <button
                  onClick={() => handleAccept(activeConv._id)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors flex items-center gap-1.5 border-none cursor-pointer"
                >
                  <CheckCircle2 size={14} /> Approve
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50">
              {messages.map((msg, i) => {
                const isMine = msg.senderId === currentId;
                return (
                  <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%]">
                      <div
                        className={`px-4 py-2 rounded text-sm leading-relaxed ${
                          isMine
                            ? "bg-slate-900 text-white rounded-br-none"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <p className={`text-[10px] text-slate-400 mt-1 ${isMine ? "text-right" : "text-left"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            {activeConv.status === "accepted" ||
            (activeConv.status === "pending" &&
              activeConv.initiatedBy.type === (type === "user" ? "User" : "Company")) ? (
              <form
                onSubmit={handleSendMessage}
                className="px-4 py-3 border-t border-slate-200 bg-white flex items-center gap-2 flex-shrink-0"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-100 border border-transparent rounded text-sm outline-none focus:bg-white focus:border-slate-300 transition-all"
                />
                <button
                  type="submit"
                  className="p-2 bg-slate-900 text-white rounded hover:bg-blue-600 transition-colors border-none cursor-pointer flex items-center justify-center flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            ) : (
              <div className="px-4 py-4 bg-amber-50 border-t border-amber-100 text-center flex-shrink-0">
                <Clock size={16} className="mx-auto text-amber-500 mb-1" />
                <p className="text-xs text-amber-700 font-medium">
                  Waiting for approval before messaging.
                </p>
              </div>
            )}
          </>
        ) : (
          /* No chat selected */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50">
            <div className="w-14 h-14 bg-white border border-slate-200 rounded flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-600">Select a conversation</p>
            <p className="text-xs text-slate-400 mt-1">Choose from the left to start chatting</p>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white border border-slate-200 rounded max-w-sm w-full p-8 text-center">
          
            <h3 className="text-xl font-black text-slate-900 mb-2">Message Limit Reached</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              You've reached your free message limit. Upgrade to continue conversations.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/pricing")}
                className="w-full py-2.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors border-none cursor-pointer"
              >
                View Plans
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2.5 bg-white text-slate-600 font-bold rounded border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
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
