import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../API/api";

const Search = () => {
  const [results, setResults] = useState({ users: [] });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Search Users Only
      const userRes = await API.get(`/auth/search?q=${query}`);
      const foundUsers = userRes.data.users || [];
      setResults({ users: foundUsers });
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
           <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">User Search</h1>
           <p className="text-slate-500 font-medium">Showing people matching "{query}"</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">Searching platform...</p>
          </div>
        ) : (
          <div className="space-y-16">
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="p-2 bg-blue-100 rounded-lg">👤</span> 
                Users Found ({results.users.length})
              </h2>
              {results.users.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.users.map((u) => (
                    <div
                      key={u._id}
                      className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center group"
                    >
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-400 to-blue-500 transition-transform group-hover:scale-105">
                           <img
                            src={u.profileImg ? `http://localhost:5000/${u.profileImg}` : "https://via.placeholder.com/150"}
                            alt={u.username}
                            className="w-full h-full rounded-full object-cover bg-white"
                          />
                        </div>
                      </div>
                      <h3 className="font-black text-slate-900 text-lg mb-1">{u.username || "Unknown User"}</h3>
                      <p className="text-xs text-slate-400 font-medium mb-6 line-clamp-1">{u.about || "No bio yet."}</p>
                      <button
                        onClick={() => navigate(`/user/profile/${u._id}`)}
                        className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-emerald-600 shadow-lg shadow-slate-100 transition-all cursor-pointer border-none"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[32px] py-20 px-6 text-center border border-slate-100">
                   <div className="text-5xl mb-4">🔍</div>
                  <p className="text-slate-500 font-bold">No users matched your query.</p>
                  <p className="text-slate-400 text-sm mt-2">Try searching for a different name or username.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
