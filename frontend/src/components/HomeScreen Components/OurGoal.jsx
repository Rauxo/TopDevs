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
            Our goal is to simplify and digitize institute management by
            providing a powerful and easy-to-use platform. We aim to help
            administrators, staff, and students manage academic activities
            efficiently, reduce manual work, and improve transparency in
            attendance, fees, exams, and overall performance tracking.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OurGoal;
