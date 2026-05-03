import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Image, Film, Users } from "lucide-react";
import API from "../../API/api";

const PublicUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!user) return (
    <div className="text-center py-20">User not found.</div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto pt-10 pb-20 px-4">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-12">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
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
              <h1 className="text-2xl font-light text-slate-800">{user.username}</h1>
              <div className="flex gap-2 justify-center">
                <button className="px-6 py-1.5 bg-emerald-600 text-white font-bold text-sm rounded-lg transition-colors">
                  Follow
                </button>
                <button className="px-6 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm rounded-lg transition-colors">
                  Message
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <p className="text-blue-900 text-sm font-medium">Developer Profile</p>
            </div>

            <div>
              <p className="font-bold text-slate-800 mb-1">{user.username}</p>
              <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">
                {user.about || "No bio yet."}
              </p>
              <p className="text-blue-900 text-sm font-medium mt-2">Member since {new Date(user.createdAt).getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Tabs Placeholder */}
        <div className="border-t border-slate-200">
          <div className="flex justify-center gap-12 -mt-px">
            <div className="flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest border-t border-slate-800 text-slate-800">
              <Image size={14} /> Posts
            </div>
            <div className="flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest border-t border-transparent text-slate-400">
              <Film size={14} /> Reels
            </div>
            <div className="flex items-center gap-2 py-4 text-xs font-bold uppercase tracking-widest border-t border-transparent text-slate-400">
              <Users size={14} /> Tagged
            </div>
          </div>
        </div>

        <div className="mt-12 text-center py-20 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
          <p className="text-slate-400 italic">No posts yet from this user.</p>
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
