import React from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Rocket, Target, ArrowRight } from "lucide-react";
import OurGoal from "../../components/HomeScreen Components/OurGoal";
import WhoWeAre from "../../components/HomeScreen Components/WhoWeAre";
function HomeScreen() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-100">
        {/* Decorative background blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 w-[400px] h-[400px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Text */}
        <div className="relative z-10 w-full md:w-[55%] px-6 md:pl-24">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full mb-4">
            <Rocket size={14} /> Developer Platform
          </span>
          <h1 className="text-4xl md:text-[52px] font-extrabold leading-[1.1] text-slate-800">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-500">
              TopDevs
            </span>{" "}
            Community
          </h1>
          <p className="text-xl md:text-2xl font-medium mt-4 text-slate-600 flex items-center gap-2">
            Learn, Practice &amp; Get Hired <Target size={24} className="text-emerald-500" />
          </p>
          <p className="mt-4 text-slate-500 text-base max-w-md leading-relaxed">
            A platform that bridges the gap between learning to code and landing
            your dream job. Build skills, earn ranks, and connect with top
            companies.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/create")}
              className="h-13 px-8 rounded-xl font-bold text-base text-white bg-gradient-to-r from-emerald-500 to-sky-500 shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_28px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border-none flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="h-13 px-8 rounded-xl font-bold text-base text-slate-700 bg-white border-2 border-slate-200 hover:border-emerald-400 hover:text-emerald-600 transition-all duration-200 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>

        {/* Hero Animation — hidden on small screens */}
        <div className="hidden md:flex absolute right-0 top-0 h-full w-[50%] items-center justify-center pointer-events-none">
          <DotLottieReact
            src="/PC Coding and Dislay app Mobile.json"
            autoplay
            loop
            className="w-[680px] h-[540px]"
          />
        </div>
      </section>

      {/* ── Content Sections ── */}
      <OurGoal />
      <WhoWeAre />
    </>
  );
}

export default HomeScreen;
