import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function CommunitySupport() {
  return (
    <section className="w-full py-24 bg-white border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
        
        {/* Animation */}
        <div className="w-full md:w-[50%] flex items-center justify-center">
          <DotLottieReact
            src="/Looped 404 error animation.json"
            autoplay
            loop
            className="h-[300px] md:h-[480px] w-auto"
          />
        </div>

        {/* Text */}
        <div className="w-full md:w-[50%]">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
            Never Hit a Dead End
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-6">
            Getting stuck on a bug is part of learning, but staying stuck doesn't have to be. Our massive community of developers is always here to help you debug, review code, and point you in the right direction.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Whenever you feel lost, the TopDevs community is just a click away to get you back on track.
          </p>
        </div>

      </div>
    </section>
  );
}

export default CommunitySupport;
