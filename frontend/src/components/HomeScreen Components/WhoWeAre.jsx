import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function WhoWeAre() {
  return (
    <section className="w-full py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center gap-16">
        
        {/* Text */}
        <div className="w-full md:w-[50%]">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
            Who We Are
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            We are building a modern platform that combines learning, coding
            practice, and hiring into one ecosystem. 
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our focus is to empower developers with real skills, gamified learning, and opportunities to connect with companies, making the journey from learning to getting hired seamless and efficient.
          </p>
        </div>

        <div className="w-full md:w-[50%] flex items-center justify-center">
          <DotLottieReact
            src="/About Us Team.json"
            autoplay
            loop
            className="h-[300px] md:h-[480px] w-auto"
          />
        </div>

      </div>
    </section>
  );
}

export default WhoWeAre;
