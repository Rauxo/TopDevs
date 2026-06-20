import React from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Rocket, Target, ArrowRight } from "lucide-react";
import Features from "../../components/HomeScreen Components/Features";
import OurGoal from "../../components/HomeScreen Components/OurGoal";
import WhoWeAre from "../../components/HomeScreen Components/WhoWeAre";
import CommunitySupport from "../../components/HomeScreen Components/CommunitySupport";
import CallToAction from "../../components/HomeScreen Components/CallToAction";
import VideoShowcase from "../../components/VideoShowcase";

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] w-full flex items-center bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
          {/* Hero Text */}
          <div className="w-full md:w-[50%] z-10 pt-20 md:pt-0">
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-slate-900 mb-6 tracking-tight">
              Welcome to <span className="text-blue-600">TopDevs</span>{" "}
              Community
            </h1>

            <p className="text-xl font-bold text-slate-700 flex items-center gap-2 mb-4">
              Learn, Practice &amp; Get Hired{" "}
              <Target size={20} className="text-blue-600" />
            </p>

            <p className="text-slate-600 text-lg leading-relaxed max-w-lg mb-10">
              A platform that bridges the gap between learning to code and
              landing your dream job. Build skills, earn ranks, and connect with
              top companies.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/create")}
                className="px-8 py-4 font-bold text-base text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors cursor-pointer border-none flex items-center gap-2"
              >
                Get Started <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 font-bold text-base text-slate-900 bg-white border-2 border-slate-900 rounded hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>

          {/* Hero Animation */}
          <div className="hidden md:flex w-[50%] justify-end pointer-events-none">
            <DotLottieReact
              src="/PC Coding and Dislay app Mobile.json"
              autoplay
              loop
              className="w-[680px] h-[540px]"
            />
          </div>
        </div>
      </section>

      {/* ── Content Sections ── */}
      <Features />
      <VideoShowcase />
      <OurGoal />
      <WhoWeAre />
      <CommunitySupport />
      <CallToAction />
    </>
  );
}

export default HomeScreen;
