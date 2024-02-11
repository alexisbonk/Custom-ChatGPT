import { createContext, useMemo, useState } from "react";

import { voices } from "../utils/constants";

const defaultValue = {
  isPlaying: false,
  setIsPlaying: () => undefined,
  isRecording: false,
  setIsRecording: () => undefined,
  startPressed: false,
  setStartPressed: () => undefined,
  isProcessing: false,
  setIsProcessing: () => undefined,
  selectedVoice: voices[0],
  setSelectedVoice: () => undefined,
  selfDiscussEnabled: false,
  setSelfDiscussedEnabled: () => undefined,

  isInProvider: false,
};

export const MainContext = createContext(defaultValue);

export const MainContextProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [startPressed, setStartPressed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(() => {
    const savedVoice = localStorage.getItem('selectedVoice');
    return savedVoice ? voices.find(voice => voice.value === savedVoice) : voices[0].value;
  });
  const [selfDiscussEnabled, setSelfDiscussedEnabled] = useState(localStorage.getItem('selfDiscussEnabled') === 'true');  

  return (
    <MainContext.Provider
      value={
        useMemo(() => ({
          isPlaying,
          setIsPlaying,
          isRecording,
          setIsRecording,
          isProcessing,
          setIsProcessing,
          startPressed,
          setStartPressed,
          selectedVoice,
          setSelectedVoice: (newVoice) => {
            localStorage.setItem('selectedVoice', newVoice.value);
            setSelectedVoice(newVoice);
          },
          selfDiscussEnabled,
          setSelfDiscussedEnabled: (enabled) => {
            localStorage.setItem('selfDiscussEnabled', enabled);
            setSelfDiscussedEnabled(enabled);
          },
          isInProvider: true,
        }), [
          isPlaying,
          isRecording,
          startPressed,
          isProcessing,
          selectedVoice,
          selfDiscussEnabled,

        ])
      }
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
