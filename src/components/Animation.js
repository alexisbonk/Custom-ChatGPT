import { useRef, useEffect, useState } from "react";
import Lottie from "lottie-react";
import PromptAnimation from '../assets/prompt.json';
import PromptPlayedAnimation from '../assets/played-prompt.json';

export const StartScreen = ({ audioPlaying, isRecording, onStartButtonClicked }) => {
  const [showStartButton, setShowStartButton] = useState(true); 
  const lottieRef = useRef(null)

  const handleMouseEnter = () => {
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    lottieRef.current?.goToAndStop(120, true);
  };

  useEffect(() => {
    lottieRef.current?.goToAndStop(120, true);
  }, []);

  return (
    <div className="start-screen-container" style={showStartButton ? {} : { pointerEvents: 'none' }}>
      {showStartButton && (
        <div
          className="start-button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            setShowStartButton(false);
            onStartButtonClicked && onStartButtonClicked();
          }}
        >
          <svg viewBox="0 0 500 500" className="rotate start-chatting-text">
            <path id="curve" fill="none" d="M 25 250 A 225 225 0 1 1 475 250 A 225 225 0 1 1 25 250" />
            <text fontSize="40px" dy="20px" fill="#ffffff">
              <textPath href="#curve" startOffset="50%" textAnchor="middle">START CHATTING</textPath>
            </text>
          </svg>
        </div>
      )}
      <Lottie 
        className={`lottie-animation heartbeat ${audioPlaying || isRecording ? 'heartbeat-animate' : ''}`}
        animationData={audioPlaying ? PromptPlayedAnimation : PromptAnimation}
        loop={true}
        lottieRef={lottieRef}
      />
    </div>
  );
};

export default StartScreen;
