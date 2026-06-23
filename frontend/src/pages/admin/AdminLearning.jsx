import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Plus, Edit2, Trash2, Settings, GraduationCap,
  Layers, HelpCircle, Save, X, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";
import API from "../../API/api";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const token = () => localStorage.getItem("adminToken");
const authH = () => ({ headers: { Authorization: `Bearer ${token()}` } });

const Confirm = ({ msg, onYes, onNo }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-slate-700">{msg}</p>
      </div>
      <div className="flex gap-3 justify-end">
        <button onClick={onNo} className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
        <button onClick={onYes} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
      </div>
    </div>
  </div>
);

// ─── Modal wrapper ────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="font-black text-slate-900">{title}</h2>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

// ─── Field helpers ────────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
    {children}
  </div>
);

const inp = "w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";
const monoInp = inp + " font-mono text-xs bg-slate-50";

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AdminLearning = () => {
  const [activeTab, setActiveTab] = useState("languages");
  const [languages, setLanguages] = useState([]);
  const [levels, setLevels]       = useState([]);
  const [questions, setQuestions] = useState([]);
  const [settings, setSettings]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [toast, setToast]         = useState(null);

  // modal states
  const [editLang,    setEditLang]    = useState(null);
  const [editLevel,   setEditLevel]   = useState(null);
  const [editQuestion,setEditQuestion]= useState(null);
  const [confirmDel,  setConfirmDel]  = useState(null); // { type, id, label }

  // form states
  const [langForm,     setLangForm]     = useState({ name: "", description: "", order: 0, icon: "" });
  const [levelForm,    setLevelForm]    = useState({ languageId: "", levelNumber: "", heading: "", content: "", image: "" });
  const [questionForm, setQuestionForm] = useState({ levelId: "", title: "", description: "", boilerplateCode: "", points: 10, testCases: '[{"input":"","expectedOutput":""}]' });
  const [selLangForQ,  setSelLangForQ]  = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // ── fetch ────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "languages") {
        const r = await API.get("/learning/languages");
        setLanguages(r.data);
      } else if (activeTab === "levels") {
        const r = await API.get("/learning/languages");
        setLanguages(r.data);
        if (r.data.length > 0) {
          const id = levelForm.languageId || r.data[0]._id;
          setLevelForm(p => ({ ...p, languageId: id }));
          fetchLevels(id);
        }
      } else if (activeTab === "questions") {
        const r = await API.get("/learning/languages");
        setLanguages(r.data);
      } else if (activeTab === "settings") {
        const r = await API.get("/learning/settings");
        setSettings(r.data);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchLevels = async (langId) => {
    if (!langId) return;
    try {
      const r = await API.get(`/admin/levels/${langId}`, authH());
      setLevels(r.data);
    } catch (e) { console.error(e); }
  };

  const fetchQuestions = async (levelId) => {
    if (!levelId) return;
    try {
      const r = await API.get(`/admin/questions/${levelId}`, authH());
      setQuestions(r.data);
    } catch (e) { console.error(e); }
  };

  // ── LANGUAGE CRUD ────────────────────────────────────────────────────────
  const handleCreateLanguage = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/language", langForm, authH());
      showToast("Language added!");
      setLangForm({ name: "", description: "", order: 0, icon: "" });
      fetchData();
    } catch { showToast("Error creating language", "error"); }
  };

  const handleUpdateLanguage = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/language/${editLang._id}`, editLang, authH());
      showToast("Language updated!");
      setEditLang(null);
      fetchData();
    } catch { showToast("Error updating language", "error"); }
  };

  const handleDeleteLanguage = async (id) => {
    try {
      await API.delete(`/admin/language/${id}`, authH());
      showToast("Language deleted!");
      fetchData();
    } catch { showToast("Error deleting language", "error"); }
  };

  // ── LEVEL CRUD ───────────────────────────────────────────────────────────
  const handleCreateLevel = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/level", levelForm, authH());
      showToast("Level added!");
      setLevelForm(p => ({ ...p, levelNumber: "", heading: "", content: "", image: "" }));
      fetchLevels(levelForm.languageId);
    } catch { showToast("Error creating level", "error"); }
  };

  const handleUpdateLevel = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/level/${editLevel._id}`, editLevel, authH());
      showToast("Level updated!");
      setEditLevel(null);
      fetchLevels(levelForm.languageId);
    } catch { showToast("Error updating level", "error"); }
  };

  const handleDeleteLevel = async (id) => {
    try {
      await API.delete(`/admin/level/${id}`, authH());
      showToast("Level deleted!");
      fetchLevels(levelForm.languageId);
    } catch { showToast("Error deleting level", "error"); }
  };

  // ── QUESTION CRUD ────────────────────────────────────────────────────────
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    let testCases = questionForm.testCases;
    try { testCases = JSON.parse(testCases); } catch { return showToast("Test cases must be valid JSON", "error"); }
    try {
      await API.post("/admin/question", { ...questionForm, testCases }, authH());
      showToast("Question added!");
      setQuestionForm(p => ({ ...p, title: "", description: "", boilerplateCode: "", points: 10, testCases: '[{"input":"","expectedOutput":""}]' }));
      fetchQuestions(questionForm.levelId);
    } catch { showToast("Error creating question", "error"); }
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    let testCases;
    try {
      testCases = JSON.parse(editQuestion.testCasesRaw || JSON.stringify(editQuestion.testCases));
    } catch { return showToast("Test cases must be valid JSON", "error"); }
    try {
      await API.put(`/admin/question/${editQuestion._id}`, { ...editQuestion, testCases }, authH());
      showToast("Question updated!");
      setEditQuestion(null);
      fetchQuestions(questionForm.levelId);
    } catch { showToast("Error updating question", "error"); }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await API.delete(`/admin/question/${id}`, authH());
      showToast("Question deleted!");
      fetchQuestions(questionForm.levelId);
    } catch { showToast("Error deleting question", "error"); }
  };

  // ── SETTINGS ─────────────────────────────────────────────────────────────
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await API.put("/admin/learning-settings", settings, authH());
      showToast("Settings saved!");
    } catch { showToast("Error saving settings", "error"); }
  };

  const addTickRange = () => {
    setSettings(s => ({
      ...s,
      levelRanges: [...s.levelRanges, { minLevel: 1, maxLevel: 10, tickColor: "#6366f1" }]
    }));
  };

  const removeTickRange = (index) => {
    setSettings(s => ({
      ...s,
      levelRanges: s.levelRanges.filter((_, i) => i !== index)
    }));
  };

  const updateRange = (index, field, value) => {
    const ranges = [...settings.levelRanges];
    ranges[index] = { ...ranges[index], [field]: field.includes("Level") ? parseInt(value) : value };
    setSettings(s => ({ ...s, levelRanges: ranges }));
  };

  // ── confirm delete dispatcher ─────────────────────────────────────────────
  const doDelete = () => {
    if (!confirmDel) return;
    const { type, id } = confirmDel;
    if (type === "language") handleDeleteLanguage(id);
    if (type === "level")    handleDeleteLevel(id);
    if (type === "question") handleDeleteQuestion(id);
    setConfirmDel(null);
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  const tabs = [
    { id: "languages", icon: GraduationCap, label: "Languages" },
    { id: "levels",    icon: Layers,        label: "Levels"    },
    { id: "questions", icon: HelpCircle,    label: "Questions" },
    { id: "settings",  icon: Settings,      label: "Settings"  },
  ];

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-bold text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
          {toast.msg}
        </div>
      )}

      {/* Confirm dialog */}
      {confirmDel && (
        <Confirm
          msg={`Delete "${confirmDel.label}"? This cannot be undone.`}
          onYes={doDelete}
          onNo={() => setConfirmDel(null)}
        />
      )}

      {/* Edit modals */}
      {editLang && (
        <Modal title="Edit Language" onClose={() => setEditLang(null)}>
          <form onSubmit={handleUpdateLanguage} className="space-y-4">
            <Field label="Name"><input className={inp} value={editLang.name} onChange={e => setEditLang(p => ({ ...p, name: e.target.value }))} required /></Field>
            <Field label="Description"><textarea className={inp} rows={2} value={editLang.description} onChange={e => setEditLang(p => ({ ...p, description: e.target.value }))} /></Field>
            <Field label="Icon URL"><input className={inp} value={editLang.icon} onChange={e => setEditLang(p => ({ ...p, icon: e.target.value }))} placeholder="https://..." /></Field>
            <Field label="Order (sort)"><input type="number" className={inp} value={editLang.order} onChange={e => setEditLang(p => ({ ...p, order: e.target.value }))} /></Field>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Changes</button>
              <button type="button" onClick={() => setEditLang(null)} className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {editLevel && (
        <Modal title={`Edit Level ${editLevel.levelNumber}`} onClose={() => setEditLevel(null)}>
          <form onSubmit={handleUpdateLevel} className="space-y-4">
            <Field label="Level Number"><input type="number" className={inp} value={editLevel.levelNumber} onChange={e => setEditLevel(p => ({ ...p, levelNumber: e.target.value }))} required /></Field>
            <Field label="Heading"><input className={inp} value={editLevel.heading} onChange={e => setEditLevel(p => ({ ...p, heading: e.target.value }))} required /></Field>
            <Field label="Content Text"><textarea className={inp} rows={5} value={editLevel.content} onChange={e => setEditLevel(p => ({ ...p, content: e.target.value }))} required /></Field>
            <Field label="Image URL (optional)"><input className={inp} value={editLevel.image || ""} onChange={e => setEditLevel(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></Field>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Changes</button>
              <button type="button" onClick={() => setEditLevel(null)} className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {editQuestion && (
        <Modal title="Edit Question" onClose={() => setEditQuestion(null)}>
          <form onSubmit={handleUpdateQuestion} className="space-y-4">
            <Field label="Title"><input className={inp} value={editQuestion.title} onChange={e => setEditQuestion(p => ({ ...p, title: e.target.value }))} required /></Field>
            <Field label="Description / Problem Statement"><textarea className={inp} rows={3} value={editQuestion.description} onChange={e => setEditQuestion(p => ({ ...p, description: e.target.value }))} required /></Field>
            <Field label="Boilerplate Code">
              <textarea className={monoInp} rows={4} value={editQuestion.boilerplateCode} onChange={e => setEditQuestion(p => ({ ...p, boilerplateCode: e.target.value }))} required />
            </Field>
            <Field label='Test Cases (JSON: [{input, expectedOutput}])'>
              <textarea
                className={monoInp} rows={5}
                value={editQuestion.testCasesRaw || JSON.stringify(editQuestion.testCases, null, 2)}
                onChange={e => setEditQuestion(p => ({ ...p, testCasesRaw: e.target.value }))}
                required
              />
            </Field>
            <Field label="Points"><input type="number" className={inp} value={editQuestion.points} onChange={e => setEditQuestion(p => ({ ...p, points: e.target.value }))} required /></Field>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Save Changes</button>
              <button type="button" onClick={() => setEditQuestion(null)} className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Learning Center Management</h1>
        <p className="text-slate-500">Manage languages, levels, coding questions, and tick settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-colors ${
              activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        {loading && <div className="p-10 text-center animate-pulse text-slate-400">Loading...</div>}

        {/* ── LANGUAGES ── */}
        {!loading && activeTab === "languages" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add form */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Add New Language</h3>
              <form onSubmit={handleCreateLanguage} className="space-y-4">
                <Field label="Language Name"><input className={inp} value={langForm.name} onChange={e => setLangForm(p => ({ ...p, name: e.target.value }))} required /></Field>
                <Field label="Description"><textarea className={inp} rows={2} value={langForm.description} onChange={e => setLangForm(p => ({ ...p, description: e.target.value }))} required /></Field>
                <Field label="Icon URL"><input className={inp} value={langForm.icon} onChange={e => setLangForm(p => ({ ...p, icon: e.target.value }))} placeholder="https://..." required /></Field>
                <Field label="Order (sort position)"><input type="number" className={inp} value={langForm.order} onChange={e => setLangForm(p => ({ ...p, order: e.target.value }))} /></Field>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                  <Plus size={16} /> Add Language
                </button>
              </form>
            </div>

            {/* List */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Existing Languages ({languages.length})</h3>
              <div className="space-y-2">
                {languages.map(lang => (
                  <div key={lang._id} className="p-3 border border-slate-100 bg-slate-50 rounded-xl flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <img src={lang.icon} alt={lang.name} className="w-8 h-8 object-contain" onError={e => e.target.style.display = "none"} />
                      <div>
                        <p className="font-bold text-slate-900">{lang.name}</p>
                        <p className="text-xs text-slate-500">{lang.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditLang({ ...lang })}
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                        title="Edit"
                      ><Edit2 size={15} /></button>
                      <button
                        onClick={() => setConfirmDel({ type: "language", id: lang._id, label: lang.name })}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                        title="Delete"
                      ><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LEVELS ── */}
        {!loading && activeTab === "levels" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add form */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Add New Level</h3>
              <form onSubmit={handleCreateLevel} className="space-y-4">
                <Field label="Select Language">
                  <select
                    className={inp}
                    value={levelForm.languageId}
                    onChange={e => { setLevelForm(p => ({ ...p, languageId: e.target.value })); fetchLevels(e.target.value); }}
                    required
                  >
                    <option value="">Select...</option>
                    {languages.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                  </select>
                </Field>
                <Field label="Level Number"><input type="number" className={inp} value={levelForm.levelNumber} onChange={e => setLevelForm(p => ({ ...p, levelNumber: e.target.value }))} required /></Field>
                <Field label="Heading / Chapter Title"><input className={inp} value={levelForm.heading} onChange={e => setLevelForm(p => ({ ...p, heading: e.target.value }))} required /></Field>
                <Field label="Content Text"><textarea rows={4} className={inp} value={levelForm.content} onChange={e => setLevelForm(p => ({ ...p, content: e.target.value }))} required /></Field>
                <Field label="Image URL (optional)"><input className={inp} value={levelForm.image} onChange={e => setLevelForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></Field>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                  <Plus size={16} /> Add Level
                </button>
              </form>
            </div>

            {/* List */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Levels ({levels.length})</h3>
              <div className="space-y-2">
                {levels.length === 0
                  ? <p className="text-sm text-slate-400">Select a language to see its levels.</p>
                  : levels.map(level => (
                    <div key={level._id} className="p-3 border border-slate-100 bg-slate-50 rounded-xl flex justify-between items-center group">
                      <div>
                        <span className="font-bold text-blue-600 mr-2">Lvl {level.levelNumber}:</span>
                        <span className="font-medium text-slate-700">{level.heading}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditLevel({ ...level })}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                          title="Edit"
                        ><Edit2 size={15} /></button>
                        <button
                          onClick={() => setConfirmDel({ type: "level", id: level._id, label: `Level ${level.levelNumber}: ${level.heading}` })}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="Delete"
                        ><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ── QUESTIONS ── */}
        {!loading && activeTab === "questions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add form */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Add New Question</h3>
              <form onSubmit={handleCreateQuestion} className="space-y-4">
                <Field label="Select Language">
                  <select className={inp} value={selLangForQ} onChange={e => { setSelLangForQ(e.target.value); fetchLevels(e.target.value); }}>
                    <option value="">Select...</option>
                    {languages.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                  </select>
                </Field>
                <Field label="Select Level">
                  <select className={inp} value={questionForm.levelId} onChange={e => { setQuestionForm(p => ({ ...p, levelId: e.target.value })); fetchQuestions(e.target.value); }} required>
                    <option value="">Select...</option>
                    {levels.map(l => <option key={l._id} value={l._id}>Level {l.levelNumber}: {l.heading}</option>)}
                  </select>
                </Field>
                <Field label="Question Title"><input className={inp} value={questionForm.title} onChange={e => setQuestionForm(p => ({ ...p, title: e.target.value }))} required /></Field>
                <Field label="Description / Problem Statement"><textarea rows={3} className={inp} value={questionForm.description} onChange={e => setQuestionForm(p => ({ ...p, description: e.target.value }))} required /></Field>
                <Field label="Boilerplate Code">
                  <textarea rows={4} className={monoInp} value={questionForm.boilerplateCode} onChange={e => setQuestionForm(p => ({ ...p, boilerplateCode: e.target.value }))} placeholder={`def solve(input):\n    # write code here\n    return input`} required />
                </Field>
                <Field label='Test Cases JSON — [{input, expectedOutput}]'>
                  <textarea rows={4} className={monoInp} value={questionForm.testCases} onChange={e => setQuestionForm(p => ({ ...p, testCases: e.target.value }))} placeholder='[{"input":"5","expectedOutput":"10"}]' required />
                  <p className="text-xs text-slate-400 mt-1">⚠️ <b>expectedOutput</b> must match exactly what the code prints.</p>
                </Field>
                <Field label="Points"><input type="number" className={inp} value={questionForm.points} onChange={e => setQuestionForm(p => ({ ...p, points: e.target.value }))} required /></Field>
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                  <Plus size={16} /> Add Question
                </button>
              </form>
            </div>

            {/* List */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-800">Questions ({questions.length})</h3>
              <div className="space-y-3">
                {questions.length === 0
                  ? <p className="text-sm text-slate-400">Select a level to see its questions.</p>
                  : questions.map(q => (
                    <div key={q._id} className="p-4 border border-slate-100 bg-slate-50 rounded-xl group">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate">{q.title}</p>
                          <div className="flex gap-3 mt-1">
                            <span className="text-xs font-bold text-blue-600">{q.points} pts</span>
                            <span className="text-xs text-slate-400">{q.testCases?.length || 0} test case(s)</span>
                          </div>
                          {/* Show test cases preview */}
                          {q.testCases?.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {q.testCases.map((tc, i) => (
                                <div key={i} className="text-xs font-mono bg-white border border-slate-100 rounded px-2 py-1 text-slate-600">
                                  <span className="text-slate-400">in:</span> {tc.input} &nbsp;
                                  <span className="text-slate-400">→</span> &nbsp;
                                  <span className={tc.expectedOutput ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                                    {tc.expectedOutput || "⚠️ MISSING"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => setEditQuestion({ ...q, testCasesRaw: JSON.stringify(q.testCases, null, 2) })}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                            title="Edit"
                          ><Edit2 size={15} /></button>
                          <button
                            onClick={() => setConfirmDel({ type: "question", id: q._id, label: q.title })}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                            title="Delete"
                          ><Trash2 size={15} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {!loading && activeTab === "settings" && settings && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-slate-800">Profile Level Tick Ranges</h3>
              <button
                onClick={addTickRange}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700"
              >
                <Plus size={16} /> Add Range
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Set the tick badge color users earn at each profile level range.
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-3">
              {settings.levelRanges.map((range, i) => (
                <div key={i} className="flex gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {/* Badge preview */}
                  <div className="shrink-0 w-10 h-10 rounded-full border-4 flex items-center justify-center" style={{ borderColor: range.tickColor }}>
                    <span className="text-xs font-black" style={{ color: range.tickColor }}>✓</span>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Min Level</label>
                    <input type="number" className={inp} value={range.minLevel} onChange={e => updateRange(i, "minLevel", e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Max Level</label>
                    <input type="number" className={inp} value={range.maxLevel} onChange={e => updateRange(i, "maxLevel", e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Tick Color</label>
                    <div className="flex gap-2">
                      <input type="color" className="w-10 h-10 p-1 border border-slate-200 rounded-lg cursor-pointer" value={range.tickColor} onChange={e => updateRange(i, "tickColor", e.target.value)} />
                      <input type="text" className={`${inp} font-mono text-xs`} value={range.tickColor} onChange={e => updateRange(i, "tickColor", e.target.value)} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTickRange(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mb-0.5"
                    title="Remove this range"
                  ><Trash2 size={16} /></button>
                </div>
              ))}

              {settings.levelRanges.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No tick ranges defined. Click "Add Range" to create one.
                </div>
              )}

              <div className="pt-4">
                <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
                  <Save size={18} /> Save All Settings
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
