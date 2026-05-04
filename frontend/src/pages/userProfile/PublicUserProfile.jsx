import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GraduationCap, MessageSquare } from "lucide-react";
import UserLevelTick from "../../components/UserLevelTick";
import API from "../../API/api";
import { AuthContext } from "../../API/AuthContext";

const PublicUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { company } = React.useContext(AuthContext);

  const handleMessage = async () => {
    if (!company)
      return alert("Only companies can message developers directly");
    try {
      await API.post("/message/send", {
        receiverId: user._id,
        receiverType: "User",
        text: `Hi ${user.username}, we viewed your profile and would like to connect!`,
      });
      navigate("/company/dashboard", { state: { activeTab: "messages" } });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await API.get(`/auth/public-profile/${id}`);
        setUser(res.data.user);
      } catch (err) {
        console.error("Error fetching user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );

  if (!user) return <div className="text-center py-20">User not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-12">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-emerald-500 to-cyan-500">
              <div className="w-full h-full rounded-full p-1 bg-white">
                <img
                  src={`http://localhost:5000/${user.profileImg}`}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-light text-slate-800">
                  {user.username}
                </h1>
                <UserLevelTick level={user.profileLevel || 1} size={24} />
              </div>
              <div className="flex gap-2 justify-center">
                {company && (
                  <button
                    onClick={handleMessage}
                    className="px-6 py-1.5 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 transition-colors border-none cursor-pointer shadow-lg shadow-emerald-50"
                  >
                    <MessageSquare size={16} className="inline mr-2" /> Message
                    Developer
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <p className="text-blue-900 text-sm font-medium">
                Developer Profile • Level {user.profileLevel || 1} •{" "}
                {user.points || 0} Points
              </p>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">{user.username}</p>
              <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                {user.about || "No bio yet."}
              </p>
              <p className="text-blue-900 text-sm font-medium mt-2">
                Member since {new Date(user.createdAt).getFullYear()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200">
          <div className="flex justify-center -mt-px">
            <div className="flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest border-t border-emerald-600 text-emerald-600">
              <Image size={14} /> Posts
            </div>
          </div>
        </div>

        {/* Learning Progress Section */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
            <GraduationCap size={16} className="text-emerald-500" /> Learning
            Progress
          </h2>
          {user.selectedLanguages?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.selectedLanguages.map((sl, index) => (
                <div
                  key={index}
                  className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900">
                      {sl.language?.name || "Language"}
                    </h3>
                    <span className="text-emerald-600 font-black text-sm">
                      {sl.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${sl.progress}%` }}
                    ></div>
                  </div>
                  {sl.completionDate && (
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      Completed in{" "}
                      {Math.ceil(
                        (new Date(sl.completionDate) - new Date(sl.startDate)) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
              <p className="text-slate-400 italic">
                No learning progress to show.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
