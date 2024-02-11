import React from 'react';
import Animation from './components/Animation';
import Drawer from './components/Drawer';
import AudioRecorder from './components/AudioRecorder';
import { useMainContext } from './hooks/useMainContext';

function App() {
  const { startPressed } = useMainContext();

  return (
    <div className={`App ${startPressed ? '' : 'App-start'}`}>
      <Animation />
      {
        startPressed && (
          <>
            <AudioRecorder />
            <Drawer />
          </>
        )
      }
    </div>
  );
}

export default App;
