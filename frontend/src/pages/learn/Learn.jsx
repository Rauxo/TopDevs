import React from "react";

const Learn = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 text-center">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Learn Coding</h1>
      <p className="text-lg text-slate-600 mb-8">Access interactive courses and improve your skills.</p>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {['HTML & CSS', 'JavaScript', 'React'].map((course, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="font-bold text-slate-800 mb-2">{course}</h3>
            <button className="text-emerald-600 font-bold text-sm">Start Learning →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
