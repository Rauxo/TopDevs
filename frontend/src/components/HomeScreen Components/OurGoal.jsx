import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function OurGoal() {
  return (
    <div className="OurGoalContainer">
      <div className="goalImageContainer">
        <DotLottieReact
          src="/coding.json"
          autoplay
          loop
          className="goalCodingAnimation"
        />
      </div>
      <div className="GoalTitle">
        <h1>Our Goal</h1>
        <div className="goalParagraph">
          <p>
            Our goal is to bridge the gap between learning and hiring by
            creating a platform where users can learn programming, practice
            real-world coding problems, and showcase their skills. We aim to
            build a system where talent is measured by performance, helping
            developers grow and get hired based on their actual abilities.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OurGoal;
