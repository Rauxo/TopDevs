import React, { useState, useEffect } from "react";
import API from "../../API/api";
import { useNavigate } from "react-router-dom";
import { Trophy, Crown, Medal, Calendar, Star } from "lucide-react";

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-100 text-slate-800 py-20 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-[400px] h-[400px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-emerald-200">
            <Trophy size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-500 mb-6 tracking-tight">
            Hall of Fame
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Discover the most active and skilled developers in our community. Ranked by Level and tenure.
          </p>
        </div>

        {players.length > 0 ? (
          <div className="space-y-6">
            {/* Top 3 Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
              {/* Rank 2 (Silver) */}
              {players[1] && (
                <div className="order-2 md:order-1 transform hover:-translate-y-2 transition-all duration-300">
                  <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 text-center shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
                    <div className="flex justify-center mb-4 relative">
                      <div className="absolute -top-3 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-100">
                        <Medal size={24} className="text-gray-400" />
                      </div>
                      <img src={`http://localhost:5000/${players[1].profileImg}`} alt={players[1].username} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm group-hover:border-gray-300 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 truncate">{players[1].username}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2 text-emerald-600">
                      <Star size={16} className="fill-emerald-500 text-emerald-500" />
                      <span className="font-semibold">Level {players[1].profileLevel || 1}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 flex justify-center gap-1"><Calendar size={14}/> Joined {new Date(players[1].createdAt).toLocaleDateString()}</p>
                    <button onClick={() => navigate(`/user/profile/${players[1]._id}`)} className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-200">View Profile</button>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) */}
              {players[0] && (
                <div className="order-1 md:order-2 transform hover:-translate-y-2 transition-all duration-300 z-10 scale-100 md:scale-110">
                  <div className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/50 to-transparent pointer-events-none"></div>
                    <div className="flex justify-center mb-5 relative">
                      <div className="absolute -top-4 shadow-sm drop-shadow-md text-yellow-500 animate-bounce bg-white rounded-full p-1 border border-yellow-100">
                        <Crown size={32} className="fill-yellow-400" />
                      </div>
                      <img src={`http://localhost:5000/${players[0].profileImg}`} alt={players[0].username} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:border-yellow-400 transition-colors mt-2" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600 truncate">{players[0].username}</h2>
                    <div className="flex items-center justify-center gap-2 mt-3 text-yellow-600">
                      <Star size={18} className="fill-yellow-400 text-yellow-500" />
                      <span className="font-bold text-lg">Level {players[0].profileLevel || 1}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 flex justify-center gap-1"><Calendar size={14}/> Joined {new Date(players[0].createdAt).toLocaleDateString()}</p>
                    <button onClick={() => navigate(`/user/profile/${players[0]._id}`)} className="mt-6 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/25">View Profile</button>
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {players[2] && (
                <div className="order-3 transform hover:-translate-y-2 transition-all duration-300">
                  <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-6 text-center shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
                    <div className="flex justify-center mb-4 relative">
                      <div className="absolute -top-3 -right-2 bg-white rounded-full p-1 shadow-md border border-amber-100">
                        <Medal size={24} className="text-amber-600" />
                      </div>
                      <img src={`http://localhost:5000/${players[2].profileImg}`} alt={players[2].username} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm group-hover:border-amber-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 truncate">{players[2].username}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2 text-emerald-600">
                      <Star size={16} className="fill-emerald-500 text-emerald-500" />
                      <span className="font-semibold">Level {players[2].profileLevel || 1}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 flex justify-center gap-1"><Calendar size={14}/> Joined {new Date(players[2].createdAt).toLocaleDateString()}</p>
                    <button onClick={() => navigate(`/user/profile/${players[2]._id}`)} className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-200">View Profile</button>
                  </div>
                </div>
              )}
            </div>

            {/* Remaining Players List */}
            {players.length > 3 && (
              <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/80 overflow-hidden shadow-xl">
                <div className="p-2">
                  {players.slice(3).map((p, index) => (
                    <div 
                      key={p._id} 
                      onClick={() => navigate(`/user/profile/${p._id}`)}
                      className="group flex flex-col sm:flex-row items-center justify-between p-4 hover:bg-white/80 rounded-2xl transition-all cursor-pointer gap-4 border border-transparent hover:border-emerald-100 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors border border-slate-200 group-hover:border-emerald-200">
                          {index + 4}
                        </div>
                        <img 
                          src={`http://localhost:5000/${p.profileImg}`} 
                          alt={p.username} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-emerald-300 transition-colors" 
                        />
                        <div>
                          <h4 className="font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors">{p.username}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={12}/> Joined {new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Rank Info</span>
                          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                            <Star size={14} className="fill-emerald-500 text-emerald-500" />
                            <span className="font-bold text-sm">Lvl {p.profileLevel || 1}</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 border border-emerald-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white/80 shadow-xl">
            <Trophy size={48} className="mx-auto text-emerald-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Leaders Yet</h3>
            <p className="text-slate-500">Be the first to join the leaderboard and claim the top spot!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
