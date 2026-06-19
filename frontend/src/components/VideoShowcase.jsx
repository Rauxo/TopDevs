import heroVideo from "../assets/hero_video2.mp4";
import "./VideoShowcase.css";

export default function VideoShowcase() {
  return (
    <section className="video-showcase" aria-label="Our technology in action">
      <div className="video-showcase__frame">
        <svg viewBox="0 0 1000 600" className="video-mask">
          <defs>
          <clipPath id="customShape" clipPathUnits="objectBoundingBox">
              <path d="
M0.08,0
H0.32
C0.42,0 0.38,0.13 0.50,0.13
H0.65
C0.76,0.13 0.72,0 0.84,0
H0.92
Q1,0 1,0.13
V0.83
Q1,1 0.90,1
H0.22
C0.12,1 0.18,0.75 0.08,0.75
C0,0.75 0,0.58 0,0.42
V0.13
Q0,0 0.08,0
Z"
/>
            </clipPath>
          </defs>
        </svg>

        <video
          className="video-showcase__video"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    </section>
  );
}
