import React, { useState, useEffect } from "react";
import API from "../../API/api";
import { useNavigate } from "react-router-dom";
import { Trophy, Crown, Medal, Calendar, Star, Filter, ArrowRight } from "lucide-react";

const RANK_CONFIG = [
  { label: "1st", icon: <Crown size={20} className="text-blue-600" />, border: "border-blue-600", badge: "bg-blue-600 text-white" },
  { label: "2nd", icon: <Medal size={20} className="text-slate-500" />, border: "border-slate-400", badge: "bg-slate-700 text-white" },
  { label: "3rd", icon: <Medal size={20} className="text-slate-400" />, border: "border-slate-300", badge: "bg-slate-500 text-white" },
];

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
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900 text-white rounded">
              <Trophy size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Leaderboard</h1>
              <p className="text-slate-500 mt-1">Top-ranked developers in our community</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-slate-500 flex-shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 rounded px-4 py-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 min-w-[200px] cursor-pointer"
            >
              <option value="">Overall (Top Levels)</option>
              <optgroup label="Filter by Language">
                {languages.map(lang => (
                  <option key={lang._id} value={lang._id}>{lang.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : players.length > 0 ? (
          <div className="space-y-10">

            {/* ── Top 3 Podium ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Rank 2 */}
              {players[1] && (
                <div className="md:order-1">
                  <div className={`bg-white border-2 ${RANK_CONFIG[1].border} rounded p-6 text-center flex flex-col items-center`}>
                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded mb-4 ${RANK_CONFIG[1].badge}`}>
                      2nd Place
                    </span>
                    <img
                      src={`http://localhost:5000/${players[1].profileImg}`}
                      alt={players[1].username}
                      className="w-20 h-20 rounded object-cover border-2 border-slate-200 mb-4"
                    />
                    <h3 className="text-lg font-bold text-slate-900 truncate w-full text-center">{players[1].username}</h3>
                    <div className="flex items-center gap-1.5 mt-2 text-blue-600">
                      <Star size={14} className="fill-blue-600" />
                      <span className="font-bold text-sm">Level {players[1].profileLevel || 1}</span>
                    </div>
                    {selectedLanguage && (
                      <span className="mt-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                        {players[1].progress || 0}% Complete
                      </span>
                    )}
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                      {selectedLanguage
                        ? `Time: ${formatTime(players[1].totalTimeTaken)}`
                        : <><Calendar size={12} /> {new Date(players[1].createdAt).toLocaleDateString()}</>}
                    </p>
                    <button
                      onClick={() => navigate(`/user/profile/${players[1]._id}`)}
                      className="mt-4 w-full py-2 bg-white border border-slate-300 text-slate-900 font-bold text-sm rounded hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Rank 1 — taller */}
              {players[0] && (
                <div className="md:order-2">
                  <div className={`bg-white border-2 ${RANK_CONFIG[0].border} rounded p-8 text-center flex flex-col items-center relative`}>
                   
                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded mb-4 ${RANK_CONFIG[0].badge}`}>
                      1st Place
                    </span>
                    <img
                      src={`http://localhost:5000/${players[0].profileImg}`}
                      alt={players[0].username}
                      className="w-28 h-28 rounded object-cover border-2 border-blue-200 mb-4"
                    />
                    <h2 className="text-xl font-black text-slate-900 truncate w-full text-center">{players[0].username}</h2>
                    <div className="flex items-center gap-1.5 mt-2 text-blue-600">
                      <Star size={16} className="fill-blue-600" />
                      <span className="font-bold">Level {players[0].profileLevel || 1}</span>
                    </div>
                    {selectedLanguage && (
                      <span className="mt-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                        {players[0].progress || 0}% Complete
                      </span>
                    )}
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                      {selectedLanguage
                        ? `Time: ${formatTime(players[0].totalTimeTaken)}`
                        : <><Calendar size={12} /> {new Date(players[0].createdAt).toLocaleDateString()}</>}
                    </p>
                    <button
                      onClick={() => navigate(`/user/profile/${players[0]._id}`)}
                      className="mt-5 w-full py-2.5 bg-blue-600 text-white font-bold text-sm rounded hover:bg-blue-700 transition-colors border-none cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Rank 3 */}
              {players[2] && (
                <div className="md:order-3">
                  <div className={`bg-white border-2 ${RANK_CONFIG[2].border} rounded p-6 text-center flex flex-col items-center`}>
                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded mb-4 ${RANK_CONFIG[2].badge}`}>
                      3rd Place
                    </span>
                    <img
                      src={`http://localhost:5000/${players[2].profileImg}`}
                      alt={players[2].username}
                      className="w-20 h-20 rounded object-cover border-2 border-slate-200 mb-4"
                    />
                    <h3 className="text-lg font-bold text-slate-900 truncate w-full text-center">{players[2].username}</h3>
                    <div className="flex items-center gap-1.5 mt-2 text-blue-600">
                      <Star size={14} className="fill-blue-600" />
                      <span className="font-bold text-sm">Level {players[2].profileLevel || 1}</span>
                    </div>
                    {selectedLanguage && (
                      <span className="mt-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                        {players[2].progress || 0}% Complete
                      </span>
                    )}
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                      {selectedLanguage
                        ? `Time: ${formatTime(players[2].totalTimeTaken)}`
                        : <><Calendar size={12} /> {new Date(players[2].createdAt).toLocaleDateString()}</>}
                    </p>
                    <button
                      onClick={() => navigate(`/user/profile/${players[2]._id}`)}
                      className="mt-4 w-full py-2 bg-white border border-slate-300 text-slate-900 font-bold text-sm rounded hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Remaining Players Table ── */}
            {players.length > 3 && (
              <div className="bg-white border border-slate-200 rounded overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-6 py-3">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5">Developer</div>
                  <div className="col-span-2 text-center">Level</div>
                  {selectedLanguage && <div className="col-span-2 text-center">Progress</div>}
                  <div className={`${selectedLanguage ? 'col-span-2' : 'col-span-4'} text-right`}>
                    {selectedLanguage ? "Time" : "Joined"}
                  </div>
                </div>

                {/* Table Rows */}
                {players.slice(3).map((p, index) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/user/profile/${p._id}`)}
                    className="grid grid-cols-12 items-center px-6 py-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors group last:border-b-0"
                  >
                    <div className="col-span-1 text-center">
                      <span className="text-sm font-black text-slate-500 group-hover:text-blue-600 transition-colors">
                        {index + 4}
                      </span>
                    </div>
                    <div className="col-span-5 flex items-center gap-3">
                      <img
                        src={`http://localhost:5000/${p.profileImg}`}
                        alt={p.username}
                        className="w-10 h-10 rounded object-cover border border-slate-200 flex-shrink-0"
                      />
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {p.username}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-sm">
                        <Star size={13} className="fill-blue-600" /> {p.profileLevel || 1}
                      </span>
                    </div>
                    {selectedLanguage && (
                      <div className="col-span-2 text-center">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                          {p.progress || 0}%
                        </span>
                      </div>
                    )}
                    <div className={`${selectedLanguage ? 'col-span-2' : 'col-span-4'} text-right`}>
                      <span className="text-sm text-slate-500">
                        {selectedLanguage
                          ? formatTime(p.totalTimeTaken)
                          : new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-32 bg-white border border-slate-200 rounded">
            <Trophy size={48} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Leaders Found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your filters or be the first to join the leaderboard!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
