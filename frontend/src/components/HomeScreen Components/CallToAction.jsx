import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AuthContext } from "../../API/AuthContext";

function CallToAction() {
  const navigate = useNavigate();
  const { openAuthModal } = useContext(AuthContext);

  return (
    <section className="w-full py-24 bg-slate-900 text-white text-center">
      <div className="max-w-[800px] mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          Ready to Level Up?
        </h2>
        <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
          Join thousands of developers who are practicing real-world skills and getting hired by top tech companies.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => openAuthModal("user-register")}
            className="px-10 py-4 font-bold text-lg text-white bg-blue-600 rounded hover:bg-blue-600 transition-colors cursor-pointer border-none flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            Create Free Account <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate("/jobs")}
            className="px-10 py-4 font-bold text-lg text-white bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors cursor-pointer w-full sm:w-auto"
          >
            View Open Jobs
          </button>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
