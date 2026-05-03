import React, { useState, useEffect } from "react";
import API from "../../API/api";
import { useNavigate } from "react-router-dom";
import { Trophy, Crown } from "lucide-react";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/auth/leaderboard");
        setPlayers(res.data.users);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Community Leaderboard</h1>
          <p className="text-lg text-slate-600 flex items-center justify-center gap-2">See the top developers in our community! <Trophy size={20} className="text-yellow-500" /></p>
        </div>

        {players.length > 0 ? (
          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-emerald-600 p-8 text-white text-center flex flex-col items-center">
              <div className="text-yellow-400 mb-4">
                <Crown size={64} />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80">Top Developer</p>
              <h2 className="text-3xl font-extrabold">{players[0].username}</h2>
              <p className="mt-2 text-emerald-100">Joined {new Date(players[0].createdAt).toLocaleDateString()}</p>
            </div>

            <div className="p-4">
              {players.map((p, index) => (
                <div 
                  key={p._id} 
                  onClick={() => navigate(`/user/profile/${p._id}`)}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span className={`w-8 text-lg font-black ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-600' : 'text-slate-300'}`}>
                      #{index + 1}
                    </span>
                    <img 
                      src={`http://localhost:5000/${p.profileImg}`} 
                      alt={p.username} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                    />
                    <span className="font-bold text-slate-800">{p.username}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Profile</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 italic">No users found in the leaderboard.</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
