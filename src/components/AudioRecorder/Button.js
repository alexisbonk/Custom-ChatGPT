import { useEffect } from "react";
import useDevice from "../../hooks/useDevice";
import { useMainContext } from "../../hooks/useMainContext";
import { useMount } from "../../hooks/useMount";
import useTimer from "../../hooks/useTimer";

export const Button = ({ stopAudioPlayback, startRecording, stopRecording }) => {
  const { isMobile } = useDevice();
  const { isPlaying, isProcessing, isRecording } = useMainContext();
  const isMounted = useMount();
  const { startTimer, stopTimer, minutes, seconds, centiseconds, timerRunning } = useTimer();

  useEffect(() => {
    if (!isRecording && timerRunning) stopTimer();
    else if (isRecording && !timerRunning) startTimer();
  }, [isRecording, startTimer, stopTimer, timerRunning]);

  if (isMobile) return null;
  return (
    <div
      className={`main-button button-animations ${isMounted ? '' : 'hidden'}`}
      onClick={() => isPlaying && stopAudioPlayback()}
      onMouseDown={() => !isRecording && !isProcessing && !isPlaying && startRecording()}
      onMouseUp={() => isRecording && stopRecording()}
    >
      {isRecording && (
        <div>
          {minutes + ':' + seconds.toString().padStart(2, '0') + '.' + centiseconds.toString().padStart(2, '0')} | RECORDING...
        </div>
      )}
      {isPlaying && <div className="stop-icon" />}
      {isProcessing && 'Processing...'}
      {!isPlaying && !isRecording && !isProcessing && 'Hold Space and talk'}
    </div>
  );
};

export default Button;
