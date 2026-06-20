import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Timer, Play, CheckCircle2, ChevronLeft, Send, AlertCircle } from "lucide-react";
import API from "../../API/api";

const SolvePage = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get(`/learning/questions/${levelId}`);
        setQuestions(res.data);
        if (res.data.length > 0) {
          setCode(res.data[0].boilerplateCode);
        }
      } catch (err) {
        console.error("Error fetching questions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [levelId]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRunCode = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await API.post("/learning/run-code", {
        questionId: questions[currentQuestionIndex]._id,
        code
      });
      setResult({ status: "success", message: res.data.message });
    } catch (err) {
      setResult({ status: "error", message: err.response?.data?.message || "Error running code" });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await API.post("/learning/submit-code", {
        questionId: questions[currentQuestionIndex]._id,
        code,
        timeTaken: timer
      });
      
      setResult({ status: "success", message: res.data.message, points: res.data.pointsAwarded });
      setIsRunning(false);

      // If more questions, move to next
      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
            setCode(questions[currentQuestionIndex + 1].boilerplateCode);
            setTimer(0);
            setIsRunning(true);
            setResult(null);
        }, 2000);
      } else {
        // Completed all questions for this level
        setTimeout(() => {
            navigate(-2); // Back to levels list
        }, 3000);
      }

    } catch (err) {
      setResult({ status: "error", message: err.response?.data?.message || "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Questions...</div>;
  if (questions.length === 0) return <div className="min-h-screen flex items-center justify-center">No questions found for this level.</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <div className="h-4 w-[1px] bg-slate-800 mx-2"></div>
          <h2 className="font-bold text-slate-200">{currentQuestion.title}</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-blue-400 font-mono bg-blue-400/10 px-4 py-1.5 rounded border border-blue-400/20">
            <Timer size={18} />
            <span>{formatTime(timer)}</span>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-bold rounded transition-all flex items-center gap-2"
          >
            {submitting ? "Submitting..." : <><Send size={18} /> Submit Solution</>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Question */}
        <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-900 overflow-y-auto p-8">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-800 px-3 py-1 rounded">
              Problem {currentQuestionIndex + 1}
            </span>
          </div>
          <h1 className="text-2xl font-black mb-6">{currentQuestion.title}</h1>
          <div className="prose prose-invert text-slate-400 leading-relaxed whitespace-pre-wrap mb-8">
            {currentQuestion.description}
          </div>

          <div className="mt-auto pt-8 border-t border-slate-800">
            <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Test Cases</h4>
            <div className="space-y-3">
              {currentQuestion.testCases?.map((tc, i) => (
                <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-xs font-bold text-slate-500 mb-2">Input</div>
                  <div className="font-mono text-blue-400 mb-3">{tc.input}</div>
                  <div className="text-xs font-bold text-slate-500 mb-2">Expected Output</div>
                  <div className="font-mono text-blue-400">{tc.expectedOutput}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Editor & Result */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 bg-[#1e1e1e]">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 20 },
              }}
            />
          </div>

          {/* Result Overlay */}
          {result && (
            <div className={`absolute bottom-6 right-6 p-6 rounded-2xl shadow-2xl border flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-300 ${
              result.status === "success" ? "bg-blue-900 border-blue-500/50" : "bg-red-900 border-red-500/50"
            }`}>
              <div className="flex items-center gap-3">
                {result.status === "success" ? (
                  <CheckCircle2 size={24} className="text-blue-400" />
                ) : (
                  <AlertCircle size={24} className="text-red-400" />
                )}
                <span className="font-bold text-lg">{result.status === "success" ? "Success!" : "Failed"}</span>
              </div>
              <p className="text-slate-200">{result.message}</p>
              {result.points && (
                <span className="font-bold text-blue-400">+{result.points} Points Earned</span>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="h-16 border-t border-slate-800 bg-slate-900 flex items-center justify-between px-6">
            <button 
              onClick={handleRunCode}
              disabled={running || submitting}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-bold rounded transition-all flex items-center gap-2"
            >
              <Play size={18} fill="currentColor" /> {running ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvePage;
