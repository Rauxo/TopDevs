import React, { useEffect, useState, useContext } from "react";
import { GraduationCap, BookOpen, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import API from "../../API/api";
import { AuthContext } from "../../API/AuthContext";
import { useNavigate } from "react-router-dom";

const Learn = () => {
  const { user, refreshAuth } = useContext(AuthContext);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await API.get("/learning/languages");
        setLanguages(res.data);
      } catch (err) {
        console.error("Error fetching languages", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  const handleSelectLanguage = async (languageId) => {
    try {
      await API.post("/learning/languages/select", { languageId });
      await refreshAuth(); // Update user object with new selected language
    } catch (err) {
      console.error("Error selecting language", err);
    }
  };

  const isSelected = (languageId) => {
    return user?.selectedLanguages?.some(sl => sl.language === languageId || sl.language?._id === languageId);
  };

  const getProgress = (languageId) => {
    const sl = user?.selectedLanguages?.find(sl => sl.language === languageId || sl.language?._id === languageId);
    return sl ? sl.progress : 0;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-200">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Learning Hub</h1>
            <p className="text-slate-500">Master new technologies and level up your career</p>
          </div>
        </div>

        {/* Selected Languages Section */}
        {user?.selectedLanguages?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-emerald-500" /> Your Learning Progress
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {languages.filter(l => isSelected(l._id)).map((lang) => {
                const progress = getProgress(lang._id);
                return (
                  <div key={lang._id} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 p-2 overflow-hidden flex items-center justify-center">
                          <img src={lang.icon} alt={lang.name} className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">{lang.name}</h3>
                      </div>
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs">
                        {progress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <button 
                      onClick={() => navigate(`/learn/${lang._id}/levels`)}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                    >
                      Continue Learning <ChevronRight size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Available Languages Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Available Languages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {languages.filter(l => !isSelected(l._id)).map((lang) => (
              <div key={lang._id} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-all text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-50 p-4 flex items-center justify-center">
                  <img src={lang.icon} alt={lang.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{lang.name}</h3>
                <p className="text-xs text-slate-500 mb-6 line-clamp-2">{lang.description}</p>
                <button 
                  onClick={() => handleSelectLanguage(lang._id)}
                  className="w-full py-2 bg-emerald-50 text-emerald-600 rounded-lg font-bold hover:bg-emerald-100 transition-colors"
                >
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
