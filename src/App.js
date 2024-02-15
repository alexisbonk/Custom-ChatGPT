import React from 'react';
import Animation from './components/Animation';
import Buttons from './components/Buttons';
import AudioRecorder from './components/AudioRecorder';
import Drawer from './components/Drawer';
import { useMainContext } from './hooks/useMainContext';

function App() {
  const { startPressed } = useMainContext();

  return (
    <div className={`App ${startPressed ? '' : 'App-start'}`}>
      <Animation />
      {
        startPressed && (
          <>
            <Buttons />
            <AudioRecorder />
            <Drawer />
          </>
        )
      }
    </div>
  );
}

export default App;
