import React from "react";
import Layout from "../../Layout/Layout";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import OurGoal from "../../components/HomeScreen Components/OurGoal";
import WhoWeAre from "../../components/HomeScreen Components/WhoWeAre";

function HomeScreen() {
  return (
    <Layout>
      <div className="HomeContainer">
        <div className="container-animation">
          <div className="HomeAnimation">
          <DotLottieReact src="/PC Coding and Dislay app Mobile.json" autoplay loop className="HomeAnimationSource"/>
        </div>
        </div>
        <div className="secondContainer">
          <h1>Welcome to TopDevs Community</h1>
          <h2>Learn and get Hired</h2>
          <div className="getStarted">
            <button>Get Started </button>
          </div>
        </div>
      </div>
      <div>
        <OurGoal/>
        <WhoWeAre/>
      </div>
    </Layout>
  );
}

export default HomeScreen;
