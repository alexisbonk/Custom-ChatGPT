import React, { useState } from 'react';
import Animation from './components/Animation';
import Drawer, { voices } from './components/Drawer';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [startPressed, setStartPressed] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [selfDiscussEnabled, setSelfDiscussedEnabled] = useState(false);

  const onAudioPlaying = async (promise) => {
    setAudioPlaying(true);
    await promise;
    setAudioPlaying(false);
  };

  return (
    <div className={`App ${startPressed ? '' : 'App-start'}`}>
      <Animation
        audioPlaying={audioPlaying}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        onStartButtonClicked={() => setStartPressed(true)}
      />
      
      {
        startPressed && (
          <>
            <AudioRecorder
              onAudioPlaying={onAudioPlaying}
              selectedVoice={selectedVoice}
              onAudioStop={() => setAudioPlaying(false)}
              selfDiscussEnabled={selfDiscussEnabled}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
            <Drawer
              onAudioPlaying={onAudioPlaying}
              onVoiceSelect={setSelectedVoice}
              setSelfDiscussedEnabled={setSelfDiscussedEnabled}
              selfDiscussEnabled={selfDiscussEnabled}
            />
          </>
        )
      }
    </div>
  );
}

export default App;
