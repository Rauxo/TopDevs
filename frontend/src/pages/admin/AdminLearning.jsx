import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Plus, Edit2, Trash2, Settings, GraduationCap, Layers, HelpCircle, Save } from "lucide-react";
import API from "../../API/api";

const AdminLearning = () => {
  const [activeTab, setActiveTab] = useState("languages");
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Forms states
  const [langForm, setLangForm] = useState({ name: "", description: "", order: 0, icon: "" });
  const [levelForm, setLevelForm] = useState({ languageId: "", levelNumber: "", heading: "", content: "", image: "" });
  const [questionForm, setQuestionForm] = useState({ levelId: "", title: "", description: "", boilerplateCode: "", points: 10, testCases: "[]" });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "languages") {
        const res = await API.get("/learning/languages");
        setLanguages(res.data);
      } else if (activeTab === "levels") {
        // Need to fetch languages first to select one
        const langRes = await API.get("/learning/languages");
        setLanguages(langRes.data);
        if (langRes.data.length > 0 && !levelForm.languageId) {
          setLevelForm(prev => ({ ...prev, languageId: langRes.data[0]._id }));
          fetchLevels(langRes.data[0]._id);
        } else if (levelForm.languageId) {
          fetchLevels(levelForm.languageId);
        }
      } else if (activeTab === "questions") {
        // Complex to manage hierarchical state, fetching all levels isn't provided directly, 
        // we'll require admin to select language -> level.
        const langRes = await API.get("/learning/languages");
        setLanguages(langRes.data);
      } else if (activeTab === "settings") {
        const res = await API.get("/learning/settings");
        setSettings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLevels = async (langId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await API.get(`/admin/levels/${langId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLevels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async (levelId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await API.get(`/admin/questions/${levelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Handlers for Creation ---
  const handleCreateLanguage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await API.post("/admin/language", langForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setLangForm({ name: "", description: "", order: 0, icon: "" });
    } catch (err) {
      alert("Error creating language");
    }
  };

  const handleCreateLevel = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await API.post("/admin/level", levelForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLevels(levelForm.languageId);
      setLevelForm({ ...levelForm, levelNumber: "", heading: "", content: "", image: "" });
    } catch (err) {
      alert("Error creating level");
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await API.post("/admin/question", questionForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestions(questionForm.levelId);
      setQuestionForm({ ...questionForm, title: "", description: "", boilerplateCode: "", points: 10, testCases: "[]" });
    } catch (err) {
      alert("Error creating question");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await API.put("/admin/learning-settings", settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Settings Saved!");
    } catch (err) {
      alert("Error saving settings");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Learning Center Management</h1>
        <p className="text-slate-500">Manage languages, levels, and coding questions.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-200">
        {[
          { id: "languages", icon: GraduationCap, label: "Languages" },
          { id: "levels", icon: Layers, label: "Levels" },
          { id: "questions", icon: HelpCircle, label: "Questions" },
          { id: "settings", icon: Settings, label: "Settings" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-sm border-b-2 transition-colors ${
              activeTab === tab.id ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        {loading && <div className="p-10 text-center animate-pulse text-slate-400">Loading...</div>}

        {!loading && activeTab === "languages" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Add New Language</h3>
              <form onSubmit={handleCreateLanguage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Language Name</label>
                  <input type="text" value={langForm.name} onChange={e => setLangForm({...langForm, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                  <textarea value={langForm.description} onChange={e => setLangForm({...langForm, description: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Icon URL</label>
                  <input type="text" value={langForm.icon} onChange={e => setLangForm({...langForm, icon: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" placeholder="https://..." required />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Add Language</button>
              </form>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Existing Languages</h3>
              <div className="space-y-2">
                {languages.map(lang => (
                  <div key={lang._id} className="p-3 border border-slate-100 bg-slate-50 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={lang.icon} alt={lang.name} className="w-8 h-8 object-contain" />
                      <span className="font-bold">{lang.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === "levels" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Add New Level</h3>
              <form onSubmit={handleCreateLevel} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Select Language</label>
                  <select 
                    value={levelForm.languageId} 
                    onChange={e => {
                      setLevelForm({...levelForm, languageId: e.target.value});
                      fetchLevels(e.target.value);
                    }} 
                    className="w-full p-2 border border-slate-200 rounded-lg" required
                  >
                    <option value="">Select...</option>
                    {languages.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Level Number</label>
                  <input type="number" value={levelForm.levelNumber} onChange={e => setLevelForm({...levelForm, levelNumber: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Heading / Chapter</label>
                  <input type="text" value={levelForm.heading} onChange={e => setLevelForm({...levelForm, heading: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Content Text</label>
                  <textarea rows="4" value={levelForm.content} onChange={e => setLevelForm({...levelForm, content: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Image URL (Optional)</label>
                  <input type="text" value={levelForm.image} onChange={e => setLevelForm({...levelForm, image: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" placeholder="https://..." />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Add Level</button>
              </form>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Levels for Selected Language</h3>
              <div className="space-y-2">
                {levels.length === 0 ? <p className="text-sm text-slate-400">No levels found.</p> : levels.map(level => (
                  <div key={level._id} className="p-3 border border-slate-100 bg-slate-50 rounded-lg">
                    <span className="font-bold mr-2 text-emerald-600">Lvl {level.levelNumber}:</span>
                    <span className="font-medium text-slate-700">{level.heading}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === "questions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Add New Question</h3>
              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Select Language to see Levels</label>
                  <select 
                    onChange={e => fetchLevels(e.target.value)} 
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value="">Select...</option>
                    {languages.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Select Level</label>
                  <select 
                    value={questionForm.levelId} 
                    onChange={e => {
                      setQuestionForm({...questionForm, levelId: e.target.value});
                      fetchQuestions(e.target.value);
                    }} 
                    className="w-full p-2 border border-slate-200 rounded-lg" required
                  >
                    <option value="">Select...</option>
                    {levels.map(l => <option key={l._id} value={l._id}>Level {l.levelNumber}: {l.heading}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Question Title</label>
                  <input type="text" value={questionForm.title} onChange={e => setQuestionForm({...questionForm, title: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Description / Problem Statement</label>
                  <textarea rows="3" value={questionForm.description} onChange={e => setQuestionForm({...questionForm, description: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Boilerplate Code</label>
                  <textarea rows="3" value={questionForm.boilerplateCode} onChange={e => setQuestionForm({...questionForm, boilerplateCode: e.target.value})} className="w-full p-2 font-mono text-xs border border-slate-200 bg-slate-50 rounded-lg" placeholder="function solve(input) {&#10;  // write code&#10;}" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Test Cases (JSON format)</label>
                  <textarea rows="3" value={questionForm.testCases} onChange={e => setQuestionForm({...questionForm, testCases: e.target.value})} className="w-full p-2 font-mono text-xs border border-slate-200 bg-slate-50 rounded-lg" placeholder='[{"input":"5", "expectedOutput":"10"}]' required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Points</label>
                  <input type="number" value={questionForm.points} onChange={e => setQuestionForm({...questionForm, points: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Add Question</button>
              </form>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Questions for Selected Level</h3>
              <div className="space-y-2">
                {questions.length === 0 ? <p className="text-sm text-slate-400">No questions found.</p> : questions.map(q => (
                  <div key={q._id} className="p-3 border border-slate-100 bg-slate-50 rounded-lg">
                    <span className="font-bold mr-2 text-slate-900">{q.title}</span>
                    <span className="text-xs font-bold text-emerald-600">({q.points} pts)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === "settings" && settings && (
          <div className="max-w-2xl">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Profile Level Tick Configuration</h3>
            <p className="text-sm text-slate-500 mb-6">Configure the color of the verification tick based on user level.</p>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              {settings.levelRanges.map((range, index) => (
                <div key={index} className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Min Level</label>
                    <input type="number" value={range.minLevel} onChange={e => {
                      const newRanges = [...settings.levelRanges];
                      newRanges[index].minLevel = parseInt(e.target.value);
                      setSettings({...settings, levelRanges: newRanges});
                    }} className="w-full p-2 border border-slate-200 rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Max Level</label>
                    <input type="number" value={range.maxLevel} onChange={e => {
                      const newRanges = [...settings.levelRanges];
                      newRanges[index].maxLevel = parseInt(e.target.value);
                      setSettings({...settings, levelRanges: newRanges});
                    }} className="w-full p-2 border border-slate-200 rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tick Color (Hex)</label>
                    <div className="flex gap-2">
                      <input type="color" value={range.tickColor} onChange={e => {
                        const newRanges = [...settings.levelRanges];
                        newRanges[index].tickColor = e.target.value;
                        setSettings({...settings, levelRanges: newRanges});
                      }} className="w-10 h-10 p-1 border border-slate-200 rounded-lg" />
                      <input type="text" value={range.tickColor} onChange={e => {
                        const newRanges = [...settings.levelRanges];
                        newRanges[index].tickColor = e.target.value;
                        setSettings({...settings, levelRanges: newRanges});
                      }} className="w-full p-2 font-mono text-xs border border-slate-200 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4">
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
                  <Save size={18} /> Save Configurations
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLearning;
