import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function WhoWeAre() {
  return (
    <section className="w-full min-h-screen flex flex-col-reverse md:flex-row items-center gap-12 px-6 md:px-16 py-20 bg-[rgba(168,193,189,0.2)]">
      {/* Text */}
      <div className="flex-1">
        <h1 className="text-[30px] md:text-[42px] font-extrabold text-emerald-700">
          Who We Are
        </h1>
        <p className="mt-6 text-lg md:text-[19px] text-slate-700 leading-relaxed">
          We are building a modern platform that combines learning, coding
          practice, and hiring into one ecosystem. Our focus is to empower
          developers with real skills, gamified learning, and opportunities to
          connect with companies, making the journey from learning to getting
          hired seamless and efficient.
        </p>
      </div>

      {/* Animation */}
      <div className="flex-1 flex items-center justify-center">
        <DotLottieReact
          src="/About Us Team.json"
          autoplay
          loop
          className="h-[300px] md:h-[480px] w-auto"
        />
      </div>
    </section>
  );
}

export default WhoWeAre;
