import React from "react";

const Leaderboard = () => {
  const players = [
    { rank: 1, name: "Rahul S.", score: 2500, avatar: "👤" },
    { rank: 2, name: "Alice M.", score: 2350, avatar: "👤" },
    { rank: 3, name: "John D.", score: 2200, avatar: "👤" },
    { rank: 4, name: "Sarah K.", score: 2100, avatar: "👤" },
    { rank: 5, name: "Mike T.", score: 1950, avatar: "👤" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Community Leaderboard</h1>
          <p className="text-lg text-slate-600">See who's at the top of their game this week! 🏆</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-emerald-600 p-8 text-white text-center">
            <div className="text-5xl mb-4">👑</div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-80">Current Champion</p>
            <h2 className="text-3xl font-extrabold">{players[0].name}</h2>
            <p className="mt-2 text-emerald-100">{players[0].score} Points</p>
          </div>

          <div className="p-4">
            {players.map((p) => (
              <div key={p.rank} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-6">
                  <span className={`w-8 text-lg font-black ${p.rank === 1 ? 'text-yellow-500' : p.rank === 2 ? 'text-slate-400' : p.rank === 3 ? 'text-amber-600' : 'text-slate-300'}`}>
                    #{p.rank}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">{p.avatar}</div>
                  <span className="font-bold text-slate-800">{p.name}</span>
                </div>
                <span className="font-extrabold text-emerald-600">{p.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
