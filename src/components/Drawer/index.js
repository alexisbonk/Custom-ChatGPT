import React, { useState, useEffect, useRef } from 'react';
import { setInitPrompt } from '../../api/openai';
import { useMount } from '../../hooks/useMount';
import { voices } from '../../utils/constants';
import { useMainContext } from '../../hooks/useMainContext';

import './Drawer.css';

const Drawer = () => {
  const isMounted = useMount();
  const [value, setValue] = useState(localStorage.getItem('initPrompt') || '');
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);
  const {
    selectedVoice,
    setSelectedVoice,
    selfDiscussEnabled,
    setSelfDiscussedEnabled
  } = useMainContext();

  useEffect(() => {
    value && setInitPrompt(value);
  }, [value]);

  const handleVoiceChange = (event) => {
    const selectedVoice = event.target.value;
    const selectedVoiceObject = voices.find(voice => voice.value === selectedVoice);
    selectedVoiceObject && setSelectedVoice(selectedVoiceObject);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`drawer-container ${isOpen ? 'open' : ''}`} ref={drawerRef}>
        <h3 className="drawer-title">ChatPéTé</h3>
        <div className="drawer-title-divider"></div>
        <div className="voice-select-container">
          <select className="voice-select" value={selectedVoice.value} onChange={handleVoiceChange}>
            {voices.map(voice => (
              <option key={voice.value} value={voice.value}>
                ({voice.language}) {voice.name} - {voice.genre}
              </option>
            ))}
          </select>
        </div>
        <div className="checkbox-container">
          <label className="checkbox-label">
            Loop:&nbsp;
            <input
              className="checkbox-input"
              type="checkbox"
              checked={selfDiscussEnabled}
              onChange={() => setSelfDiscussedEnabled(!selfDiscussEnabled)}
            />
          </label>
        </div>
        <div className="input-container">
          <p className="input-label">Custom prompt</p>
          <textarea
            className="input-textarea"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              localStorage.setItem('initPrompt', event.target.value);
            }}
            style={{ width: '100%', height: 200 }}
            onKeyDown={(event) => event.stopPropagation()}
            onKeyUp={(event) => event.stopPropagation()}
          ></textarea>
        </div>
      </div>
      <div className={`drawer-toggle button-animations ${isOpen || !isMounted ? 'hidden' : ''}`} onClick={toggleDrawer}>
        <div className='chevron-icon' />
      </div>
    </>
  );
};

export default Drawer;
