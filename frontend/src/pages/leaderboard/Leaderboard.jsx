import React, { useState, useEffect } from "react";
import API from "../../API/api";
import { useNavigate } from "react-router-dom";
import { Trophy, Crown, Medal, Calendar, Star, Filter } from "lucide-react";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await API.get("/learning/languages");
        setLanguages(res.data || []);
      } catch (err) {
        console.error("Error fetching languages", err);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        let query = "";
        if (selectedLanguage) query += `?language=${selectedLanguage}`;
        
        const res = await API.get(`/auth/leaderboard${query}`);
        setPlayers(res.data.users);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [selectedLanguage]);

  const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null || seconds > 9999999) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 text-slate-800 py-20 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-0 w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)] border border-blue-200">
            <Trophy size={32} className="text-blue-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 mb-6 tracking-tight">
           Leaderboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Discover the most active and skilled developers in our community.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 mb-10 border border-white shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-center">
          <div className="flex items-center gap-2 text-slate-500 font-semibold">
            <Filter size={18} /> Sort By:
          </div>
          <select 
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          >
            <option value="">TopLevels</option>
            <optgroup label="Top in Language">
              {languages.map(lang => (
                <option key={lang._id} value={lang._id}>{lang.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : players.length > 0 ? (
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
                    <div className="flex items-center justify-center gap-2 mt-2 text-blue-600">
                      <Star size={16} className="fill-blue-500 text-blue-500" />
                      <span className="font-semibold">Level {players[1].profileLevel || 1}</span>
                    </div>
                    {selectedLanguage && (
                      <div className="mt-2 text-sm text-blue-700 font-bold bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                        {players[1].progress || 0}% Complete
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-3 flex justify-center gap-1">
                      {selectedLanguage ? `Time Taken: ${formatTime(players[1].totalTimeTaken)}` : <><Calendar size={14}/> Joined {new Date(players[1].createdAt).toLocaleDateString()}</>}
                    </p>
                    <button onClick={() => navigate(`/user/profile/${players[1]._id}`)} className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors border border-slate-200">View Profile</button>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) */}
              {players[0] && (
                <div className="order-1 md:order-2 transform hover:-translate-y-2 transition-all duration-300 z-10 scale-100 md:scale-110">
                  <div className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[2rem] p-8 text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none"></div>
                    <div className="flex justify-center mb-5 relative">
                      <div className="absolute -top-4 shadow-sm drop-shadow-md text-slate-500 animate-bounce bg-white rounded-full p-1 border border-slate-100">
                        <Crown size={32} className="fill-slate-400" />
                      </div>
                      <img src={`http://localhost:5000/${players[0].profileImg}`} alt={players[0].username} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:border-slate-400 transition-colors mt-2" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600 truncate">{players[0].username}</h2>
                    <div className="flex items-center justify-center gap-2 mt-3 text-slate-600">
                      <Star size={18} className="fill-slate-400 text-slate-500" />
                      <span className="font-bold text-lg">Level {players[0].profileLevel || 1}</span>
                    </div>
                    {selectedLanguage && (
                      <div className="mt-2 text-sm text-blue-700 font-bold bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                        {players[0].progress || 0}% Complete
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-4 flex justify-center gap-1">
                      {selectedLanguage ? `Time Taken: ${formatTime(players[0].totalTimeTaken)}` : <><Calendar size={14}/> Joined {new Date(players[0].createdAt).toLocaleDateString()}</>}
                    </p>
                    <button onClick={() => navigate(`/user/profile/${players[0]._id}`)} className="mt-6 w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25">View Profile</button>
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
                    <div className="flex items-center justify-center gap-2 mt-2 text-blue-600">
                      <Star size={16} className="fill-blue-500 text-blue-500" />
                      <span className="font-semibold">Level {players[2].profileLevel || 1}</span>
                    </div>
                    {selectedLanguage && (
                      <div className="mt-2 text-sm text-blue-700 font-bold bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                        {players[2].progress || 0}% Complete
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-3 flex justify-center gap-1">
                      {selectedLanguage ? `Time Taken: ${formatTime(players[2].totalTimeTaken)}` : <><Calendar size={14}/> Joined {new Date(players[2].createdAt).toLocaleDateString()}</>}
                    </p>
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
                      className="group flex flex-col sm:flex-row items-center justify-between p-4 hover:bg-white/80 rounded-2xl transition-all cursor-pointer gap-4 border border-transparent hover:border-blue-100 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors border border-slate-200 group-hover:border-blue-200">
                          {index + 4}
                        </div>
                        <img 
                          src={`http://localhost:5000/${p.profileImg}`} 
                          alt={p.username} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-blue-300 transition-colors" 
                        />
                        <div>
                          <h4 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors">{p.username}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            {selectedLanguage ? `Time Taken: ${formatTime(p.totalTimeTaken)}` : <><Calendar size={12}/> Joined {new Date(p.createdAt).toLocaleDateString()}</>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Rank Info</span>
                          <div className="flex items-center gap-2">
                            {selectedLanguage && (
                              <div className="text-xs text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                {p.progress || 0}%
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                              <Star size={14} className="fill-blue-500 text-blue-500" />
                              <span className="font-bold text-sm">Lvl {p.profileLevel || 1}</span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-blue-100 p-2 rounded-full text-blue-600 border border-blue-200">
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
            <Trophy size={48} className="mx-auto text-blue-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No Leaders Found</h3>
            <p className="text-slate-500">Try adjusting your filters or be the first to join the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
