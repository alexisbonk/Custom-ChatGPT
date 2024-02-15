import { createContext, useMemo, useState } from "react";

import { voices, versions } from "../utils/constants";

const defaultValue = {
  isPlaying: false,
  setIsPlaying: () => undefined,
  isRecording: false,
  setIsRecording: () => undefined,
  startPressed: false,
  setStartPressed: () => undefined,
  isProcessing: false,
  setIsProcessing: () => undefined,
  isCursorDisabled: true,
  setIsCursorDisabled: () => undefined,
  selectedVoice: voices[0],
  setSelectedVoice: () => undefined,
  selectedVersion: versions[0],
  setSelectedVersion: () => undefined,
  selfDiscussEnabled: false,
  setSelfDiscussedEnabled: () => undefined,
  selectedEmoji: '',
  setSelectedEmoji: () => undefined,

  isInProvider: false,
};

export const MainContext = createContext(defaultValue);

export const MainContextProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [startPressed, setStartPressed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCursorDisabled, setIsCursorDisabled] = useState(localStorage.getItem('cursorDisabled') === 'true');  
  const [selectedVoice, setSelectedVoice] = useState(() => {
    const savedVoice = localStorage.getItem('selectedVoice');
    return savedVoice ? voices.find(voice => voice.value === savedVoice) : voices[0].value;
  });
  const [selectedVersion, setSelectedVersion] = useState(() => {
    const savedVersion = localStorage.getItem('selectedVersion');
    return savedVersion ? versions.find(version => version.value === savedVersion) : versions[2].value;
  });
  const [selfDiscussEnabled, setSelfDiscussedEnabled] = useState(localStorage.getItem('selfDiscussEnabled') === 'true');  
  const [selectedEmoji, setSelectedEmoji] = useState(localStorage.getItem('selectedEmoji') ? localStorage.getItem('selectedEmoji') : '');  

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
          isCursorDisabled,
          setIsCursorDisabled: (enabled) => {
            localStorage.setItem('cursorDisabled', enabled);
            setIsCursorDisabled(enabled);
          },
          startPressed,
          setStartPressed,
          selectedVoice,
          setSelectedVoice: (newVoice) => {
            localStorage.setItem('selectedVoice', newVoice.value);
            setSelectedVoice(newVoice);
          },
          selectedVersion,
          setSelectedVersion: (newVersion) => {
            localStorage.setItem('selectedVersion', newVersion.value);
            setSelectedVersion(newVersion);
          },
          selfDiscussEnabled,
          setSelfDiscussedEnabled: (enabled) => {
            localStorage.setItem('selfDiscussEnabled', enabled);
            setSelfDiscussedEnabled(enabled);
          },
          selectedEmoji,
          setSelectedEmoji: (newEmoji) => {
            localStorage.setItem('selectedEmoji', newEmoji);
            setSelectedEmoji(newEmoji);
          },
          isInProvider: true,
        }), [
          isPlaying,
          isRecording,
          startPressed,
          isProcessing,
          isCursorDisabled,
          selectedVoice,
          selectedVersion,
          selfDiscussEnabled,
          selectedEmoji,
        ])
      }
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
