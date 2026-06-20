import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function OurGoal() {
  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row items-center gap-12 px-6 md:px-16 py-20 bg-gradient-to-br from-[rgba(168,193,189,0.3)] to-[rgba(255,255,255,0.8)]">
      {/* Animation */}
      <div className="flex-1 flex items-center justify-center">
        <DotLottieReact
          src="/coding.json"
          autoplay
          loop
          className="h-[300px] md:h-[480px] w-auto"
        />
      </div>

      {/* Text */}
      <div className="flex-1">
        <h1 className="text-[30px] md:text-[42px] font-extrabold text-blue-700">
          Our Goal
        </h1>
        <div className="mt-6">
          <p className="text-lg md:text-[19px] text-slate-700 leading-relaxed">
            Our goal is to bridge the gap between learning and hiring by
            creating a platform where users can learn programming, practice
            real-world coding problems, and showcase their skills. We aim to
            build a system where talent is measured by performance, helping
            developers grow and get hired based on their actual abilities.
          </p>
        </div>
      </div>
    </section>
  );
}

export default OurGoal;
