import React, { useEffect, useState, useContext } from "react";
import { GraduationCap, BookOpen, ChevronRight, ArrowRight } from "lucide-react";
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
      await refreshAuth();
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Page Header ── */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded">
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Learning Hub</h1>
            <p className="text-slate-500 mt-1">Master new technologies and level up your career</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* ── In Progress Section ── */}
        {user?.selectedLanguages?.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
              <BookOpen size={20} className="text-blue-600" />
              <h2 className="text-xl font-black text-slate-900">Continue Learning</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {languages.filter(l => isSelected(l._id)).map((lang) => {
                const progress = getProgress(lang._id);
                return (
                  <div key={lang._id} className="bg-white border border-slate-200 rounded hover:border-blue-600 transition-colors flex flex-col">
                    {/* Card top bar — progress fill */}
                    <div className="h-1 bg-slate-100 rounded-t">
                      <div
                        className="h-full bg-blue-600 rounded-t transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded border border-slate-200 bg-slate-50 p-2 flex items-center justify-center overflow-hidden">
                            <img src={lang.icon} alt={lang.name} className="w-full h-full object-contain" />
                          </div>
                          <h3 className="font-bold text-slate-900 text-lg">{lang.name}</h3>
                        </div>
                        <span className="text-blue-600 font-black text-sm bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                          {progress}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 h-1.5 rounded mb-6">
                        <div
                          className="bg-blue-600 h-full rounded transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <p className="text-slate-500 text-sm mb-6 flex-grow">
                        {progress === 0 ? "Start your journey with " + lang.name : `You've completed ${progress}% of this course. Keep going!`}
                      </p>

                      <button
                        onClick={() => navigate(`/learn/${lang._id}/levels`)}
                        className="w-full py-2.5 bg-slate-900 text-white rounded font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors border-none cursor-pointer mt-auto"
                      >
                        Continue <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Available Languages Section ── */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-black text-slate-900">
              Available Languages
              <span className="text-blue-600 ml-2">({languages.filter(l => !isSelected(l._id)).length})</span>
            </h2>
          </div>

          {languages.filter(l => !isSelected(l._id)).length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded">
              <GraduationCap size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="font-bold text-slate-600">You've enrolled in all available languages!</p>
              <p className="text-slate-500 text-sm mt-1">Check back later for new courses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {languages.filter(l => !isSelected(l._id)).map((lang) => (
                <div key={lang._id} className="bg-white border border-slate-200 rounded hover:border-blue-600 transition-colors group flex flex-col">
                  <div className="p-6 text-center flex flex-col flex-grow">
                    <div className="w-20 h-20 mx-auto mb-5 rounded border border-slate-200 bg-slate-50 p-4 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                      <img src={lang.icon} alt={lang.name} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{lang.name}</h3>
                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-grow">{lang.description}</p>
                    <button
                      onClick={() => handleSelectLanguage(lang._id)}
                      className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 border-none cursor-pointer mt-auto"
                    >
                      Start Learning <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Learn;
