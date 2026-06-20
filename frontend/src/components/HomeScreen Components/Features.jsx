import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CheckCircle2 } from "lucide-react";

function Features() {
  const features = [
    {
      title: "Learn by Doing",
      description: "Interactive tutorials and exercises designed to build your coding muscle memory."
    },
    {
      title: "Real-World Projects",
      description: "Practice your skills by building projects that companies actually care about."
    },
    {
      title: "Direct Hiring",
      description: "Top companies recruit directly from our platform based on your verified skills."
    }
  ];

  return (
    <section className="w-full py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">
        
        {/* Features List */}
        <div className="w-full md:w-[50%]">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
            Why Choose TopDevs?
          </h2>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            We provide everything you need to go from a beginner to a hired professional software engineer, all in one platform.
          </p>
          
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-[50%] flex items-center justify-center">
          <DotLottieReact
            src="/WebCoding.json"
            autoplay
            loop
            className="h-[300px] md:h-[480px] w-auto"
          />
        </div>

      </div>
    </section>
  );
}

export default Features;
