import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, BookOpen } from "lucide-react";
import API from "../../API/api";

const LevelContentPage = () => {
  const { levelId } = useParams();
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const res = await API.get(`/learning/level/${levelId}`);
        setLevel(res.data);
      } catch (err) {
        console.error("Error fetching level", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLevel();
  }, [levelId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!level) return <div className="min-h-screen flex items-center justify-center">Level not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Levels
        </button>

        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
          {level.image && (
            <div className="w-full h-80 overflow-hidden">
              <img src={level.image} alt={level.heading} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-10">
            <div className="flex items-center gap-3 text-blue-600 mb-6 bg-blue-50 w-fit px-4 py-2 rounded-full font-bold text-sm">
              <BookOpen size={18} /> Level {level.levelNumber} Reading Material
            </div>
            
            <h1 className="text-4xl font-black text-slate-900 mb-8 leading-tight">
              {level.heading}
            </h1>

            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-12 whitespace-pre-wrap">
              {level.content}
            </div>

            <div className="flex justify-end pt-8 border-t border-slate-50">
              <button 
                onClick={() => navigate(`/learn/solve/${level._id}`)}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 group"
              >
                Go to Next Level <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelContentPage;
