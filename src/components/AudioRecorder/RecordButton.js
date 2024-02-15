import { useEffect, useMemo } from "react";
import useDevice from "../../hooks/useDevice";
import { useMainContext } from "../../hooks/useMainContext";
import { useMount } from "../../hooks/useMount";
import useTimer from "../../hooks/useTimer";

export const RecordButton = ({ stopAudioPlayback, startRecording, stopRecording }) => {
  const { isMobile } = useDevice();
  const { isPlaying, isProcessing, isRecording } = useMainContext();
  const isMounted = useMount();
  const { startTimer, stopTimer, minutes, seconds, centiseconds, timerRunning } = useTimer();

  useEffect(() => {
    if (!isRecording && timerRunning) stopTimer();
    else if (isRecording && !timerRunning) startTimer();
  }, [isRecording, startTimer, stopTimer, timerRunning]);

  const defaultText = useMemo(() => isMobile ? 'Tap and hold to talk' : 'Hold Space and talk', [isMobile]);

  return (
    <div
      className={`record-button button-animations ${isMounted ? '' : 'hidden'}`}
      onClick={() => isPlaying && stopAudioPlayback()}
      onMouseDown={() => !isMobile && !isRecording && !isProcessing && !isPlaying && startRecording()}
      onMouseUp={() => !isMobile && isRecording && stopRecording()}
    >
      <div style={{ pointerEvents: 'none' }}>
        {isRecording && (
          <div>
            {minutes + ':' + seconds.toString().padStart(2, '0') + '.' + centiseconds.toString().padStart(2, '0')} | RECORDING...
          </div>
        )}
        {isPlaying && <div className="stop-icon" />}
        {isProcessing && 'Processing...'}
        {!isPlaying && !isRecording && !isProcessing && defaultText}
      </div>
    </div>
  );
};

export default RecordButton;
