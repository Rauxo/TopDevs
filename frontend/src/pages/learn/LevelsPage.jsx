import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, CheckCircle2, Play } from "lucide-react";
import API from "../../API/api";
import { AuthContext } from "../../API/AuthContext";

const LevelsPage = () => {
  const { languageId } = useParams();
  const { user } = useContext(AuthContext);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await API.get(`/learning/levels/${languageId}`);
        setLevels(res.data);
      } catch (err) {
        console.error("Error fetching levels", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, [languageId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate("/learn")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Languages
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Levels</h1>
          <p className="text-slate-500">Complete each level to unlock the next one</p>
        </div>

        <div className="space-y-4">
          {levels.map((level, index) => (
            <div 
              key={level._id} 
              className={`p-6 rounded-[24px] border-2 transition-all flex items-center justify-between ${
                level.isUnlocked 
                  ? "border-blue-100 bg-white shadow-sm hover:border-blue-500 cursor-pointer" 
                  : "border-slate-50 bg-slate-50 opacity-60 cursor-not-allowed"
              }`}
              onClick={() => level.isUnlocked && navigate(`/learn/level/${level._id}`)}
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                  level.isCompleted 
                    ? "bg-blue-500 text-white" 
                    : level.isUnlocked 
                      ? "bg-slate-900 text-white" 
                      : "bg-slate-200 text-slate-400"
                }`}>
                  {level.levelNumber}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{level.heading}</h3>
                  <p className="text-sm text-slate-500">Level {level.levelNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {level.isCompleted ? (
                  <div className="text-blue-500 flex items-center gap-2 font-bold">
                    <CheckCircle2 size={24} /> Completed
                  </div>
                ) : level.isUnlocked ? (
                  <div className="text-slate-900 font-bold flex items-center gap-2">
                    Start <Play size={20} fill="currentColor" />
                  </div>
                ) : (
                  <Lock size={24} className="text-slate-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;
