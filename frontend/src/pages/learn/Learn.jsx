import React from "react";
import { GraduationCap, Rocket, ShieldCheck } from "lucide-react";

const Learn = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-emerald-500 mb-8 flex justify-center">
          <GraduationCap size={80} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-6">TopDev Learning Hub</h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          We are currently preparing interactive coding courses, project-based tutorials, and skill assessments to help you level up your developer career.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Rocket size={20} className="text-emerald-500" /> Learning Paths
            </h3>
            <p className="text-sm text-slate-500">Structured paths to take you from beginner to job-ready developer.</p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-500" /> Skill Assessments
            </h3>
            <p className="text-sm text-slate-500">Verify your skills with industry-standard tests and earn badges.</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100">
          <span>Stay Tuned</span>
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

export default Learn;
