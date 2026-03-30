import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function WhoWeAre() {
  return (
    <div className="whoWeAreContainer">
      <div className="whoWeAreTextContainer">
        <h1>Who We Are</h1>
        <p>
          We are building a modern platform that combines learning, coding
          practice, and hiring into one ecosystem. Our focus is to empower
          developers with real skills, gamified learning, and opportunities to
          connect with companies, making the journey from learning to getting
          hired seamless and efficient.
        </p>
      </div>
      <div className="whoWeAreAnimation">
        <DotLottieReact
          src="/About Us Team.json"
          autoplay
          loop
          className="whoWeAreLottieAnimation"
        />
      </div>
    </div>
  );
}

export default WhoWeAre;
