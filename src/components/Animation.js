import { useRef, useEffect, useState } from "react";
import Lottie from "lottie-react";
import PromptAnimation from '../assets/prompt.json';
import PromptPlayedAnimation from '../assets/played-prompt.json';
import { useMainContext } from "../hooks/useMainContext";

export const StartScreen = ({ onStartButtonClicked }) => {
  const [displayCursor, setDisplayCursor] = useState(false);
  const { isPlaying, startPressed, setStartPressed, isRecording } = useMainContext();
  const lottieRef = useRef(null);

  const handleMouseEnter = () => {
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    lottieRef.current?.goToAndStop(120, true);
  };

  useEffect(() => {
    lottieRef.current?.goToAndStop(120, true);
  }, []);

  const showCursor = () => {
    lottieRef.current?.setSpeed(1.8)
    setDisplayCursor(true);
  };

  const hideCursor = () => {
    lottieRef.current?.setSpeed(1)
    setDisplayCursor(false);
  }

  return (
    <div className="start-screen-container">
      {!startPressed && (
        <div
          className="start-button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            setStartPressed(true);
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
        className={`lottie-animation heartbeat ${isPlaying || isRecording ? 'heartbeat-animate' : ''} ${startPressed ? 'start-pressed' : ''}`}
        animationData={isPlaying ? PromptPlayedAnimation : PromptAnimation}
        loop={true}
        lottieRef={lottieRef}
        style={!startPressed ? { pointerEvents: 'none' } : {}}
        onMouseEnter={showCursor}
        onMouseLeave={hideCursor}
        onMouseMove={() => !displayCursor && showCursor()}
      />
      <div id="lottie-cursor" className={displayCursor ? '' : 'hidden'} />
    </div>
  );
};

export default StartScreen;
